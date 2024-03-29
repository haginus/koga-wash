import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { roundToNearest10, entityOrFail, groupBy, getOrder, logError } from "src/lib/util";
import { MachineInstancesService } from "src/machines/machine-instances.service";
import { FindOptionsWhere, LessThanOrEqual, Not, Repository } from "typeorm";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { Reservation, ReservationStatus } from "./entities/reservation.entity";
import { MoreThanOrEqual } from "typeorm";
import { Programme } from "src/machines/enitities/programme.entity";
import { ProgrammesService } from "src/machines/programmes.service";
import { UsersService } from "src/users/users.service";
import { MailService } from "src/mail/mail.service";
import { ReservationQueryDto } from "./dto/reservation-query.dto";
import { Paginated } from "src/lib/types/Paginated";
import { plainToInstance } from "class-transformer";
import { User } from "src/users/entities/user.entity";
import { Role } from "src/auth/role.enum";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AvailableInstancesDto } from "./dto/available-instances.dto";
import { PlugsService } from "src/plugs/plugs.service";

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    private readonly machineInstancesService: MachineInstancesService,
    private readonly programmesService: ProgrammesService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly plugsService: PlugsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private ownsReservationGuard(user: User | null, reservation: Reservation, passAdmin = true) {
    if(!user) return;
    if(user.id != reservation.user.id) {
      if(user.role == Role.Admin && passAdmin) {
        return;
      }
      throw new ForbiddenException(`Nu puteți accesa această rezervare.`);
    }
  }

  async findAll(opts?: ReservationQueryDto): Promise<Paginated<Reservation>> {
    const where: FindOptionsWhere<Reservation> = {};
    if(opts?.userId) {
      where.user = { id: opts.userId };
    }
    if(opts?.instanceId) {
      where.machineInstance = { id: opts.instanceId };
    }
    if(opts?.since) {
      where.startTime = MoreThanOrEqual(opts.since);
    }
    if(opts?.until) {
      where.endTime = LessThanOrEqual(opts.until);
    }
    if(opts?.status) {
      where.status = opts.status;
    }
    const [data, count] = await this.reservationRepository.findAndCount({ 
      where,
      order: getOrder<Reservation>(opts?.sortBy || 'startTime', opts?.sortDirection || 'ASC'),
      take: opts?.limit,
      skip: opts?.offset
    });
    return { data, count };
  }

  async findOne(id: string, user?: User): Promise<Reservation> {
    const reservation = await entityOrFail(this.reservationRepository.findOneBy({ id }));
    if(user) {
      this.ownsReservationGuard(user, reservation);
    }
    return reservation;
  }

  async findOneByOpts(opts: Omit<ReservationQueryDto, 'limit'>) {
    const result = await this.findAll({ ...opts, limit: 1 });
    return result.data[0];
  }

  async findPreviousReservation(reservation: Reservation, flag?: boolean): Promise<Reservation | undefined> {
    if(!reservation.canCheckIn) {
      throw new BadRequestException(`Nu puteți cere rezervarea anterioară pentru această rezervare.`);
    }
    const list = await this.reservationRepository.find({ 
      where: { 
        machineInstance: { id: reservation.machineInstance.id },
        endTime: LessThanOrEqual(reservation.startTime),
        status: Not(ReservationStatus.CANCELLED),
      },
      order: { endTime: 'DESC' }, 
      take: 1
    });
    const previous = list[0];
    if(!previous) return;
    if(flag && !previous.meta.hasFlag('clothes_left_behind')) {
      previous.flagged = true;
      previous.meta.flags = previous.meta.flags || [];
      previous.meta.flags.push({ 
        flaggedAt: new Date(), 
        flaggedByUserId: reservation.user.id, 
        flagReason: 'clothes_left_behind' 
      });
      await this.reservationRepository.save(previous);
    }
    return previous;
  }

  private getAvailableSlots(startTime: Date, _endTime: Date | undefined, reservations: Reservation[], programme: Programme) {
    const duration = programme.duration * 60 * 1000;
    const buffer = 10 * 60 * 1000;
    const bufferedDuration = duration + buffer;
    const roundedStartTime = roundToNearest10(startTime).getTime();
    const endTime = _endTime?.getTime() || roundedStartTime + 3 * 24 * 60 * 60 * 1000;
    let currentSlot = roundedStartTime;
    let reservationIdx = 0;
    const slots: Date[] = [];
    
    while(currentSlot < endTime) {
      const reservation = reservations[reservationIdx];
      if(!reservation || currentSlot + bufferedDuration <= reservation.startTime.getTime()) {
        slots.push(new Date(currentSlot));
        currentSlot = currentSlot + bufferedDuration;
      } else {
        currentSlot = reservation.endTime.getTime() + buffer;
        reservationIdx++;
      }
    }

    return slots;
  }

  async findAvailableSlots(startTime: Date, endTime: Date | undefined, programmeId: string, instanceId?: string) {

    const programme = await this.programmesService.findOne(programmeId);

    const reservations = (await this.findAll({ since: startTime, until: endTime })).data.filter(r => r.isPending);
    const groupedReservations = groupBy(reservations, r => r.machineInstance.id);
    
    const instances = instanceId ? 
      [await this.machineInstancesService.findOne(instanceId)] : 
      await this.machineInstancesService.findAllByMachineId(programme.machine.id);
    
    return instances.map(instance => {
      if(instance.isFaulty) return { instance, slots: [] };
      const instanceReservations = groupedReservations[instance.id] || [];
      const instanceSlots = this.getAvailableSlots(startTime, endTime, instanceReservations, programme);
      delete instance.machine.programmes;
      return { instance, slots: instanceSlots };
    }).filter(({ slots }) => slots.length > 0);
  }

  async findAvailableInstances(): Promise<AvailableInstancesDto[]> {
    const now = new Date();
    const EIGHTY_MINUTES = 80 * 60 * 1000;
    const endTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const instances = await this.machineInstancesService.findAll();
    const reservations = (await this.findAll({ 
      since: new Date(now.getTime() - 2 * 60 * 60 * 1000), 
      until: endTime,
      limit: 10000
    })).data.filter(reservation => reservation.isPending);
    const groupedReservations = groupBy(reservations, reservation => reservation.machineInstance.id);
    return instances.map((instance) => {
      const reservations = groupedReservations[instance.id] || [];
      const nowReservationIdx = reservations.findIndex(reservation => reservation.containsTime(now));
      if(nowReservationIdx != -1) {
        const sliced = reservations.slice(nowReservationIdx);
        const lastReservation = reservations.find((reservation, idx) => 
          reservation.startTime.getTime() + EIGHTY_MINUTES > sliced[idx - 1]?.endTime.getTime());
        return { instance, busyUntil: lastReservation?.endTime || sliced[0].endTime };
      } else {
        const firstReservationIdx = reservations.findIndex(reservation => reservation.startTime.getTime() > now.getTime());
        if(firstReservationIdx == -1) {
          return { instance, availableUntil: endTime };
        }
        const firstReservation = reservations[firstReservationIdx];
        if(firstReservation.startTime.getTime() - now.getTime() > EIGHTY_MINUTES) {
          return { instance, availableUntil: firstReservation.startTime };
        } else {
          const lastReservation = reservations.find((reservation, idx) => 
            reservation.startTime.getTime() + EIGHTY_MINUTES > reservations[idx - 1]?.endTime.getTime());
          return { instance, busyUntil: lastReservation?.endTime || endTime};
        }
      }
    });
  }

  async create(createReservationDto: CreateReservationDto) {
    const user = await this.usersService.findOne(createReservationDto.userId);
    if(!user) {
      throw new NotFoundException(`Usetilizatorul cu ID-ul ${createReservationDto.userId} nu a fost găsit.`);
    }
    if(user.suspendedUntil && user.suspendedUntil.getTime() > Date.now()) {
      throw new BadRequestException(`Utilizatorul este suspendat până la ${user.suspendedUntil}.`);
    }
    const machineInstance = await this.machineInstancesService.findOne(createReservationDto.machineInstanceId);
    if(!machineInstance) {
      throw new NotFoundException(`Instanța cu ID-ul ${createReservationDto.machineInstanceId} nu a fost găsită.`);
    }
    const programme = await this.programmesService.findOne(createReservationDto.programmeId);
    if(!programme) {
      throw new NotFoundException(`Programul cu ID-ul ${createReservationDto.programmeId} nu a fost găsit.`);
    }
    if(programme.machine.id != machineInstance.machine.id) {
      throw new BadRequestException(`Programul cu ID-ul ${programme.id} nu este compatibil cu instanța ${machineInstance.id}.`);
    }
    if(createReservationDto.startTime.getTime() < Date.now()) {
      throw new BadRequestException(`Data de început trebuie să fie în viitor.`);
    }
    const endTime = new Date(createReservationDto.startTime.getTime() + programme.duration * 60 * 1000);
    const availableSlots = await this.findAvailableSlots(createReservationDto.startTime, endTime, createReservationDto.programmeId, createReservationDto.machineInstanceId);
    if(availableSlots.length == 0 || availableSlots[0].slots.length == 0) {
      throw new BadRequestException(`Niciun slot disponibil pentru instanța ${createReservationDto.machineInstanceId} la ${createReservationDto.startTime}`);
    }
    let reservation = plainToInstance(Reservation, {
      startTime: createReservationDto.startTime,
      endTime,
      status: ReservationStatus.PENDING,
      meta: {},
      machineInstance,
      programme,
      user,
    });

    reservation = await this.reservationRepository.save(reservation);
    try {
      this.mailService.sendReservationConfirmation(reservation);
    } catch(error) {
      console.error(error);
    }
    this.eventEmitter.emit('reservation.created', reservation);
    return reservation;
  }

  async cancel(user: User, id: string) {
    const reservation = await this.findOne(id);
    this.ownsReservationGuard(user, reservation);
    if(!reservation.isPending) {
      throw new BadRequestException(`Rezervarea nu poate fi anulată.`);
    }
    reservation.status = ReservationStatus.CANCELLED;
    reservation.meta.cancelledAt = new Date();
    reservation.meta.cancelledBy = user.role;
    return this.reservationRepository.save(reservation);
  }

  async cancelAsNotHonored(id: string) {
    const reservation = await this.findOne(id);
    reservation.status = ReservationStatus.NOT_HONORED;
    reservation.meta.cancelledAt = new Date();
    reservation.meta.cancelledBy = Role.System;
    return this.reservationRepository.save(reservation);
  }

  async checkIn(user: User, id: string) {
    const reservation = await this.findOne(id);
    this.ownsReservationGuard(user, reservation);
    if(!reservation.canCheckIn) {
      throw new BadRequestException(`Nu se poate face check-in la această rezervare.`);
    }
    reservation.status = ReservationStatus.CHECKED_IN;
    reservation.meta.checkedInAt = new Date();
    try {
      reservation.meta.initialEnergyUsage = (await this.plugsService.getEnergyUsage(reservation.machineInstance.plugId)).today_energy;
    } catch(error) {
      logError(error);
    }
    await this.plugsService.turnOn(reservation.machineInstance.plugId);
    const result = await this.reservationRepository.save(reservation);
    this.eventEmitter.emit('reservation.checkedIn', result);
    return result;
  }

  async checkOut(user: User, id: string) {
    const reservation = await this.findOne(id);
    this.ownsReservationGuard(user, reservation);
    if(reservation.status != ReservationStatus.CHECKED_IN) {
      throw new BadRequestException(`Nu se poate face check-out la această rezervare.`);
    }
    reservation.status = ReservationStatus.FINISHED;
    reservation.meta.checkedOutAt = new Date();
    if(reservation.meta.initialEnergyUsage !== undefined) {
      try {
        const currentEnergyUsage = (await this.plugsService.getEnergyUsage(reservation.machineInstance.plugId)).today_energy;
        reservation.energyUsage = currentEnergyUsage - reservation.meta.initialEnergyUsage;
        delete reservation.meta.initialEnergyUsage;
      } catch(error) {
        logError(error);
      }
    }
    await this.plugsService.turnOff(reservation.machineInstance.plugId);
    return this.reservationRepository.save(reservation);
  }

  /**
   * Resets the initial energy usage for all reservations that are currently checked in.
   * This is called before the start of each day.
   */
  async savePendingEnergyUsage() {
    const reservations = await this.reservationRepository.find({
      where: {
        status: ReservationStatus.CHECKED_IN,
      },
      relations: ['machineInstance'],
    });
    await Promise.all(
      reservations.map(async (reservation) => {
        if(reservation.meta.initialEnergyUsage === undefined) return;
        try {
          const currentEnergyUsage = (await this.plugsService.getEnergyUsage(reservation.machineInstance.plugId)).today_energy;
          reservation.meta.initialEnergyUsage = reservation.meta.initialEnergyUsage - currentEnergyUsage;
          await this.reservationRepository.save(reservation);
        } catch(error) {
          logError(error);
        }
      })
    );
  }

}
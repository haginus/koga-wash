import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { roundToNearest10 } from "src/lib/util";
import { MachineInstancesService } from "src/machines/machine-instances.service";
import { Repository } from "typeorm";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { Reservation, ReservationStatus } from "./entities/reservation.entity";
import { MoreThanOrEqual } from "typeorm";
import { Programme } from "src/machines/enitities/programme.entity";
import { ProgrammesService } from "src/machines/programmes.service";

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    private readonly machineInstancesService: MachineInstancesService,
    private readonly programmesService: ProgrammesService,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  async findAllSince(startTime: Date) {
    return this.reservationRepository.findBy({ startTime: MoreThanOrEqual(startTime) });
  }

  async findAllForMachineInstanceSince(machineInstanceId: string, startTime: Date) {
    return this.reservationRepository.findBy({ machineInstance: { id: machineInstanceId }, startTime: MoreThanOrEqual(startTime) });
  }

  async findOne(id: string): Promise<Reservation> {
    return this.reservationRepository.findOneBy({ id });
  }

  getAvailableSlots(startTime: Date, _endTime: Date | undefined, reservations: Reservation[], programme: Programme) {
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

  async findAvailableSlots(startTime: Date, endTime: Date | undefined, programmeId: string, machineInstanceId?: string) {

    const programme = await this.programmesService.findOne(programmeId);

    const reservations = machineInstanceId ? 
      await this.findAllForMachineInstanceSince(machineInstanceId, startTime) : 
      await this.findAllSince(startTime);
    
    const instances = machineInstanceId ? 
      [await this.machineInstancesService.findOne(machineInstanceId)] : 
      await this.machineInstancesService.findAll();
    
    return instances.map(instance => {
      const instanceReservations = reservations.filter(reservation => reservation.machineInstance.id == instance.id);
      const instanceSlots = this.getAvailableSlots(startTime, endTime, instanceReservations, programme);
      return { instance, slots: instanceSlots };
    });

  }

  async create(createReservationDto: CreateReservationDto) {
    const machineInstance = await this.machineInstancesService.findOne(createReservationDto.machineInstanceId);
    if(!machineInstance) {
      throw new NotFoundException(`Machine instance with id ${createReservationDto.machineInstanceId} not found`);
    }
    const programme = await this.programmesService.findOne(createReservationDto.programmeId);
    if(!programme) {
      throw new NotFoundException(`Programme with id ${createReservationDto.programmeId} not found`);
    }
    if(createReservationDto.startTime.getTime() < Date.now()) {
      throw new BadRequestException(`Start time must be in the future`);
    }
    if(createReservationDto.startTime.getTime() != roundToNearest10(createReservationDto.startTime).getTime()) {
      throw new BadRequestException(`Start time must be a multiple of 10 minutes`);
    }
    const endTime = new Date(createReservationDto.startTime.getTime() + programme.duration * 60 * 1000);
    const availableSlots = await this.findAvailableSlots(createReservationDto.startTime, endTime, createReservationDto.programmeId, createReservationDto.machineInstanceId);
    if(availableSlots.length == 0 || availableSlots[0].slots.length == 0) {
      throw new BadRequestException(`No available slots for machine instance ${createReservationDto.machineInstanceId} at ${createReservationDto.startTime}`);
    }
    return this.reservationRepository.save({ ...createReservationDto, endTime, status: ReservationStatus.PENDING, meta: { } });
  }
}
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { roundToNearest10 } from "src/lib/util";
import { MachineInstancesService } from "src/machines/machine-instances.service";
import { MachinesService } from "src/machines/machines.service";
import { MachineInstance } from "src/machines/schemas/machine-instance.schema";
import { Programme } from "src/machines/schemas/programme.schema";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { Reservation, ReservationDocument, ReservationStatus } from "./schemas/reservation.schema";

@Injectable()
export class ReservationsService {
  constructor(@InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
    private readonly machineInstancesService: MachineInstancesService, private readonly machinesService: MachinesService) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel.find().exec();
  }

  async findAllSince(startTime: Date) {
    return this.reservationModel.find({ startTime: { $gte: startTime } }).populate('machineInstance').exec();
  }

  async findAllForMachineInstanceSince(machineInstance: string, startTime: Date) {
    return this.reservationModel.find({ machineInstance, startTime: { $gte: startTime } }).populate('machineInstance').exec();
  }

  async findOne(id: string): Promise<Reservation> {
    return this.reservationModel.findById(id).exec();
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

  async findAvailableSlots(startTime: Date, endTime: Date | undefined, programme: string, machineInstance?: string) {

    const programmeInstance = await this.machinesService.findProgrammeById(programme);

    const reservations = machineInstance ? 
      await this.findAllForMachineInstanceSince(machineInstance, startTime) : 
      await this.findAllSince(startTime);
    
    const instances = machineInstance ? 
      [await this.machineInstancesService.findOne(machineInstance)] : 
      await this.machineInstancesService.findAll();
    
    return instances.map(instance => {
      const instanceReservations = reservations.filter(reservation => reservation.machineInstance._id.toString() == instance._id.toString());
      const instanceSlots = this.getAvailableSlots(startTime, endTime, instanceReservations, programmeInstance);
      return { instance, slots: instanceSlots };
    });

  }

  async create(createReservationDto: CreateReservationDto) {
    const machineInstance = await this.machineInstancesService.findOne(createReservationDto.machineInstance);
    if(!machineInstance) {
      throw new NotFoundException(`Machine instance with id ${createReservationDto.machineInstance} not found`);
    }
    const programme = await this.machinesService.findProgrammeById(createReservationDto.programme);
    if(!programme) {
      throw new NotFoundException(`Programme with id ${createReservationDto.programme} not found`);
    }
    if(createReservationDto.startTime.getTime() < Date.now()) {
      throw new BadRequestException(`Start time must be in the future`);
    }
    if(createReservationDto.startTime.getTime() != roundToNearest10(createReservationDto.startTime).getTime()) {
      throw new BadRequestException(`Start time must be a multiple of 10 minutes`);
    }
    const endTime = new Date(createReservationDto.startTime.getTime() + programme.duration * 60 * 1000);
    const availableSlots = await this.findAvailableSlots(createReservationDto.startTime, endTime, createReservationDto.programme, createReservationDto.machineInstance);
    if(availableSlots.length == 0 || availableSlots[0].slots.length == 0) {
      throw new BadRequestException(`No available slots for machine instance ${createReservationDto.machineInstance} at ${createReservationDto.startTime}`);
    }
    const createdReservation = new this.reservationModel({ ...createReservationDto, endTime, status: ReservationStatus.PENDING });
    return createdReservation.save();
  }
}
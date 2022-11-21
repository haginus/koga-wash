import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { roundToNearest10 } from "src/lib/util";
import { MachineInstancesService } from "src/machines/machine-instances.service";
import { MachinesService } from "src/machines/machines.service";
import { MachineInstance } from "src/machines/schemas/machine-instance.schema";
import { Programme } from "src/machines/schemas/programme.schema";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { Reservation, ReservationDocument } from "./schemas/reservation.schema";

@Injectable()
export class ReservationsService {
  constructor(@InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
    private readonly machineInstancesService: MachineInstancesService, private readonly machinesService: MachinesService) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel.find().exec();
  }

  async findAllSince(startTime: Date) {
    return this.reservationModel.find({ startTime: { $gte: startTime } }).exec();
  }

  async findAllForMachineInstanceSince(machineInstance: string, startTime: Date) {
    return this.reservationModel.find({ machineInstance, startTime: { $gte: startTime } }).exec();
  }

  async findOne(id: string): Promise<Reservation> {
    return this.reservationModel.findById(id).exec();
  }

  getAvailableSlots(startTime: Date, reservations: Reservation[], programme: Programme) {
    const duration = programme.duration * 60 * 1000;
    const buffer = 10 * 60 * 1000;
    const roundedStartTime = roundToNearest10(startTime).getTime();
    const endTime = roundedStartTime + 3 * 24 * 60 * 60 * 1000;
    let currentSlot = roundedStartTime;
    let reservationIdx = 0;
    const slots: Date[] = [];
    
    while(currentSlot < endTime) {
      const reservation = reservations[reservationIdx];
      if(!reservation || currentSlot + duration < reservation.startTime.getTime()) {
        slots.push(new Date(currentSlot));
        currentSlot = currentSlot + duration;
      } else {
        currentSlot = reservation.endTime.getTime() + buffer;
        reservationIdx++;
      }
    }

    return slots;
  }

  async findAvailableSlots(startTime: Date, programme: string, machineInstance?: string) {

    const programmeInstance = await this.machinesService.findProgrammeById(programme);

    const reservations = machineInstance ? 
      await this.findAllForMachineInstanceSince(machineInstance, startTime) : 
      await this.findAllSince(startTime);
    
    const instances = machineInstance ? 
      [await this.machineInstancesService.findOne(machineInstance)] : 
      await this.machineInstancesService.findAll();
    
    return instances.map(instance => {
      const instanceReservations = reservations.filter(reservation => reservation.machineInstance == instance);
      const instanceSlots = this.getAvailableSlots(startTime, instanceReservations, programmeInstance);
      return { instance, slots: instanceSlots };
    });

  }

  async create(createReservationDto: CreateReservationDto) {
    // const 
    const createdReservation = new this.reservationModel(createReservationDto);
    return createdReservation.save();
  }
}
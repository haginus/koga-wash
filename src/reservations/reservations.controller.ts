import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { ReservationsService } from "./reservations.service";
import { Reservation } from "./schemas/reservation.schema";

@Controller("reservations")
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  async findAll(): Promise<Reservation[]> {
    return this.reservationsService.findAll();
  }

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get("/available-slots/programme/:id")
  async findAvailableSlots(@Param("id") programmeId: string) {
    return this.reservationsService.findAvailableSlots(new Date(), undefined, programmeId);
  }
}
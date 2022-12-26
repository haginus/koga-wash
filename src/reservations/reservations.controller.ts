import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/users/schemas/user.schema";
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
  async create(@Body() createReservationDto: CreateReservationDto, @CurrentUser() user: User) {
    createReservationDto.user = user._id;
    return this.reservationsService.create(createReservationDto);
  }

  @Get("/available-slots/programme/:id")
  async findAvailableSlots(@Param("id") programmeId: string) {
    return this.reservationsService.findAvailableSlots(new Date(), undefined, programmeId);
  }
}
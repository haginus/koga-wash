import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/users/entities/user.entity";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { ReservationsService } from "./reservations.service";

@Controller("reservations")
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto, @CurrentUser() user: User) {
    createReservationDto.user = user.id;
    return this.reservationsService.create(createReservationDto);
  }

  @Get("/available-slots/programme/:id")
  async findAvailableSlots(@Param("id") programmeId: string) {
    return this.reservationsService.findAvailableSlots(new Date(), undefined, programmeId);
  }
}
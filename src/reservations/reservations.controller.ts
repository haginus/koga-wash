import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/users/entities/user.entity";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { ReservationQueryDto } from "./dto/reservation-query.dto";
import { ReservationsService } from "./reservations.service";

@Controller("reservations")
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}


  @Get("/available-slots/programme/:id")
  async findAvailableSlots(@Param("id") programmeId: string) {
    return this.reservationsService.findAvailableSlots(new Date(), undefined, programmeId);
  }

  @Get()
  async findAll(@Query() query: ReservationQueryDto) {
    return this.reservationsService.findAll(query);
  }

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto, @CurrentUser() user: User) {
    createReservationDto.userId = user.id;
    return this.reservationsService.create(createReservationDto);
  }

  @Post(":id/cancel")
  async cancel(@Param("id") id: string, @CurrentUser() user: User) {
    return this.reservationsService.cancel(user, id);
  }

  @Post(":id/check-in")
  async checkIn(@Param("id") id: string, @CurrentUser() user: User) {
    return this.reservationsService.checkIn(user, id);
  }

  @Post(":id/check-out")
  async checkOut(@Param("id") id: string, @CurrentUser() user: User) {
    return this.reservationsService.checkOut(user, id);
  }
  
}
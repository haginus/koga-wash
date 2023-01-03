import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { Role } from "src/auth/role.enum";
import { User } from "src/users/entities/user.entity";
import { AvailableSlotsQueryDto } from "./dto/available-slots-query.dto";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { ReservationQueryDto } from "./dto/reservation-query.dto";
import { ReservationsService } from "./reservations.service";

@Controller("reservations")
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}


  @Get("/available-slots/programme/:id")
  async findAvailableSlots(@Param("id") programmeId: string, @Query() query: AvailableSlotsQueryDto) {
    return this.reservationsService.findAvailableSlots(query.since || new Date(), undefined, programmeId);
  }

  @Get("/instances")
  async findAvailableInstances() {
    return this.reservationsService.findAvailableInstances();
  }

  @Get()
  async findAll(@Query() query: ReservationQueryDto = {}, @CurrentUser() user: User) {
    if(user.role != Role.Admin) query.userId = user.id;
    return this.reservationsService.findAll(query);
  }

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto, @CurrentUser() user: User) {
    if(user.role != Role.Admin) createReservationDto.userId = user.id;
    return this.reservationsService.create(createReservationDto);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @CurrentUser() user: User) {
    return this.reservationsService.findOne(id, user);
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

  @Get(":id/previous")
  async findPrevious(@Param("id") id: string, @Query("flag") flag: string) {
    const reservation = await this.reservationsService.findOne(id);
    return this.reservationsService.findPreviousReservation(reservation, flag == "true");
  }
  
}
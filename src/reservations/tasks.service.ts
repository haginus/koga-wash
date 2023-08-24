import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { MailService } from "src/mail/mail.service";
import { Reservation, ReservationStatus } from "./entities/reservation.entity";
import { ReservationsService } from "./reservations.service";

/**
 * This service is responsible for running background tasks.
 * - Check for reservations that are about to start and send a notification to the user.
 * - Check for reservations that are about to end and send a notification to the user.
 * - Cancel as not honored the reservations that started but the user did not show up.
 * - Automatically end the reservations that started and the user did not end them.
 */
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly reservationsService: ReservationsService,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    const pendingReservations = await this.reservationsService.findAll({ status: ReservationStatus.PENDING });
    pendingReservations.data.forEach(reservation => this.registerPendingReservation(reservation));
    const forEndNotifications = await this.reservationsService.findAll({ status: ReservationStatus.CHECKED_IN });
    forEndNotifications.data.forEach(reservation => this.registerCheckedInReservation(reservation));
  }

  @OnEvent("reservation.created")
  public registerPendingReservation(reservation: Reservation) {
    // Register a timeout for the reservation start time minus 15 minutes.
    const notificationTime = reservation.startTime.getTime() - 15 * 60 * 1000;
    const timeout = setTimeout(() => {
      this.mailService.sendReservationStartReminder(reservation);
    }, notificationTime - Date.now());
    this.schedulerRegistry.addTimeout(`reservation/${reservation.id}/startNotif`, timeout);
    this.logger.log(`Registered start notification send for reservation {${reservation.id}} at ${new Date(notificationTime).toISOString()}`);

    // Register a timeout for reservation cancel time.
    const cancelTime = reservation.startTime.getTime() + 5 * 60 * 1000;
    const cancelTimeout = setTimeout(async () => {
      const freshReservation = await this.reservationsService.findOne(reservation.id);
      if (freshReservation.status == ReservationStatus.PENDING) {
        this.reservationsService.cancelAsNotHonored(reservation.id);
      }
    }, cancelTime - Date.now());
    this.schedulerRegistry.addTimeout(`reservation/${reservation.id}/cancel`, cancelTimeout);
    this.logger.log(`Registered auto cancel for reservation {${reservation.id}} at ${new Date(cancelTime).toISOString()}`);

  }

  @OnEvent("reservation.checkedIn")
  public registerCheckedInReservation(reservation: Reservation) {
    // Register a timeout for the reservation end time minus 5 minutes.
    const notificationTime = reservation.endTime.getTime() - 5 * 60 * 1000;
    const timeoutTime = notificationTime - Date.now();
    const timeout = setTimeout(() => {
      this.mailService.sendReservationStartReminder(reservation);
    }, timeoutTime);
    this.schedulerRegistry.addTimeout(`reservation/${reservation.id}/endNotif`, timeout);
    this.logger.log(`Registered end notification send for reservation {${reservation.id}} at ${new Date(notificationTime).toISOString()}`);

    // Register a timeout for reservation end time.
    const endTime = reservation.endTime.getTime();
    const endTimeout = setTimeout(async () => {
      const freshReservation = await this.reservationsService.findOne(reservation.id);
      if (freshReservation.status == ReservationStatus.CHECKED_IN) {
        this.reservationsService.checkOut(null, reservation.id);
      }
    }, endTime - Date.now());
    this.schedulerRegistry.addTimeout(`reservation/${reservation.id}/end`, endTimeout);
    this.logger.log(`Registered auto check out for reservation {${reservation.id}} at ${new Date(endTime).toISOString()}`);
  }

  @Cron("0 59 23 * * *")
  public async saveEnergyUsage() {
    this.reservationsService.savePendingEnergyUsage();
  }

}
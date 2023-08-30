import { plainToInstance } from "class-transformer";
import { Role } from "src/auth/role.enum";
import { roundToNearest10 } from "src/lib/util";
import { MachineInstance } from "src/machines/enitities/machine-instance.entity";
import { Machine } from "src/machines/enitities/machine.entity";
import { MaterialKind, Programme } from "src/machines/enitities/programme.entity";
import { Reservation, ReservationStatus } from "src/reservations/entities/reservation.entity";
import { User } from "src/users/entities/user.entity";

export const mockProgramme: Programme = {
  id: "3c717abd-a01a-4c79-a480-36e917c4a207",
  name: "Bumbac 30°C",
  wheelIndex: 0,
  description: null,
  duration: 60,
  materialKind: MaterialKind.COTTON,
  machine: null,
  reservations: [],
};

export const mockMachine: Machine = {
  id: "525ea50d-ef19-43ad-8b3e-0365bdafea66",
  make: "Arctic",
  model: "WWW3342SV",
  kind: "WashingMachine",
  instances: [],
  programmes: [mockProgramme],
}

export const mockMachineInstance: MachineInstance = {
  id: "14672a30-6ee5-4782-a580-1fa8a57d0038",
  name: "Mașina de spălat #1",
  isFaulty: false,
  plugId: "8022116E8E7698E841D4FF58F1620CD21FD1B26C",
  machine: mockMachine,
  reservations: [],
}

export const mockUser: User = {
  id: "525ea50d-ef19-43ad-8b3e-0365bdafea64",
  firstName: "John",
  lastName: "Doe",
  room: "331A",
  phone: "0743854334",
  email: "john.doe@example.com",
  password: null,
  tokens: [],
  reservations: [],
  role: Role.User,
};

export const getMockReservation = () => {
  const startTime = roundToNearest10(new Date());
  const endTime = new Date(startTime.getTime() + mockProgramme.duration * 60 * 1000);
  return plainToInstance(Reservation, {
    id: "f15d2348-e297-42a0-bf9e-566f6f5bb59f",
    startTime,
    endTime,
    status: ReservationStatus.PENDING,
    flagged: true,
    meta: {
      flags: [
        {
          flaggedAt: new Date("2023-01-02T23:37:15.867Z"),
          flaggedByUserId: "525ea50d-ef19-43ad-8b3e-0365bdafea64",
          flagReason: "clothes_left_behind"
        }
      ]
    },
    machineInstance: mockMachineInstance,
    user: mockUser,
    programme: mockProgramme,
  });
}

export const mailContexts = {
  "welcome": {
    user: mockUser,
    token: "i5sudv7az4fkajimqmjktk",
  },
  "reservation-confirmation": {
    reservation: getMockReservation(),
  },
  "reservation-start-reminder": {
    reservation: getMockReservation(),
  },
  "reservation-end-reminder": {
    reservation: getMockReservation(),
  },
};
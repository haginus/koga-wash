import { MachineInstance } from "src/machines/enitities/machine-instance.entity"

export type AvailableInstancesDto = {
  instance: MachineInstance;
} & (
  | { availableUntil: Date }
  | { busyUntil: Date }
)
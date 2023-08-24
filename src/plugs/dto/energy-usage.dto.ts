export class EnergyUsageDto {
  current_power: number;
  electricity_charge: [number, number, number];
  local_time: string;
  /** Month energy usage in watts */
  month_energy: number;
  /** Month runtime in minutes */
  month_runtime: number;
  /** Today energy usage in watts */
  today_energy: number;
  /** Today runtime in minutes */
  today_runtime: number;
}
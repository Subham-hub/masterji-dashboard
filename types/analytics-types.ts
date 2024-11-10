export interface AnalyticsType {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    fill?: boolean;
    borderColor: string;
    tension?: number;
    backgroundColor?: string;
    borderWidth?: number;
  }>;
}

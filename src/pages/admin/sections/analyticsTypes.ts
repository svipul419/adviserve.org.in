export interface DailyCount {
  date: string;
  views: number;
  visitors: number;
}

export interface PageStat {
  path: string;
  views: number;
  uniqueVisitors: number;
}

export interface DeviceBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface ReferrerStat {
  source: string;
  visits: number;
}

export type DateRange = '7d' | '30d' | '90d';

export interface Outage {
  id: number;
  location: string;
  affectedAreas: string;
  domain: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ACTIVE' | 'RESOLVED';
  createdAt?: string;
  resolvedAt?: string;
}

export interface Ticket {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone?: string;
  customerLocation?: string;
  domain: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  repId?: number;
  repName?: string;
  managerId?: number;
  createdAt?: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  responseTimeHrs?: number;
  resolutionTimeHrs?: number;
  rating?: number;
}

export enum IncidentSeverity {
  TRIVIAL = 'Trivial Damage',
  MINOR = 'Minor Damage',
  MAJOR = 'Major Damage',
  TOTAL = 'Total Loss'
}

export interface ClaimData {
  months_as_customer: number;
  policy_annual_premium: number;
  policy_deductable: number;
  umbrella_limit: number;
  vehicle_claim: number;
  incident_hour_of_the_day: number;
  incident_severity: IncidentSeverity;
}

export interface PredictionResult {
  isFraud: boolean;
  riskScore: number; // 0-100
  aiAnalysis: string;
}

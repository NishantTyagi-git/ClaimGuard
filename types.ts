export interface TreeNode {
  featureIndex?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  value?: number; // Result probability (0.0 to 1.0)
  groups?: number[][][];
}

export interface ClaimInputs {
  months_as_customer: number;
  policy_deductable: number;
  umbrella_limit: number;
  policy_annual_premium: number;
  incident_hour_of_the_day: number;
  vehicle_claim: number;
  incident_severity: string;
}

export interface PredictionResult {
  isFraud: boolean;
  prob: number;
  aiAnalysis?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

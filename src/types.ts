export interface HealthRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  category: string;
  date: string;
  time: string;
}

export type ViewState = 'home' | 'calculator' | 'records' | 'statistics' | 'about';

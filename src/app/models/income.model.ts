export interface Income {
  id: number;
  source: string;
  amount: number;
  date: string; // keep as string from API
  category: string;
}
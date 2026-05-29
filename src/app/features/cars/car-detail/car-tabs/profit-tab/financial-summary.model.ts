export interface FinancialSummary {
  carId: number;
  purchasePrice: number;
  totalExpenses: number;
  investedAmount: number;
  salePrice: number | null;
  profit: number | null;
  roi: number | null;
  daysHeld: number;
}

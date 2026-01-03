import {ExpenseType} from '../../../../../shared/ui/enums/expense-type';

export interface CostModel {
  expenseId?: number;
  carId: number;
  type: ExpenseType;
  date: string;
  description: string;
  payer: string;
  amount: number;
}

import {Component, effect, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CostsService} from '../costs-service';
import {ExpenseType} from '../../../../../../shared/ui/enums/expense-type';
import {CostModel} from '../cost-model';

@Component({
  selector: 'app-add-cost',
  imports: [FormsModule],
  templateUrl: './add-cost.html',
  styleUrl: './add-cost.css',
})
export class AddCost {

  @Input() carId!: number;
  @Input() expense: CostModel | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  costService = inject(CostsService);

  expenseTypes = Object.values(ExpenseType);

  description = '';
  amount!: number;
  date!: string;
  type!: ExpenseType;
  payer!: string;

  constructor() {
    effect(() => {
      if (this.expense) {
        this.description = this.expense.description;
        this.amount = this.expense.amount;
        this.date = this.expense.date;
        this.type = this.expense.type;
        this.payer = this.expense.payer;
      }
    });
  }

  submit() {

    this.costService.createCostForCar({
      carId: this.carId,
      type: this.type,
      payer: this.payer,
      description: this.description,
      amount: this.amount,
      date: this.date
    }).subscribe({
      next: () => {
        this.saved.emit();
      },
      error: err => {
        console.error('Błąd zapisu kosztu', err);
      }
    });
  }
}

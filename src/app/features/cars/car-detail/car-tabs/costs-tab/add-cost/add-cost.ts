import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CostsService} from '../costs-service';
import {ExpenseType} from '../../../../../../shared/ui/enums/expense-type';
import {CostModel} from '../cost-model';
import {ToastService} from '../../../../../../shared/ui/toast-service';

@Component({
  selector: 'app-add-cost',
  imports: [FormsModule],
  templateUrl: './add-cost.html',
  styleUrl: './add-cost.css',
})
export class AddCost {

  @Input() carId!: number;
  @Input()
  set expense(value: CostModel | null) {
    if (value) {
      this.description = value.description;
      this.amount = value.amount;
      this.date = value.date;
      this.type = value.type;
      this.payer = value.payer;
      this._expense = value;
    } else {
      this._expense = null;
      this.resetForm();
    }
  }
  get expense(): CostModel | null {
    return this._expense;
  }

  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private costService = inject(CostsService);
  private toastService = inject(ToastService);
  private _expense: CostModel | null = null;

  expenseTypes = Object.values(ExpenseType);

  description = '';
  amount!: number;
  date!: string;
  type!: ExpenseType;
  payer!: string;

  private resetForm(): void {
    this.description = '';
    this.amount = 0;
    this.date = '';
    this.payer = '';
  }

  submit(): void {
    const costData: CostModel = {
      carId: this.carId,
      type: this.type,
      payer: this.payer,
      description: this.description,
      amount: this.amount,
      date: this.date,
    };

    if (this.expense?.expenseId) {
      // Edycja istniejącego kosztu
      costData.expenseId = this.expense.expenseId;
      this.costService.editCostForCar(costData).subscribe({
        next: () => {
          this.toastService.show('Koszt zaktualizowany');
          this.saved.emit();
        },
        error: () => {
          this.toastService.show('Błąd aktualizacji kosztu');
        },
      });
    } else {
      // Tworzenie nowego kosztu
      this.costService.createCostForCar(costData).subscribe({
        next: () => {
          this.toastService.show('Koszt dodany');
          this.saved.emit();
        },
        error: () => {
          this.toastService.show('Błąd zapisu kosztu');
        },
      });
    }
  }
}

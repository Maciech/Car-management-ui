import {Component, computed, Input, OnInit, signal} from '@angular/core';
import {CostModel} from './cost-model';
import {CostsService} from './costs-service';
import {AddCost} from './add-cost/add-cost';
import {ExpenseType} from '../../../../../shared/ui/enums/expense-type';

@Component({
  selector: 'app-costs-tab',
  imports: [
    AddCost
  ],
  templateUrl: './costs-tab.html',
  styleUrl: './costs-tab.css',
})
export class CostsTab implements OnInit{
  @Input() carId!: number;
  costs  = signal<CostModel[]>([])
  showAdd = signal(false);
  selectedType = signal<string | null>(null);
  selectedPayer = signal<string | null>(null);
  expenseSum = signal<number | null>(null);
  editingCost = signal<CostModel | null>(null);

  expenseTypes = Object.values(ExpenseType);

  filteredCosts = computed(() => {
    return this.costs().filter(cost => {
      const typeOk =
        !this.selectedType() || cost.type === this.selectedType();

      // const payerOk =
      //   !this.selectedPayer() || cost.payer === this.selectedPayer();

      return typeOk;
    });
  });



  constructor(private costService: CostsService) {}

  ngOnInit() {
    this.getCostsByCarId();
  }

  openAdd() {
    this.showAdd.set(true);
  }

  closeAdd() {
    this.showAdd.set(false);
  }

  onSaved() {
    this.closeAdd();
    this.getCostsByCarId();
  }

  getCostsByCarId() {
    this.costService.getAllCostsByCarId(this.carId)
      .subscribe(costs => {
        this.costs.set(costs)
        this.expenseSum.set(costs.map(value => value.amount)
          .reduce((a, b) => a + b));
      });
  }

  editCost(expense: CostModel) {
      this.editingCost.set(expense);
      this.showAdd.set(true);
  }
}

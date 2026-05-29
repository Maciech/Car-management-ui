import {Component, computed, inject, Input, OnInit, signal} from '@angular/core';
import {CostModel} from './cost-model';
import {CostsService} from './costs-service';
import {AddCost} from './add-cost/add-cost';
import {ExpenseType} from '../../../../../shared/ui/enums/expense-type';
import {AgGridAngular} from 'ag-grid-angular';
import {ToastService} from '../../../../../shared/ui/toast-service';
import {colorSchemeDarkBlue, GridReadyEvent, SizeColumnsToContentStrategy, themeQuartz, GridOptions} from 'ag-grid-community';

@Component({
  selector: 'app-costs-tab',
  imports: [
    AddCost,
    AgGridAngular
  ],
  templateUrl: './costs-tab.html',
  styleUrl: './costs-tab.css',
})
export class CostsTab implements OnInit {
  @Input() carId!: number;

  showAdd = signal(false);
  expenseSum = signal<number | null>(null);
  editingCost = signal<CostModel | null>(null);

  costService = inject(CostsService);
  toastService = inject(ToastService);
  myTheme = themeQuartz.withPart(colorSchemeDarkBlue);

  rowData: any[] = [];

  gridOptions: GridOptions = {
    autoSizeStrategy: {
      type: 'fitCellContents'
    } as SizeColumnsToContentStrategy
  };


  columnDefs = [
    { field: 'expenseId', headerName: 'ID' },
    { field: 'type', headerName: 'Typ', sortable: true, filter: true },
    { field: 'date', headerName: 'Data', sortable: true },
    { field: 'description', headerName: 'Opis', filter: true },
    { field: 'payer', headerName: 'Płatnik' , sortable: true, filter: true},
    { field: 'amount', headerName: 'Wartość [zł]', sortable: true, filter: true},
  ];


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
      .subscribe({
        next: (costs) => {
          this.rowData = costs;
          this.expenseSum.set(costs.length > 0
            ? costs.map(value => value.amount).reduce((a, b) => a + b)
            : 0);
        },
        error: () => {
          this.toastService.show("Koszty dla podanego samochodu nie zostały znalezione")
        },
      });
  }

  editCost(expense: CostModel) {
      this.editingCost.set(expense);
      this.showAdd.set(true);
  }

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }
}

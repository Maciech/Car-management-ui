import {Component, computed, inject, Input, OnInit, signal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {CostModel} from './cost-model';
import {CostsService} from './costs-service';
import {AddCost} from './add-cost/add-cost';
import {AgGridAngular} from 'ag-grid-angular';
import {ToastService} from '../../../../../shared/ui/toast-service';
import {ThemeService} from '../../../../../core/theme/theme.service';
import {
  colorSchemeDarkBlue,
  colorSchemeLight,
  GridOptions,
  GridReadyEvent,
  SizeColumnsToContentStrategy,
  themeQuartz,
} from 'ag-grid-community';

@Component({
  selector: 'app-costs-tab',
  imports: [AddCost, AgGridAngular, DecimalPipe],
  templateUrl: './costs-tab.html',
  styleUrl: './costs-tab.css',
})
export class CostsTab implements OnInit {
  @Input() carId!: number;

  private costService  = inject(CostsService);
  private toastService = inject(ToastService);
  private themeService = inject(ThemeService);

  showAdd     = signal(false);
  expenseSum  = signal<number>(0);
  editingCost = signal<CostModel | null>(null);
  rowData: CostModel[] = [];

  // Reaguje na zmianę motywu bez restartu komponentu
  agTheme = computed(() =>
    this.themeService.isDark()
      ? themeQuartz.withPart(colorSchemeDarkBlue)
      : themeQuartz.withPart(colorSchemeLight)
  );

  gridOptions: GridOptions = {
    autoSizeStrategy: {type: 'fitCellContents'} as SizeColumnsToContentStrategy,
    suppressMovableColumns: true,
  };

  columnDefs = [
    {field: 'type',        headerName: 'Typ',          sortable: true, filter: true},
    {field: 'date',        headerName: 'Data',         sortable: true},
    {field: 'description', headerName: 'Opis',         filter: true, flex: 1},
    {field: 'payer',       headerName: 'Płatnik',      sortable: true},
    {field: 'amount',      headerName: 'Kwota (zł)',   sortable: true, filter: true},
  ];

  ngOnInit() { this.load(); }

  load() {
    this.costService.getAllCostsByCarId(this.carId).subscribe({
      next: costs => {
        this.rowData = costs;
        this.expenseSum.set(
          costs.length > 0 ? costs.reduce((s, c) => s + c.amount, 0) : 0
        );
      },
      error: () => this.toastService.show('Nie udało się pobrać kosztów'),
    });
  }

  openAdd()   { this.editingCost.set(null); this.showAdd.set(true); }
  closeAdd()  { this.showAdd.set(false); this.editingCost.set(null); }
  editCost(e: CostModel) { this.editingCost.set(e); this.showAdd.set(true); }

  onSaved()   { this.closeAdd(); this.load(); }

  onGridReady(params: GridReadyEvent) { params.api.sizeColumnsToFit(); }
}

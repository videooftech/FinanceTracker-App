import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { ICellRendererParams } from 'ag-grid-community';
import { IncomeService } from '../../services/income.service';
import { Income } from '../../models/income.model';
import { ToastService } from '../../services/toast.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';



@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class IncomeComponent implements OnInit {
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  deletingIncomeId: number = 0;

  columnDefs: ColDef[] = [
    { field: 'source', headerName: 'Source', filter: true, sortable: true, flex: 1 },
    { field: 'category', headerName: 'Category', filter: true, sortable: true, width: 140, cellRenderer: (params: ICellRendererParams) => `<span class=\"badge\">${params.value || ''}</span>` },
    { field: 'amount', headerName: 'Amount', filter: 'agNumberColumnFilter', sortable: true, width: 140, valueFormatter: (params: any) => {
        const v = params.value || 0; return '₹' + (+v).toLocaleString();
      }
    },
    { field: 'date', headerName: 'Date', filter: 'agDateColumnFilter', sortable: true, width: 150, valueFormatter: (params: any) => {
        if (!params.value) return '';
        const d = new Date(params.value); return d.toLocaleDateString();
      }
    },
    { headerName: 'Actions', width: 160, suppressMovable: true, cellRenderer: (params: ICellRendererParams) => {
        const container = document.createElement('div');
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-primary me-2';
        editBtn.innerText = 'Edit';
        editBtn.addEventListener('click', () => this.startEdit(params.data));

        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-sm btn-danger';
        delBtn.innerText = 'Delete';
        delBtn.addEventListener('click', () => this.deleteIncome(params.data.id));

        container.appendChild(editBtn);
        container.appendChild(delBtn);
        return container;
      }
    }
  ];

  defaultColDef = { resizable: true, filter: true, sortable: true };

  gridContext = { componentParent: this };

  editing: boolean = false;
  editData: Income = { id: 0, source: '', amount: 0, date: '', category: '' };

  incomeList: Income[] = [];

  newIncome: Omit<Income, 'id'> = {
    source: '',
    amount: 0,
    date: '',
    category: ''
  };


  constructor(private incomeService: IncomeService, private cdr: ChangeDetectorRef, private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadIncome();
  }

  onGridReady(event: GridReadyEvent) {
    try { event.api.sizeColumnsToFit(); } catch (e) { }
  }

  loadIncome() {
    this.incomeService.getIncome().subscribe(res => {
      this.incomeList = [...res];
      this.cdr.markForCheck();
    });
  }

  addIncome() {
    this.incomeService.addIncome(this.newIncome).subscribe(res => {
      this.incomeList = [...this.incomeList, res];
      this.newIncome = { source: '', amount: 0, date: '', category: '' };
      this.cdr.markForCheck();
      this.toastService.success('Income added successfully!');
    });
  }

  startEdit(item: Income) {
    this.editing = true;
    this.editData = { ...item };
  }

  cancelEdit() {
    this.editing = false;
    this.editData = { id: 0, source: '', amount: 0, date: '', category: '' };
  }

  saveEdit() {
    this.incomeService.updateIncome(this.editData.id, this.editData)
      .subscribe(() => {
        this.loadIncome();
        this.editing = false;
        this.toastService.success('Income updated successfully!');
        this.editData = { id: 0, source: '', amount: 0, date: '', category: '' };
      });
  }

  deleteIncome(id: number) {
    this.deletingIncomeId = id;
    if (this.confirmDialog) {
      this.confirmDialog.isOpen = true;
    }
  }

  onDeleteConfirmed() {
    this.incomeService.deleteIncome(this.deletingIncomeId).subscribe(() => {
      this.loadIncome();
      this.toastService.success('Income deleted successfully!');
    });
  }

  onDeleteCancelled() {
    this.deletingIncomeId = 0;
  }

}

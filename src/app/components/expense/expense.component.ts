import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html'
})
export class ExpenseComponent implements OnInit {

  columnDefs: ColDef[] = [
    { field: 'title', headerName: 'Title', filter: true, sortable: true, flex: 1 },
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
        delBtn.addEventListener('click', () => this.deleteExpense(params.data.id));

        container.appendChild(editBtn);
        container.appendChild(delBtn);
        return container;
      }
    }
  ];

  defaultColDef = { resizable: false, filter: true, sortable: true };

  gridContext = { componentParent: this };

  editing: boolean = false;
  editData: Expense = { id: 0, title: '', amount: 0, date: '', category: '' };

  expenseList: Expense[]  = [
    { id: 1, title: 'Groceries', amount: 1500, date: '2024-01-15', category: 'Food' },
    { id: 2, title: 'Gas', amount: 800, date: '2024-01-16', category: 'Transportation' }
    ];

  newExpense: Omit<Expense, 'id'>
 = {
    title: '',
    amount: 0,
    date: '',
    category: ''
  };

  constructor(private expenseService: ExpenseService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  onGridReady(event: GridReadyEvent) {
    try { event.api.sizeColumnsToFit(); } catch (e) { }
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(res => {
      this.expenseList = res;
    });
  }

  addExpense() {
    this.expenseService.addExpense(this.newExpense).subscribe(res => {
      this.expenseList = [...this.expenseList, res];
      this.newExpense = { title: '', amount: 0, date: '',   category: '' };
      this.cdr.markForCheck();
    });
  }

  startEdit(item: Expense) {
    this.editing = true;
    this.editData = { ...item };
  }

  cancelEdit() {
    this.editing = false;
  }

  saveEdit() {
     this.expenseService.updateExpense(this.editData.id, this.editData)
       .subscribe(() => {
         this.loadExpenses();
         this.editing = false;
       });
  }

  deleteExpense(id: number) {
    if (confirm("Are you sure you want to delete this expense?")) {
       this.expenseService.deleteExpense(id).subscribe(() => {
      console.log("Deleted, refreshing list...");

       this.loadExpenses();
      });
    }
  }

}

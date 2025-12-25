import { Component, OnInit } from '@angular/core';
import { IncomeService } from './services/income.service';
import { ExpenseService } from './services/expense.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {



  expenseList: any[] = [];

  newExpense = {
    title: '',
    amount: 0,
    date: '',
    category: ''
  };




  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();


  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(res => {
      this.expenseList = res;
    });
  }

  addExpense() {
    this.expenseService.addExpense(this.newExpense).subscribe(res => {
      this.expenseList.push(res);
      this.newExpense = { title: '', amount: 0, date: '',  category: '' };
    });
  }



}

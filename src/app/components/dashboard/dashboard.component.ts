import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardSummary } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  summary: DashboardSummary = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary() {
    this.dashboardService.getSummary().subscribe(res => {
      this.summary = res;
    });
  }
}
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

   pieChartLabels: string[] = ['Food', 'Travel', 'Bills', 'Shopping'];

  pieChartData = [
    { data: [1200, 800, 450, 300] }
  ];

  pieChartType: string = 'pie';

  pieChartOptions: any = {
    responsive: true,
    legend: {
      position: 'bottom'
    }
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
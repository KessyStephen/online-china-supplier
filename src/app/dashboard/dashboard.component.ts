import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/services/order.service';
import { DashboardService } from '../shared/services/dashboard.service';
import { Statistics } from '../shared/interfaces/stat.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  ordersList = [];
  loading: boolean = false;
  stats: Statistics;

  constructor(private orderService: OrderService, private dashboardStatics: DashboardService) { }

  getRecentOrders() {
    this.loading = true;
    this.orderService.getOrders(1, 5, "createdAt:desc").subscribe((response) => {
      this.loading = false;
      this.ordersList = response.results;
    });
  }

  getDashboardStats() {
    this.loading = true;
    this.dashboardStatics.getStats().subscribe((response) => {
      this.loading = false;
      this.stats = response;
    });
  }

  ngOnInit(): void {
    this.getDashboardStats();
    this.getRecentOrders();
  }
}

import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/services/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  ordersList = [];
  loading: boolean = false;

  constructor(private orderService: OrderService) { }

  getRecentOrders() {
    this.loading = true;
    this.orderService.getOrders(1, 5, "createdAt:desc").subscribe((response) => {
      this.loading = false;
      this.ordersList = response.results;
    });
  }

  ngOnInit(): void {
    this.getRecentOrders();
  }
}

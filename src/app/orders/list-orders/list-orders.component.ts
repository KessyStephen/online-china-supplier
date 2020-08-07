import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/shared/services/table.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { NzTableQueryParams } from 'ng-zorro-antd';
import { Order } from 'src/app/shared/interfaces/order.interface';


@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css'],
})
export class ListOrdersComponent implements OnInit {
  ngOnInit(): void {
    this.loadDataFromServer(this.page, this.perPage);
    this.getOrderStatusList();
  }

  allChecked: boolean = false;
  indeterminate: boolean = false;
  displayData = [];
  searchInput: string;
  loading: boolean = false;
  page: number = 1;
  perPage: number = 10;
  total: number = 1;
  orderStatusList: any[] = [];
  statusInput: any;

  orderColumn = [
    {
      title: 'ID',
      key: 'orderId',
      compare: (a: Order, b: Order) => a.id.localeCompare(b.id),
    },
    {
      title: 'Date',
      key: 'createdAt',
      compare: (a: Order, b: Order) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: 'Customer',
    },
    {
      title: 'Amount',
      key: 'total',
      compare: (a: Order, b: Order) => a.total - b.total,
    },
    {
      title: 'Sample Request',
      key: 'isSampleRequest',
      compare: (a: Order, b: Order) => a.total - b.total,
    },
    {
      title: 'Status',
      key: 'status',
      compare: (a: Order, b: Order) => a.status.localeCompare(b.status),
    }
  ];

  ordersList = [];

  constructor(private tableSvc: TableService, private orderService: OrderService) {
    this.displayData = this.ordersList;
  }

  search() {
    const data = this.ordersList;
    this.displayData = this.tableSvc.search(this.searchInput, data);
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    let sortString = '';
    if (currentSort)
      sortString = `${currentSort.key}:${currentSort.value === 'ascend' ? 'asc' : 'desc'}`;
    this.loadDataFromServer(pageIndex, pageSize, sortString);
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sort?: string
  ): void {
    this.loading = true;
    this.orderService.getOrders(pageIndex, pageSize, sort).subscribe((result: { total: number, results: Order[] }) => {
      this.loading = false;
      this.ordersList = result.results;
      this.total = result.total;
    });
  }

  filterStatus(status) {
    this.loadDataFromServer(1, 10, `status:${status}`);
  }

  getOrderStatusList() {
    this.orderService.getOrderStatusList().subscribe((statuses) => {
      this.orderStatusList = statuses;
    })
  }
}

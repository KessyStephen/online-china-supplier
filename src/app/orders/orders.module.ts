import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewOrderComponent } from './view-order/view-order.component';
import { ListOrdersComponent } from './list-orders/list-orders.component';
import { OrderRoutingModule } from './orders-routing.module';
import {
  NzCardModule,
  NzAvatarModule,
  NzBadgeModule,
  NzTableModule,
  NzInputModule,
  NzSelectModule,
  NzButtonModule,
  NzIconModule,
  NzTimelineModule,
  NzTagModule,
  NzSkeletonModule,
  NzFormModule,
  NzSwitchModule,
} from 'ng-zorro-antd';
import { ThemeConstantService } from '../shared/services/theme-constant.service';
import { AppsService } from '../shared/services/apps.service';
import { TableService } from '../shared/services/table.service';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewOrderComponent, ListOrdersComponent],
  imports: [
    NzCardModule,
    NzButtonModule,
    NzInputModule,
    NzTagModule,
    NzTimelineModule,
    NzSelectModule,
    NzAvatarModule,
    NzBadgeModule,
    NzTableModule,
    CommonModule,
    NzIconModule,
    NzInputModule,
    NzFormModule,
    NzSkeletonModule,
    OrderRoutingModule,
    ReactiveFormsModule,
    NzSwitchModule,
    SharedModule,
  ],
  providers: [ThemeConstantService, AppsService, TableService],
})
export class OrdersModule {}

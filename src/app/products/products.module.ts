import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProductsComponent } from './list-products/list-products.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ProductRoutingModule } from './products-routing.module';
import { ThemeConstantService } from '../shared/services/theme-constant.service';
import { AppsService } from '../shared/services/apps.service';
import { QuillModule } from 'ngx-quill';

import { TableService } from '../shared/services/table.service';
import {
  NzButtonModule,
  NzCardModule,
  NzAvatarModule,
  NzRateModule,
  NzBadgeModule,
  NzProgressModule,
  NzRadioModule,
  NzTableModule,
  NzDropDownModule,
  NzTimelineModule,
  NzTabsModule,
  NzTagModule,
  NzListModule,
  NzCalendarModule,
  NzToolTipModule,
  NzFormModule,
  NzModalModule,
  NzSelectModule,
  NzUploadModule,
  NzInputModule,
  NzPaginationModule,
  NzDatePickerModule,
  NzCheckboxModule,
  NzMessageModule,
  NzIconModule,
  NzDividerModule,
  NzInputNumberModule,
  NzTypographyModule,
  NzStepsModule,
  NzTreeSelectModule,
} from 'ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { QuantitySaleComponent } from './quantity-sale/quantity-sale.component';
import { CustomAttributeComponent } from './custom-attribute/custom-attribute.component';
import { QosComponent } from './qos/qos.component';
import { QosOneComponent } from './qos-one/qos-one.component';
import { QosTwoComponent } from './qos-two/qos-two.component';

const antdModule = [
  NzButtonModule,
  NzCardModule,
  NzAvatarModule,
  NzRateModule,
  NzBadgeModule,
  NzProgressModule,
  NzRadioModule,
  NzTableModule,
  NzDropDownModule,
  NzTimelineModule,
  NzTabsModule,
  NzDividerModule,
  NzTagModule,
  NzListModule,
  NzCalendarModule,
  NzToolTipModule,
  NzFormModule,
  NzModalModule,
  NzSelectModule,
  NzUploadModule,
  NzInputModule,
  NzPaginationModule,
  NzDatePickerModule,
  NzCheckboxModule,
  NzMessageModule,
  NzInputNumberModule,
  NzTypographyModule,
  NzStepsModule,
  NzTreeSelectModule
];
@NgModule({
  declarations: [ListProductsComponent, ViewProductComponent, QuantitySaleComponent, CustomAttributeComponent, QosComponent, QosOneComponent, QosTwoComponent],
  imports: [SharedModule, CommonModule, ProductRoutingModule, ReactiveFormsModule, ...antdModule, QuillModule],
  providers: [ThemeConstantService, AppsService, TableService],
})
export class ProductsModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOrdersComponent } from './list-orders/list-orders.component';
import { ViewOrderComponent } from './view-order/view-order.component';

const routes: Routes = [
    {
        path: '',
        component: ListOrdersComponent,
        data: {
            title: 'Orders',
            headerDisplay: "none"
        }
    },
    {
        path: 'view/:id',
        component: ViewOrderComponent,
        data: {
            title: 'View Order',
            headerDisplay: "none"
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrderRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewProductComponent } from './view-product/view-product.component';
import { ListProductsComponent } from './list-products/list-products.component';


const routes: Routes = [
    {
        path: '',
        component: ListProductsComponent,
        data: {
            title: 'Products',
            headerDisplay: "none"
        }
    },
    {
        path: 'view/:id',
        component: ViewProductComponent,
        data: {
            title: 'View Product',
            headerDisplay: "none"
        }
    },
    {
        path: 'create',
        component: ViewProductComponent,
        data: {
            title: 'Create Product',
            headerDisplay: "none"
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductRoutingModule { }

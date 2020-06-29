import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { ViewCategoriesComponent } from './view-categories/view-categories.component';


const routes: Routes = [
    {
        path: '',
        component: ListCategoriesComponent,
        data: {
            title: 'Categories',
            headerDisplay: "none"
        }
    },
    {
        path: 'view/:id',
        component: ViewCategoriesComponent,
        data: {
            title: 'View Category',
            headerDisplay: "none"
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CategoriesRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { ViewCategoriesComponent } from './view-categories/view-categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';



@NgModule({
  declarations: [ListCategoriesComponent, ViewCategoriesComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule
  ]
})
export class CategoriesModule { }

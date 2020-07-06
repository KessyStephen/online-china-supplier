import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/shared/services/table.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { NzTableQueryParams } from 'ng-zorro-antd';
import { CategoryService } from 'src/app/shared/services/categories.service';

@Component({
    selector: 'app-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {

    constructor(private tableSvc: TableService, private productService: ProductsService, private categoryService: CategoryService) {
        this.displayData = this.productsList
    }

    ngOnInit(): void {
        this.loadDataFromServer(this.page, this.perPage, "createdAt:desc");
        this.getCategories();
    }
    selectedCategory: string;
    selectedStatus: string;
    searchInput: any;
    displayData = [];
    loading: boolean = false;
    page: number = 1;
    perPage: number = 10;
    total: number = 1;

    orderColumn = [
        {
            title: 'Created Date',
            key: 'createdAt',
            compare: (a: Product, b: Product) => a.createdAt.localeCompare(b.createdAt)
        },
        {
            title: 'Product',
            key: 'translations',
        },
        {
            title: 'Category',
            key: 'categoryId',
        },
        {
            title: 'Price',
            key: 'price',
            compare: (a: Product, b: Product) => a.price - b.price,
        },
        {
            title: 'Status',

        },
        {
            title: ''
        }
    ]

    productsList = [];
    categoryList: any[] = [];

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
        this.productService.listProducts(pageIndex, pageSize, sort).subscribe((result: { total: number, results: Product[] }) => {
            this.loading = false;
            this.productsList = result.results;
            this.total = result.total;
        });
    }

    getCategories() {
        this.categoryService.getAllSubcategories().subscribe((response: any) => {
            response.forEach(element => {
                if (element.parentId)
                    this.categoryList.push(element);
            });;
        });
    }

    getCategoryName(id: string) {
       return this.categoryList.find((category) => category._id === id).translations.en.name;
    }


    search(): void {
        const data = this.productsList
        this.displayData = this.tableSvc.search(this.searchInput, data)
    }

    categoryChange(value: string): void {
        const data = this.productsList
        value !== 'All' ? this.displayData = data.filter(elm => elm.category === value) : this.displayData = data
    }

    statusChange(value: string): void {
        const data = this.productsList
        value !== 'All' ? this.displayData = data.filter(elm => elm.status === value) : this.displayData = data
    }
}    
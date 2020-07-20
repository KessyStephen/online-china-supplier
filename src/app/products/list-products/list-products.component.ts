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
    categoryId: string;
    status: string;

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
    categoryList: any[] = [{
        translations: {
            en: {
                name: 'All'
            }
        },
        id: 'all'
    }];

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
        sort?: string,
        categoryIds?: string[],
        isApproved?: string,
        query?: string
    ): void {
        this.loading = true;
        this.productService.listProducts(pageIndex, pageSize, sort, categoryIds, isApproved, query).subscribe((result: { total: number, results: Product[] }) => {
            this.loading = false;
            this.productsList = result.results;
            this.total = result.total;
        });
    }

    getCategories() {
        this.categoryService.getAllCategories().subscribe((success: boolean) => {
            this.categoryList = this.categoryService.categories;
        });
    }

    getCategoryName(id: string) {
        return this.categoryService.categories.find((category) => category._id === id).translations.en.name;
    }


    search(): void {
        // const data = this.productsList
        // this.displayData = this.tableSvc.search(this.searchInput, data)
        this.loadDataFromServer(1, 10, null, null, null, this.searchInput);
    }

    categoryChange(value: string): void {
        let subCategories = [];
        if (value !== 'all') {
            subCategories = this.categoryService.categories.filter(category => category.parentId === value).map((subs) => {
                return subs._id;
            });
            subCategories.push(value);
        }
        this.page = 1;
        this.perPage = 10;
        if (value === 'all')
            this.loadDataFromServer(this.page, this.perPage, null, null);
        else
            this.loadDataFromServer(this.page, this.perPage, null, subCategories);
    }

    statusChange(value: string): void {
        if (value === 'all')
            this.loadDataFromServer(this.page, this.perPage, null, null, null);
        else
            this.loadDataFromServer(this.page, this.perPage, null, null, value);
    }
}    
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NzModalService, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/categories.service';
import { Category } from 'src/app/shared/interfaces/categories.model';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Observable, Observer } from 'rxjs';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
    selector: 'app-view-product',
    templateUrl: './view-product.component.html',
    styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

    isEdit: boolean = false;
    isCreate: boolean = false;
    productEditForm: FormGroup;
    previewImage: string = '';
    previewVisible: boolean = false;
    categories: Category[] = [];
    subCategories: Category[] = [];
    attributes: FormGroup;
    productImages: any[] = [];
    product: Product;
    fileList = [];
    isLoading: boolean = false;

    attributeData = [
        {
            "required": false,
            "options": [
                "Red",
                "Blue",
                "Green"
            ],
            "_id": "5ef81dfdebab5903a32c8b90",
            "name": "Color",
            "type": "string"
        },
        {
            "required": false,
            "options": [
                "S",
                "M",
                "L",
                "XL",
                "XXL",
                "XXXL",
                "4XL"
            ],
            "_id": "5ef81dfdebab5903a32c8b91",
            "name": "Size",
            "type": "string"
        },
        {
            "required": false,
            "options": [
                "Fur",
                "Leather",
                "Cotton",
                "Polyester",
                "Microfiber"
            ],
            "_id": "5ef81dfdebab5903a32c8b92",
            "name": "Material",
            "type": "string"
        }
    ];

    productData: Product;

    constructor(private modalService: NzModalService, private fb: FormBuilder,
        private categoryService: CategoryService, private route: ActivatedRoute,
        private uploadService: UploadService, private productService: ProductsService) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.getCategories();
        this.route.params.subscribe((params) => {
            if (Object.keys(params).length == 0) {
                this.isLoading = false
                this.isCreate = true;
            } else {
                this.getProduct(params.id)
                this.isEdit = true;
            }
        });

    }

    initializeForm(product?: Product) {
        if (product) {
            this.attributes = this.addProductAttributes();
            this.productEditForm = this.fb.group({
                productName: [product.translations.en.name, [Validators.required]],
                currency: [product.currency, [Validators.required]],
                price: [product.price, [Validators.required]],
                categoryId: [product.categoryId, [Validators.required]],
                category: ['', [Validators.required]],
                sku: [product.sku, [Validators.required]],
                quality: [product.quality, [Validators.required]],
                description: [product.translations.en.description, [Validators.required]],
                attributes: this.attributes
            });
            for (let i = 0; i < product.images.length; i++) {
                const image = product.images[i];
                this.fileList.push(
                    {
                        uid: `-${i + 1}`,
                        name: image._id,
                        url: image.src,
                        status: 'done'
                    }
                )

            }
        } else {
            this.attributes = this.addProductAttributes();
            this.productEditForm = this.fb.group({
                productName: ['', [Validators.required]],
                currency: ['', [Validators.required]],
                price: ['', [Validators.required]],
                categoryId: ['', [Validators.required]],
                category: ['', [Validators.required]],
                sku: ['', [Validators.required]],
                quality: ['', [Validators.required]],
                description: ['', [Validators.required]],
                attributes: this.attributes
            });
        }
    }

    addProductAttributes() {
        const attributeGroup = this.fb.group({});
        this.attributeData.forEach((attribute) => {
            attributeGroup.addControl(attribute.name, this.fb.control([], attribute.required ? [Validators.required] : []));
        });
        return attributeGroup;
    }

    edit() {
        this.isEdit = true;
    }

    editClose() {
        this.isEdit = false;
    }

    save() {
        console.log(this.productEditForm.value)
        this.modalService.confirm({
            nzTitle: '<i>Do you want your changes?</i>',
            nzOnOk: () => { }
        });
        let product: Product = this.productEditForm.value;
        product.currency = 'USD';

        product.images = this.productImages;
        const attr = [];
        Object.keys(product.attributes).forEach((key) => {
            attr.push({
                name: key,
                value: product.attributes[key]
            })
        });

        product.attributes = attr;
        product.translations = {
            en: {
                name: this.productEditForm.value.productName,
                description: this.productEditForm.value.description
            }
        }

        this.createProduct(product);

    }

    createProduct(product: Product) {
        this.productService.createProduct(product).subscribe(result => {
            console.log(result);
        })
    }

    handlePreview = (file: UploadFile) => {
        console.log(this.fileList)
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    getCategories() {
        this.categoryService.listCategories().subscribe((result: any) => {
            if (result.success) {
                this.categories = result.data;
            }
        });
    }

    getSubCategories(id: string) {
        this.categoryService.getSubCategories(id).subscribe((result: Category[]) => {
            this.subCategories = result;
        });
    }

    onCategorySelected(id: string) {
        this.getSubCategories(id);
    }

    handleRequest = (data: any) => {
        const file = data.file;
        return this.uploadService.getUploadUrl(file.name, file.type).subscribe((result: any) => {
            let url = result.getUrl;
            return this.uploadService.uploadFile(file, result).subscribe((res: any) => {
                this.productImages.push({ src: url, position: this.productImages.length });
                data.onSuccess(data.file);
            }, (err) => {
                data.onError(err, data.file);
            })

        });
    }

    editorConfig = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'align': [] }],
            ['link', 'image']
        ]
    };

    getProduct(id: string) {
        this.productService.getProduct(id).subscribe((product: Product) => {
            this.isLoading = false
            console.log(product);
            this.product = product;
            this.initializeForm(product);

        });
    }
}
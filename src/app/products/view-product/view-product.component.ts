import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NzModalService, NzMessageService, UploadFile, NzNotificationService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/categories.service';
import { Category } from 'src/app/shared/interfaces/categories.model';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { UploadService } from 'src/app/shared/services/upload.service';
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
    attributes: FormGroup = new FormGroup({});
    variations: FormGroup = new FormGroup({});
    productImages: any[] = [];
    product: Product;
    fileList: any[] = [];
    isLoading: boolean = false;
    saveLoading: boolean = false;
    isCategoryLoading: boolean = false;
    productTypes: string[] = ['Simple', 'Variable'];
    isSimpleProduct: boolean = true;
    canSampleRequest: boolean = false;
    attributeData: any[] = [];
    variationData: any[] = [];

    productData: Product;

    constructor(private modalService: NzModalService, private fb: FormBuilder,
        private categoryService: CategoryService, private route: ActivatedRoute,
        private uploadService: UploadService, private productService: ProductsService,
        private notificationService: NzNotificationService,
        private router: Router) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.getCategories();
        this.route.params.subscribe((params) => {
            if (Object.keys(params).length == 0) {
                this.isLoading = false
                this.isCreate = true;
                this.initializeForm();
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
                canRequestSample: [product.canRequestSample, [Validators.required]],
                currency: [product.currency, [Validators.required]],
                price: [product.price, [Validators.required]],
                categoryId: [product.categoryId, [Validators.required]],
                sku: [product.sku, [Validators.required]],
                quality: [product.quality, [Validators.required]],
                samplePrice: [product.samplePrice, this.canSampleRequest ? [Validators.required] : []],
                minOrderQuantity: [product.minOrderQuantity, [Validators.required]],
                sampleCurrency: [product.sampleCurrency, this.canSampleRequest ? [Validators.required] : []],
                sampleQuantity: [product.sampleQuantity, this.canSampleRequest ? [Validators.required] : []],
                sampleUnit: [product.sampleUnit, this.canSampleRequest ? [Validators.required] : []],
                description: [product.translations.en.description, [Validators.required]],
                attributes: this.attributes
            });
            for (let i = 0; i < product.images.length; i++) {
                const image = product.images[i];
                this.fileList.push(
                    {
                        uid: `-${i + 1}`,
                        name: image._id,
                        _id: image._id,
                        position: image.position,
                        url: image.src,
                        status: 'done'
                    }
                )

            }
        } else {
            this.productEditForm = this.fb.group({
                productName: ['', [Validators.required]],
                currency: ['', [Validators.required]],
                price: ['', [Validators.required]],
                canRequestSample: [false, [Validators.required]],
                categoryId: ['', [Validators.required]],
                sku: ['', [Validators.required]],
                quality: ['', [Validators.required]],
                description: ['', [Validators.required]],
                samplePrice: ['', this.canSampleRequest ? [Validators.required] : []],
                minOrderQuantity: ['', this.canSampleRequest ? [Validators.required] : []],
                sampleCurrency: ['', this.canSampleRequest ? [Validators.required] : []],
                sampleQuantity: ['', this.canSampleRequest ? [Validators.required] : []],
                sampleUnit: ['', this.canSampleRequest ? [Validators.required] : []],
                attributes: []
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

    onCategorySelected(id) {
        const sub = this.categoryService.categories.find(sub => sub._id === id);
        if (sub.attributes) {
            this.attributeData = sub.attributes;
            this.attributes = this.addProductAttributes();
        }
    }

    onProductTypeSelected(type: string) {
        if (type.toLowerCase() === 'simple') {
            this.isSimpleProduct = true;
        } else {
            this.isSimpleProduct = false;
        }
    }

    edit() {
        this.saveLoading = true;
        const id = this.product._id;
        this.product = this.productEditForm.value;

        this.product.images = this.fileList.map((image) => { return { _id: image._id, src: image.url, position: image.position } });
        const attr = [];
        Object.keys(this.product.attributes).forEach((key) => {
            attr.push({
                name: key,
                value: this.product.attributes[key]
            })
        });

        this.product.attributes = attr;
        this.product.translations = {
            en: {
                name: this.productEditForm.value.productName,
                description: this.productEditForm.value.description
            }
        }
        delete this.product._id;
        this.modalService.confirm({
            nzTitle: 'Update this product?',
            nzOnOk: () => {
                this.updateProduct(id, this.product);
            }
        });
    }

    editClose() {
        this.isEdit = false;
    }

    save() {
        this.saveLoading = true;
        let product: Product = this.productEditForm.value;

        product.images = this.productImages;
        const attr = [];
        Object.keys(product.attributes).forEach((key) => {
            attr.push({
                name: key,
                value: product.attributes[key]
            })
        });

        console.log(product)

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
            this.saveLoading = false;
            if (result) {
                this.notificationService.success("Success", `Successfully created ${product.translations.en.name}`);
                this.router.navigate(['/products']);
            }
        },
            error => {
                this.notificationService.error('Error', error.message);

            });
    }

    updateProduct(id: string, product: Product) {
        this.productService.updateProduct(id, product).subscribe(result => {
            this.saveLoading = false;
            if (result) {
                this.notificationService.success("Success", `Successfully updated ${product.translations.en.name}`);
                this.router.navigate(['/products']);
            }
        },
            error => {
                this.notificationService.error('Error', error.message);

            });
    }

    handlePreview = (file: UploadFile) => {
        console.log(this.fileList)
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    getCategories() {
        this.categoryService.getAllCategories().subscribe((result: any) => {
            if (result) {
                this.categories = this.categoryService.childCategories;
            }
        });
    }

    getSubCategories(id: string) {
        this.categoryService.getSubCategories(id).subscribe((result: Category[]) => {
            this.subCategories = result;
        });
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

    checkIfVariationAttrPresent() {
        console.log(this.attributes.value);

        let parts = [];
        let result = [];

        Object.keys(this.attributes.value).forEach((attr) => {
            parts.push(this.attributes.value[attr]);
        });
        result = parts.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));

        // this.variationData = 
    }

    generateVariations() {
        console.log('cl: [] icked');
    }

    onRequestSampleChanged(value) {
        this.canSampleRequest = value;
    }
}
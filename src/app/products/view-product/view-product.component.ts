import { Component, OnInit, TemplateRef } from '@angular/core';
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
    listOfTagOptions = [];
    isEdit: boolean = false;
    isCreate: boolean = false;
    productEditForm: FormGroup;
    previewImage: string = '';
    previewVisible: boolean = false;
    categories: Category[] = [];
    subCategories: Category[] = [];
    attributes: FormGroup = new FormGroup({});
    variations: FormGroup = new FormGroup({});
    specificationForm: FormGroup = new FormGroup({});
    quantitySaleForm: FormGroup = new FormGroup({});
    specifications: any[] = [];
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
    quantityData: any[] = [];
    pricingRules: any[] = [];
    variationKeys: string[] = [];
    tagss: string[] = [];
    checked: boolean = false;
    price: string;
    quantityOfSales: any[] = [];
    radioValue = 0;
    style = {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
    };

    current: number = 0;

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
            this.onProductTypeSelected(product.type);
            this.productEditForm = this.fb.group({
                productName: [product.translations.en.name, [Validators.required]],
                canRequestSample: [product.canRequestSample, [Validators.required]],
                // currency: [product.currency, [Validators.required]],
                // type: [product.type, [Validators.required]],
                price: [product.price, [Validators.required]],
                unit: [product.unit, [Validators.required]],
                tags: [product.tags.join(','), [Validators.required]],
                categoryId: [product.categoryId, [Validators.required]],
                sku: [product.sku, [Validators.required]],
                length: [product.length, []],
                width: [product.width, []],
                height: [product.height, []],
                weight: [product.weight, []],
                moq: [product.moq, []],
                model: [product.model, []],
                radioValue: [],
                // quality: [product.quality, [Validators.required]],
                samplePrice: [product.samplePrice, this.canSampleRequest ? [Validators.required] : []],
                // minOrderQuantity: [product.minOrderQuantity, []],
                // minOrderUnit: [product.minOrderUnit, []],
                sampleCurrency: [product.sampleCurrency, this.canSampleRequest ? [Validators.required] : []],
                sampleQuantity: [product.sampleQuantity, this.canSampleRequest ? [Validators.required] : []],
                // sampleUnit: [product.sampleUnit, this.canSampleRequest ? [Validators.required] : []],
                // description: [product.translations.en.description, [Validators.required]],
                variations: [product.variations, []],
                shippingCBMQuantity: [product.shippingCBMQuantity, []],
                shippingCBMValue: [product.shippingCBMValue, []],
                shippingWeightQuantity: [product.shippingWeightQuantity, []],
                shippingWeightValue: [product.shippingWeightValue, []],
            });
            const sub = this.categoryService.categories.find(sub => sub._id === product.categoryId);
            if (sub.attributes) {
                this.attributeData = product.attributes.map((prod) => {
                    return { name: prod.name, options: prod.value }
                });
                this.attributes = this.addProductAttributes(product.attributes);
            }

            if (product.specifications)
                this.specifications = product.specifications;

            if (product.variations.length > 0) {
                this.variationData = product.variations;
            }
            this.attributeData.forEach((attr) => {
                if (attr.options.length > 0) {
                    this.variationKeys.push(attr.name);
                }
            })
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
                // type: ['simple', [Validators.required]],
                // currency: ['', [Validators.required]],
                price: ['', [Validators.required]],
                unit: ['', [Validators.required]],
                tags: [[]],
                canRequestSample: [false, [Validators.required]],
                categoryId: ['', [Validators.required]],
                sku: ['', []],
                length: ['', []],
                width: ['', []],
                height: ['', []],
                weight: ['', []],
                moq: ['', []],
                radioValue: [],
                model: ['', []],
                shippingCBMQuantity: ['', []],
                shippingCBMValue: ['', []],
                shippingWeightQuantity: ['', []],
                shippingWeightValue: ['', []],
                // quality: ['', [Validators.required]],
                // description: ['', [Validators.required]],
                samplePrice: ['', this.canSampleRequest ? [Validators.required] : []],
                minOrderUnit: ['', []],
                // minOrderQuantity: ['', []],
                sampleCurrency: ['', this.canSampleRequest ? [Validators.required] : []],
                sampleQuantity: ['', this.canSampleRequest ? [Validators.required] : []],
                // sampleUnit: ['', this.canSampleRequest ? [Validators.required] : []],
                attributes: [],
                variations: [],
            });
        }
    }

    addProductAttributes(data?) {
        const attributeGroup = this.fb.group({});
        this.attributeData.forEach((attribute) => {
            if (data) {
                let attrVariation = data.find((attr) => attr.name === attribute.name)
                attributeGroup.addControl(attribute.name, this.fb.control(attrVariation.value, attribute.required ? [Validators.required] : []));
            } else {
                attributeGroup.addControl(attribute.name, this.fb.control([], attribute.required ? [Validators.required] : []));
            }

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
        this.product.images = this.fileList.map((image, index) => {

            if (image.url) {
                return { _id: image._id, src: image.url, position: image.position }
            } else {
                return {
                    src: image.response,
                    position: index
                }
            }
        });
        const attr = [];

        if (this.attributeData.length > 0)
            this.attributeData.forEach((attribute) => {
                attr.push({
                    name: attribute.name,
                    value: attribute.options
                })
            })

        if (this.variationData.length > 0)
            this.product.variations = this.variationData;
        
        
        this.product = this.productEditForm.value.tags.split(',');


        this.product.attributes = attr;
        this.product.translations = {
            en: {
                name: this.productEditForm.value.productName,
                description: this.productEditForm.value.description
            }
        }
        this.product.specifications = this.specifications;

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
        if (this.attributeData.length > 0) {
            product.type = 'variable';
            this.attributeData.forEach((attribute) => {
                attr.push({
                    name: attribute.name,
                    value: attribute.options
                })
            })
        } else {
            product.type = 'simple';
        }

        if (this.variationData.length > 0)
            product.variations = this.variationData;
        
        product.tags = this.productEditForm.value.tags.split(',');

        product.attributes = attr;
        product.translations = {
            en: {
                name: this.productEditForm.value.productName,
                description: this.productEditForm.value.description
            }
        }

        product.specifications = this.specifications;

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
                this.categories = this.categoryService.categories;
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
        return this.uploadService.getUploadUrl('products/'+file.name, file.type).subscribe((result: any) => {
            let url = result.getUrl;
            return this.uploadService.uploadFile(file, result).subscribe((res: any) => {
                this.productImages.push({ src: url, position: this.productImages.length });
                data.onSuccess(url);
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

    generateVariationsArray() {
        let parts = [];
        let result = [];
        let data = [];
        this.variationKeys = [];


        this.attributeData.forEach((attr) => {
            if (attr.options.length > 0) {
                parts.push(attr.options);
                this.variationKeys.push(attr.name);
            }
        })
        result = parts.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));
        for (let i = 0; i < result.length; i++) {
            let obj = {
                price: 0,
                currency: 'CNY',
                attributes: [],
                pricingRules: []
            };
            if (Array.isArray(result[i])) {
                for (let j = 0; j < result[i].length; j++) {
                    const element = result[i][j];
                    let d = { name: this.variationKeys[j], value: element };
                    obj.attributes.push(d);
                }
            } else {
                const element = result[i];
                let d = {};
                if (this.variationKeys.length == 1)
                    d = { name: this.variationKeys[0], value: element };
                else
                    d = { name: this.variationKeys[i], value: element };
                obj.attributes.push(d);
            }

            data.push(obj)
        }
        this.variationData = data;
    }
    onRequestSampleChanged(value) {
        this.canSampleRequest = value;
    }

    checkIfAttributesIsEmpty() {
        if (Object.keys(this.attributeData).length > 0)
            return false;
        else
            return true;
    }

    showEditPrice(modalRef: TemplateRef<{}>, index: number) {
        this.price = this.variationData[index].price;
        const modal = this.modalService.create({
            nzTitle: 'Modify the price',
            nzContent: modalRef,
            nzFooter: [
                {
                    label: 'Submit',
                    type: 'primary',
                    onClick: () => {
                        this.variationData[index].price = this.price;
                        this.modalService.closeAll();
                    }
                },
            ],
            nzWidth: 800
        })
    }

    showSalePrice(modalRef: TemplateRef<{}>, qosIndex?: number, variationIndex?: number) {
        if (this.variationData[variationIndex].pricingRules[qosIndex] != undefined) {
            this.price = this.variationData[variationIndex].pricingRules[qosIndex].amount;
        }
        const modal = this.modalService.create({
            nzTitle: 'Modify the price',
            nzContent: modalRef,
            nzFooter: [
                {
                    label: 'Submit',
                    type: 'primary',
                    onClick: () => {
                        if (this.variationData[variationIndex].pricingRules[qosIndex] != undefined) {
                            this.variationData[variationIndex].pricingRules[qosIndex].amount = this.price;
                        } else {
                            this.variationData[variationIndex].pricingRules.push({ ...this.quantityOfSales[qosIndex], amount: this.price });
                        }

                        this.modalService.closeAll();
                        this.price = '0';

                    }
                },
            ],
            nzWidth: 800
        })
    }

    deleteVariation(index: number) {
        this.variationData.splice(index, 1);
    }

    newQuantity(data) {
        const { minQuantity, maxQuantity, amount, discountType, index } = data;
        Object.assign(this.quantityData[index], { minQuantity, maxQuantity, amount, discountType })
    }

    addQuantitySale() {
        this.quantityData.push({ minQuantity: 1, maxQuantity: 100, amount: 0 })
    }

    openPopup(view, index?) {
        if (this.pricingRules)
            this.quantityData = this.pricingRules

        if (index != undefined && this.variationData[index].pricingRules)
            this.quantityData = this.variationData[index].pricingRules;

        const modal = this.modalService.create({
            nzTitle: 'Quantity Of Sale',
            nzContent: view,
            nzFooter: [
                {
                    label: 'Dismiss',
                    type: 'default',
                    onClick: () => {
                        this.modalService.closeAll()
                        if (index != undefined) {
                            this.variationData[index].pricingRules = this.quantityData;
                        } else {
                            this.pricingRules = this.quantityData;
                        }
                    }
                },
            ],
            nzWidth: 800
        });
    }

    addProductSpecification(view, index?) {
        if (index != undefined) {
            this.specificationForm = this.fb.group({
                key: [this.specifications[index].key, Validators.required],
                value: [this.specifications[index].value, Validators.required]
            })
        } else {
            this.specificationForm = this.fb.group({
                key: [null, Validators.required],
                value: [null, Validators.required]
            })
        }

        const modal = this.modalService.create({
            nzTitle: 'Product Specification',
            nzContent: view,
            nzFooter: [
                {
                    label: 'Save',
                    type: 'primary',
                    onClick: () => {
                        if (this.specificationForm.valid) {
                            if (index != undefined) {
                                this.specifications[index] = this.specificationForm.value;
                                this.modalService.closeAll();
                            } else {
                                this.specifications.push(this.specificationForm.value);
                                this.modalService.closeAll();
                            }

                        }

                    }
                },
                {
                    label: 'Cancel',
                    type: 'default',
                    onClick: () => {
                        this.modalService.closeAll()

                    }
                },
            ],
            nzWidth: 400
        });
    }

    addQuantitySaleModal(view, index?) {
        if (index != undefined) {
            this.quantitySaleForm = this.fb.group({
                from: [this.quantityOfSales[index].from, Validators.required],
                to: [this.quantityOfSales[index].to, Validators.required],
            })
        } else {
            this.quantitySaleForm = this.fb.group({
                from: [null, Validators.required],
                to: [null, Validators.required],
            })
        }

        const modal = this.modalService.create({
            nzTitle: 'Quantity Sale',
            nzContent: view,
            nzFooter: [
                {
                    label: 'Save',
                    type: 'primary',
                    onClick: () => {
                        if (this.quantitySaleForm.valid) {
                            if (index != undefined) {
                                this.quantityOfSales[index] = this.quantitySaleForm.value;
                                this.modalService.closeAll();
                            } else {
                                this.quantitySaleForm.value['discountType'] = 'discountAmount'
                                this.quantityOfSales.push(this.quantitySaleForm.value);
                                this.modalService.closeAll();
                            }

                        }

                    }
                },
                {
                    label: 'Cancel',
                    type: 'default',
                    onClick: () => {
                        this.modalService.closeAll()

                    }
                },
            ],
            nzWidth: 400
        });
    }

    deleteSpec(index) {
        this.specifications.splice(index, 1);
    }

    deleteQos(index) {
        this.quantityOfSales.splice(index, 1);
    }

    addNewCustomAttribute() {
        this.attributeData.push({ name: "", options: [] })
    }

    saveAttributes(data) {
        console.log(data);
        const { title, options, index } = data;
        Object.assign(this.attributeData[index], { name: title, options });
    }

    pre(): void {
        this.current -= 1;
        // this.changeContent();
    }

    next(): void {
        this.current += 1;
        // this.changeContent();
    }

    done(): void {
        console.log('done');
    }

    changeImageOrder(index) {
        this.productImages.map((productImage) => {
            if (productImage.position === 0) {
                productImage.position = index;
                return productImage;
            }

            if (productImage.position === index) {
                productImage.position = 0;
                return productImage;
            }
        });

    }
}
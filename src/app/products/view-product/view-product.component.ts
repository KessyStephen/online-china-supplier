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
    isShowAmount: boolean = false;
    isMoreAdded: boolean = false;
    moq: number = 1;
    listOfTagOptions = [];
    isEdit: boolean = false;
    isCreate: boolean = false;
    productEditForm: FormGroup;
    previewImage: string = '';
    previewVisible: boolean = false;
    categories: Category[] = [];
    subCategories: Category[] = [];
    tree: any[] = [];
    attributes: FormGroup = new FormGroup({});
    variations: FormGroup = new FormGroup({});
    greaterThanForm: FormGroup = new FormGroup({});
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

    qosData: any;

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
        this.greaterThanForm = this.fb.group({
            greaterThanTo: [0, Validators.required],
            greaterThanAmount: [0, Validators.required]
        })

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
                length: [product.length, [Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                width: [product.width, [Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                height: [product.height, [Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                weight: [product.weight, [Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                radioValue: [],
                // quality: [product.quality, [Validators.required]],
                samplePrice: [product.samplePrice, this.canSampleRequest ? [Validators.required] : []],
                minOrderQuantity: [product.minOrderQuantity, [Validators.required, Validators.pattern("^[0-9]*$")]],
                // minOrderUnit: [product.minOrderUnit, []],
                sampleCurrency: [product.sampleCurrency, this.canSampleRequest ? [Validators.required] : []],
                sampleQuantity: [product.sampleQuantity, this.canSampleRequest ? [Validators.required] : []],
                // sampleUnit: [product.sampleUnit, this.canSampleRequest ? [Validators.required] : []],
                // description: [product.translations.en.description, [Validators.required]],
                variations: [product.variations, []],
                shippingCBMQuantity: [product.shippingCBMQuantity, [Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                shippingCBMValue: [product.shippingCBMValue, [Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                shippingWeightQuantity: [product.shippingWeightQuantity, [Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                shippingWeightValue: [product.shippingWeightValue, [Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
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
                for (let i = 0; i < this.variationData[0].pricingRules.length; i++) {
                    const element = this.variationData[0].pricingRules[i];
                    this.quantityOfSales.push(element);

                }
            }

            if (product.pricingRules.length > 0) {
                this.pricingRules = product.pricingRules;
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
                length: [null, [Validators.required, Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                width: [null, [Validators.required, Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                height: [null, [Validators.required, Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                weight: [null, [Validators.required, Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                moq: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
                radioValue: [],
                shippingCBMQuantity: [null, [Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                shippingCBMValue: [null, [Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                shippingWeightQuantity: [null, [Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                shippingWeightValue: [null, [Validators.pattern(/^(0|[1-9]\d*)(\.\d+)?$/)]],
                // quality: ['', [Validators.required]],
                // description: ['', [Validators.required]],
                samplePrice: ['', this.canSampleRequest ? [Validators.required] : []],
                // minOrderUnit: ['', []],
                minOrderQuantity: [1, [Validators.required, Validators.pattern("^[0-9]*$")]],
                sampleCurrency: ['', this.canSampleRequest ? [Validators.required] : []],
                sampleQuantity: ['', this.canSampleRequest ? [Validators.required] : []],
                // sampleUnit: ['', this.canSampleRequest ? [Validators.required] : []],
                attributes: [],
                variations: [],
            });
        }
        const moqCtrl = this.productEditForm.get('minOrderQuantity')
        moqCtrl.valueChanges.subscribe(value => {
            if (value) {
                this.productService.changeMOQ(value);
            }
        });

        const lenCtrl = this.productEditForm.get('length');
        lenCtrl.valueChanges.subscribe(value=>{
            console.log(this.productEditForm.get('length').errors)
        })

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


        this.product.tags = this.productEditForm.value.tags.split(',');


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

        if (this.variationData.length > 0) {
            product.variations = this.variationData;
            if (this.quantityOfSales.length > 0) {
                for (let i = 0; i < this.variationData.length; i++) {
                    const data = this.variationData[i];
                    data.price = parseFloat(data.pricingRules[0].amount);
                }
            }
        }

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
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    getCategories() {
        this.categoryService.getAllCategories().subscribe((result: any) => {
            if (result) {
                this.categories = this.categoryService.categories;
                this.tree = this.categoryService.tree;
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
        return this.uploadService.getUploadUrl('products/' + file.name, file.type).subscribe((result: any) => {
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
            if (attr.options) {
                parts.push(attr.options);
                this.variationKeys.push(attr.name);
            }
        })
        if (parts.length > 0) {
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
        } else {
            this.notificationService.error('Error Generating Variations', 'Please fill in the options for the attributes in the previous step!');
        }
    }

    checkAttributesLength() {
        if (this.attributeData.length === 0) {
            return false;
        }

        let parts = [];
        let result = [];
        let data = [];
        this.variationKeys = [];


        this.attributeData.forEach((attr) => {
            if (attr.options) {
                parts.push(attr.options);
                this.variationKeys.push(attr.name);
            }
        })
        if (parts.length === 0) {
            return false;
        } else {
            return true;
        }
    }
    onRequestSampleChanged(value) {
        if (value) {
            this.productEditForm.get('samplePrice').setValidators(Validators.required);
            this.productEditForm.get('samplePrice').updateValueAndValidity();
            this.productEditForm.get('sampleQuantity').setValidators(Validators.required)
            this.productEditForm.get('sampleQuantity').updateValueAndValidity();
        } else {
            this.productEditForm.get('samplePrice').setValidators([]);
            this.productEditForm.get('samplePrice').updateValueAndValidity();
            this.productEditForm.get('sampleQuantity').setValidators([])
            this.productEditForm.get('sampleQuantity').updateValueAndValidity();
        }
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
        let minQuantity = this.productEditForm.value['minOrderQuantity'] + 1
        if (this.attributeData.length == 0) {
            if (this.quantityData.length > 0)
                minQuantity = this.pricingRules[this.pricingRules.length - 1].maxQuantity + 1;
            if (this.quantityData.length < 2) {
                this.quantityData.push({ minQuantity: minQuantity, maxQuantity: 0, amount: 0, discountType: 'fixedPrice', showFrom: true })
            }
        } else {
            if (this.quantityData.length > 0)
                minQuantity = this.quantityOfSales[this.quantityOfSales.length - 1].maxQuantity + 1;
            if (this.quantityData.length < 2) {
                this.quantityData.push({ minQuantity: minQuantity, maxQuantity: 0, amount: 0, discountType: 'fixedPrice', showFrom: true })
            }
        }
    }

    switchForms(data?) {
        if (this.attributeData.length == 0) {
            this.isShowAmount = true;
            if (data) {
                this.qosData = { from: data.from, to: data.to, amount: data.amount, fromTwo: data.to + 1 };
            }

            this.isMoreAdded = !this.isMoreAdded;
        } else {
            this.isShowAmount = false;
            if (data) {
                this.qosData = { from: data.from, to: data.to, amount: data.amount, fromTwo: data.to + 1 };
            }
            this.isMoreAdded = !this.isMoreAdded;
        }
    }

    savePricingRules(data) {
        if (this.attributeData.length == 0) {
            if (this.pricingRules[data.index]) {
                this.pricingRules[data.index] = { minQuantity: data.from, maxQuantity: data.to, amount: data.amount, discountType: 'fixedPrice' };
            } else {
                this.pricingRules.push({ minQuantity: data.from, maxQuantity: data.to, amount: data.amount, discountType: 'fixedPrice' });
                this.greaterThanForm.patchValue({ greaterThanTo: data.to + 1 })
            }
        } else {
            if (this.quantityOfSales[data.index]) {
                this.quantityOfSales[data.index] = { minQuantity: data.from, maxQuantity: data.to, discountType: 'fixedPrice' };
            } else {
                this.quantityOfSales.push({ minQuantity: data.from, maxQuantity: data.to, discountType: 'fixedPrice' });
                this.greaterThanForm.patchValue({ greaterThanTo: data.to + 1 })
            }
        }


    }

    openPopup(view, index?) {
        // this.productService.changeMOQ(this.productEditForm.value['minOrderQuantity']+1);
        if (this.attributeData.length == 0) {
            this.isShowAmount = true;

            if (this.pricingRules.length > 0) {
                this.qosData = {};
                if (parseInt(this.pricingRules[0].minQuantity) != parseInt(this.productEditForm.value['minOrderQuantity']) + 1)
                    this.pricingRules = [];


                if (this.pricingRules.length > 2) {
                    this.isMoreAdded = true;
                    this.pricingRules.forEach((data, index) => {
                        if (index == 0) {
                            Object.assign(this.qosData, { from: data.minQuantity, to: data.maxQuantity, amount: data.amount })
                        }
                        if (index == 1) {
                            Object.assign(this.qosData, { fromTwo: data.minQuantity, toTwo: data.maxQuantity, amountTwo: data.amount })
                        }
                        if (index == 2) {
                            Object.assign(this.qosData, { greaterThanTo: data.minQuantity, greaterThanAmount: data.amount })
                        }
                    })
                } else {
                    this.isMoreAdded = false;
                    this.pricingRules.forEach((data) => {
                        if (data.maxQuantity) {
                            Object.assign(this.qosData, { from: data.minQuantity, to: data.maxQuantity, amount: data.amount })
                        }
                        else {
                            Object.assign(this.qosData, { greaterThanTo: data.minQuantity, greaterThanAmount: data.amount })

                        }
                    })
                }

            }


            const modal = this.modalService.create({
                nzTitle: 'Quantity Of Sale',
                nzContent: view,
                nzFooter: [

                ],
                nzWidth: 800
            });
        } else {
            this.isShowAmount = false;
            if (this.quantityOfSales.length > 0) {
                this.qosData = {};

                if (parseInt(this.quantityOfSales[0].minQuantity) !== parseInt(this.productEditForm.value['minOrderQuantity']))
                    this.quantityOfSales = [];

                if (this.quantityOfSales.length > 2) {
                    this.isMoreAdded = true;
                    this.quantityOfSales.forEach((data) => {
                        if (index == 0) {
                            Object.assign(this.qosData, { from: data.minQuantity, to: data.maxQuantity, amount: data.amount })
                        }
                        if (index == 1) {
                            Object.assign(this.qosData, { fromTwo: data.minQuantity, toTwo: data.maxQuantity, amountTwo: data.amount })
                        }
                        if (index == 2) {
                            Object.assign(this.qosData, { greaterThanTo: data.minQuantity, greaterThanAmount: data.amount })
                        }
                    })
                } else {
                    this.isMoreAdded = false;
                    this.quantityOfSales.forEach((data) => {
                        if (data.maxQuantity) {
                            Object.assign(this.qosData, { from: data.minQuantity, to: data.maxQuantity, amount: data.amount })
                        }
                        else {
                            Object.assign(this.qosData, { greaterThanTo: data.minQuantity, greaterThanAmount: data.amount })

                        }
                    })
                }
            }
            console.log(this.qosData);

            const modal = this.modalService.create({
                nzTitle: 'Quantity Of Sale',
                nzContent: view,
                nzFooter: [
                ],
                nzWidth: 800
            });
        }
    }

    addProductSpecification(view, index?) {
        if (index != undefined) {
            this.specificationForm = this.fb.group({
                name: [this.specifications[index].name, Validators.required],
                value: [this.specifications[index].value, Validators.required]
            })
        } else {
            this.specificationForm = this.fb.group({
                name: [null, Validators.required],
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
                from: [this.productEditForm.value['minOrderQuantity'] + 1, Validators.required],
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
                                this.quantitySaleForm.value['discountType'] = 'fixedPrice'
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
        const { title, options, index } = data;
        Object.assign(this.attributeData[index], { name: title, options });
    }

    pre(): void {
        this.current -= 1;
        // this.changeContent();
    }

    next(): void {
        switch (this.current) {
            case 0:
                if (this.validateFirstStep())
                    this.current += 1;
                break;
            case 1:
                if (true)
                    this.current += 1;
                break;
            case 2:
                if (this.validateThirdStep())
                    this.current += 1;
                break;

            default:
                break;
        }

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

    saveNewQos(data) {
        const pricingRulesData = [];
        if (this.attributeData.length == 0) {
            pricingRulesData.push({ minQuantity: data.from, maxQuantity: data.to, amount: data.amount, discountType: 'fixedPrice' });
            pricingRulesData.push({ minQuantity: data.greaterThanTo, amount: data.greaterThanAmount, discountType: 'fixedPrice' })
            this.pricingRules = pricingRulesData;
        } else {
            pricingRulesData.push({ minQuantity: data.from, maxQuantity: data.to, discountType: 'fixedPrice' });
            pricingRulesData.push({ minQuantity: data.greaterThanTo, discountType: 'fixedPrice' })
            this.quantityOfSales = pricingRulesData;
        }
        this.modalService.closeAll();
    }

    saveNewQosTwo(data) {
        const pricingRulesData = [];

        if (this.attributeData.length == 0) {
            pricingRulesData.push({ minQuantity: data.from, maxQuantity: data.to, amount: data.amount, discountType: 'fixedPrice' });
            pricingRulesData.push({ minQuantity: data.fromTwo, maxQuantity: data.toTwo, amount: data.amountTwo, discountType: 'fixedPrice' });
            pricingRulesData.push({ minQuantity: data.greaterThanTo, amount: data.greaterThanAmount, discountType: 'fixedPrice' })
            this.pricingRules = pricingRulesData;
        } else {
            pricingRulesData.push({ minQuantity: data.from, maxQuantity: data.to, discountType: 'fixedPrice' });
            pricingRulesData.push({ minQuantity: data.fromTwo, maxQuantity: data.toTwo, discountType: 'fixedPrice' });
            pricingRulesData.push({ minQuantity: data.greaterThanTo, discountType: 'fixedPrice' })
            this.quantityOfSales = pricingRulesData;
        }
        this.modalService.closeAll();
    }

    validateFirstStep() {
        if (this.productEditForm.get('categoryId').invalid ||
            this.productEditForm.get('productName').invalid ||
            this.productEditForm.get('unit').invalid ||
            this.productEditForm.get('samplePrice').invalid ||
            this.productEditForm.get('sampleQuantity').invalid) {
            const array = ['categoryId', 'productName', 'unit', 'samplePrice', 'sampleQuantity'];
            for (let index = 0; index < array.length; index++) {
                const fieldName = array[index];
                this.productEditForm.get(fieldName).markAsDirty();
                this.productEditForm.get(fieldName).updateValueAndValidity();
            }

            return false;
        }

        return true;
    }

    validateSecondStep() {
        if (this.productEditForm.get('length').invalid ||
            this.productEditForm.get('width').invalid ||
            this.productEditForm.get('height').invalid ||
            this.productEditForm.get('weight').invalid) {
            const array = ['length', 'width', 'height', 'weight'];
            for (let index = 0; index < array.length; index++) {
                const fieldName = array[index];
                this.productEditForm.get(fieldName).markAsDirty();
                this.productEditForm.get(fieldName).updateValueAndValidity();
            }

            return false;
        }

        return true;
    }

    validateThirdStep() {
        if (this.attributeData.length > 0) {
            if (this.productEditForm.get('minOrderQuantity').invalid) {
                this.productEditForm.get('minOrderQuantity').markAsDirty();
                this.productEditForm.get('minOrderQuantity').updateValueAndValidity();

                return false;
            }

        } else {
            if (this.productEditForm.get('minOrderQuantity').invalid ||
                this.productEditForm.get('price').invalid) {
                const array = ['minOrderQuantity', 'price'];
                for (let index = 0; index < array.length; index++) {
                    const fieldName = array[index];
                    this.productEditForm.get(fieldName).markAsDirty();
                    this.productEditForm.get(fieldName).updateValueAndValidity();
                }

                return false;
            }

        }
        return true;


    }
}
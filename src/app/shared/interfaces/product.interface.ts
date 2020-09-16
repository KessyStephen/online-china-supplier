export interface Product {
    tags: string[];
    unit: any;
    shippingCBMQuantity: any;
    shippingCBMValue: any;
    shippingWeightQuantity: any;
    shippingWeightValue: any;
    model: any;
    length: any;
    height: any;
    weight: any;
    moq: any;
    width: any;
    _id: string;
    createdAt: string;
    categoryId: string;
    type: string;
    price: number;
    currency: string;
    quality: string;
    sku: string;
    thumbnail: string;
    images: any;
    translations: any;
    supplier: any;
    isApproved: boolean;
    supplierId: string;
    canRequestSample: boolean;
    samplePrice: number;
    sampleQuantity: number;
    minOrderQuantity: number;
    minOrderUnit: string;
    sampleCurrency: string;
    sampleUnit: string;
    attributes: Attribute[],
    variations: any[],
    specifications: any[]
}

interface Attribute {
    name: string;
    value: string;
}

interface Variation {
    price: number;
    currency: string;
    attributes: Attribute[]
}
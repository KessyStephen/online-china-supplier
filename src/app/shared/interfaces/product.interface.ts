export interface Product {
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
    sampleCurrency: string;
    sampleUnit: string;
    attributes: Attribute[],
    variations: [
        {
            price: number;
            currency: string;
            attributes: Attribute[]
        }
    ]
}

interface Attribute {
    name: string;
    value: string;
}
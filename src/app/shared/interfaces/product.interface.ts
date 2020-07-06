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
    isApproved: boolean;
    supplierId: string;
    canRequestSample: boolean;
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
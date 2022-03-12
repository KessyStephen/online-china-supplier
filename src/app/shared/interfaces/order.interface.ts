import { OrderItem } from './order-item.model';

export interface Order {
    id: string;
    status: string;
    orderNo: number;
    referenceId: string;
    supplier: {
        _id: string;
        name: string;
        email: string;
        phoneNumber?: string;
    },
    user: {
        _id: string;
        name: string;
        phoneNumber: string;
        email?: string;
    },
    showToSupplier: boolean;
    isSampleRequest: boolean;
    trackingId: string;
    quantity: number;
    total: number;
    totalCurrency: string;
    createdAt: string;
    items?: OrderItem[];
    timeline?: [{
        title: string;
        createdAt: string;
    }];
    supplierTotalPrice: number;
    supplierTotalPriceCurrency: string;
    supplierPrice: number;
    supplierPriceCurrency: number;
}

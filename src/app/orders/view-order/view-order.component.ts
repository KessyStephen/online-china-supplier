import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/shared/services/order.service';
import { Order } from 'src/app/shared/interfaces/order.interface';
import { NzNotificationService } from 'ng-zorro-antd';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-view-order',
    templateUrl: './view-order.component.html',
    styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService, private notificationService: NzNotificationService) { }

    trackingForm: FormGroup;

    ngOnInit(): void {
        this.getOrderStatusList();
        this.activatedRoute.params.subscribe(params => {
            this.getOrderInformation(params.id);
        });

        this.trackingForm = new FormGroup({
            trackingId: new FormControl(this.order ? this.order.trackingId : '', [Validators.required])
        })
    }
    checked: boolean = false;
    order: Order;
    loading: boolean = false;
    supplierShowLoading: boolean = false;
    orderStatusList: string[] = [];

    getOrderInformation(id: string) {
        this.loading = true;
        this.orderService.getOrder(id).subscribe((order: Order) => {
            this.loading = false;
            this.order = order;
            this.trackingForm.setValue({ trackingId: order.trackingId })
        });
    }

    submitForm() {
        this.updateOrder(this.trackingForm.value);
    }

    changeShowToSupplierFlag() {
        if (!this.supplierShowLoading) {
            this.supplierShowLoading = true;
            this.order.showToSupplier = !this.order.showToSupplier;
            this.updateOrder({ showToSupplier: this.order.showToSupplier });
        }
    } 
    changeOrderStatus(status) {
        this.updateOrder({ statusCode: status });
    }

    updateOrder(data) {
        this.orderService.updateOrder(this.order.id, data).subscribe((result) => {
            this.supplierShowLoading = false;
            if (result)
                this.notificationService.success(`Order status: ${status}`, `Successfully updated Order # ${this.order.id}`);
        });
    }

    getOrderStatusList() {
        this.orderService.getOrderStatusList().subscribe((statuses) => {
            this.orderStatusList = statuses;
        })
    }

}

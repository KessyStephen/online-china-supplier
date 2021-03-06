import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface QuantityOfSale {

  minQuantity: number;
  maxQuantity: number;
  amount: number;
  index?: number;
}

@Component({
  selector: 'app-quantity-sale',
  templateUrl: './quantity-sale.component.html',
  styleUrls: ['./quantity-sale.component.css']
})
export class QuantitySaleComponent implements OnInit {

  @Input() minQuantity: number;
  @Input() maxQuantity: number;
  @Input() index: number;
  @Input() amount: number;

  disabled: boolean = false;

  @Output() quantityEvent = new EventEmitter<QuantityOfSale>();

  constructor() { }

  ngOnInit(): void {
  }

  save() {
    this.disabled = !this.disabled;
    this.quantityEvent.emit({ minQuantity: this.minQuantity, maxQuantity: this.maxQuantity, amount: this.amount, index: this.index });
  }

  edit() {
    this.disabled = !this.disabled;
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface QuantityOfSale {

  from: number;
  to: number;
  amount: number;
  index?: number;
}

@Component({
  selector: 'app-qos',
  templateUrl: './qos.component.html',
  styleUrls: ['./qos.component.css']
})
export class QosComponent implements OnInit {

  @Input() from: number;
  @Input() to: number;
  @Input() showFrom: boolean = true;
  @Input() amount: number;
  @Input() index: number;

  @Output() quantityEvent = new EventEmitter<QuantityOfSale>();


  constructor() { }

  ngOnInit(): void {}

  save() {
    this.quantityEvent.emit({ from: this.from, to: this.to, amount: this.amount, index: this.index });
  }

}

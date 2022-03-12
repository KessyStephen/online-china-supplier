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
  @Input() amount: number;
  @Input() index: number;

  @Input() showAmount: boolean = true;

  @Output() save = new EventEmitter<QuantityOfSale>();


  constructor() { }

  ngOnInit(): void {}

  saveData() {
    this.save.emit({ from: this.from, to: this.to, amount: this.amount, index: this.index });
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-qos-one',
  templateUrl: './qos-one.component.html',
  styleUrls: ['./qos-one.component.css']
})
export class QosOneComponent implements OnInit {

  constructor(private fb: FormBuilder, private productService: ProductsService) { }

  qosForm: FormGroup = new FormGroup({});
  @Input() showAmount: boolean = true;
  @Input() data;
  @Input() moq: number;

  @Output() save = new EventEmitter();
  @Output() switch = new EventEmitter();

  ngOnInit(): void {
    if (this.data && Object.values(this.data).length > 0) {
      this.qosForm = this.fb.group({
        from: [this.data.from, Validators.required],
        to: [this.data.to, Validators.required],
        amount: [this.data.amount, this.showAmount ? Validators.required : []],
        greaterThanTo: [this.data.greaterThanTo, Validators.required],
        greaterThanAmount: [this.data.greaterThanAmount, this.showAmount ? Validators.required : []]
      });
    } else {
      this.qosForm = this.fb.group({
        from: [this.productService.currentMOQValue, Validators.required],
        to: [, Validators.required],
        amount: [, this.showAmount ? Validators.required : []],
        greaterThanTo: [, Validators.required],
        greaterThanAmount: [, this.showAmount ? Validators.required : []]
      });
    }

    const toCtrl = this.qosForm.get('to');
    const greaterThanToCtrl = this.qosForm.get('greaterThanTo');
    toCtrl.valueChanges.subscribe(value => {
      if (value) {
        greaterThanToCtrl.setValue(value + 1)
      }
    });
  }

  saveData() {
    if (this.qosForm.valid)
      this.save.emit(this.qosForm.value)
  }

  switchForm() {
    this.switch.emit(this.qosForm.value)
  }



}

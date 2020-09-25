import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-qos-two',
  templateUrl: './qos-two.component.html',
  styleUrls: ['./qos-two.component.css']
})
export class QosTwoComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  qosForm: FormGroup = new FormGroup({});
  @Input() showAmount: boolean = true;
  @Input() data;

  @Output() save = new EventEmitter();
  @Input() moq: number;

  @Output() switch = new EventEmitter();



  ngOnInit(): void {
    if (this.data) {
      this.qosForm = this.fb.group({
        from: [this.data.from, Validators.required],
        to: [this.data.to, Validators.required],
        amount: [this.data.amount, this.showAmount ? Validators.required : []],
        fromTwo: [this.data.fromTwo, Validators.required],
        toTwo: [this.data.toTwo, Validators.required],
        amountTwo: [this.data.amountTwo, this.showAmount ? Validators.required : []],
        greaterThanTo: [this.data.greaterThanTo, Validators.required],
        greaterThanAmount: [this.data.greaterThanAmount, this.showAmount ? Validators.required : []]
      });
    } else {
      this.qosForm = this.fb.group({
        from: [this.moq, Validators.required],
        to: [, Validators.required],
        amount: [, this.showAmount ? Validators.required : []],
        fromTwo: [, Validators.required],
        toTwo: [, Validators.required],
        amountTwo: [, this.showAmount ? Validators.required : []],
        greaterThanTo: [, Validators.required],
        greaterThanAmount: [, this.showAmount ? Validators.required : []]
      });

    }

    const toCtrl = this.qosForm.get('toTwo');
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

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface Attribute {

  title: string;
  options: string[];
  index?: number;
}

@Component({
  selector: 'app-custom-attribute',
  templateUrl: './custom-attribute.component.html',
  styleUrls: ['./custom-attribute.component.css']
})
export class CustomAttributeComponent implements OnInit {

  constructor() { }

  @Input() title: string;
  @Input() options: string[] = [];
  @Input() index: number;
  @Output() saveOptions = new EventEmitter<Attribute>();


  ngOnInit(): void {
  }

  save() {
    this.saveOptions.emit({ index: this.index, title: this.title, options: this.options })
  }

}

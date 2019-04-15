import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perceptron-demo',
  templateUrl: './perceptron-demo.component.html',
  styleUrls: ['./perceptron-demo.component.scss']
})
export class PerceptronDemoComponent implements OnInit {
  public form: any = {
    input1: 10,
    input2: 10,
    weight1: 1,
    weight2: 1,
    output: 0
  };

  constructor() {}

  ngOnInit() {
    this.calculate();
  }

  calculate() {
    this.form.output = this.form.input1 * this.form.weight1 + this.form.input2 * this.form.weight2;
  }
}

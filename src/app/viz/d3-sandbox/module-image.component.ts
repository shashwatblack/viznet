import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';

declare var Snap: any;
declare var mina: any;

@Component({
  selector: 'app-module-image',
  templateUrl: './module-image.component.html',
  styleUrls: ['./module-image.component.scss']
})
export class ModuleImageComponent implements OnInit {
  private svg: any;
  private g: any;
  private options = {
    width: 1200,
    height: 600,
    padding: 10
  };
  public form = {
    numCols: 0,
    numRows: 0
  };
  public figure = {
    numCols: 0,
    numRows: 0,
    nodes: {}
  };
  slider_value: number = 100;
  slider_options: Options = {
    floor: 0,
    ceil: 255
  };
  selectedNode = null;

  constructor() {}

  ngOnInit() {
    this.svg = Snap('#module-image-svg');

    this.svg.attr({
      viewBox: `0 0 ${this.options.width} ${this.options.height}`
    });

    this.g = this.svg.g();

    this.initializeFigure();
  }

  initializeFigure() {
    this.form.numCols = 8;
    this.form.numRows = 8;

    this.updateFigure();
  }

  nodeClicked(node) {
    if (this.selectedNode) {
      this.selectedNode.circle.attr({
        stroke: 'None'
      });
    }
    this.selectedNode = node;
    node.circle.attr({
      stroke: '#0db9f0'
    });
    this.slider_value = node.value;
  }

  sliderUpdated() {
    let value = (this.selectedNode.value = this.slider_value);
    this.selectedNode.circle.attr({
      fill: `rgb(${value}, ${value}, ${value})`
    });
    this.selectedNode.text.attr({
      text: value
    });
  }

  getNewNode(r, c) {
    let x = 50 + c * 50;
    let y = 50 + r * 50;
    let radius = 20;
    let value = 255;
    let circle = this.g.circle(x, y, radius).attr({
      fill: `rgb(${value}, ${value}, ${value})`,
      'stroke-width': '4px'
    });
    let text = this.g.text(x, y, value).attr({
      'text-anchor': 'middle',
      'alignment-baseline': 'middle',
      transform: 'translate(0, 2)'
    });
    circle.addClass('cursor-pointer');
    text.addClass('no-pointer');
    text.addClass('no-user-select');

    let node = { r, c, x, y, radius, value, circle, text };
    circle.click(() => this.nodeClicked(node));
    text.click(() => this.nodeClicked(node));
    return node;
  }

  updateFigure() {
    // if new is wider - add columns
    if (this.form.numCols > this.figure.numCols) {
      for (let r = 0; r < this.figure.numRows; r++) {
        for (let c = this.figure.numCols; c < this.form.numCols; c++) {
          this.figure.nodes[`${r},${c}`] = this.getNewNode(r, c);
        }
      }
    }
    // if new is taller - add rows
    if (this.form.numRows > this.figure.numRows) {
      for (let r = this.figure.numRows; r < this.form.numRows; r++) {
        for (let c = 0; c < this.form.numCols; c++) {
          this.figure.nodes[`${r},${c}`] = this.getNewNode(r, c);
        }
      }
    }

    // remove all outside
    for (let key in this.figure.nodes) {
      let node = this.figure.nodes[key];
      if (node.r >= this.form.numRows || node.c >= this.form.numCols) {
        node.circle.remove();
        node.text.remove();
        delete this.figure.nodes[key];
      }
    }

    this.figure.numRows = this.form.numRows;
    this.figure.numCols = this.form.numCols;
  }
}

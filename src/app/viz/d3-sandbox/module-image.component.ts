import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit() {
    this.svg = Snap('#module-image-svg');

    this.svg.attr({
      viewBox: `0 0 ${this.options.width} ${this.options.height}`
    });

    this.g = this.svg.g();

    this.initializeFigure();
    // this.drawImage();
  }

  initializeFigure() {
    this.form.numCols = 8;
    this.form.numRows = 8;

    this.updateFigure();
  }

  getNewNode(r, c) {
    let x = 50 + c * 50;
    let y = 50 + r * 50;
    let radius = 20;
    let v = 255;
    let element = this.g.circle(x, y, radius).attr({
      fill: `rgb(${v}, ${v}, ${v})`
    });
    return { r, c, x, y, radius, element };
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
        node.element.remove();
        delete this.figure.nodes[key];
      }
    }

    this.figure.numRows = this.form.numRows;
    this.figure.numCols = this.form.numCols;
  }
  /*
  private drawImage() {
    for (let element of this.figure.elements) {
      element.remove();
    }
    this.figure.elements.length = 0;
    for (let r = 0; r < this.figure.values.length; r++) {
      for (let c = 0; c < this.figure.values[0].length; c++) {
        let v = this.figure.values[r][c];
        let x = 50 + c * 50;
        let y = 50 + r * 50;
        let element = this.g.circle(x, y, this.options.nodeRadius).attr({
          fill: `rgb(${v}, ${v}, ${v})`
        });
        this.figure.elements.push(element);
      }
    }
  }*/
}

import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';

declare var Snap: any;
declare var mina: any;

@Component({
  selector: 'app-module-conv',
  templateUrl: './module-conv.component.html',
  styleUrls: ['./module-conv.component.scss']
})
export class ModuleConvComponent implements OnInit {
  private svg: any;
  private g_image: any;
  private g_filter: any;
  private g_result: any;
  public form = {
    numColsImage: 0,
    numRowsImage: 0,
    numColsFilter: 0,
    numRowsFilter: 0,
    numColsResult: 0,
    numRowsResult: 0
  };
  public figure = {
    numColsImage: 0,
    numRowsImage: 0,
    nodesImage: {},
    numColsFilter: 0,
    numRowsFilter: 0,
    nodesFilter: {},
    numColsResult: 0,
    numRowsResult: 0,
    nodesResult: {}
  };
  slider_value: number = 100;
  slider_options: Options = {
    floor: 0,
    ceil: 255
  };
  selectedNode = null;

  constructor() {}

  ngOnInit() {
    this.svg = Snap('#module-conv-svg');

    this.svg.attr({
      width: 1800,
      height: 600,
      viewBox: '0 0 1800 600'
    });

    this.g_image = this.svg.g().attr({
      transform: 'translate(0, 0)'
    });
    this.g_filter = this.svg.g().attr({
      transform: 'translate(600, 0)'
    });
    this.g_result = this.svg.g().attr({
      transform: 'translate(1200, 0)'
    });

    this.initializeFigure();
  }

  initializeFigure() {
    this.form.numColsImage = 8;
    this.form.numRowsImage = 8;
    this.updateImage();

    this.form.numColsFilter = 2;
    this.form.numRowsFilter = 2;
    this.updateFilter();

    this.form.numColsResult = this.form.numColsImage - this.form.numColsFilter + 1;
    this.form.numRowsResult = this.form.numRowsImage - this.form.numRowsFilter + 1;
    this.updateResult();
  }

  nodeClicked(node) {
    if (this.selectedNode) {
      this.selectedNode.circle.removeClass('selected');
    }
    node.circle.addClass('selected');
    node.circle.attr({
      stroke: '#0db9f0'
    });
    this.slider_value = node.value;
    this.selectedNode = node;
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

  getNewNode(group, r, c) {
    let x = 50 + c * 50;
    let y = 50 + r * 50;
    let radius = 20;
    let value = 255;
    let circle = group.circle(x, y, radius).attr({
      fill: `rgb(${value}, ${value}, ${value})`
    });
    let text = group.text(x, y, value).attr({
      'text-anchor': 'middle',
      'alignment-baseline': 'middle',
      transform: 'translate(0, 2)'
    });
    circle.addClass('cursor-pointer');
    circle.addClass('svg-node');
    text.addClass('svg-node-text');
    text.addClass('no-pointer');
    text.addClass('no-user-select');

    let node = { r, c, x, y, radius, value, circle, text };
    circle.click(() => this.nodeClicked(node));
    text.click(() => this.nodeClicked(node));
    return node;
  }

  updateImage() {
    // if new is wider - add columns
    if (this.form.numColsImage > this.figure.numColsImage) {
      for (let r = 0; r < this.figure.numRowsImage; r++) {
        for (let c = this.figure.numColsImage; c < this.form.numColsImage; c++) {
          this.figure.nodesImage[`${r},${c}`] = this.getNewNode(this.g_image, r, c);
        }
      }
    }
    // if new is taller - add rows
    if (this.form.numRowsImage > this.figure.numRowsImage) {
      for (let r = this.figure.numRowsImage; r < this.form.numRowsImage; r++) {
        for (let c = 0; c < this.form.numColsImage; c++) {
          this.figure.nodesImage[`${r},${c}`] = this.getNewNode(this.g_image, r, c);
        }
      }
    }

    // remove all outside
    for (let key in this.figure.nodesImage) {
      let node = this.figure.nodesImage[key];
      if (node.r >= this.form.numRowsImage || node.c >= this.form.numColsImage) {
        node.circle.remove();
        node.text.remove();
        delete this.figure.nodesImage[key];
      }
    }

    this.figure.numRowsImage = this.form.numRowsImage;
    this.figure.numColsImage = this.form.numColsImage;
  }

  updateFilter() {
    // if new is wider - add columns
    if (this.form.numColsFilter > this.figure.numColsFilter) {
      for (let r = 0; r < this.figure.numRowsFilter; r++) {
        for (let c = this.figure.numColsFilter; c < this.form.numColsFilter; c++) {
          this.figure.nodesFilter[`${r},${c}`] = this.getNewNode(this.g_filter, r, c);
        }
      }
    }
    // if new is taller - add rows
    if (this.form.numRowsFilter > this.figure.numRowsFilter) {
      for (let r = this.figure.numRowsFilter; r < this.form.numRowsFilter; r++) {
        for (let c = 0; c < this.form.numColsFilter; c++) {
          this.figure.nodesFilter[`${r},${c}`] = this.getNewNode(this.g_filter, r, c);
        }
      }
    }

    // remove all outside
    for (let key in this.figure.nodesFilter) {
      let node = this.figure.nodesFilter[key];
      if (node.r >= this.form.numRowsFilter || node.c >= this.form.numColsFilter) {
        node.circle.remove();
        node.text.remove();
        delete this.figure.nodesFilter[key];
      }
    }

    this.figure.numRowsFilter = this.form.numRowsFilter;
    this.figure.numColsFilter = this.form.numColsFilter;
  }

  updateResult() {
    // if new is wider - add columns
    if (this.form.numColsResult > this.figure.numColsResult) {
      for (let r = 0; r < this.figure.numRowsResult; r++) {
        for (let c = this.figure.numColsResult; c < this.form.numColsResult; c++) {
          this.figure.nodesResult[`${r},${c}`] = this.getNewNode(this.g_result, r, c);
        }
      }
    }
    // if new is taller - add rows
    if (this.form.numRowsResult > this.figure.numRowsResult) {
      for (let r = this.figure.numRowsResult; r < this.form.numRowsResult; r++) {
        for (let c = 0; c < this.form.numColsResult; c++) {
          this.figure.nodesResult[`${r},${c}`] = this.getNewNode(this.g_result, r, c);
        }
      }
    }

    // remove all outside
    for (let key in this.figure.nodesResult) {
      let node = this.figure.nodesResult[key];
      if (node.r >= this.form.numRowsResult || node.c >= this.form.numColsResult) {
        node.circle.remove();
        node.text.remove();
        delete this.figure.nodesResult[key];
      }
    }

    this.figure.numRowsResult = this.form.numRowsResult;
    this.figure.numColsResult = this.form.numColsResult;
  }
}

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
  public form = {
    numColsImage: 0,
    numRowsImage: 0,
    numColsFilter: 0,
    numRowsFilter: 0,
    numColsResult: 0,
    numRowsResult: 0,
    numPadding: 0,
    numDilation: 1,
    numStride: 1
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
    nodesResult: {},
    numPadding: 0,
    numDilation: 1,
    numStride: 1
  };

  slider_value: number = 100;
  slider_options: Options = {
    floor: 0,
    ceil: 255
  };
  selectedNode = null;

  private svg: any;
  private g_image: any;
  private g_filter: any;
  private g_result: any;
  private g_hoverLines: any;

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

  wrapperClicked() {
    // remove selected node
    if (this.selectedNode) {
      this.selectedNode.circle.removeClass('selected');
    }
    this.selectedNode = null;
    // remove hover boxes
    if (this.g_hoverLines) {
      this.g_hoverLines.remove();
    }
  }

  delay(callback) {
    return () => setTimeout(callback, 0);
  }

  initializeFigure() {
    this.form.numColsImage = 8;
    this.form.numRowsImage = 8;
    this.updateImage();

    this.form.numColsFilter = 3;
    this.form.numRowsFilter = 3;
    this.updateFilter();

    // this.form.numColsResult = (this.form.numColsImage + 2 * this.form.numPadding - this.form.numDilation * (this.form.numColsFilter - 1) -1)/this.form.numStride + 1;
    // this.form.numRowsResult = (this.form.numRowsImage + 2 * this.form.numPadding - this.form.numDilation * (this.form.numRowsFilter - 1) -1)/this.form.numStride + 1;
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
      fill: `rgb(${256 - value},${256 - value}, ${256 - value})`
    });
    this.selectedNode.text.attr({
      text: value
    });
    this.updateResultColor();
  }

  addNewNode(group, r, c) {
    let x = 50 + c * 50;
    let y = 50 + r * 50;
    let radius = 20;
    let value = 0;
    let circle = group.circle(x, y, radius).attr({
      fill: `rgb(${256 - value},${256 - value}, ${256 - value})`
    });
    let text = group.text(x, y, value).attr({
      'text-anchor': 'middle',
      'alignment-baseline': 'middle',
      transform: 'translate(0, 2)'
    });
    circle.addClass('cursor-pointer');
    circle.addClass('svg-node');
    if (group == this.g_image) {
      circle.addClass('image');
    } else if (group == this.g_filter) {
      circle.addClass('filter');
    } else {
      circle.addClass('result');
    }
    text.addClass('svg-node-text');
    text.addClass('no-pointer');
    text.addClass('no-user-select');

    group.polyline([10, 10, 1000, 1000]);

    let node = { r, c, x, y, radius, value, circle, text };
    circle.click(this.delay(() => this.nodeClicked(node)));
    text.click(this.delay(() => this.nodeClicked(node)));
    return node;
  }

  // basic implemtation of hoverevent
  addHoverEvent(node) {
    let gutter = 2;
    let ii = node.r; //+ kCenterY;
    let jj = node.c; //+ kCenterX;

    let node_image = this.figure.nodesImage[`${ii},${jj}`];

    node.circle.mouseover(() => {
      //console.log(node.r, node.c, ii, jj, kCenterX, kCenterY, this.figure.numRowsFilter, this.figure.numColsFilter);
      this.addHoverLines(
        {
          // 30 -> 80 ->130
          x: node_image.x - node_image.radius - gutter,
          y: node_image.y - node_image.radius - gutter,
          w: node.radius * 7 + 2 * gutter,
          h: node.radius * 7 + 2 * gutter
        },
        {
          x: 630 - gutter,
          y: 30 - gutter,
          w: node.radius * 7 + 2 * gutter,
          h: node.radius * 7 + 2 * gutter
        },
        {
          x: 1200 + node.x - node.radius - gutter,
          y: node.y - node.radius - gutter,
          w: 2 * node.radius + 2 * gutter,
          h: 2 * node.radius + 2 * gutter
        }
      );
    });
  }

  addHoverEventLogic(node) {}

  addHoverLines(imageBox, filterBox, resultBox) {
    if (this.g_hoverLines) {
      this.g_hoverLines.remove();
    }
    this.g_hoverLines = this.svg.g();
    let group = this.g_hoverLines;

    let inputAttr = {
      stroke: 'rgba(244, 64, 52, 0.3)',
      'stroke-width': '3px',
      fill: 'None'
    };

    let filterAttr = {
      stroke: 'rgba(0, 195, 255, 0.3)',
      'stroke-width': '3px',
      fill: 'None'
    };

    let resultAttr = {
      stroke: 'rgba(0, 205, 73, 0.3)',
      'stroke-width': '3px',
      fill: 'None'
    };

    group.rect(imageBox.x, imageBox.y, imageBox.w, imageBox.h).attr(inputAttr);
    group.rect(filterBox.x, filterBox.y, filterBox.w, filterBox.h).attr(filterAttr);
    group.rect(resultBox.x, resultBox.y, resultBox.w, resultBox.h).attr(resultAttr);

    group.line(imageBox.x, imageBox.y, resultBox.x, resultBox.y).attr(inputAttr);
    group.line(imageBox.x + imageBox.w, imageBox.y, resultBox.x + resultBox.w, resultBox.y).attr(inputAttr);
    group.line(imageBox.x, imageBox.y + imageBox.h, resultBox.x, resultBox.y + resultBox.h).attr(inputAttr);
    group
      .line(imageBox.x + imageBox.w, imageBox.y + imageBox.h, resultBox.x + resultBox.w, resultBox.y + resultBox.h)
      .attr(inputAttr);

    group.line(filterBox.x, filterBox.y, resultBox.x, resultBox.y).attr(filterAttr);
    group.line(filterBox.x + filterBox.w, filterBox.y, resultBox.x + resultBox.w, resultBox.y).attr(filterAttr);
    group.line(filterBox.x, filterBox.y + filterBox.h, resultBox.x, resultBox.y + resultBox.h).attr(filterAttr);
    group
      .line(filterBox.x + filterBox.w, filterBox.y + filterBox.h, resultBox.x + resultBox.w, resultBox.y + resultBox.h)
      .attr(filterAttr);

    return this.g_hoverLines;
  }

  updateImage() {
    // if new is wider - add columns
    if (this.form.numColsImage > this.figure.numColsImage) {
      for (let r = 0; r < this.figure.numRowsImage; r++) {
        for (let c = this.figure.numColsImage; c < this.form.numColsImage; c++) {
          this.figure.nodesImage[`${r},${c}`] = this.addNewNode(this.g_image, r, c);
        }
      }
    }
    // if new is taller - add rows
    if (this.form.numRowsImage > this.figure.numRowsImage) {
      for (let r = this.figure.numRowsImage; r < this.form.numRowsImage; r++) {
        for (let c = 0; c < this.form.numColsImage; c++) {
          this.figure.nodesImage[`${r},${c}`] = this.addNewNode(this.g_image, r, c);
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
    this.figure.numColsImage = this.form.numColsImage;
    this.figure.numRowsImage = this.form.numRowsImage;

    this.updateResult();
  }

  updateFilter() {
    // if new is wider - add columns
    if (this.form.numColsFilter > this.figure.numColsFilter) {
      for (let r = 0; r < this.figure.numRowsFilter; r++) {
        for (let c = this.figure.numColsFilter; c < this.form.numColsFilter; c++) {
          this.figure.nodesFilter[`${r},${c}`] = this.addNewNode(this.g_filter, r, c);
        }
      }
    }
    // if new is taller - add rows
    if (this.form.numRowsFilter > this.figure.numRowsFilter) {
      for (let r = this.figure.numRowsFilter; r < this.form.numRowsFilter; r++) {
        for (let c = 0; c < this.form.numColsFilter; c++) {
          this.figure.nodesFilter[`${r},${c}`] = this.addNewNode(this.g_filter, r, c);
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
    this.form.numColsResult =
      (this.form.numColsImage + 2 * this.form.numPadding - this.form.numDilation * (this.form.numColsFilter - 1) - 1) /
        this.form.numStride +
      1;
    this.form.numRowsResult =
      (this.form.numRowsImage + 2 * this.form.numPadding - this.form.numDilation * (this.form.numRowsFilter - 1) - 1) /
        this.form.numStride +
      1;
    if (this.form.numColsResult < 0 || this.form.numRowsResult < 0) {
      this.form.numColsResult = 0;
      this.form.numRowsResult = 0;
    }
    // if new is wider - add columns
    if (this.form.numColsResult > this.figure.numColsResult) {
      for (let r = 0; r < this.figure.numRowsResult; r++) {
        for (let c = this.figure.numColsResult; c < this.form.numColsResult; c++) {
          let node = this.addNewNode(this.g_result, r, c);
          node.circle.unclick();
          node.text.unclick();
          this.addHoverEvent(node);
          this.figure.nodesResult[`${r},${c}`] = node;
        }
      }
    }
    // if new is taller - add rows
    if (this.form.numRowsResult > this.figure.numRowsResult) {
      for (let r = this.figure.numRowsResult; r < this.form.numRowsResult; r++) {
        for (let c = 0; c < this.form.numColsResult; c++) {
          let node = this.addNewNode(this.g_result, r, c);
          node.circle.unclick();
          node.text.unclick();
          this.addHoverEvent(node);
          this.figure.nodesResult[`${r},${c}`] = node;
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

  updateResultColor() {
    let kCenterX = Math.round(this.figure.numRowsFilter / 2);
    let kCenterY = Math.round(this.figure.numColsFilter / 2);
    // console.log(kCenterY, kCenterX);
    for (let i = 0; i < this.figure.numRowsResult; i++) {
      let value = 0;

      for (let j = 0; j < this.figure.numColsResult; j++) {
        for (let m = 0; m < this.figure.numRowsFilter; m++) {
          let mm = this.figure.numRowsFilter - 1 - m; // invert filter

          for (let n = 0; n < this.figure.numColsFilter; n++) {
            let nn = this.figure.numColsFilter - 1 - n; // invert filter
            let ii = i + (kCenterY - mm);
            let jj = j + (kCenterX - nn);

            if (ii >= 0 && ii < this.figure.numRowsImage && jj >= 0 && jj < this.figure.numColsImage) {
              let node_image = this.figure.nodesImage[`${ii},${jj}`];
              let node_filter = this.figure.nodesFilter[`${mm},${nn}`];
              // console.log(node_result, node_image, node_filter)
              value = value + node_image.value * node_filter.value;

              // console.log(`IN: i:${i},j:${j},ii:${ii},jj:${jj},n:${n},nn:${nn},m:${m},mm:${mm}`);
              // console.log(value, node_image.value, node_filter.value);

              let node_result = this.figure.nodesResult[`${i},${j}`];
              node_result.value = value;

              // safety net , preventing negative value
              if (node_result.value > 256) {
                node_result.value = 256;
                value = 256;
              }
              //

              node_result.circle.attr({
                fill: `rgb(${256 - value},${256 - value}, ${256 - value})`
              });
              node_result.text.attr({
                text: value
              });
              this.figure.nodesResult[`${i}, ${j}`] = node_result;
            }
          }
        }
      }
    }
  }

  // convolve() {
  //   this.updateResultColor();
  // }
}

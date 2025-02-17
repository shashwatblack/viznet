import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { LabelType, Options } from 'ng5-slider';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { UtilsService } from '@app/core';

declare var Snap: any;
declare var mina: any;

@Component({
  selector: 'app-module-conv',
  templateUrl: './module-conv.component.html',
  styleUrls: ['./module-conv.component.scss']
})
export class ModuleConvComponent implements OnInit, AfterViewInit {
  @ViewChild('colorPickerPopup') colorPickerPopup: ElementRef;
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

  public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  public slider_value: number = 100;
  public slider_options_image: Options = {
    floor: 0,
    ceil: 255,
    vertical: true
  };
  public slider_options_filter: Options = {
    floor: -100,
    ceil: 100,
    vertical: true,
    translate: (value: number, label: LabelType): string => {
      return '';
    }
  };
  public selectedNode = null;

  private svg: any;
  private g_image: any;
  private g_filter: any;
  private g_result: any;
  private g_hoverLines: any;
  private g_labels: any;
  private dimensions: any = {
    svgWidth: 1400,
    svgHeight: 600,
    inputOffset: [0, 0],
    filterOffset: [625, 100],
    resultOffset: [1000, 50]
  };

  constructor(public ngxSmartModalService: NgxSmartModalService, private readonly utils: UtilsService) {}

  ngOnInit() {
    this.svg = Snap('#module-conv-svg');

    this.svg.attr({
      width: this.dimensions.svgWidth,
      height: this.dimensions.svgHeight,
      viewBox: `0 0 ${this.dimensions.svgWidth} ${this.dimensions.svgHeight}`
    });

    this.g_image = this.svg.g().attr({
      transform: `translate(${this.dimensions.inputOffset[0]}, ${this.dimensions.inputOffset[1]})`
    });
    this.g_filter = this.svg.g().attr({
      transform: `translate(${this.dimensions.filterOffset[0]}, ${this.dimensions.filterOffset[1]})`
    });
    this.g_result = this.svg.g().attr({
      transform: `translate(${this.dimensions.resultOffset[0]}, ${this.dimensions.resultOffset[1]})`
    });
    this.g_labels = this.svg.g();

    this.initializeFigure();
  }

  ngAfterViewInit() {
    // push task at the end of queue using timeout
    setTimeout(() => {
      this.showIntro();
    }, 0);
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
    this.hidePopup();
  }

  initializeFigure() {
    this.form.numColsImage = 8;
    this.form.numRowsImage = 8;
    this.updateImage();

    this.form.numColsFilter = 3;
    this.form.numRowsFilter = 3;
    this.updateFilter();

    this.updateResult();

    this.addLabels();

    this.doConvolution();
  }

  nodeClicked(node) {
    if (this.selectedNode) {
      this.selectedNode.circle.removeClass('selected');
    }
    node.circle.addClass('selected');
    node.circle.attr({
      stroke: '#0db9f0'
    });
    this.manualRefresh.emit();
    this.slider_value = node.value;
    this.selectedNode = node;

    this.showPopup(node);
  }

  logScaled(x) {
    if (x > 0) {
      return Math.min(Math.floor(127.5 + (127.5 * Math.log(x)) / Math.log(255 * 9)), 255);
    }
    if (x < 0) {
      x *= -1;
      return Math.max(Math.floor(127.5 - (127.5 * Math.log(x)) / Math.log(255 * 9)), 0);
    }
    return 127;
  }

  updateNodeValue(node, value) {
    let textValue: any = Math.floor(value);
    let colorValue: any = textValue;
    if (node.nodeType == 'filter') {
      colorValue = Math.floor(((value + 100) / 200) * 255);
      textValue = (textValue / 100).toFixed(2);
    } else if (node.nodeType == 'result') {
      colorValue = this.logScaled(colorValue);
      colorValue = colorValue >= 0 ? (colorValue <= 255 ? colorValue : 255) : 0;
      colorValue = Math.floor(colorValue);
    }
    node.value = value;
    node.circle.attr({
      fill: `rgb(${colorValue}, ${colorValue}, ${colorValue})`
    });
    node.text.attr({
      text: textValue
    });
  }

  sliderUpdated() {
    this.updateNodeValue(this.selectedNode, this.slider_value);
    this.utils.debounce(() => this.doConvolution(), 500)();
  }

  addNewNode(group, r, c) {
    let nodeType = null;
    let x = 50 + c * 50;
    let y = 50 + r * 50;
    let radius = 20;
    let value = 0;

    if (group == this.g_filter) {
      value = 0;
    }

    let circle = group.circle(x, y, radius);
    let text = group.text(x, y, value).attr({
      'text-anchor': 'middle',
      'alignment-baseline': 'middle',
      transform: 'translate(0, 2)'
    });
    if (group == this.g_image) {
      circle.addClass('image');
      nodeType = 'image';
    } else if (group == this.g_filter) {
      circle.addClass('filter');
      nodeType = 'filter';
    } else {
      circle.addClass('result');
      nodeType = 'result';
    }
    circle.addClass('cursor-pointer');
    circle.addClass('svg-node');
    text.addClass('svg-node-text');
    text.addClass('no-pointer');
    text.addClass('no-user-select');

    circle.click(this.utils.delay(() => this.nodeClicked(node)));
    text.click(this.utils.delay(() => this.nodeClicked(node)));

    let node = { r, c, x, y, radius, value, circle, text, nodeType };
    this.updateNodeValue(node, value);

    return node;
  }

  addHoverEvent(node) {
    let gutter = 2;
    let ii = node.r; //+ kCenterY;
    let jj = node.c; //+ kCenterX;

    let node_image = this.figure.nodesImage[`${ii},${jj}`];

    node.circle.mouseover(() => {
      // console.log(node.r, node.c, ii, jj, kCenterX, kCenterY, this.figure.numRowsFilter, this.figure.numColsFilter);
      this.addHoverLines(
        {
          x: node_image.x - node_image.radius - gutter,
          y: node_image.y - node_image.radius - gutter,
          w: node.radius * 7 + 2 * gutter,
          h: node.radius * 7 + 2 * gutter
        },
        {
          x: this.dimensions.filterOffset[0] + 30 - gutter,
          y: this.dimensions.filterOffset[1] + 30 - gutter,
          w: node.radius * 7 + 2 * gutter,
          h: node.radius * 7 + 2 * gutter
        },
        {
          x: this.dimensions.resultOffset[0] + node.x - node.radius - gutter,
          y: this.dimensions.resultOffset[1] + node.y - node.radius - gutter,
          w: 2 * node.radius + 2 * gutter,
          h: 2 * node.radius + 2 * gutter
        }
      );
    });
  }

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

    // boxes
    group.rect(imageBox.x, imageBox.y, imageBox.w, imageBox.h).attr(inputAttr);
    group.rect(filterBox.x, filterBox.y, filterBox.w, filterBox.h).attr(filterAttr);
    group.rect(resultBox.x, resultBox.y, resultBox.w, resultBox.h).attr(resultAttr);

    // image to filter
    group.line(imageBox.x, imageBox.y, filterBox.x, filterBox.y).attr(inputAttr);
    group.line(imageBox.x + imageBox.w, imageBox.y, filterBox.x + filterBox.w, filterBox.y).attr(inputAttr);
    group.line(imageBox.x, imageBox.y + imageBox.h, filterBox.x, filterBox.y + filterBox.h).attr(inputAttr);
    group
      .line(imageBox.x + imageBox.w, imageBox.y + imageBox.h, filterBox.x + filterBox.w, filterBox.y + filterBox.h)
      .attr(inputAttr);

    // filter to result
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

  addLabels() {
    // Under input image
    let g_inputLabel = this.g_labels
      .g()
      .attr({
        transform: `translate(${this.dimensions.inputOffset[0] + 193}, ${500})`
      })
      .addClass('svg-label');
    g_inputLabel.rect(-17, -26, 100, 40);
    g_inputLabel.text(0, 0, `Input`);
    g_inputLabel.circle(55, -6, 11);
    g_inputLabel.text(51, -1, 'i').addClass('i-icon');
    g_inputLabel.click(() => this.showIntro(0, true));

    // under filter
    let g_filterLabel = this.g_labels
      .g()
      .attr({
        transform: `translate(${this.dimensions.filterOffset[0] + 65}, ${500})`
      })
      .addClass('svg-label');
    g_filterLabel.rect(-17, -26, 100, 40);
    g_filterLabel.text(0, 0, `Kernel`);
    g_filterLabel.circle(65, -6, 11);
    g_filterLabel.text(61, -1, 'i').addClass('i-icon');
    g_filterLabel.click(() => this.showIntro(1, true));

    // under result
    let g_resultLabel = this.g_labels
      .g()
      .attr({
        transform: `translate(${this.dimensions.resultOffset[0] + 138}, ${500})`
      })
      .addClass('svg-label');
    g_resultLabel.rect(-17, -26, 110, 40);
    g_resultLabel.text(0, 0, `Output`);
    g_resultLabel.circle(65, -6, 11);
    g_resultLabel.text(61, -1, 'i').addClass('i-icon');
    g_resultLabel.click(() => this.showIntro(3, true));
  }

  updateResultColor() {
    let kCenterX = Math.round(this.figure.numRowsFilter / 2);
    let kCenterY = Math.round(this.figure.numColsFilter / 2);
    // console.log(kCenterY, kCenterX);
    for (let i = 0; i < this.figure.numRowsResult; i++) {
      for (let j = 0; j < this.figure.numColsResult; j++) {
        let node_result = this.figure.nodesResult[`${i},${j}`];
        node_result.value = 0; // reset
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
              node_result.value += node_image.value * node_filter.value;
              //node_result.value += value;
              // safety net , preventing negative value
              if (node_result.value > 256) {
                node_result.value = 256;
                //value = 256;
              }
              //
              let value = node_result.value;
              node_result.circle.attr({
                fill: `rgb(${256 - value},${256 - value}, ${256 - value})`
              });
              node_result.text.attr({
                text: value
              });
              this.figure.nodesResult[`${i}, ${j}`] = node_result;

              // console.log(`IN: i:${i},j:${j},ii:${ii},jj:${jj},n:${n},nn:${nn},m:${m},mm:${mm}`);
              // console.log(value, node_image.value, node_filter.value);
            }
          }
        }
      }
    }
  }

  doConvolution() {
    // iterate over every cell of results
    for (let i = 0; i < this.figure.numRowsResult; i++) {
      for (let j = 0; j < this.figure.numColsResult; j++) {
        // for result matrix cell of i, j
        // input matrix is i:j::i+3:j+3
        // filter matrix is 0:0::3:3
        let resultValue = 0;
        for (let m = 0; m < 3; m++) {
          for (let n = 0; n < 3; n++) {
            let imageValue = this.figure.nodesImage[`${i + m},${j + n}`].value;
            let filterValue = this.figure.nodesFilter[`${m},${n}`].value / 100;
            resultValue += imageValue * filterValue;
          }
        }
        resultValue = Math.floor(resultValue);

        // update result node
        let result_node = this.figure.nodesResult[`${i},${j}`];
        this.updateNodeValue(result_node, resultValue);
      }
    }
  }

  public intro = {
    current_index: 0,
    current_state: {
      title: null,
      message: null,
      btnText: null
    },
    allowClose: false,
    states: [
      {
        title: `Hey there! Let's learn about convolution!`,
        message: 'Convolution is an important concept in Neural Networks.',
        btnText: 'Next'
      },
      {
        title: "Let's start with kernel.",
        message: `
        From the last tutorial, you remember that an image is nothing but a grid of pixels. <br>
        Imagine another <b><i>smaller</i></b> grid of pixels. We'll call this a <b><i>kernel</i></b>.<br>
        <div class="text-center"><img src="assets/kernel.png" height="300"></div>
        `,
        btnText: 'Next'
      },
      {
        title: 'Using a kernel?',
        message: `
        We can do some cool maths on the image using this kernel. This gives us a new image.
        <div class="text-center"><img src="https://mlnotebook.github.io/img/CNN/convSobel.gif" height="500"></div>
        <div class="row conv-animation-label">
          <div class="col-1 offset-3 text-center">Image</div>
          <div class="col-1 text-center text-large">*</div>
          <div class="col-1 text-center">Kernel</div>
          <div class="col-1 text-center">=</div>
          <div class="col-1 text-center">Output</div>
        </div>
        `,
        btnText: 'Next'
      },
      {
        title: "What's it for?",
        message: `
        Convolution is a useful tool in computer vision. It can do awesome things like detect edges in images.
        <div class="text-center"><img src="assets/edge-detection.jpg" width="500"></div>
        `,
        btnText: 'Next'
      },
      {
        title: "That's it!",
        message: `
        We have a cool tool for you to play with. <br>
        You'll be able to draw your image as well as the kernel. <br>
        We also have some predefined presets for you to try out. <br>
        Notice how the output changes for different kernels.
        `,
        btnText: `Let's Go!`
      }
    ]
  };

  showPopup(node) {
    let myicon = node.circle.node;
    let colorPickerPopup = this.colorPickerPopup.nativeElement;
    let iconPos = myicon.getBoundingClientRect();
    colorPickerPopup.style.left = iconPos.right + 20 + 'px';
    colorPickerPopup.style.top = window.scrollY + iconPos.top - 60 + 'px';
    colorPickerPopup.style.display = 'block';
  }

  hidePopup() {
    let colorPickerPopup = this.colorPickerPopup.nativeElement;
    colorPickerPopup.style.display = 'none';
  }

  showIntro(index = 0, allowClose = false) {
    this.intro.allowClose = allowClose;
    this.intro.current_index = index;
    this.intro.current_state = this.intro.states[index];
    this.ngxSmartModalService.getModal('introModal').open();
  }

  introNext() {
    this.intro.current_index += 1;
    if (this.intro.current_index < this.intro.states.length) {
      this.intro.current_state = this.intro.states[this.intro.current_index];
    } else {
      this.closeIntro();
    }
  }

  closeIntro() {
    this.ngxSmartModalService.getModal('introModal').close();
  }

  public imagePresets = [
    {
      id: '1',
      name: '1',
      width: 8,
      height: 8,
      pixels: [
        [0, 0, 0, 255, 255, 0, 0, 0],
        [0, 0, 255, 255, 255, 0, 0, 0],
        [0, 255, 255, 255, 255, 0, 0, 0],
        [0, 0, 0, 255, 255, 0, 0, 0],
        [0, 0, 0, 255, 255, 0, 0, 0],
        [0, 0, 0, 255, 255, 0, 0, 0],
        [200, 200, 200, 255, 255, 200, 200, 200],
        [255, 255, 255, 255, 255, 255, 255, 255]
      ]
    },
    {
      id: '4',
      name: '4',
      width: 8,
      height: 8,
      pixels: [
        [50, 255, 200, 0, 0, 50, 255, 200],
        [50, 255, 200, 0, 0, 50, 255, 200],
        [50, 255, 200, 0, 0, 50, 255, 200],
        [50, 255, 255, 255, 255, 255, 255, 200],
        [50, 255, 255, 255, 255, 255, 255, 200],
        [0, 0, 0, 0, 0, 50, 255, 200],
        [0, 0, 0, 0, 0, 50, 255, 200],
        [0, 0, 0, 0, 0, 50, 255, 200]
      ]
    },
    {
      id: '7',
      name: '7',
      width: 8,
      height: 8,
      pixels: [
        [50, 255, 200, 255, 255, 255, 255, 200],
        [50, 255, 200, 255, 255, 255, 255, 200],
        [50, 255, 50, 0, 0, 50, 255, 200],
        [0, 0, 0, 0, 0, 50, 255, 200],
        [0, 0, 0, 0, 0, 50, 255, 200],
        [0, 0, 0, 0, 0, 50, 255, 200],
        [0, 0, 0, 0, 0, 50, 255, 200],
        [0, 0, 0, 0, 0, 50, 255, 200]
      ]
    },
    {
      id: '9',
      name: '9',
      width: 8,
      height: 8,
      pixels: [
        [50, 255, 200, 255, 255, 255, 255, 200],
        [50, 255, 200, 255, 255, 255, 255, 200],
        [50, 255, 200, 0, 0, 50, 255, 200],
        [50, 255, 255, 255, 255, 255, 255, 200],
        [50, 255, 255, 255, 255, 255, 255, 200],
        [0, 0, 0, 0, 0, 50, 255, 200],
        [200, 200, 200, 255, 255, 200, 200, 200],
        [255, 255, 255, 255, 255, 255, 255, 255]
      ]
    }
  ];

  public filterPresets = [
    {
      id: 'identity',
      name: 'Identity',
      width: 3,
      height: 3,
      pixels: [[0, 0, 0], [0, 100, 0], [0, 0, 0]]
    },
    {
      id: 'horizontal_edge',
      name: 'Horizontal Edge',
      width: 3,
      height: 3,
      pixels: [[-10, -10, -10], [100, 100, 100], [-10, -10, -10]]
    },
    {
      id: 'vertical_edge',
      name: 'Vertical Edge',
      width: 3,
      height: 3,
      pixels: [[-10, 100, -10], [-10, 100, -10], [-10, 100, -10]]
    }
  ];

  loadImagePreset(preset) {
    for (let r = 0; r < preset.height; r++) {
      for (let c = 0; c < preset.width; c++) {
        let node = this.figure.nodesImage[`${r},${c}`];
        this.updateNodeValue(node, preset.pixels[r][c]);
      }
    }
    this.doConvolution();
  }

  loadFilterPreset(preset) {
    for (let r = 0; r < preset.height; r++) {
      for (let c = 0; c < preset.width; c++) {
        let node = this.figure.nodesFilter[`${r},${c}`];
        this.updateNodeValue(node, preset.pixels[r][c]);
      }
    }
    this.doConvolution();
  }
}

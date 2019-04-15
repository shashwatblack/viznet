import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { LabelType, Options } from 'ng5-slider';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { UtilsService } from '@app/core';

declare var Snap: any;
declare var mina: any;

@Component({
  selector: 'app-module-pool',
  templateUrl: './module-pool.component.html',
  styleUrls: ['./module-pool.component.scss']
})
export class ModulePoolComponent implements OnInit, AfterViewInit {
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
    svgWidth: 1300,
    svgHeight: 600,
    inputOffset: [0, 0],
    filterOffset: [650, 150],
    resultOffset: [1000, 100]
  };

  constructor(public ngxSmartModalService: NgxSmartModalService, private readonly utils: UtilsService) {}

  ngOnInit() {
    this.svg = Snap('#module-pool-svg');

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

    this.form.numColsFilter = 2;
    this.form.numRowsFilter = 2;
    this.updateFilter();

    this.form.numColsResult = 4;
    this.form.numRowsResult = 4;
    this.updateResult();

    this.addLabels();

    this.doPooling();
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

  updateNodeValue(node, value) {
    let textValue: any = Math.floor(value);
    let colorValue: any = textValue;
    if (node.nodeType == 'filter') {
      colorValue = 255;
      textValue = '';
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
    this.utils.debounce(() => this.doPooling(), 500)();
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
    let node_image = this.figure.nodesImage[`${node.r * 2},${node.c * 2}`];

    node.circle.mouseover(() => {
      this.addHoverLines(
        {
          x: node_image.x - node_image.radius - gutter,
          y: node_image.y - node_image.radius - gutter,
          w: node.radius * 4.5 + 2 * gutter,
          h: node.radius * 4.5 + 2 * gutter
        },
        {
          x: this.dimensions.filterOffset[0] + 30 - gutter,
          y: this.dimensions.filterOffset[1] + 30 - gutter,
          w: node.radius * 4.5 + 2 * gutter,
          h: node.radius * 4.5 + 2 * gutter
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
          let node = this.addNewNode(this.g_filter, r, c);
          this.figure.nodesFilter[`${r},${c}`] = node;
          node.circle.unclick();
          node.text.unclick();
        }
      }
    }
    // if new is taller - add rows
    if (this.form.numRowsFilter > this.figure.numRowsFilter) {
      for (let r = this.figure.numRowsFilter; r < this.form.numRowsFilter; r++) {
        for (let c = 0; c < this.form.numColsFilter; c++) {
          let node = this.addNewNode(this.g_filter, r, c);
          this.figure.nodesFilter[`${r},${c}`] = node;
          node.circle.unclick();
          node.text.unclick();
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
        transform: `translate(${this.dimensions.filterOffset[0] + 35}, ${500})`
      })
      .addClass('svg-label');
    g_filterLabel.rect(-17, -26, 120, 40);
    g_filterLabel.text(0, 0, `Window`);
    g_filterLabel.circle(75, -6, 11);
    g_filterLabel.text(71, -1, 'i').addClass('i-icon');
    g_filterLabel.click(() => this.showIntro(1, true));

    // under result
    let g_resultLabel = this.g_labels
      .g()
      .attr({
        transform: `translate(${this.dimensions.resultOffset[0] + 88}, ${500})`
      })
      .addClass('svg-label');
    g_resultLabel.rect(-17, -26, 110, 40);
    g_resultLabel.text(0, 0, `Result`);
    g_resultLabel.circle(65, -6, 11);
    g_resultLabel.text(61, -1, 'i').addClass('i-icon');
    g_resultLabel.click(() => this.showIntro(3, true));
  }

  doPooling() {
    // iterate over every cell of results
    for (let i = 0; i < this.figure.numRowsResult; i++) {
      for (let j = 0; j < this.figure.numColsResult; j++) {
        // for result matrix cell of i, j
        // input matrix is i*2:j*2::i+2:j+2
        let resultValue = 0;
        if (this.poolingWindows.selected == 'max') {
          for (let m = 0; m < 2; m++) {
            for (let n = 0; n < 2; n++) {
              let imageValue = this.figure.nodesImage[`${i * 2 + m},${j * 2 + n}`].value;
              resultValue = Math.max(resultValue, imageValue);
            }
          }
        } else if (this.poolingWindows.selected == 'average') {
          for (let m = 0; m < 2; m++) {
            for (let n = 0; n < 2; n++) {
              let imageValue = this.figure.nodesImage[`${i * 2 + m},${j * 2 + n}`].value;
              resultValue += imageValue;
            }
          }
          resultValue /= 4;
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
        title: `Now it's time to learn about pooling!`,
        message: `
        Convolution operation is usually followed by pooling. <br>
        Pooling progressively reduces the size of the input image, and therefore also reduces the computation required in further steps. <br>
        There are different types of pooling - we'll see max pooling and average pooling.
        `,
        btnText: 'Next'
      },
      {
        title: 'Max Pooling',
        message: `
        Consider a pooling window of size 2x2. In the animation below, the green rectangle represents this window. <br>
        Now, this pooling window scans the input, and just picks the maximum element it sees. <br>
        Then it places the max element as the corresponding output. <br>
        <div class="text-center"><img src="assets/max-pooling.gif" height="300"></div>
        <br>
        Essentially, this halves the image dimensions at the end. The final image has one-fourth the number of pixels in original.
        `,
        btnText: 'Next'
      },
      {
        title: 'Average Pooling',
        message: `
        Similar to the previous case, average pooling takes the average of all the elements under the window as opposed to just the maximum element. <br>
        Max pooling saves strong contrasting features, while average pooling results in softer, blurred image.
        While this method does preserve details better, it loses distinguishing edges and textures. <br>
        Due to this reason, most CNNs prefer max pooling. 
        <div class="text-center"><img src="assets/max-avg-pooling.png" height="300"></div>
        `,
        btnText: 'Next'
      },
      {
        title: "That's it!",
        message: `
        We have another tool for you to play with. <br>
        You'll be able to draw your image and test out max and average pooling. <br>
        We also have some predefined presets for you to try out. <br>
        Make sure you notice the output being softer in average pooling than in max pooling.
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

  public poolingWindows = {
    selected: 'max',
    options: [
      {
        id: 'max',
        name: 'Max Pooling'
      },
      {
        id: 'average',
        name: 'Average Pooling'
      }
    ]
  };

  loadImagePreset(preset) {
    for (let r = 0; r < preset.height; r++) {
      for (let c = 0; c < preset.width; c++) {
        let node = this.figure.nodesImage[`${r},${c}`];
        this.updateNodeValue(node, preset.pixels[r][c]);
      }
    }
    this.doPooling();
  }

  updatePoolingWindow(window) {
    this.poolingWindows.selected = window.id;
    this.doPooling();
  }
}

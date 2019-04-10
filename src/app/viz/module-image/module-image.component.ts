import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Options } from 'ng5-slider';
import { NgxSmartModalService } from 'ngx-smart-modal';

declare var Snap: any;
declare var mina: any;

@Component({
  selector: 'app-module-image',
  templateUrl: './module-image.component.html',
  styleUrls: ['./module-image.component.scss']
})
export class ModuleImageComponent implements OnInit, AfterViewInit {
  @ViewChild('colorPickerPopup') colorPickerPopup: ElementRef;
  private svg: any;
  private g: any;
  private options = {
    width: 900,
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
  manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  slider_value: number = 100;
  slider_options: Options = {
    floor: 0,
    ceil: 255,
    vertical: true
  };
  selectedNode = null;

  constructor(public ngxSmartModalService: NgxSmartModalService) {}

  ngOnInit() {
    this.svg = Snap('#module-image-svg');

    this.svg.attr({
      viewBox: `0 0 ${this.options.width} ${this.options.height}`
    });

    this.g = this.svg.g();

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
    this.hidePopup();
  }

  delay(callback) {
    return () => setTimeout(callback, 0);
  }

  initializeFigure() {
    this.form.numCols = 8;
    this.form.numRows = 8;

    this.updateFigure();
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
      fill: `rgb(${value}, ${value}, ${value})`
    });
    let text = this.g.text(x, y, value).attr({
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
    circle.click(this.delay(() => this.nodeClicked(node)));
    text.click(this.delay(() => this.nodeClicked(node)));
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

  intro = {
    current_index: 0,
    current_state: {},
    states: [
      {
        title: 'Hello.',
        message: 'Welcome to convolution.',
        btnText: 'Next'
      },
      {
        title: 'So what is convolution, you say?',
        message: 'Well <b>Aaron or Scott or Gerald can explain much better than me.</b>',
        btnText: 'Next'
      },
      {
        title: "So that's it!",
        message: 'Someone will fill in these text here.',
        btnText: "I'm ready for interactive app!"
      }
    ]
  };

  showIntro() {
    this.intro.current_index = 0;
    this.intro.current_state = this.intro.states[0];
    this.ngxSmartModalService.getModal('introModal').open();
  }

  introNext() {
    this.intro.current_index += 1;
    if (this.intro.current_index < this.intro.states.length) {
      this.intro.current_state = this.intro.states[this.intro.current_index];
    } else {
      this.ngxSmartModalService.getModal('introModal').close();
    }
  }

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
}

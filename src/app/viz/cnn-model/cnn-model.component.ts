import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

declare var Snap: any;
declare var mina: any;

@Component({
  selector: 'app-cnn-model',
  templateUrl: './cnn-model.component.html',
  styleUrls: ['./cnn-model.component.scss']
})
export class CnnModelComponent implements OnInit, OnChanges {
  @Input() state: Array<any>;
  private layers: any;
  private svg: any;
  private g: any;
  private options = { width: 1200, height: 600, padding: 10 };
  public focusedLayers: any = [];
  public networkVisible: boolean = false;

  constructor() {}

  ngOnInit() {
    this.constructLayers();

    this.svg = Snap('#viz-svg');

    this.svg.attr({
      viewBox: `0 0 ${this.options.width} ${this.options.height}`
    });

    this.g = this.svg.g();

    // this.g.attr({
    //   transform: `translate(${this.options.padding}, ${this.options.padding})`,
    // });

    this.drawImage();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.focusedLayers = changes.state.currentValue.focus;
    setTimeout(() => this.focusLayers(), 500);
  }

  private constructLayers() {
    this.layers = [
      {
        id: 'l1',
        type: 'channel',
        channels: 1,
        name: 'Input Image',
        shape: '1 x 28 x 28'
      },
      {
        id: 'l2',
        type: 'channel',
        channels: 5,
        name: 'Convolution 1',
        shape: '5 x 24 x 24'
      },
      {
        id: 'l3',
        type: 'channel',
        channels: 5,
        name: 'Pooling 1',
        shape: '5 x 12 x 12',
        imageScale: 0.6,
        oneOnOneWeights: true
      },
      {
        id: 'l4',
        type: 'channel',
        channels: 10,
        name: 'Convolution 2',
        shape: '10 x 8 x 8'
      },
      {
        id: 'l5',
        type: 'channel',
        channels: 10,
        name: 'Pooling 2',
        shape: '10 x 4 x 4',
        imageScale: 0.5,
        oneOnOneWeights: true
      },
      {
        id: 'l6',
        type: 'dense',
        channels: 20,
        name: 'Dense',
        shape: '20 x 1',
        verticalTopMargin: 0.1,
        values: [165, 79, 27, 231, 221, 35, 221, 9, 189, 70, 109, 50, 129, 138, 182, 233, 162, 53, 193, 162]
      },
      {
        id: 'l7',
        type: 'dense',
        channels: 10,
        name: 'Output',
        shape: '10 x 1',
        verticalTopMargin: 0.3,
        values: [207, 197, 188, 197, 30, 209, 186, 176, 164, 187]
      }
    ];
  }

  private drawImage() {
    let x = 0;
    let box_margin = 5;
    let layer_height = this.options.height - box_margin * 10;
    let layer_width = this.options.width / (2 * this.layers.length - 1);
    let max_box_height = 100;
    let box_container_width = layer_width - 2 * box_margin;
    let vertical_top_margin = 0;
    for (const layer of this.layers) {
      layer.g = this.g.g().addClass('layer-box animated');
      if (layer.verticalTopMargin) {
        vertical_top_margin = layer_height * layer.verticalTopMargin;
      }
      if (layer.type == 'channel') {
        let box_container_height = (layer_height - 2 * vertical_top_margin) / layer.channels;
        let box_height = box_container_height - 2 * box_margin;
        box_height = Math.min(box_height, max_box_height);
        let box_width = Math.min(box_container_width, box_height);
        if (layer.imageScale) {
          box_width *= layer.imageScale;
        }
        box_height = box_width; // square it all. square it all.
        layer.elements = [];
        for (let c = 0; c < layer.channels; c++) {
          let box_vcenter = vertical_top_margin + ((2 * c + 1) * box_container_height) / 2;
          let box_hcenter = x + box_container_width / 2;
          let box_vtop = box_vcenter - box_height / 2;
          let box_htop = box_margin + box_hcenter - box_width / 2;
          let filename = `assets/cnn/${layer.id}_${c}.png`;
          let element = layer.g.image(filename, box_htop, box_vtop, box_width, box_height);
          // let element = layer.g.rect(box_htop, box_vtop, box_width, box_height);
          element.mouseover(() => this.cnnNodeMouseover(layer, element));
          element.mouseout(() => this.cnnNodeMouseout(layer, element));
          layer.elements.push(element);
        }
      } else if (layer.type == 'dense') {
        let box_container_height = (layer_height - 2 * vertical_top_margin) / layer.channels;
        let box_height = Math.max(1, box_container_height - 2);
        box_height = Math.min(box_height, max_box_height);
        let box_width = Math.min(box_container_width, box_height);
        layer.elements = [];
        for (let c = 0; c < layer.channels; c++) {
          let box_vcenter = vertical_top_margin + ((2 * c + 1) * box_container_height) / 2;
          let box_hcenter = x + box_container_width / 2;
          let box_vtop = box_vcenter - box_height / 2;
          let box_htop = box_margin + box_hcenter - box_width / 2;
          let element = layer.g.rect(box_htop, box_vtop, box_width, box_height);
          element.mouseover(() => this.cnnNodeMouseover(layer, element));
          element.mouseout(() => this.cnnNodeMouseout(layer, element));
          let v = layer.values[c];
          element.attr({
            fill: `rgb(${v},${v},${v})`
          });
          layer.elements.push(element);
        }
      }

      // ignoring shapes because users didn't find this important
      // let shape_htop = x + layer_width / 2;
      // let shape_vtop = layer_height + box_margin * 4;
      // layer.shape_element = this.g.text(shape_htop, shape_vtop, layer.shape).attr({
      //   'text-anchor': 'middle'
      // });

      let name_htop = x + layer_width / 2;
      let name_vtop = layer_height + box_margin * 8;
      layer.name_element = layer.g.text(name_htop, name_vtop, layer.name).attr({
        'text-anchor': 'middle'
      });

      x += layer_width * 2;
    }

    // now draw weights between layers
    for (let i = 1; i < this.layers.length; i++) {
      let lastLayer = this.layers[i - 1];
      let thisLayer = this.layers[i];
      thisLayer.g_weights = {};
      thisLayer.weights = {};

      for (let index = 0; index < thisLayer.elements.length; index++) {
        let thisElement = thisLayer.elements[index];
        let group = this.g.g().addClass('weights-box');
        let weights = [];
        let lastLayerElements = lastLayer.elements;
        if (thisLayer.oneOnOneWeights) {
          lastLayerElements = [lastLayer.elements[index]];
        }
        for (let lastElement of lastLayerElements) {
          let x1 = lastElement.node.x.baseVal.value + lastElement.node.width.baseVal.value;
          let y1 = lastElement.node.y.baseVal.value + lastElement.node.height.baseVal.value / 2;
          let x2 = thisElement.node.x.baseVal.value;
          let y2 = thisElement.node.y.baseVal.value + thisElement.node.height.baseVal.value / 2;
          weights.push(group.line(x1, y1, x2, y2));
        }
        thisLayer.g_weights[thisElement.id] = group;
        thisLayer.weights[thisElement.id] = weights;
      }
    }

    this.svg.addClass('animated bounceIn');
    this.focusLayers();
  }

  private focusLayers() {
    let focusedLayers = [];
    if (this.state && 'focus' in this.state) {
      focusedLayers = this.state['focus'];
    }

    this.svg.removeClass('no-display');
    this.networkVisible = true;
    if (this.state['hideNetwork']) {
      this.networkVisible = false;
      this.svg.addClass('no-display');
    }
    for (const layer of this.layers) {
      layer.g.removeClass('focused');
      layer.g.removeClass('pulse');
      if (focusedLayers.includes(layer.id)) {
        layer.g.addClass('focused');
        if (this.state['animate']) {
          layer.g.addClass('pulse');
        }
      }
    }
  }

  cnnNodeMouseover(layer, element) {
    element.addClass('mouseover');
    layer.g_weights[element.id].addClass('mouseover');
  }

  cnnNodeMouseout(layer, element) {
    element.removeClass('mouseover');
    layer.g_weights[element.id].removeClass('mouseover');
  }
}

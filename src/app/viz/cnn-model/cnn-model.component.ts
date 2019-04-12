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
        shape: '10 x 24 x 24'
      },
      {
        id: 'l3',
        type: 'channel',
        channels: 5,
        name: 'Pooling 1',
        shape: '10 x 12 x 12',
        imageScale: 0.6
      },
      {
        id: 'l4',
        type: 'channel',
        channels: 10,
        name: 'Convolution 2',
        shape: '20 x 8 x 8'
      },
      {
        id: 'l5',
        type: 'channel',
        channels: 10,
        name: 'Pooling 2',
        shape: '20 x 4 x 4',
        imageScale: 0.5
      },
      {
        id: 'l6',
        type: 'dense',
        channels: 30,
        name: 'Dense',
        shape: '320 x 1'
      },
      {
        id: 'l7',
        type: 'output',
        channels: 10,
        name: 'Output',
        shape: '10 x 1'
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
    for (const layer of this.layers) {
      layer.g = this.g.g().addClass('layer-box animated');
      if (layer.type == 'channel') {
        let box_container_height = layer_height / layer.channels;
        let box_height = box_container_height - 2 * box_margin;
        box_height = Math.min(box_height, max_box_height);
        let box_width = Math.min(box_container_width, box_height);
        if (layer.imageScale) {
          box_width *= layer.imageScale;
        }
        box_height = box_width; // square it all. square it all.
        layer.elements = [];
        for (let c = 0; c < layer.channels; c++) {
          let box_vcenter = ((2 * c + 1) * box_container_height) / 2;
          let box_hcenter = x + box_container_width / 2;
          let box_vtop = box_vcenter - box_height / 2;
          let box_htop = box_margin + box_hcenter - box_width / 2;
          let filename = `assets/cnn/${layer.id}_${c}.png`;
          let element = layer.g.image(filename, box_htop, box_vtop, box_width, box_height);
          // let element = layer.g.rect(box_htop, box_vtop, box_width, box_height);
          layer.elements.push(element);
        }
      } else if (layer.type == 'dense') {
        let box_container_height = layer_height / layer.channels;
        let box_height = Math.max(1, box_container_height - 2);
        box_height = Math.min(box_height, max_box_height);
        let box_width = Math.min(box_container_width, box_height);
        layer.elements = [];
        for (let c = 0; c < layer.channels; c++) {
          let box_vcenter = ((2 * c + 1) * box_container_height) / 2;
          let box_hcenter = x + box_container_width / 2;
          let box_vtop = box_vcenter - box_height / 2;
          let box_htop = box_margin + box_hcenter - box_width / 2;
          let element = layer.g.rect(box_htop, box_vtop, box_width, box_height);
          layer.elements.push(element);
        }
      } else if (layer.type == 'output') {
        let vertical_margin = layer_height / 4;
        let box_container_height = (layer_height - 2 * vertical_margin) / layer.channels;
        let box_height = Math.max(1, box_container_height - 2);
        box_height = Math.min(box_height, max_box_height);
        let box_width = Math.min(box_container_width, box_height);
        layer.elements = [];
        for (let c = 0; c < layer.channels; c++) {
          let box_vcenter = vertical_margin + ((2 * c + 1) * box_container_height) / 2;
          let box_hcenter = x + box_container_width / 2;
          let box_vtop = box_vcenter - box_height / 2;
          let box_htop = box_margin + box_hcenter - box_width / 2;
          let element = layer.g.rect(box_htop, box_vtop, box_width, box_height);
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

      // todo: add arrow
      x += layer_width * 2;
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
    if (this.state['hideNetwork']) {
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
}

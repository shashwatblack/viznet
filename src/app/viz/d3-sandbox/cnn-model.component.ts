import { Component, OnInit } from '@angular/core';

declare var Snap: any;
declare var mina: any;

@Component({
  selector: 'app-cnn-model',
  templateUrl: './cnn-model.component.html',
  styleUrls: ['./cnn-model.component.scss']
})
export class CnnModelComponent implements OnInit {
  private layers: any;
  private svg: any;
  private g: any;
  private options = { width: 1200, height: 600, padding: 10 };

  constructor() {}

  ngOnInit() {
    this.constructLayers();

    this.svg = Snap('#viz-svg');

    this.svg.attr({
      width: this.options.width,
      height: this.options.height
    });

    this.g = this.svg.g().attr({
      transform: `translate(${this.options.padding}, ${this.options.padding})`
    });

    this.drawImage();
  }

  private constructLayers() {
    this.layers = [
      {
        id: 'l1',
        type: 'channel',
        channels: 1,
        name: 'Input',
        shape: '1 x 28 x 28'
      },
      {
        id: 'l2',
        type: 'channel',
        channels: 10,
        name: 'Conv1',
        shape: '10 x 24 x 24'
      },
      {
        id: 'l3',
        type: 'channel',
        channels: 10,
        name: 'Pool1',
        shape: '10 x 12 x 12'
      },
      {
        id: 'l4',
        type: 'channel',
        channels: 20,
        name: 'Conv2',
        shape: '20 x 8 x 8'
      },
      {
        id: 'l5',
        type: 'channel',
        channels: 20,
        name: 'Pool2',
        shape: '20 x 4 x 4'
      },
      {
        id: 'l6',
        type: 'dense',
        channels: 320,
        name: 'FC1',
        shape: '320'
      },
      {
        id: 'l7',
        type: 'dense',
        channels: 100,
        name: 'FC2',
        shape: '100'
      },
      {
        id: 'l8',
        type: 'dense',
        channels: 10,
        name: 'Output',
        shape: '10'
      }
    ];
  }

  private drawImage() {
    let x = 0;
    let layer_width = 100;
    let max_box_height = 100;
    let box_margin = 5;
    let box_width = layer_width - 2 * box_margin;
    for (const layer of this.layers) {
      if (layer.type == 'channel') {
        let box_container_height = this.options.height / layer.channels;
        let box_height = box_container_height - 2 * box_margin;
        box_height = Math.min(box_height, max_box_height);

        layer.elements = [];
        for (let c = 0; c < layer.channels; c++) {
          let box_vcenter = ((2 * c + 1) * box_container_height) / 2;
          let box_vtop = box_vcenter - box_height / 2;
          let box_htop = x + box_margin;
          let element = this.g.rect(box_htop, box_vtop, box_width, box_height).attr({
            fill: '#aaaaaa'
          });
          element.addClass('ease-in-out');

          layer.elements.push(element);
        }
      }

      // todo: add arrow
      x += layer_width * 2;
    }
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var Snap: any;
declare var mina: any;

@Component({
  selector: 'app-d3-sandbox',
  templateUrl: './d3-sandbox.component.html',
  styleUrls: ['./d3-sandbox.component.scss']
})
export class D3SandboxComponent implements OnInit {
  @ViewChild('nodePopover') nodePopover: ElementRef;
  private image = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 55, 148, 210, 253, 253, 113, 87, 148, 55, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 87, 232, 252, 253, 189, 210, 252, 252, 253, 168, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 57, 242, 252, 190, 65, 5, 12, 182, 252, 253, 116, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 252, 252, 183, 14, 0, 0, 92, 252, 252, 225, 21, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 132, 253, 252, 146, 14, 0, 0, 0, 215, 252, 252, 79, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 126, 253, 247, 176, 9, 0, 0, 8, 78, 245, 253, 129, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 16, 232, 252, 176, 0, 0, 0, 36, 201, 252, 252, 169, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 22, 252, 252, 30, 22, 119, 197, 241, 253, 252, 251, 77, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 16, 231, 252, 253, 252, 252, 252, 226, 227, 252, 231, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 55, 235, 253, 217, 138, 42, 24, 192, 252, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 62, 255, 253, 109, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 71, 253, 252, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 252, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 71, 253, 252, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 106, 253, 252, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 45, 255, 253, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 218, 252, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 252, 189, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 184, 252, 170, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 147, 252, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  private nodes: any[];
  protected hoveredNode: any;
  private svg: any;
  private wrapper_g: any;

  constructor() {}

  ngOnInit() {
    this.constructNodes();

    this.svg = Snap('#viz-svg');

    this.svg.attr({
      width: 800,
      height: 600
    });

    this.wrapper_g = this.svg.g().attr({
      transform: 'translate(10, 10)'
    });

    this.drawImage();
  }

  rotateImage() {
    this.transformNodes();
    this.updateElements();
  }

  mouseoverNode(event: any, node: any) {
    console.log('node', node);
    this.hoveredNode = node;
    this.nodePopover.nativeElement.style.left = event.clientX - 10 + 'px';
    this.nodePopover.nativeElement.style.top = event.clientY - 10 + 'px';
    // console.log(event.clientX, event.clientY);
  }

  mouseoutNode(event: any) {
    // this.hoveredNode = null;
  }

  private constructNodes() {
    this.nodes = [];
    const numRows = 28,
      numCols = 28;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const cell = 255 - this.image[row][col];
        this.nodes.push({
          p_x: col,
          p_y: row,
          x: col * 20,
          y: row * 20,
          radius: 8,
          value: cell,
          fill: `rgb(${cell},${cell},${cell})`
        });
      }
    }
  }

  private transformNodes() {
    for (const node of this.nodes) {
      const x = node.x;
      const y = node.y;

      node.x = y;
      node.y = 540 - x;
      // node.x += 2 * (400 - node.x);
      // node.y += 100;
    }
  }

  private updateElements() {
    for (const node of this.nodes) {
      const x_diff = node.x - +node.element.attr().cx;
      const y_diff = node.y - +node.element.attr().cy;
      const transform = `t${x_diff},${y_diff}`;
      // node.element.animate({transform: transform}, 10000, mina.easeinout);
      node.element.attr({ style: `transform: translate(${x_diff}px, ${y_diff}px)` });
    }
  }

  private drawImage() {
    for (const node of this.nodes) {
      node.element = this.wrapper_g.circle(node.x, node.y, node.radius).attr({
        fill: node.fill
      });
      node.element.addClass('ease-in-out');
    }

    /*
    setInterval(() => {
      console.log('again');
      path.attr({
        d: 'M94.2,265.7L82,203.4c43.3-15.6,83.8-29.2,137.1-20.2c61.5-27.6,126.1-56.9,202.6 46.1c18.7,18.9,21.5,39.8,12.2,62.3C322.7,231.9,208.2,247.6,94.2,265.7z'
      });
      path.animate({d: 'M179.4,83.5l62.4-11.8c15.3,43.4-76,102.6-22.6,111.5c61.5-27.6,126.1-56.9,202.6-46.1c18.7,18.9,21.5,39.8,12.2,62.3C250.6,296.7,52.4,259.2,179.4,83.5z'}, 1000, mina.bounce);
    }, 2000);
    */
  }
}

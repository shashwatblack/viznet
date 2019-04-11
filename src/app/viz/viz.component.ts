import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '@app/core';
import { D3SandboxComponent } from '@app/viz/d3-sandbox/d3-sandbox.component';

@Component({
  selector: 'app-viz',
  templateUrl: './viz.component.html',
  styleUrls: ['./viz.component.scss']
})
export class VizComponent implements OnInit {
  @ViewChild('d3_sandbox') d3_sandbox: D3SandboxComponent;
  public modelStates: any;
  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit() {
    this.constructModalStates();
  }

  networkStateNext() {
    this.notificationService.info('Yet to implement!!!');
    this.d3_sandbox.rotateImage();
  }

  private constructModalStates() {
    this.modelStates = {
      current_index: 0,
      current_state: {},
      states: [
        {
          id: 'welcome',
          focus: [],
          description:
            "Welcome to VizWeb's interactive visualization! In this tutorial we will help you better understand how exactly a neural network does what it does."
        },
        {
          id: 'intro',
          focus: ['l1'],
          description:
            'We will focus primarily on one of the most widely used neural network models of the modern age; the convolutional neural network. The above visualization represents the overall structure of the convolutional neural network architecture. We will walk you through step-by-step what happens within each layer.'
        },
        {
          id: 'input',
          focus: ['l1'],
          description:
            'This is the input layer. Our input to the network is an image of a hand-drawn number. As you can see, in this instance, it is the number 4.'
        },
        {
          id: 'conv1a',
          focus: ['l2'],
          description:
            'This is the first of two convolutional layers in this network. The convolutional layer applies a italics{filter} on small sections of the the 28 x 28 grid of values from the original image (hence why we see more images in this layer).'
        },
        {
          id: 'conv1b',
          focus: ['l2'],
          description:
            'Through a series of mathematical calculations, the filter calculates numeric values that represent distinctive aspects of the image. These numeric values are called italics{features}. Examples include rounded corners, straight lines, etc.'
        },
        {
          id: 'pool1a',
          focus: ['l3'],
          description:
            'This is the first of two pooling layers in this network. The previously calculated features are passed to the pooling layer. The pooling layer separates each set of features it receives into smaller sections (hence why we see even more images in this layer), examines all of the values within that section, then chooses the largest one.'
        },
        {
          id: 'pool1b',
          focus: ['l3'],
          description:
            'This is done because the largest feature values mathematically correspond to what is likely to be the most important or distinct aspect of the image. The network is trying to figure out which of the features is the most important to focus on. Basically, it is learning to see!'
        },
        {
          id: 'convpool2',
          focus: ['l4', 'l5'],
          description:
            'By repeating this process, the network is able to look at smaller and smaller sections of the image and pick out more minute and potentially important features. Though this network only repeats the process once, it can be done any number of times depending on what the network will be used for.'
        },
        {
          id: 'fc',
          focus: ['l6'],
          description:
            'This is the first of two fully connected layers in this network. The fully connected layer takes the feature values from the last pooling layer in the network, performs a statistical calculation across all of them, then uses the calculated result to make a prediction about which output category the image is most likely to belong to.'
        },
        {
          id: 'finala',
          focus: ['l7'],
          description:
            'We have finally reached the output layer! The output layer takes in the calculated results from the final fully connected layer in the network and assigns a probability between zero and one to each of the possible category predictions.'
        },
        {
          id: 'finalb',
          focus: ['l7'],
          description:
            'Since we are trying to determine which single digit a hand-written image is showing, the choices are 0, 1, 2, 3, 4, 5, 6, 7, 8, and 9. Notice also that there are 10 elements in the output layer each of which corresponds to one of these numbers. The number that has the highest calculated probability is the one that the network chooses as the correct answer and displays to you at the very end.'
        }
      ]
    };

    this.modelStates.current_state = this.modelStates.states[0];
  }

  stateNext() {
    if (this.modelStates.current_index < this.modelStates.states.length - 1) {
      this.modelStates.current_index += 1;
      this.modelStates.current_state = this.modelStates.states[this.modelStates.current_index];
    }
  }

  statePrevious() {
    if (this.modelStates.current_index > 0) {
      this.modelStates.current_index -= 1;
      this.modelStates.current_state = this.modelStates.states[this.modelStates.current_index];
    }
  }
}

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
          id: 'intro_1',
          focus: [],
          hideNetwork: true,
          animate: true,
          description:
            "Welcome to VizWeb's interactive visualization! In this tutorial we will help you better understand how exactly a neural network does what it does."
        },
        {
          id: 'intro_2',
          focus: [],
          hideNetwork: true,
          animate: true,
          description:
            'We will focus primarily on one of the most widely used neural network models of the modern age -- the convolutional neural network.'
        },
        {
          id: 'intro_3',
          focus: [],

          hideNetwork: false,
          animate: true,
          description:
            'The above visualization represents the overall structure of the convolutional neural network architecture. We will walk you through step-by-step what happens within each layer.'
        },
        {
          id: 'intro_4',
          focus: [],

          hideNetwork: false,
          animate: true,
          description:
            'Each of the columns in the above visualization represents a layer of the neural network. Each layer of the neural network performs some mathematical operation that culminates to it being able to identify the contents of an image!'
        },
        {
          id: 'input_1',
          focus: ['l1'],

          hideNetwork: false,
          animate: true,
          description:
            'This is the input layer. Our input to the network is an image of a hand-drawn number. As you can see, in this instance, it is the number 4.'
        },
        {
          id: 'input_2',
          focus: ['l1'],

          hideNetwork: false,
          animate: true,
          description:
            'In a computer, this image is broken down into a 28 x 28 grid of pixels. Each of these pixels has a value between 0-255 representing how light or dark the pixel is respectively. This means that, in total, there are 784 of these values in each of these images!'
        },
        {
          id: 'conv1_1',
          focus: ['l2'],

          hideNetwork: false,
          animate: true,
          description: `This is the first of two convolutional layers in this network. The convolutional layer applies a <b><i>filter</i></b> on small sections of the the 28 x 28 grid of values from the original image (hence why we see more images in this layer).`
        },
        {
          id: 'conv1_2',
          focus: ['l2'],

          hideNetwork: false,
          animate: true,
          description: `Through a series of mathematical calculations, the filter calculates numeric values that represent distinctive aspects of the image. These numeric values are called <b><i>filter</i></b>. Examples include rounded corners, straight lines, etc.`
        },
        {
          id: 'pool1_1',
          focus: ['l3'],

          hideNetwork: false,
          animate: true,
          description:
            'This is the first of two pooling layers in this network. The previously calculated features are passed to the pooling layer. The pooling layer separates each set of features it receives into smaller sections (hence why we see even more images in this layer), examines all of the values within that section, then chooses the largest one.'
        },
        {
          id: 'pool1_2',
          focus: ['l3'],

          hideNetwork: false,
          animate: true,
          description:
            'This is done because the largest feature values mathematically correspond to what is likely to be the most important or distinct aspect of the image. The network is trying to figure out which of the features is the most important to focus on. Basically, it is learning to see!'
        },
        {
          id: 'convpool_1',
          focus: ['l4', 'l5'],

          hideNetwork: false,
          animate: true,
          description:
            'By repeating this process, the network is able to look at smaller and smaller sections of the image and pick out more minute and potentially important features. Though this network only repeats the process once, it can be done any number of times depending on what the network will be used for.'
        },
        {
          id: 'fc_1',
          focus: ['l6'],

          hideNetwork: false,
          animate: true,
          description:
            'This is a fully connected layer. This layer takes the feature values from the last pooling layer in the network, performs a statistical calculation across all of them, then uses the calculated result to make a prediction about which output category the image is most likely to belong to.'
        },
        {
          id: 'final_1',
          focus: ['l7'],

          hideNetwork: false,
          animate: true,
          description:
            'We have finally reached the output layer! The output layer takes in the calculated results from the last fully connected layer and assigns a probability between zero and one to each of the possible category predictions.'
        },
        {
          id: 'final_2',
          focus: ['l7'],

          hideNetwork: false,
          animate: true,
          description:
            'Since we are trying to determine which single digit a hand-written image is showing, the choices are 0, 1, 2, 3, 4, 5, 6, 7, 8, and 9. Notice also that there are 10 elements in the output layer each of which corresponds to one of these numbers. The number that has the highest calculated probability is the one that the network chooses as the correct answer and displays to you at the very end.'
        },
        {
          id: 'final_2',
          focus: ['l7'],

          hideNetwork: false,
          animate: true,
          description: `Since the element corresponding to <code>4</code> is the brightest, the network predicts that the input image is a <code>4</code>.`
        },
        {
          id: 'overall',
          focus: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'],

          hideNetwork: false,
          animate: false,
          description: `That's it! You now know the basics of a CNN. A real CNN has hundreds of these layers. <br>
            Isn't it amazing how simple layers just like these, can be used for autonomous vehicles, tumor detection, weather prediction and what not?`
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

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
  @ViewChild('description') descriptionElement: ElementRef;
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
          description: `We will focus primarily on one of the most widely used neural network models of the modern age -- the convolutional neural network (or CNN).<br>
            CNN is exceptionally good at processing images and deducing patterns. As such, it has been widely used in the field of computer vision and is the technology that underlies many modern inventions (like self-driving cars!).`
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
          description: `This is the input layer. Our input to the network is an image of a hand-drawn number. As you can see, in this instance, it is the number <code>4</code>.`
        },
        {
          id: 'input_2',
          focus: ['l1'],
          hideNetwork: false,
          animate: true,
          description:
            'In a computer, this image is broken down into a 28 x 28 grid of pixels. Each of these pixels has a value between 0-255 representing how light or dark the pixels are. This means that, in total, there are 784 of these values!'
        },
        {
          id: 'conv1_1',
          focus: ['l2'],
          hideNetwork: false,
          animate: true,
          description: `This is the first of two convolutional layers in this network. The convolutional layer applies a <b><i>kernel</i></b> on small sections of the the 28 x 28 grid of values from the original image. This kernel applies a mathematical operation to the values associated with the pixels.`
        },
        {
          id: 'conv1_2',
          focus: ['l2'],
          hideNetwork: false,
          animate: true,
          description: `By performing these mathematical calculations, the kernel is able to discover distinctive aspects of the image. Examples of such features include rounded corners, straight lines, etc. The images in the highlighted layer represent significant features that the kernel mathematically determined make this particular image unique.`
        },
        {
          id: 'conv1_3',
          focus: ['l2'],
          hideNetwork: false,
          animate: true,
          description: `Notice the patterns in the transformed images. Some have preserved horizontal, or vertical edges (edge detector kernels), and some have been sharpened or blurred (sharpen/blur kernels).`
        },
        {
          id: 'pool1_1',
          focus: ['l3'],
          hideNetwork: false,
          animate: true,
          description: `This is the first of two pooling layers in this network. The pooling layer takes a small section of pixels its corresponding picture, compares the values of each of those pixels in the small section, then chooses the largest one to keep and throws away the rest. This is an example of the max pooling concept. Notice the images being half the original dimensions. This is because of the 2x2 pooling window.`
        },
        {
          id: 'pool1_2',
          focus: ['l3'],
          hideNetwork: false,
          animate: true,
          description:
            'Pooling is done because the largest feature values mathematically correspond to what is likely to be the most important or distinct aspect of the image. The network is trying to figure out which of the features is the most important to focus on. Basically, it is learning to see!'
        },
        {
          id: 'convpool_1',
          focus: ['l4', 'l5'],
          hideNetwork: false,
          animate: true,
          description:
            'By repeating this process, the network is able to look at smaller and smaller sections of the image and pick out more minute and potentially important features. Although this particular network only has one repetition, real networks have have hundreds of these stacked one after another.'
        },
        {
          id: 'fc_1',
          focus: ['l6'],
          hideNetwork: false,
          animate: true,
          description: `This layer is called a dense or a fully-connected layer. As you'll remember from <i>perceptron</i> module earlier, the images are flattened into one dimensional list, then fed as input to this layer. The layer performs some weighted summation of the inputs.`
        },
        {
          id: 'final_1',
          focus: ['l7'],
          hideNetwork: false,
          animate: true,
          description:
            'We have finally reached the output layer! The output layer takes in the calculated results from the last fully-connected layer and assigns a probability between zero and one to each of the possible category predictions.'
        },
        {
          id: 'final_2',
          focus: ['l7'],
          hideNetwork: false,
          animate: true,
          description:
            'Since we are trying to determine which single digit a hand-written image is showing, the choices are 0, 1, 2, 3, 4, 5, 6, 7, 8, and 9. Notice also that there are 10 elements in the output layer, and each corresponds to one of these numbers. The number that has the highest calculated probability is the one that the network chooses as the correct answer and displays to you at the very end.'
        },
        {
          id: 'final_2',
          focus: ['l7'],
          hideNetwork: false,
          animate: true,
          description: `Since in this case, the element corresponding to <code>4</code> is the brightest, the network predicts that the input image is a <code>4</code>.`
        },
        {
          id: 'overall',
          focus: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'],
          hideNetwork: false,
          animate: false,
          description: `That's it! You now know the basics of a CNN. A real CNN has hundreds of these layers. <br>
            It's amazing that simple mathematical constructs like these, are the fundamental concepts underlying incredible applications like autonomous cars, tumor detections, weather predictions and so much more.`
        }
      ]
    };

    this.modelStates.current_state = this.modelStates.states[0];
  }

  stateNext() {
    if (this.modelStates.current_index < this.modelStates.states.length - 1) {
      this.descriptionElement.nativeElement.classList.add('fadeOutLeft');
      setTimeout(() => {
        this.descriptionElement.nativeElement.classList.remove('fadeOutLeft');
        this.modelStates.current_index += 1;
        this.modelStates.current_state = this.modelStates.states[this.modelStates.current_index];
        this.descriptionElement.nativeElement.classList.add('fadeInRight');
        setTimeout(() => {
          this.descriptionElement.nativeElement.classList.remove('fadeInRight');
        }, 300);
      }, 200);
    }
  }

  statePrevious() {
    if (this.modelStates.current_index > 0) {
      this.descriptionElement.nativeElement.classList.add('fadeOutRight');
      setTimeout(() => {
        this.descriptionElement.nativeElement.classList.remove('fadeOutRight');
        this.modelStates.current_index -= 1;
        this.modelStates.current_state = this.modelStates.states[this.modelStates.current_index];
        this.descriptionElement.nativeElement.classList.add('fadeInLeft');
        setTimeout(() => {
          this.descriptionElement.nativeElement.classList.remove('fadeInLeft');
        }, 300);
      }, 200);
    }
  }
}

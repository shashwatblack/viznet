
import argparse
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms
import pandas as pd
import matplotlib.pyplot as plt
import os
from PIL import Image
import numpy as np
import numpy

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 20, 5, 1)
        self.conv2 = nn.Conv2d(20, 50, 5, 1)
        self.fc1 = nn.Linear(4*4*50, 500)
        self.fc2 = nn.Linear(500, 10)

    def forward(self, x):
        x = F.relu(self.conv1(x))
        conv1=x
        x = F.max_pool2d(x, 2, 2)
        pool1=x
        x = F.relu(self.conv2(x))
        conv2=x
        x = F.max_pool2d(x, 2, 2)
        pool2=x
        x = x.view(-1, 4*4*50)
        x = F.relu(self.fc1(x))
        fc1 = x
        x = self.fc2(x)
        fc2 = x
        return [conv1,pool1,conv2,pool2,fc1,fc2,F.log_softmax(x, dim=1)]

test_loader = torch.utils.data.DataLoader(
        datasets.MNIST('../data', train=False, transform=transforms.Compose([
                           transforms.ToTensor(),
                           transforms.Normalize((0.1307,), (0.3081,))
                       ])),
        batch_size=64) #args.test_batch_size, shuffle=True, **kwargs)

device = 'cuda'
test_loss = 0
correct = 0
model = Net()
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.5)
model.load_state_dict(torch.load('mnist_cnn.pt'))
model.eval()



seen_num = set()
root = os.path.join('mnist images')
with torch.no_grad():
    for data, target in test_loader:
        print(target)
        print(data.shape)
        output = model(data)
        conv1,pool1,conv2,pool2,fc1,fc2,_ = output
        print(conv1[0].shape, conv2[0].shape, fc1[0].shape, fc2[0].shape)
        target = list(target.numpy())
        for idx,label in enumerate(target):
            if label not in seen_num:
                seen_num.add(label)
                image_path=os.path.join(root,str(label))
                print(image_path)
                #===============================================================
                input_image = data[idx][0]
                input_image = np.array(np.uint8(input_image),dtype=float)
                input_image = Image.fromarray(input_image)
                input_imgray = input_image.convert('L')
                input_image = np.array(list(input_imgray.getdata()), float)
                input_image.shape = (input_imgray.size[1], input_imgray.size[0])
                input_image = (input_image/2)*255
                input_image = np.round(input_image)
                numpy.save(os.path.join(image_path,'input','input.npy'), input_image)
                input_image = Image.fromarray(input_image)
                input_image = input_image.convert('RGB')
                input_image.save(os.path.join(image_path,'input','input.png'))
                #================================================================
                image_conv1 = conv1[idx]
                i=0
                image = None
                input_image=None
                for i,image in enumerate(image_conv1):
                    input_image = np.array(np.uint8(image),dtype=float)
                    input_image = Image.fromarray(input_image)
                    input_imgray = input_image.convert('L')
                    input_image = np.array(list(input_imgray.getdata()), float)
                    input_image.shape = (input_imgray.size[1], input_imgray.size[0])
                    #print(input_image[np.argmax(input_image,axis=1)])
                    #max_val = input_image(np.argmax(input_image))
                    max_value =np.amax(input_image)
#                     if max_value == 0:
#                         print(input_image)
#                         assert(max_value!=0)
                    #print(a)
                    input_image = (input_image/max_value)*255
                    input_image = np.round(input_image)
                    numpy.save(os.path.join(image_path,'conv1','pickles','feature_map{}.npy'.format(i)),input_image)
                    #print(input_image)
                    input_image = Image.fromarray(input_image)
                    input_image = input_image.convert('RGB')
                    input_image.save(os.path.join(image_path,'conv1','imgs','feature_map{}.png'.format(i)))
                #================================================================
                image_pool1 = pool1[idx]
                i=0
                image = None
                input_image=None
                for i,image in enumerate(image_pool1):
                    input_image = np.array(np.uint8(image),dtype=float)
                    input_image = Image.fromarray(input_image)
                    input_imgray = input_image.convert('L')
                    input_image = np.array(list(input_imgray.getdata()), float)
                    input_image.shape = (input_imgray.size[1], input_imgray.size[0])
                    max_value =np.amax(input_image)
                    input_image = (input_image/max_value)*255
                    input_image = np.round(input_image)
                    numpy.save(os.path.join(image_path,'pool1','pickles','feature_map{}.npy'.format(i)),input_image)
                    input_image = Image.fromarray(input_image)
                    input_image = input_image.convert('RGB')
                    input_image.save(os.path.join(image_path,'pool1','imgs','feature_map{}.png'.format(i)))
                #=================================================================
                image_conv2 = conv2[idx]
                i=0
                image = None
                input_image=None
                for i,image in enumerate(image_conv2):
                    input_image = np.array(np.uint8(image),dtype=float)
                    input_image = Image.fromarray(input_image)
                    input_imgray = input_image.convert('L')
                    input_image = np.array(list(input_imgray.getdata()), float)
                    input_image.shape = (input_imgray.size[1], input_imgray.size[0])
                    max_value =np.amax(input_image)
                    input_image = (input_image/max_value)*255
                    input_image = np.round(input_image)
                    numpy.save(os.path.join(image_path,'conv2','pickles','feature_map{}.npy'.format(i)),input_image)
                    input_image = Image.fromarray(input_image)
                    input_image = input_image.convert('RGB')
                    input_image.save(os.path.join(image_path,'conv2','imgs','feature_map{}.png'.format(i)))
                #=================================================================
                image_pool2 = pool2[idx]
                i=0
                image = None
                input_image=None
                for i,image in enumerate(image_conv2):
                    input_image = np.array(np.uint8(image),dtype=float)
                    input_image = Image.fromarray(input_image)
                    input_imgray = input_image.convert('L')
                    input_image = np.array(list(input_imgray.getdata()), float)
                    input_image.shape = (input_imgray.size[1], input_imgray.size[0])
                    max_value =np.amax(input_image)
                    input_image = (input_image/max_value)*255
                    input_image = np.round(input_image)
                    numpy.save(os.path.join(image_path,'pool2','pickles','feature_map{}.npy'.format(i)),input_image)
                    input_image = Image.fromarray(input_image)
                    input_image = input_image.convert('RGB')
                    input_image.save(os.path.join(image_path,'pool2','imgs','feature_map{}.png'.format(i)))
                #==================================================================
                image = None
                input_image=None
                image=fc1[idx]
                input_image = np.array(np.uint8(image),dtype=float)
                input_image = Image.fromarray(np.array([input_image]))
                input_imgray = input_image.convert('L')
                input_image = np.array(list(input_imgray.getdata()), float)
                input_image.shape = (input_imgray.size[1], input_imgray.size[0])
                max_value =np.amax(input_image)
                input_image = (input_image/max_value)*255
                input_image = np.round(input_image)
                numpy.save(os.path.join(image_path,'fc1','pickles','feature_map.npy'),input_image)
                input_image = Image.fromarray(input_image)
                input_image = input_image.convert('RGB')
                input_image.save(os.path.join(image_path,'fc1','imgs','feature_map.png'))
                #====================================================================
                image = None
                input_image=None
                image=fc2[idx]
                input_image = np.array(np.uint8(image),dtype=float)
                input_image = Image.fromarray(np.array([input_image]))
                input_imgray = input_image.convert('L')
                input_image = np.array(list(input_imgray.getdata()), float)
                input_image.shape = (input_imgray.size[1], input_imgray.size[0])
                max_value =np.amax(input_image)
                input_image = (input_image/max_value)*255
                input_image = np.round(input_image)
                numpy.save(os.path.join(image_path,'fc1','pickles','feature_map.npy'),input_image)
                input_image = Image.fromarray(input_image)
                input_image = input_image.convert('RGB')
                input_image.save(os.path.join(image_path,'fc1','imgs','feature_map.png'))
            else:
                continue
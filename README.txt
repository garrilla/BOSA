#Bosa Controller/State solution

- install node from https://nodejs.org/dist/v14.19.3/node-v14.19.3.pkg
- run `curl https://install.meteor.com/ | sh`
- download https://github.com/garrilla/BOSA/archive/refs/heads/master.zip






##About this repo

This repository contains the Reaper Timeline session and Meteor App for the Bosa Project. 

The basic operation is to act as a controller, coordinating mobile devices on the network to broadcast simultaneous play/stop events 

##Reaper
The Reaper Timeline session takes volume automation values and broadcasts them to the network over OSC. 

These value are accepted by the Bosa mobile devices and used to start and stop the audio process.

Reaper is also listening for OSC commands that start/stop the session, toggling it in a _play_ state.

 
##Meteor
A MeteorJS Web App has two roles in this solution. 

to run meteor, open a terminal in the folder enter the command

`meteor run`

When meteor is running, a browser can see the web app at http://localhost:3000 or http://127.0.0.1:3000 or http://[your host machine ip]:3000

###Meteor State watcher
The Meteor Web App acts as 'state' window to the mobile devices on the network. 

When the state of the device changes (because it received a Reaper OSC broadcast message on the network) it sends an OSC message to acknowledge the change. 

This change is then reported visually in the MeteorJS Web App view in a browser.

The meteor app is hard-coded to monitor 10 devices.

###Meteor controller
On the broswer there are two buttons, _start performance_ and _end performance_

####Start Performance
The _start performance_ button sends a message to Reaper, via OSC, to put Reaper in a 'play' state. 

When Reaper starts playing, it will read the volume auto message and broadcast them to the devices on teh network. 

####Stop Performance
The _stop performance_ button sends a message to Reaper, via OSC, to put Reaper in a 'stop' state and wind the timeline back to 0

It will also a broadcast an OSC message to the network telling devices to stop playing audio.


##Network requirments

The Bosa network must be 









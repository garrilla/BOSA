import {Meteor} from 'meteor/meteor'
import { DevicesCollection } from './devices'

Meteor.publish('devices', function publishDevices(){
    return DevicesCollection.find();
})

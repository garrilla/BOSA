import {Meteor} from 'meteor/meteor'
import { MsgsCollection } from './messages'

Meteor.publish('messages', function publishMessages(){
    return MsgsCollection.find();
})
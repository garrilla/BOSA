import {Meteor} from 'meteor/meteor'
import { SceneCollection } from './scenes'

Meteor.publish('scenes', function publishScenes(){
    return SceneCollection.find();
})
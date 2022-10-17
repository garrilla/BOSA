import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { DevicesCollection } from '/imports/api/devices';
import { SceneCollection } from '/imports/api/scenes';
import '../imports/api/deviceMethods';
import '../imports/api/oscMethods'
import '../imports/api/devicesPublications'
import '../imports/api/scenesPublication'

function insertDevice({ device, name, usb, status, battery, volume }) {
  DevicesCollection.insert({device, name,  usb, status, battery, volume, createdAt: new Date()});
}

function insertScene({ number, title, current }) {
  SceneCollection.insert({number, title, current, createdAt: new Date()});
}

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  console.log(DevicesCollection.find().count());
  if (DevicesCollection.find().count() === 0) {
    for(i = 1; i <= 10; i++ ){

      let id = '0' + (i).toString();
      id = id.substr(id.length-2, 2);

          insertDevice({
      device: '192.168.60.' + (100 + i),
      name: id,
      usb: '?',
      status: 'not-present',
      battery: '?',
      volume: '?'
    });
    }
  }

    console.log("scenes " + SceneCollection.find().count());
    if (SceneCollection.find().count() === 0) {
      insertScene({number : "0", title: "waiting to start", current: "true", prepping: "false"});
      insertScene({number : "1", title: "Intro Music", current: "false", prepping: "false"});
      insertScene({number : "2", title: "Train Station", current: "false", prepping: "false"});
      insertScene({number : "3", title: "Music station > care home ", current: "false", prepping: "false"});
      insertScene({number : "4", title: "Care Home", current: "false", prepping: "false"});
      insertScene({number : "5", title: "Music care home > supermarket", current: "false", prepping: "false"});
      insertScene({number : "6", title: "Supermarket", current: "false", prepping: "false"});
      insertScene({number : "7", title: "Music supermarket > market", current: "false", prepping: "false"});
      insertScene({number : "8", title: "Market", current: "false", prepping: "false"});
      insertScene({number : "9", title: "Music market > garden", current: "false", prepping: "false"});
      insertScene({number : "10", title: "Garden", current: "false", prepping: "false"});
      insertScene({number : "11", title: "Music garden > home", current: "false", prepping: "false"});
      insertScene({number : "12", title: "Home", current: "false", prepping: "false"});
      insertScene({number : "13", title: "Outro Music", current: "false", prepping: "false"});
    } 


});

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';
import '/imports/api/deviceMethods';
import '/imports/api/messagesMethods';
import OSC from 'osc-js';


Meteor.startup(() => {
  render(<App/>, document.getElementById('react-target'));
  Meteor.subscribe('devices');
  Meteor.subscribe('messages');
  Meteor.call('resetAllDevices',"fGXsSmgrB434Hsgaz","awesome");
});

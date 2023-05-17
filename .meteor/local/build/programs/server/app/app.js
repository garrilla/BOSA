var require = meteorInstall({"imports":{"api":{"deviceMethods.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/deviceMethods.js                                                                                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 0);
let messageTransform;
module.link("osc-min/lib/osc-utilities", {
  messageTransform(v) {
    messageTransform = v;
  }

}, 1);
let DevicesCollection;
module.link("./devices", {
  DevicesCollection(v) {
    DevicesCollection = v;
  }

}, 2);
let SceneCollection;
module.link("./scenes", {
  SceneCollection(v) {
    SceneCollection = v;
  }

}, 3);
let MsgsCollection;
module.link("./messages", {
  MsgsCollection(v) {
    MsgsCollection = v;
  }

}, 4);
Meteor.methods({
  deviceUpdate(data) {
    console.log('updating device: ' + data.deviceID + "\n [usb: " + data.usb + "; Status: " + data.status + "; Power: " + data.battery + "; Volume: " + data.volume + "]"); //console.log(DevicesCollection.find().count())
    //check(deviceID, String);
    //check(status, String);

    entity = DevicesCollection.findOne({
      "device": data.deviceID
    }); //console.log(entity);

    DevicesCollection.update(entity._id, {
      $set: {
        "status": data.status,
        "usb": data.usb,
        "battery": data.battery,
        "volume": data.volume
      }
    });
    let msg = 'device-' + data.deviceID.substr(12) + ' updated with status: ' + data.status + ' & usb: ' + data.usb;
    MsgsCollection.insert({
      msg: msg,
      time: Date.now(),
      msg_id: MsgsCollection.find().count() + 1
    });
    console.log(msg); //Meteor.call('msg', {msg: msg});

    return {
      "id": entity._id,
      "status": "sucess"
    };
  },

  testMethod(data) {
    ip = '192.168.60.101';
    if (ip == data.deviceID) console.log(data);
    s = SceneCollection.findOne({
      "current": "true"
    }); //console.log(s);

    SceneCollection.update(s._id, {
      $set: {
        "current": "false"
      }
    });
    s = SceneCollection.findOne({
      number: data.current
    }); //console.log(s);

    SceneCollection.update(s._id, {
      $set: {
        "current": "true",
        "prepping": data.warning
      }
    });
  },

  resetDevice(data) {
    entity = DevicesCollection.findOne({
      "device": data.deviceID
    }); //console.log(entity);

    DevicesCollection.update(entity._id, {
      $set: {
        "status": "waiting",
        "usb": data.usb,
        "battery": data.battery,
        "volume": data.volume
      }
    });
    let msg = 'device-' + data.deviceID.substr(12) + ' reset with status: ' + data.status;
    MsgsCollection.insert({
      msg: msg,
      time: Date.now(),
      msg_id: MsgsCollection.find().count() + 1
    });
    console.log(msg);
    return {
      "id": entity._id,
      "status": "sucess"
    };
  },

  closeDevice(data) {
    /*
    GH: not sure if ever called
    */
    //console.log("quitting" + data.deviceID);
    entity = DevicesCollection.findOne({
      "device": data.deviceID
    }); //console.log(entity);

    DevicesCollection.update(entity._id, {
      $set: {
        "status": "not-present",
        "usb": "?",
        "battery": "?",
        "volume": "?"
      }
    }); //console.log(data.deviceID + ' quit ');

    let msg = 'device-' + data.deviceID.substr(12) + ' app was closed.';
    MsgsCollection.insert({
      msg: msg,
      time: Date.now(),
      msg_id: MsgsCollection.find().count() + 1
    });
    console.log(msg);
    return {
      "id": entity._id,
      "status": "sucess"
    };
  },

  resetAllDevices(data) {
    Meteor.call('rewindOSC'); //entity = DevicesCollection.find();
    //console.log(entity);

    DevicesCollection.update({}, {
      $set: {
        "status": "reset",
        "usb": "null",
        "battery": "null",
        "volume": "null"
      }
    }, {
      multi: true
    }); //    clear messages

    MsgsCollection.remove({}); //console.log("All devices were reset.");

    let msg = "All devices in database were reset.";
    MsgsCollection.insert({
      msg: msg,
      time: Date.now(),
      msg_id: MsgsCollection.find().count() + 1
    });
    console.log(msg);
  }

}); // Meteor.methods('new-test', function(){
//     console.log('new test');
// }, {
//     url: 'new-test'
// })
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"devices.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/devices.js                                                                                            //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({
  DevicesCollection: () => DevicesCollection
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const DevicesCollection = new Mongo.Collection('newdevices');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"devicesPublications.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/devicesPublications.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let DevicesCollection;
module.link("./devices", {
  DevicesCollection(v) {
    DevicesCollection = v;
  }

}, 1);
Meteor.publish('devices', function publishDevices() {
  return DevicesCollection.find();
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"links.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/links.js                                                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({
  LinksCollection: () => LinksCollection
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const LinksCollection = new Mongo.Collection('links');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"messages.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/messages.js                                                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({
  MsgsCollection: () => MsgsCollection
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const MsgsCollection = new Mongo.Collection('messages');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"messagesPublication.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/messagesPublication.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let MsgsCollection;
module.link("./messages", {
  MsgsCollection(v) {
    MsgsCollection = v;
  }

}, 1);
Meteor.publish('messages', function publishMessages() {
  return MsgsCollection.find();
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"oscMethods.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/oscMethods.js                                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let osc;
module.link("osc-min", {
  default(v) {
    osc = v;
  }

}, 0);
let dgram;
module.link("dgram", {
  default(v) {
    dgram = v;
  }

}, 1);
let messageTransform;
module.link("osc-min/lib/osc-utilities", {
  messageTransform(v) {
    messageTransform = v;
  }

}, 2);
let MsgsCollection;
module.link("./messages", {
  MsgsCollection(v) {
    MsgsCollection = v;
  }

}, 3);
Meteor.methods({
  sendOSC() {
    if (Meteor.isServer) {
      const options = {
        type: 'udp4',
        send: {
          host: '192.168.60.54',
          port: 8000
        }
      };
      udp = dgram.createSocket(options.type);
      var message = {
        address: "/play",
        args: [{
          type: "integer",
          value: 1
        }]
      }; //sendMsg = function(msg){

      var buf;
      buf = osc.toBuffer(message);
      udp.send(buf, 0, buf.length, options.send.port, options.send.host); //}

      let msg = "Play message broadcast to OSC.";
      MsgsCollection.insert({
        msg: msg,
        time: Date.now(),
        msg_id: MsgsCollection.find().count() + 1
      });
      console.log(msg); // var wtf = sendMsg(message);

      return {
        "status": "Message sent"
      };
    }

    if (Meteor.isClient) {
      console.log('The sendOSC function was run on the server');
    }
  },

  endPerfOSC() {
    if (Meteor.isServer) {
      const options = {
        type: 'udp4',
        send: {
          host: '192.168.60.54',
          port: 8000
        }
      };
      udp = dgram.createSocket(options.type); // STOP

      var message = {
        address: "/stop",
        args: [{
          type: "integer",
          value: 1
        }]
      };
      var buf;
      buf = osc.toBuffer(message);
      udp.send(buf, 0, buf.length, options.send.port, options.send.host); // GOTO MARKER

      var stopMarkerMessage = {
        address: "/marker",
        args: [{
          type: "integer",
          value: 2
        }]
      };
      var buf;
      buf = osc.toBuffer(stopMarkerMessage);
      udp.send(buf, 0, buf.length, options.send.port, options.send.host); // REWIND TO START

      var returnMessage = {
        //address: "/frames/str",
        address: "/time/str",
        args: [{
          type: "string",
          value: "0"
        }]
      };
      var buf;
      buf = osc.toBuffer(returnMessage); //udp.send(buf, 0, buf.length, options.send.port, options.send.host);

      let msg = "Stop Performance message sent OSC";
      MsgsCollection.insert({
        msg: msg,
        time: Date.now(),
        msg_id: MsgsCollection.find().count() + 1
      });
      console.log(msg); // var wtf = sendMsg(message);

      return {
        "status": "endPerfOSC Message sent"
      };
    }
  },

  rewindOSC() {
    if (Meteor.isServer) {
      const options = {
        type: 'udp4',
        send: {
          host: '192.168.60.54',
          port: 8000
        }
      };
      udp = dgram.createSocket(options.type); // REWIND TO START

      var returnMessage = {
        //address: "/frames/str",
        address: "/time/str",
        args: [{
          type: "string",
          value: "0"
        }]
      };
      var buf;
      buf = osc.toBuffer(returnMessage);
      udp.send(buf, 0, buf.length, options.send.port, options.send.host); // var wtf = sendMsg(message);

      return {
        "status": "endPerfOSC Message sent"
      };
    }

    if (Meteor.isClient) {
      console.log('The endPerfOSC function was run on the server');
    }
  }

}); //Meteor.call('devices.update',"fGXsSmgrB434Hszgq","awtirednessesome");

/*

        const options = {
            type: 'udp4',
            send: {
            host: '192.168.178.22',
            port: 8000
            }
        }
        udp = dgram.createSocket(options.type);
        
        var message = {
            address: "/play",
            args: [1]
          };
        
        //sendMsg = function(msg){
            var buf;
            buf = osc.toBuffer(msg)
            udp.send(buf, 0, buf.length, options.send.port, options.send.host);
          //}
        

          
         // var wtf = sendMsg(message);

          return {"status":"Message sent"};
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"scenes.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/scenes.js                                                                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({
  SceneCollection: () => SceneCollection
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const SceneCollection = new Mongo.Collection('scenes');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"scenesPublication.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/scenesPublication.js                                                                                  //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SceneCollection;
module.link("./scenes", {
  SceneCollection(v) {
    SceneCollection = v;
  }

}, 1);
Meteor.publish('scenes', function publishScenes() {
  return SceneCollection.find();
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"main.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// server/main.js                                                                                                    //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let LinksCollection;
module.link("/imports/api/links", {
  LinksCollection(v) {
    LinksCollection = v;
  }

}, 1);
let DevicesCollection;
module.link("/imports/api/devices", {
  DevicesCollection(v) {
    DevicesCollection = v;
  }

}, 2);
let SceneCollection;
module.link("/imports/api/scenes", {
  SceneCollection(v) {
    SceneCollection = v;
  }

}, 3);
let MsgsCollection;
module.link("/imports/api/scenes", {
  MsgsCollection(v) {
    MsgsCollection = v;
  }

}, 4);
module.link("../imports/api/deviceMethods");
module.link("../imports/api/oscMethods");
module.link("../imports/api/devicesPublications");
module.link("../imports/api/scenesPublication");
module.link("../imports/api/messagesPublication");

function insertDevice(_ref) {
  let {
    device,
    name,
    usb,
    status,
    battery,
    volume
  } = _ref;
  DevicesCollection.insert({
    device,
    name,
    usb,
    status,
    battery,
    volume,
    createdAt: new Date()
  });
}

function insertScene(_ref2) {
  let {
    number,
    title,
    current
  } = _ref2;
  SceneCollection.insert({
    number,
    title,
    current,
    createdAt: new Date()
  });
}

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  console.log(DevicesCollection.find().count());

  if (DevicesCollection.find().count() === 0) {
    for (i = 1; i <= 10; i++) {
      let id = '0' + i.toString();
      id = id.substr(id.length - 2, 2);
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
    insertScene({
      number: "0",
      title: "waiting to start",
      current: "true",
      prepping: "false"
    });
    insertScene({
      number: "1",
      title: "Intro Music",
      current: "false",
      prepping: "false"
    });
    insertScene({
      number: "2",
      title: "Train Station",
      current: "false",
      prepping: "false"
    });
    insertScene({
      number: "3",
      title: "Music station > care home ",
      current: "false",
      prepping: "false"
    });
    insertScene({
      number: "4",
      title: "Care Home",
      current: "false",
      prepping: "false"
    });
    insertScene({
      number: "5",
      title: "Music care home > supermarket",
      current: "false",
      prepping: "false"
    });
    insertScene({
      number: "6",
      title: "Supermarket",
      current: "false",
      prepping: "false"
    });
    insertScene({
      number: "7",
      title: "Music supermarket > market",
      current: "false",
      prepping: "false"
    });
    insertScene({
      number: "8",
      title: "Market",
      current: "false",
      prepping: "false"
    });
    insertScene({
      number: "9",
      title: "Music market > garden",
      current: "false",
      prepping: "false"
    });
    insertScene({
      number: "10",
      title: "Garden",
      current: "false",
      prepping: "false"
    });
    insertScene({
      number: "11",
      title: "Music garden > home",
      current: "false",
      prepping: "false"
    });
    insertScene({
      number: "12",
      title: "Home",
      current: "false",
      prepping: "false"
    });
    insertScene({
      number: "13",
      title: "Outro Music",
      current: "false",
      prepping: "false"
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".ts",
    ".mjs",
    ".jsx"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvZGV2aWNlTWV0aG9kcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvZGV2aWNlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvZGV2aWNlc1B1YmxpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvbGlua3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL21lc3NhZ2VzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9tZXNzYWdlc1B1YmxpY2F0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9vc2NNZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9zY2VuZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3NjZW5lc1B1YmxpY2F0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJjaGVjayIsIm1vZHVsZSIsImxpbmsiLCJ2IiwibWVzc2FnZVRyYW5zZm9ybSIsIkRldmljZXNDb2xsZWN0aW9uIiwiU2NlbmVDb2xsZWN0aW9uIiwiTXNnc0NvbGxlY3Rpb24iLCJNZXRlb3IiLCJtZXRob2RzIiwiZGV2aWNlVXBkYXRlIiwiZGF0YSIsImNvbnNvbGUiLCJsb2ciLCJkZXZpY2VJRCIsInVzYiIsInN0YXR1cyIsImJhdHRlcnkiLCJ2b2x1bWUiLCJlbnRpdHkiLCJmaW5kT25lIiwidXBkYXRlIiwiX2lkIiwiJHNldCIsIm1zZyIsInN1YnN0ciIsImluc2VydCIsInRpbWUiLCJEYXRlIiwibm93IiwibXNnX2lkIiwiZmluZCIsImNvdW50IiwidGVzdE1ldGhvZCIsImlwIiwicyIsIm51bWJlciIsImN1cnJlbnQiLCJ3YXJuaW5nIiwicmVzZXREZXZpY2UiLCJjbG9zZURldmljZSIsInJlc2V0QWxsRGV2aWNlcyIsImNhbGwiLCJtdWx0aSIsInJlbW92ZSIsImV4cG9ydCIsIk1vbmdvIiwiQ29sbGVjdGlvbiIsInB1Ymxpc2giLCJwdWJsaXNoRGV2aWNlcyIsIkxpbmtzQ29sbGVjdGlvbiIsInB1Ymxpc2hNZXNzYWdlcyIsIm9zYyIsImRlZmF1bHQiLCJkZ3JhbSIsInNlbmRPU0MiLCJpc1NlcnZlciIsIm9wdGlvbnMiLCJ0eXBlIiwic2VuZCIsImhvc3QiLCJwb3J0IiwidWRwIiwiY3JlYXRlU29ja2V0IiwibWVzc2FnZSIsImFkZHJlc3MiLCJhcmdzIiwidmFsdWUiLCJidWYiLCJ0b0J1ZmZlciIsImxlbmd0aCIsImlzQ2xpZW50IiwiZW5kUGVyZk9TQyIsInN0b3BNYXJrZXJNZXNzYWdlIiwicmV0dXJuTWVzc2FnZSIsInJld2luZE9TQyIsInB1Ymxpc2hTY2VuZXMiLCJpbnNlcnREZXZpY2UiLCJkZXZpY2UiLCJuYW1lIiwiY3JlYXRlZEF0IiwiaW5zZXJ0U2NlbmUiLCJ0aXRsZSIsInN0YXJ0dXAiLCJpIiwiaWQiLCJ0b1N0cmluZyIsInByZXBwaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLEtBQUo7QUFBVUMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRixPQUFLLENBQUNHLENBQUQsRUFBRztBQUFDSCxTQUFLLEdBQUNHLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFBa0QsSUFBSUMsZ0JBQUo7QUFBcUJILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJCQUFaLEVBQXdDO0FBQUNFLGtCQUFnQixDQUFDRCxDQUFELEVBQUc7QUFBQ0Msb0JBQWdCLEdBQUNELENBQWpCO0FBQW1COztBQUF4QyxDQUF4QyxFQUFrRixDQUFsRjtBQUFxRixJQUFJRSxpQkFBSjtBQUFzQkosTUFBTSxDQUFDQyxJQUFQLENBQVksV0FBWixFQUF3QjtBQUFDRyxtQkFBaUIsQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLHFCQUFpQixHQUFDRixDQUFsQjtBQUFvQjs7QUFBMUMsQ0FBeEIs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QUFBd0RrRCxjQUFRLEVBQUU7QUFBbEUsS0FBRCxDQUFYO0FBQ0Q7QUFHSixDQXZDRCxFIiwiZmlsZSI6Ii9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjaydcclxuaW1wb3J0IHsgbWVzc2FnZVRyYW5zZm9ybSB9IGZyb20gJ29zYy1taW4vbGliL29zYy11dGlsaXRpZXMnXHJcbmltcG9ydCB7IERldmljZXNDb2xsZWN0aW9uIH0gZnJvbSAnLi9kZXZpY2VzJ1xyXG5pbXBvcnQge1NjZW5lQ29sbGVjdGlvbn0gZnJvbSAnLi9zY2VuZXMnXHJcbmltcG9ydCB7TXNnc0NvbGxlY3Rpb259IGZyb20gJy4vbWVzc2FnZXMnXHJcblxyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgICBkZXZpY2VVcGRhdGUoZGF0YSl7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0aW5nIGRldmljZTogJyArIGRhdGEuZGV2aWNlSURcclxuICAgICAgICArIFwiXFxuIFt1c2I6IFwiICsgZGF0YS51c2JcclxuICAgICAgICArIFwiOyBTdGF0dXM6IFwiICsgZGF0YS5zdGF0dXNcclxuICAgICAgICArIFwiOyBQb3dlcjogXCIgKyBkYXRhLmJhdHRlcnlcclxuICAgICAgICArIFwiOyBWb2x1bWU6IFwiICsgZGF0YS52b2x1bWUgK1wiXVwiKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKERldmljZXNDb2xsZWN0aW9uLmZpbmQoKS5jb3VudCgpKVxyXG4gICAgICAgIC8vY2hlY2soZGV2aWNlSUQsIFN0cmluZyk7XHJcbiAgICAgICAgLy9jaGVjayhzdGF0dXMsIFN0cmluZyk7XHJcbiAgICAgICAgZW50aXR5ID0gRGV2aWNlc0NvbGxlY3Rpb24uZmluZE9uZSh7XCJkZXZpY2VcIjpkYXRhLmRldmljZUlEfSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhlbnRpdHkpO1xyXG4gICAgICAgIERldmljZXNDb2xsZWN0aW9uLnVwZGF0ZShlbnRpdHkuX2lkLCBcclxuICAgICAgICAgICAgeyRzZXQ6IHtcInN0YXR1c1wiIDogZGF0YS5zdGF0dXMsIFxyXG4gICAgICAgICAgICAgICAgICAgIFwidXNiXCIgOiBkYXRhLnVzYixcclxuICAgICAgICAgICAgICAgICAgICBcImJhdHRlcnlcIiA6IGRhdGEuYmF0dGVyeSxcclxuICAgICAgICAgICAgICAgICAgICBcInZvbHVtZVwiIDogZGF0YS52b2x1bWVcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG1zZyA9ICdkZXZpY2UtJyArIGRhdGEuZGV2aWNlSUQuc3Vic3RyKDEyKVxyXG4gICAgICAgICArICcgdXBkYXRlZCB3aXRoIHN0YXR1czogJyArIGRhdGEuc3RhdHVzXHJcbiAgICAgICAgICsgJyAmIHVzYjogJyArIGRhdGEudXNiO1xyXG4gICAgICAgIE1zZ3NDb2xsZWN0aW9uLmluc2VydCh7bXNnOiBtc2csIHRpbWU6IERhdGUubm93KCksIG1zZ19pZDogTXNnc0NvbGxlY3Rpb24uZmluZCgpLmNvdW50KCkrMX0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XHJcbiAgICAgICAgLy9NZXRlb3IuY2FsbCgnbXNnJywge21zZzogbXNnfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XCJpZFwiOmVudGl0eS5faWQsXHJcbiAgICAgICAgICAgICAgICBcInN0YXR1c1wiOlwic3VjZXNzXCJcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgdGVzdE1ldGhvZChkYXRhKXtcclxuICAgICAgICBpcCA9ICcxOTIuMTY4LjYwLjEwMSc7XHJcbiAgICAgICAgaWYoaXAgPT0gZGF0YS5kZXZpY2VJRClcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICBzID0gU2NlbmVDb2xsZWN0aW9uLmZpbmRPbmUoe1wiY3VycmVudFwiOiBcInRydWVcIn0pO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cocyk7XHJcbiAgICAgICAgU2NlbmVDb2xsZWN0aW9uLnVwZGF0ZShzLl9pZCxcclxuICAgICAgICAgICAgeyRzZXQ6IHtcImN1cnJlbnRcIjogXCJmYWxzZVwiXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHMgPSBTY2VuZUNvbGxlY3Rpb24uZmluZE9uZSh7bnVtYmVyOiBkYXRhLmN1cnJlbnR9KTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHMpO1xyXG4gICAgICAgIFNjZW5lQ29sbGVjdGlvbi51cGRhdGUocy5faWQsXHJcbiAgICAgICAgICAgICAgICB7JHNldDoge1wiY3VycmVudFwiOiBcInRydWVcIiwgXCJwcmVwcGluZ1wiIDogZGF0YS53YXJuaW5nfX1cclxuICAgICAgICAgICAgKTtcclxuICAgIH0sXHJcbiAgICByZXNldERldmljZShkYXRhKXtcclxuICAgICAgICBlbnRpdHkgPSBEZXZpY2VzQ29sbGVjdGlvbi5maW5kT25lKHtcImRldmljZVwiOmRhdGEuZGV2aWNlSUR9KTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGVudGl0eSk7XHJcbiAgICAgICAgRGV2aWNlc0NvbGxlY3Rpb24udXBkYXRlKGVudGl0eS5faWQsIFxyXG4gICAgICAgICAgICB7JHNldDoge1wic3RhdHVzXCIgOiBcIndhaXRpbmdcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1c2JcIiA6IGRhdGEudXNiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYmF0dGVyeVwiIDogZGF0YS5iYXR0ZXJ5LFxyXG4gICAgICAgICAgICAgICAgICAgIFwidm9sdW1lXCIgOiBkYXRhLnZvbHVtZVxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICBsZXQgbXNnID0gJ2RldmljZS0nICsgZGF0YS5kZXZpY2VJRC5zdWJzdHIoMTIpICsgJyByZXNldCB3aXRoIHN0YXR1czogJyArIGRhdGEuc3RhdHVzO1xyXG4gICAgICAgIE1zZ3NDb2xsZWN0aW9uLmluc2VydCh7bXNnOiBtc2csIHRpbWU6IERhdGUubm93KCksIG1zZ19pZDogTXNnc0NvbGxlY3Rpb24uZmluZCgpLmNvdW50KCkrMX0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XCJpZFwiOmVudGl0eS5faWQsXHJcbiAgICAgICAgICAgICAgICBcInN0YXR1c1wiOlwic3VjZXNzXCJcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgY2xvc2VEZXZpY2UoZGF0YSl7XHJcbiAgICAgICAgLypcclxuICAgICAgICBHSDogbm90IHN1cmUgaWYgZXZlciBjYWxsZWRcclxuICAgICAgICAqLyBcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwicXVpdHRpbmdcIiArIGRhdGEuZGV2aWNlSUQpO1xyXG4gICAgICAgIGVudGl0eSA9IERldmljZXNDb2xsZWN0aW9uLmZpbmRPbmUoe1wiZGV2aWNlXCI6ZGF0YS5kZXZpY2VJRH0pO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coZW50aXR5KTtcclxuICAgICAgICBEZXZpY2VzQ29sbGVjdGlvbi51cGRhdGUoZW50aXR5Ll9pZCwgXHJcbiAgICAgICAgICAgIHskc2V0OiB7XCJzdGF0dXNcIiA6IFwibm90LXByZXNlbnRcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1c2JcIiA6IFwiP1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYmF0dGVyeVwiIDogXCI/XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ2b2x1bWVcIiA6IFwiP1wiXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coZGF0YS5kZXZpY2VJRCArICcgcXVpdCAnKTtcclxuICAgICAgICBsZXQgbXNnID0gJ2RldmljZS0nICsgZGF0YS5kZXZpY2VJRC5zdWJzdHIoMTIpICsgJyBhcHAgd2FzIGNsb3NlZC4nO1xyXG4gICAgICAgIE1zZ3NDb2xsZWN0aW9uLmluc2VydCh7bXNnOiBtc2csIHRpbWU6IERhdGUubm93KCksIG1zZ19pZDogTXNnc0NvbGxlY3Rpb24uZmluZCgpLmNvdW50KCkrMX0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XCJpZFwiOmVudGl0eS5faWQsXHJcbiAgICAgICAgICAgICAgICBcInN0YXR1c1wiOlwic3VjZXNzXCJcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICByZXNldEFsbERldmljZXMoZGF0YSl7XHJcblxyXG4gICAgICAgIE1ldGVvci5jYWxsKCdyZXdpbmRPU0MnKTtcclxuICAgICAgICAvL2VudGl0eSA9IERldmljZXNDb2xsZWN0aW9uLmZpbmQoKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGVudGl0eSk7XHJcbiAgICAgICAgRGV2aWNlc0NvbGxlY3Rpb24udXBkYXRlKHt9LCBcclxuICAgICAgICAgICAgeyRzZXQ6IHtcInN0YXR1c1wiIDogXCJyZXNldFwiLCBcclxuICAgICAgICAgICAgICAgICAgICBcInVzYlwiIDogXCJudWxsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJiYXR0ZXJ5XCIgOiBcIm51bGxcIixcclxuICAgICAgICAgICAgICAgICAgICBcInZvbHVtZVwiIDogXCJudWxsXCJcclxuICAgICAgICAgICAgICAgIH19LFxyXG4gICAgICAgICAgICAgICAge211bHRpOiB0cnVlfVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIC8vICAgIGNsZWFyIG1lc3NhZ2VzXHJcbiAgICAgICAgTXNnc0NvbGxlY3Rpb24ucmVtb3ZlKHt9KTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQWxsIGRldmljZXMgd2VyZSByZXNldC5cIik7XHJcbiAgICAgICAgbGV0IG1zZyA9IFwiQWxsIGRldmljZXMgaW4gZGF0YWJhc2Ugd2VyZSByZXNldC5cIjtcclxuICAgICAgICBNc2dzQ29sbGVjdGlvbi5pbnNlcnQoe21zZzogbXNnLCB0aW1lOiBEYXRlLm5vdygpLCBtc2dfaWQ6IE1zZ3NDb2xsZWN0aW9uLmZpbmQoKS5jb3VudCgpKzF9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xyXG4gICAgfVxyXG59KVxyXG5cclxuLy8gTWV0ZW9yLm1ldGhvZHMoJ25ldy10ZXN0JywgZnVuY3Rpb24oKXtcclxuLy8gICAgIGNvbnNvbGUubG9nKCduZXcgdGVzdCcpO1xyXG4vLyB9LCB7XHJcbi8vICAgICB1cmw6ICduZXctdGVzdCdcclxuLy8gfSkiLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XHJcblxyXG5leHBvcnQgY29uc3QgRGV2aWNlc0NvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignbmV3ZGV2aWNlcycpO1xyXG4iLCJpbXBvcnQge01ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcidcclxuaW1wb3J0IHsgRGV2aWNlc0NvbGxlY3Rpb24gfSBmcm9tICcuL2RldmljZXMnXHJcblxyXG5NZXRlb3IucHVibGlzaCgnZGV2aWNlcycsIGZ1bmN0aW9uIHB1Ymxpc2hEZXZpY2VzKCl7XHJcbiAgICByZXR1cm4gRGV2aWNlc0NvbGxlY3Rpb24uZmluZCgpO1xyXG59KVxyXG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XHJcblxyXG5leHBvcnQgY29uc3QgTGlua3NDb2xsZWN0aW9uID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2xpbmtzJyk7XHJcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcclxuXHJcbmV4cG9ydCBjb25zdCBNc2dzQ29sbGVjdGlvbiA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdtZXNzYWdlcycpOyIsImltcG9ydCB7TWV0ZW9yfSBmcm9tICdtZXRlb3IvbWV0ZW9yJ1xyXG5pbXBvcnQgeyBNc2dzQ29sbGVjdGlvbiB9IGZyb20gJy4vbWVzc2FnZXMnXHJcblxyXG5NZXRlb3IucHVibGlzaCgnbWVzc2FnZXMnLCBmdW5jdGlvbiBwdWJsaXNoTWVzc2FnZXMoKXtcclxuICAgIHJldHVybiBNc2dzQ29sbGVjdGlvbi5maW5kKCk7XHJcbn0pIiwiaW1wb3J0IG9zYyBmcm9tICdvc2MtbWluJ1xyXG5pbXBvcnQgZGdyYW0gZnJvbSAnZGdyYW0nXHJcbmltcG9ydCB7IG1lc3NhZ2VUcmFuc2Zvcm0gfSBmcm9tICdvc2MtbWluL2xpYi9vc2MtdXRpbGl0aWVzJztcclxuaW1wb3J0IHtNc2dzQ29sbGVjdGlvbn0gZnJvbSAnLi9tZXNzYWdlcydcclxuXHJcblxyXG4gICAgTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICAgICAgIHNlbmRPU0MoKXtcclxuICAgICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcil7XHJcbiAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICd1ZHA0JyxcclxuICAgICAgICAgICAgICAgIHNlbmQ6IHtcclxuICAgICAgICAgICAgICAgIGhvc3Q6ICcxOTIuMTY4LjYwLjU0JyxcclxuICAgICAgICAgICAgICAgIHBvcnQ6IDgwMDBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1ZHAgPSBkZ3JhbS5jcmVhdGVTb2NrZXQob3B0aW9ucy50eXBlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0ge1xyXG4gICAgICAgICAgICAgICAgYWRkcmVzczogXCIvcGxheVwiLFxyXG4gICAgICAgICAgICAgICAgYXJnczogW3t0eXBlOiBcImludGVnZXJcIiwgdmFsdWU6IDF9XVxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL3NlbmRNc2cgPSBmdW5jdGlvbihtc2cpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGJ1ZjtcclxuICAgICAgICAgICAgICAgIGJ1ZiA9IG9zYy50b0J1ZmZlcihtZXNzYWdlKVxyXG4gICAgICAgICAgICAgICAgdWRwLnNlbmQoYnVmLCAwLCBidWYubGVuZ3RoLCBvcHRpb25zLnNlbmQucG9ydCwgb3B0aW9ucy5zZW5kLmhvc3QpO1xyXG4gICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBsZXQgbXNnID0gXCJQbGF5IG1lc3NhZ2UgYnJvYWRjYXN0IHRvIE9TQy5cIjtcclxuICAgICAgICAgICAgICBNc2dzQ29sbGVjdGlvbi5pbnNlcnQoe21zZzogbXNnLCB0aW1lOiBEYXRlLm5vdygpLCBtc2dfaWQ6IE1zZ3NDb2xsZWN0aW9uLmZpbmQoKS5jb3VudCgpKzF9KTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgLy8gdmFyIHd0ZiA9IHNlbmRNc2cobWVzc2FnZSk7XHJcbiAgICBcclxuICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6XCJNZXNzYWdlIHNlbnRcIn07ICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihNZXRlb3IuaXNDbGllbnQpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1RoZSBzZW5kT1NDIGZ1bmN0aW9uIHdhcyBydW4gb24gdGhlIHNlcnZlcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW5kUGVyZk9TQygpe1xyXG4gICAgICAgICAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3VkcDQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBob3N0OiAnMTkyLjE2OC42MC41NCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9ydDogODAwMFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHVkcCA9IGRncmFtLmNyZWF0ZVNvY2tldChvcHRpb25zLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBTVE9QXHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBcIi9zdG9wXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJnczogW3t0eXBlOiBcImludGVnZXJcIiwgdmFsdWU6IDF9XVxyXG4gICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBidWY7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmID0gb3NjLnRvQnVmZmVyKG1lc3NhZ2UpXHJcbiAgICAgICAgICAgICAgICAgICAgdWRwLnNlbmQoYnVmLCAwLCBidWYubGVuZ3RoLCBvcHRpb25zLnNlbmQucG9ydCwgb3B0aW9ucy5zZW5kLmhvc3QpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIC8vIEdPVE8gTUFSS0VSXHJcbiAgICAgICAgICAgICAgICAgIHZhciBzdG9wTWFya2VyTWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBcIi9tYXJrZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBbe3R5cGU6IFwiaW50ZWdlclwiLCB2YWx1ZTogMn1dXHJcbiAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYnVmO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZiA9IG9zYy50b0J1ZmZlcihzdG9wTWFya2VyTWVzc2FnZSlcclxuICAgICAgICAgICAgICAgICAgICB1ZHAuc2VuZChidWYsIDAsIGJ1Zi5sZW5ndGgsIG9wdGlvbnMuc2VuZC5wb3J0LCBvcHRpb25zLnNlbmQuaG9zdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyBSRVdJTkQgVE8gU1RBUlRcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmV0dXJuTWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgIC8vYWRkcmVzczogXCIvZnJhbWVzL3N0clwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogXCIvdGltZS9zdHJcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IFt7dHlwZTogXCJzdHJpbmdcIiwgdmFsdWU6IFwiMFwifV1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgIHZhciBidWY7XHJcbiAgICAgICAgICAgICAgICAgICAgICBidWYgPSBvc2MudG9CdWZmZXIocmV0dXJuTWVzc2FnZSlcclxuICAgICAgICAgICAgICAgICAgICAgIC8vdWRwLnNlbmQoYnVmLCAwLCBidWYubGVuZ3RoLCBvcHRpb25zLnNlbmQucG9ydCwgb3B0aW9ucy5zZW5kLmhvc3QpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIGxldCBtc2cgPSBcIlN0b3AgUGVyZm9ybWFuY2UgbWVzc2FnZSBzZW50IE9TQ1wiO1xyXG4gICAgICAgICAgICAgICAgICBNc2dzQ29sbGVjdGlvbi5pbnNlcnQoe21zZzogbXNnLCB0aW1lOiBEYXRlLm5vdygpLCBtc2dfaWQ6IE1zZ3NDb2xsZWN0aW9uLmZpbmQoKS5jb3VudCgpKzF9KTtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgLy8gdmFyIHd0ZiA9IHNlbmRNc2cobWVzc2FnZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6XCJlbmRQZXJmT1NDIE1lc3NhZ2Ugc2VudFwifTsgIFxyXG4gICAgICAgICAgICB9fSxcclxuICAgICAgICByZXdpbmRPU0MoKXtcclxuICAgICAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcil7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd1ZHA0JyxcclxuICAgICAgICAgICAgICAgICAgICBzZW5kOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaG9zdDogJzE5Mi4xNjguNjAuNTQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvcnQ6IDgwMDBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB1ZHAgPSBkZ3JhbS5jcmVhdGVTb2NrZXQob3B0aW9ucy50eXBlKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gUkVXSU5EIFRPIFNUQVJUXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldHVybk1lc3NhZ2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAvL2FkZHJlc3M6IFwiL2ZyYW1lcy9zdHJcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IFwiL3RpbWUvc3RyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhcmdzOiBbe3R5cGU6IFwic3RyaW5nXCIsIHZhbHVlOiBcIjBcIn1dXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYnVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgYnVmID0gb3NjLnRvQnVmZmVyKHJldHVybk1lc3NhZ2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICB1ZHAuc2VuZChidWYsIDAsIGJ1Zi5sZW5ndGgsIG9wdGlvbnMuc2VuZC5wb3J0LCBvcHRpb25zLnNlbmQuaG9zdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAvLyB2YXIgd3RmID0gc2VuZE1zZyhtZXNzYWdlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjpcImVuZFBlcmZPU0MgTWVzc2FnZSBzZW50XCJ9OyAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoTWV0ZW9yLmlzQ2xpZW50KXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUaGUgZW5kUGVyZk9TQyBmdW5jdGlvbiB3YXMgcnVuIG9uIHRoZSBzZXJ2ZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuXHJcblxyXG4gIC8vTWV0ZW9yLmNhbGwoJ2RldmljZXMudXBkYXRlJyxcImZHWHNTbWdyQjQzNEhzemdxXCIsXCJhd3RpcmVkbmVzc2Vzb21lXCIpO1xyXG4vKlxyXG5cclxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAndWRwNCcsXHJcbiAgICAgICAgICAgIHNlbmQ6IHtcclxuICAgICAgICAgICAgaG9zdDogJzE5Mi4xNjguMTc4LjIyJyxcclxuICAgICAgICAgICAgcG9ydDogODAwMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVkcCA9IGRncmFtLmNyZWF0ZVNvY2tldChvcHRpb25zLnR5cGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBtZXNzYWdlID0ge1xyXG4gICAgICAgICAgICBhZGRyZXNzOiBcIi9wbGF5XCIsXHJcbiAgICAgICAgICAgIGFyZ3M6IFsxXVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICAvL3NlbmRNc2cgPSBmdW5jdGlvbihtc2cpe1xyXG4gICAgICAgICAgICB2YXIgYnVmO1xyXG4gICAgICAgICAgICBidWYgPSBvc2MudG9CdWZmZXIobXNnKVxyXG4gICAgICAgICAgICB1ZHAuc2VuZChidWYsIDAsIGJ1Zi5sZW5ndGgsIG9wdGlvbnMuc2VuZC5wb3J0LCBvcHRpb25zLnNlbmQuaG9zdCk7XHJcbiAgICAgICAgICAvL31cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgICBcclxuICAgICAgICAgLy8gdmFyIHd0ZiA9IHNlbmRNc2cobWVzc2FnZSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOlwiTWVzc2FnZSBzZW50XCJ9O1xyXG4qLyIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcclxuXHJcbmV4cG9ydCBjb25zdCBTY2VuZUNvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignc2NlbmVzJyk7XHJcbiIsImltcG9ydCB7TWV0ZW9yfSBmcm9tICdtZXRlb3IvbWV0ZW9yJ1xyXG5pbXBvcnQgeyBTY2VuZUNvbGxlY3Rpb24gfSBmcm9tICcuL3NjZW5lcydcclxuXHJcbk1ldGVvci5wdWJsaXNoKCdzY2VuZXMnLCBmdW5jdGlvbiBwdWJsaXNoU2NlbmVzKCl7XHJcbiAgICByZXR1cm4gU2NlbmVDb2xsZWN0aW9uLmZpbmQoKTtcclxufSkiLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcclxuaW1wb3J0IHsgTGlua3NDb2xsZWN0aW9uIH0gZnJvbSAnL2ltcG9ydHMvYXBpL2xpbmtzJztcclxuaW1wb3J0IHsgRGV2aWNlc0NvbGxlY3Rpb24gfSBmcm9tICcvaW1wb3J0cy9hcGkvZGV2aWNlcyc7XHJcbmltcG9ydCB7IFNjZW5lQ29sbGVjdGlvbiB9IGZyb20gJy9pbXBvcnRzL2FwaS9zY2VuZXMnO1xyXG5pbXBvcnQgeyBNc2dzQ29sbGVjdGlvbiB9IGZyb20gJy9pbXBvcnRzL2FwaS9zY2VuZXMnO1xyXG5pbXBvcnQgJy4uL2ltcG9ydHMvYXBpL2RldmljZU1ldGhvZHMnO1xyXG5pbXBvcnQgJy4uL2ltcG9ydHMvYXBpL29zY01ldGhvZHMnXHJcbmltcG9ydCAnLi4vaW1wb3J0cy9hcGkvZGV2aWNlc1B1YmxpY2F0aW9ucydcclxuaW1wb3J0ICcuLi9pbXBvcnRzL2FwaS9zY2VuZXNQdWJsaWNhdGlvbidcclxuaW1wb3J0ICcuLi9pbXBvcnRzL2FwaS9tZXNzYWdlc1B1YmxpY2F0aW9uJ1xyXG5cclxuZnVuY3Rpb24gaW5zZXJ0RGV2aWNlKHsgZGV2aWNlLCBuYW1lLCB1c2IsIHN0YXR1cywgYmF0dGVyeSwgdm9sdW1lIH0pIHtcclxuICBEZXZpY2VzQ29sbGVjdGlvbi5pbnNlcnQoe2RldmljZSwgbmFtZSwgIHVzYiwgc3RhdHVzLCBiYXR0ZXJ5LCB2b2x1bWUsIGNyZWF0ZWRBdDogbmV3IERhdGUoKX0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRTY2VuZSh7IG51bWJlciwgdGl0bGUsIGN1cnJlbnQgfSkge1xyXG4gIFNjZW5lQ29sbGVjdGlvbi5pbnNlcnQoe251bWJlciwgdGl0bGUsIGN1cnJlbnQsIGNyZWF0ZWRBdDogbmV3IERhdGUoKX0pO1xyXG59XHJcblxyXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XHJcbiAgLy8gSWYgdGhlIExpbmtzIGNvbGxlY3Rpb24gaXMgZW1wdHksIGFkZCBzb21lIGRhdGEuXHJcbiAgY29uc29sZS5sb2coRGV2aWNlc0NvbGxlY3Rpb24uZmluZCgpLmNvdW50KCkpO1xyXG4gIGlmIChEZXZpY2VzQ29sbGVjdGlvbi5maW5kKCkuY291bnQoKSA9PT0gMCkge1xyXG4gICAgZm9yKGkgPSAxOyBpIDw9IDEwOyBpKysgKXtcclxuXHJcbiAgICAgIGxldCBpZCA9ICcwJyArIChpKS50b1N0cmluZygpO1xyXG4gICAgICBpZCA9IGlkLnN1YnN0cihpZC5sZW5ndGgtMiwgMik7XHJcblxyXG4gICAgICAgICAgaW5zZXJ0RGV2aWNlKHtcclxuICAgICAgZGV2aWNlOiAnMTkyLjE2OC42MC4nICsgKDEwMCArIGkpLFxyXG4gICAgICBuYW1lOiBpZCxcclxuICAgICAgdXNiOiAnPycsXHJcbiAgICAgIHN0YXR1czogJ25vdC1wcmVzZW50JyxcclxuICAgICAgYmF0dGVyeTogJz8nLFxyXG4gICAgICB2b2x1bWU6ICc/J1xyXG4gICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwic2NlbmVzIFwiICsgU2NlbmVDb2xsZWN0aW9uLmZpbmQoKS5jb3VudCgpKTtcclxuICAgIGlmIChTY2VuZUNvbGxlY3Rpb24uZmluZCgpLmNvdW50KCkgPT09IDApIHtcclxuICAgICAgaW5zZXJ0U2NlbmUoe251bWJlciA6IFwiMFwiLCB0aXRsZTogXCJ3YWl0aW5nIHRvIHN0YXJ0XCIsIGN1cnJlbnQ6IFwidHJ1ZVwiLCBwcmVwcGluZzogXCJmYWxzZVwifSk7XHJcbiAgICAgIGluc2VydFNjZW5lKHtudW1iZXIgOiBcIjFcIiwgdGl0bGU6IFwiSW50cm8gTXVzaWNcIiwgY3VycmVudDogXCJmYWxzZVwiLCBwcmVwcGluZzogXCJmYWxzZVwifSk7XHJcbiAgICAgIGluc2VydFNjZW5lKHtudW1iZXIgOiBcIjJcIiwgdGl0bGU6IFwiVHJhaW4gU3RhdGlvblwiLCBjdXJyZW50OiBcImZhbHNlXCIsIHByZXBwaW5nOiBcImZhbHNlXCJ9KTtcclxuICAgICAgaW5zZXJ0U2NlbmUoe251bWJlciA6IFwiM1wiLCB0aXRsZTogXCJNdXNpYyBzdGF0aW9uID4gY2FyZSBob21lIFwiLCBjdXJyZW50OiBcImZhbHNlXCIsIHByZXBwaW5nOiBcImZhbHNlXCJ9KTtcclxuICAgICAgaW5zZXJ0U2NlbmUoe251bWJlciA6IFwiNFwiLCB0aXRsZTogXCJDYXJlIEhvbWVcIiwgY3VycmVudDogXCJmYWxzZVwiLCBwcmVwcGluZzogXCJmYWxzZVwifSk7XHJcbiAgICAgIGluc2VydFNjZW5lKHtudW1iZXIgOiBcIjVcIiwgdGl0bGU6IFwiTXVzaWMgY2FyZSBob21lID4gc3VwZXJtYXJrZXRcIiwgY3VycmVudDogXCJmYWxzZVwiLCBwcmVwcGluZzogXCJmYWxzZVwifSk7XHJcbiAgICAgIGluc2VydFNjZW5lKHtudW1iZXIgOiBcIjZcIiwgdGl0bGU6IFwiU3VwZXJtYXJrZXRcIiwgY3VycmVudDogXCJmYWxzZVwiLCBwcmVwcGluZzogXCJmYWxzZVwifSk7XHJcbiAgICAgIGluc2VydFNjZW5lKHtudW1iZXIgOiBcIjdcIiwgdGl0bGU6IFwiTXVzaWMgc3VwZXJtYXJrZXQgPiBtYXJrZXRcIiwgY3VycmVudDogXCJmYWxzZVwiLCBwcmVwcGluZzogXCJmYWxzZVwifSk7XHJcbiAgICAgIGluc2VydFNjZW5lKHtudW1iZXIgOiBcIjhcIiwgdGl0bGU6IFwiTWFya2V0XCIsIGN1cnJlbnQ6IFwiZmFsc2VcIiwgcHJlcHBpbmc6IFwiZmFsc2VcIn0pO1xyXG4gICAgICBpbnNlcnRTY2VuZSh7bnVtYmVyIDogXCI5XCIsIHRpdGxlOiBcIk11c2ljIG1hcmtldCA+IGdhcmRlblwiLCBjdXJyZW50OiBcImZhbHNlXCIsIHByZXBwaW5nOiBcImZhbHNlXCJ9KTtcclxuICAgICAgaW5zZXJ0U2NlbmUoe251bWJlciA6IFwiMTBcIiwgdGl0bGU6IFwiR2FyZGVuXCIsIGN1cnJlbnQ6IFwiZmFsc2VcIiwgcHJlcHBpbmc6IFwiZmFsc2VcIn0pO1xyXG4gICAgICBpbnNlcnRTY2VuZSh7bnVtYmVyIDogXCIxMVwiLCB0aXRsZTogXCJNdXNpYyBnYXJkZW4gPiBob21lXCIsIGN1cnJlbnQ6IFwiZmFsc2VcIiwgcHJlcHBpbmc6IFwiZmFsc2VcIn0pO1xyXG4gICAgICBpbnNlcnRTY2VuZSh7bnVtYmVyIDogXCIxMlwiLCB0aXRsZTogXCJIb21lXCIsIGN1cnJlbnQ6IFwiZmFsc2VcIiwgcHJlcHBpbmc6IFwiZmFsc2VcIn0pO1xyXG4gICAgICBpbnNlcnRTY2VuZSh7bnVtYmVyIDogXCIxM1wiLCB0aXRsZTogXCJPdXRybyBNdXNpY1wiLCBjdXJyZW50OiBcImZhbHNlXCIsIHByZXBwaW5nOiBcImZhbHNlXCJ9KTtcclxuICAgIH0gXHJcblxyXG5cclxufSk7XHJcbiJdfQ==

var require = meteorInstall({"imports":{"api":{"deviceMethods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/deviceMethods.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  let check;
  module1.link("meteor/check", {
    check(v) {
      check = v;
    }

  }, 0);
  let messageTransform;
  module1.link("osc-min/lib/osc-utilities", {
    messageTransform(v) {
      messageTransform = v;
    }

  }, 1);
  let DevicesCollection;
  module1.link("./devices", {
    DevicesCollection(v) {
      DevicesCollection = v;
    }

  }, 2);
  let SceneCollection;
  module1.link("./scenes", {
    SceneCollection(v) {
      SceneCollection = v;
    }

  }, 3);
  let MsgsCollection;
  module1.link("./messages", {
    MsgsCollection(v) {
      MsgsCollection = v;
    }

  }, 4);

  ___INIT_METEOR_FAST_REFRESH(module);

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
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"devices.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/devices.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  module1.export({
    DevicesCollection: () => DevicesCollection
  });
  let Mongo;
  module1.link("meteor/mongo", {
    Mongo(v) {
      Mongo = v;
    }

  }, 0);

  ___INIT_METEOR_FAST_REFRESH(module);

  const DevicesCollection = new Mongo.Collection('newdevices');
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"messages.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/messages.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  module1.export({
    MsgsCollection: () => MsgsCollection
  });
  let Mongo;
  module1.link("meteor/mongo", {
    Mongo(v) {
      Mongo = v;
    }

  }, 0);

  ___INIT_METEOR_FAST_REFRESH(module);

  const MsgsCollection = new Mongo.Collection('messages');
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"messagesMethods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/messagesMethods.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  let check;
  module1.link("meteor/check", {
    check(v) {
      check = v;
    }

  }, 0);
  let messageTransform;
  module1.link("osc-min/lib/osc-utilities", {
    messageTransform(v) {
      messageTransform = v;
    }

  }, 1);
  let MsgsCollection;
  module1.link("./messages", {
    MsgsCollection(v) {
      MsgsCollection = v;
    }

  }, 2);
  let SceneCollection;
  module1.link("./scenes", {
    SceneCollection(v) {
      SceneCollection = v;
    }

  }, 3);

  ___INIT_METEOR_FAST_REFRESH(module);

  Meteor.methods({
    msgUpdate(data) {
      console.log('msg recived: ' + data.msg);
      MsgsCollection.insert({
        msg: entity._id
      });
      console.log('inserted msg to collection: ' + data.msg);
      return {
        "msg:": data.msg,
        "status": "sucess"
      };
    },

    msg(stg) {
      console.log(stg);
    }

  });
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"oscMethods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/oscMethods.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  let osc;
  module1.link("osc-min", {
    default(v) {
      osc = v;
    }

  }, 0);
  let dgram;
  module1.link("dgram", {
    default(v) {
      dgram = v;
    }

  }, 1);
  let messageTransform;
  module1.link("osc-min/lib/osc-utilities", {
    messageTransform(v) {
      messageTransform = v;
    }

  }, 2);
  let MsgsCollection;
  module1.link("./messages", {
    MsgsCollection(v) {
      MsgsCollection = v;
    }

  }, 3);

  ___INIT_METEOR_FAST_REFRESH(module);

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
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"scenes.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/scenes.js                                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  module1.export({
    SceneCollection: () => SceneCollection
  });
  let Mongo;
  module1.link("meteor/mongo", {
    Mongo(v) {
      Mongo = v;
    }

  }, 0);

  ___INIT_METEOR_FAST_REFRESH(module);

  const SceneCollection = new Mongo.Collection('scenes');
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"ui":{"App.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/App.jsx                                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  module1.export({
    App: () => App
  });
  let React;
  module1.link("react", {
    default(v) {
      React = v;
    }

  }, 0);
  let Menu;
  module1.link("./Menu.jsx", {
    Menu(v) {
      Menu = v;
    }

  }, 1);
  let Devices;
  module1.link("./Devices.jsx", {
    Devices(v) {
      Devices = v;
    }

  }, 2);
  let Messages;
  module1.link("./Messages.jsx", {
    Messages(v) {
      Messages = v;
    }

  }, 3);

  ___INIT_METEOR_FAST_REFRESH(module);

  const App = () => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "BOSA !"), /*#__PURE__*/React.createElement("div", {
    id: "flex-container",
    className: "flex"
  }, /*#__PURE__*/React.createElement(Menu, null), /*#__PURE__*/React.createElement(Devices, null), /*#__PURE__*/React.createElement(Messages, null)));

  _c = App;

  var _c;

  $RefreshReg$(_c, "App");
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Devices.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/Devices.jsx                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  module1.export({
    Devices: () => Devices
  });
  let React;
  module1.link("react", {
    default(v) {
      React = v;
    }

  }, 0);
  let useTracker;
  module1.link("meteor/react-meteor-data", {
    useTracker(v) {
      useTracker = v;
    }

  }, 1);
  let DevicesCollection;
  module1.link("../api/devices", {
    DevicesCollection(v) {
      DevicesCollection = v;
    }

  }, 2);

  ___INIT_METEOR_FAST_REFRESH(module);

  var _s = $RefreshSig$();

  const Devices = () => {
    _s();

    const devices = useTracker(() => {
      console.log("Device collection find() = ", DevicesCollection.find().count());
      return DevicesCollection.find().fetch();
    });
    var boxclass;
    return /*#__PURE__*/React.createElement("div", {
      id: "devices",
      className: "wrapper cf dev-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "header"
    }, "Device Info"), devices.map(device => /*#__PURE__*/React.createElement("div", {
      key: device.name,
      className: "box ".concat(device.status, " ").concat(device.usb),
      name: device._id
    }, /*#__PURE__*/React.createElement("div", {
      className: "device"
    }, device.name), /*#__PURE__*/React.createElement("div", {
      className: "status"
    }, "usb:", device.usb != 'true' ? /*#__PURE__*/React.createElement("span", {
      className: "warn"
    }, device.usb) : /*#__PURE__*/React.createElement("span", null, device.usb)), /*#__PURE__*/React.createElement("div", {
      className: "status"
    }, "status: ", /*#__PURE__*/React.createElement("span", null, device.status)), /*#__PURE__*/React.createElement("div", {
      className: "status"
    }, "battery:", device.battery < 50 ? /*#__PURE__*/React.createElement("span", {
      className: "warn"
    }, device.battery) : /*#__PURE__*/React.createElement("span", null, device.battery)), /*#__PURE__*/React.createElement("div", {
      className: "status"
    }, "volume:", device.volume < 100 ? /*#__PURE__*/React.createElement("span", {
      className: "warn"
    }, device.volume) : /*#__PURE__*/React.createElement("span", null, device.volume)))));
  };

  _s(Devices, "ONGPz4EFlKwFhHc4KoO2ivcDYeg=", false, function () {
    return [useTracker];
  });

  _c = Devices;

  var _c;

  $RefreshReg$(_c, "Devices");
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Menu.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/Menu.jsx                                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  module1.export({
    Menu: () => Menu
  });
  let React, useState;
  module1.link("react", {
    default(v) {
      React = v;
    },

    useState(v) {
      useState = v;
    }

  }, 0);
  module1.link("../api/deviceMethods");
  module1.link("../api/oscMethods");

  ___INIT_METEOR_FAST_REFRESH(module);

  var _s = $RefreshSig$();

  const Menu = () => {
    _s();

    const [counter, setCounter] = useState(0);

    const increment = () => {
      setCounter(counter + 1);
    };

    let perfState = 'waiting';

    const callMethod = () => {
      Meteor.call('sendOSC');
      perfState = 'playing';
    };

    const endPerformMethod = () => {
      Meteor.call('endPerfOSC');
      perfState = 'end';
    };

    const resetAllMethod = () => {
      Meteor.call('resetAllDevices');
      perfState = 'end';
    };

    return /*#__PURE__*/React.createElement("div", {
      id: "menu",
      className: "menu-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "header"
    }, "Menu"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "btnSpace"
    }, /*#__PURE__*/React.createElement("button", {
      className: "button startPerformance",
      onClick: callMethod
    }, "Start Performance")), /*#__PURE__*/React.createElement("div", {
      className: "btnSpace"
    }, /*#__PURE__*/React.createElement("button", {
      className: "button endPerformance",
      onClick: endPerformMethod
    }, "End Performance")), /*#__PURE__*/React.createElement("div", {
      className: "btnSpace"
    }, /*#__PURE__*/React.createElement("button", {
      className: "button resetAll",
      onClick: resetAllMethod
    }, "Reset System"))));
  };

  _s(Menu, "mgO7WMHyhiBnLtH7uw/qAj2Cy9A=");

  _c = Menu;

  var _c;

  $RefreshReg$(_c, "Menu");
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Messages.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/ui/Messages.jsx                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  module1.export({
    Messages: () => Messages
  });
  let React;
  module1.link("react", {
    default(v) {
      React = v;
    }

  }, 0);
  let useTracker;
  module1.link("meteor/react-meteor-data", {
    useTracker(v) {
      useTracker = v;
    }

  }, 1);
  let MsgsCollection;
  module1.link("../api/messages", {
    MsgsCollection(v) {
      MsgsCollection = v;
    }

  }, 2);

  ___INIT_METEOR_FAST_REFRESH(module);

  var _s = $RefreshSig$();

  const Messages = () => {
    _s();

    const messages = useTracker(() => {
      console.log("Messages collection find() = ", MsgsCollection.find().count());
      return MsgsCollection.find({}, {
        sort: {
          msg_id: -1
        }
      }).fetch();
    });
    var boxclass;
    return /*#__PURE__*/React.createElement("div", {
      id: "messages",
      className: "wrapper cf message-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "header"
    }, "Messages"), messages.map(message => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, message.msg_id.toString().padStart(3, "0")), /*#__PURE__*/React.createElement("span", null, message.msg))));
  };

  _s(Messages, "2MSBR6jJDhl4LL8fRlSneajoKtk=", false, function () {
    return [useTracker];
  });

  _c = Messages;

  var _c;

  $RefreshReg$(_c, "Messages");
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"client":{"main.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/main.jsx                                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  let React;
  module1.link("react", {
    default(v) {
      React = v;
    }

  }, 0);
  let Meteor;
  module1.link("meteor/meteor", {
    Meteor(v) {
      Meteor = v;
    }

  }, 1);
  let render;
  module1.link("react-dom", {
    render(v) {
      render = v;
    }

  }, 2);
  let App;
  module1.link("/imports/ui/App", {
    App(v) {
      App = v;
    }

  }, 3);
  module1.link("/imports/api/deviceMethods");
  module1.link("/imports/api/messagesMethods");
  let OSC;
  module1.link("osc-js", {
    default(v) {
      OSC = v;
    }

  }, 4);

  ___INIT_METEOR_FAST_REFRESH(module);

  Meteor.startup(() => {
    render( /*#__PURE__*/React.createElement(App, null), document.getElementById('react-target'));
    Meteor.subscribe('devices');
    Meteor.subscribe('messages');
    Meteor.call('resetAllDevices', "fGXsSmgrB434Hsgaz", "awesome");
  });
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".ts",
    ".mjs",
    ".css",
    ".jsx"
  ]
});

var exports = require("/client/main.jsx");
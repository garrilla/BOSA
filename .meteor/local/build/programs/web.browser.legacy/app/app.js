var require = meteorInstall({"imports":{"api":{"deviceMethods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/deviceMethods.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  var check;
  module1.link("meteor/check", {
    check: function (v) {
      check = v;
    }
  }, 0);
  var messageTransform;
  module1.link("osc-min/lib/osc-utilities", {
    messageTransform: function (v) {
      messageTransform = v;
    }
  }, 1);
  var DevicesCollection;
  module1.link("./devices", {
    DevicesCollection: function (v) {
      DevicesCollection = v;
    }
  }, 2);
  var SceneCollection;
  module1.link("./scenes", {
    SceneCollection: function (v) {
      SceneCollection = v;
    }
  }, 3);
  var MsgsCollection;
  module1.link("./messages", {
    MsgsCollection: function (v) {
      MsgsCollection = v;
    }
  }, 4);

  ___INIT_METEOR_FAST_REFRESH(module);

  Meteor.methods({
    deviceUpdate: function (data) {
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
      var msg = 'device-' + data.deviceID.substr(12) + ' updated with status: ' + data.status + ' & usb: ' + data.usb;
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
    testMethod: function (data) {
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
    resetDevice: function (data) {
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
      var msg = 'device-' + data.deviceID.substr(12) + ' reset with status: ' + data.status;
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
    closeDevice: function (data) {
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

      var msg = 'device-' + data.deviceID.substr(12) + ' app was closed.';
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
    resetAllDevices: function (data) {
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

      var msg = "All devices in database were reset.";
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
    DevicesCollection: function () {
      return DevicesCollection;
    }
  });
  var Mongo;
  module1.link("meteor/mongo", {
    Mongo: function (v) {
      Mongo = v;
    }
  }, 0);

  ___INIT_METEOR_FAST_REFRESH(module);

  var DevicesCollection = new Mongo.Collection('newdevices');
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
    MsgsCollection: function () {
      return MsgsCollection;
    }
  });
  var Mongo;
  module1.link("meteor/mongo", {
    Mongo: function (v) {
      Mongo = v;
    }
  }, 0);

  ___INIT_METEOR_FAST_REFRESH(module);

  var MsgsCollection = new Mongo.Collection('messages');
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
  var check;
  module1.link("meteor/check", {
    check: function (v) {
      check = v;
    }
  }, 0);
  var messageTransform;
  module1.link("osc-min/lib/osc-utilities", {
    messageTransform: function (v) {
      messageTransform = v;
    }
  }, 1);
  var MsgsCollection;
  module1.link("./messages", {
    MsgsCollection: function (v) {
      MsgsCollection = v;
    }
  }, 2);
  var SceneCollection;
  module1.link("./scenes", {
    SceneCollection: function (v) {
      SceneCollection = v;
    }
  }, 3);

  ___INIT_METEOR_FAST_REFRESH(module);

  Meteor.methods({
    msgUpdate: function (data) {
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
    msg: function (stg) {
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
  var osc;
  module1.link("osc-min", {
    "default": function (v) {
      osc = v;
    }
  }, 0);
  var dgram;
  module1.link("dgram", {
    "default": function (v) {
      dgram = v;
    }
  }, 1);
  var messageTransform;
  module1.link("osc-min/lib/osc-utilities", {
    messageTransform: function (v) {
      messageTransform = v;
    }
  }, 2);
  var MsgsCollection;
  module1.link("./messages", {
    MsgsCollection: function (v) {
      MsgsCollection = v;
    }
  }, 3);

  ___INIT_METEOR_FAST_REFRESH(module);

  Meteor.methods({
    sendOSC: function () {
      if (Meteor.isServer) {
        var options = {
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

        var msg = "Play message broadcast to OSC.";
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
    endPerfOSC: function () {
      if (Meteor.isServer) {
        var options = {
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

        var msg = "Stop Performance message sent OSC";
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
    rewindOSC: function () {
      if (Meteor.isServer) {
        var options = {
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
    SceneCollection: function () {
      return SceneCollection;
    }
  });
  var Mongo;
  module1.link("meteor/mongo", {
    Mongo: function (v) {
      Mongo = v;
    }
  }, 0);

  ___INIT_METEOR_FAST_REFRESH(module);

  var SceneCollection = new Mongo.Collection('scenes');
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
    App: function () {
      return App;
    }
  });
  var React;
  module1.link("react", {
    "default": function (v) {
      React = v;
    }
  }, 0);
  var Menu;
  module1.link("./Menu.jsx", {
    Menu: function (v) {
      Menu = v;
    }
  }, 1);
  var Devices;
  module1.link("./Devices.jsx", {
    Devices: function (v) {
      Devices = v;
    }
  }, 2);
  var Messages;
  module1.link("./Messages.jsx", {
    Messages: function (v) {
      Messages = v;
    }
  }, 3);

  ___INIT_METEOR_FAST_REFRESH(module);

  var App = function () {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "BOSA !"), /*#__PURE__*/React.createElement("div", {
      id: "flex-container",
      className: "flex"
    }, /*#__PURE__*/React.createElement(Menu, null), /*#__PURE__*/React.createElement(Devices, null), /*#__PURE__*/React.createElement(Messages, null)));
  };

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
    Devices: function () {
      return Devices;
    }
  });
  var React;
  module1.link("react", {
    "default": function (v) {
      React = v;
    }
  }, 0);
  var useTracker;
  module1.link("meteor/react-meteor-data", {
    useTracker: function (v) {
      useTracker = v;
    }
  }, 1);
  var DevicesCollection;
  module1.link("../api/devices", {
    DevicesCollection: function (v) {
      DevicesCollection = v;
    }
  }, 2);

  ___INIT_METEOR_FAST_REFRESH(module);

  var _s = $RefreshSig$();

  var Devices = function () {
    _s();

    var devices = useTracker(function () {
      console.log("Device collection find() = ", DevicesCollection.find().count());
      return DevicesCollection.find().fetch();
    });
    var boxclass;
    return /*#__PURE__*/React.createElement("div", {
      id: "devices",
      className: "wrapper cf dev-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "header"
    }, "Device Info"), devices.map(function (device) {
      return /*#__PURE__*/React.createElement("div", {
        key: device.name,
        className: "box " + device.status + " " + device.usb,
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
      }, device.volume) : /*#__PURE__*/React.createElement("span", null, device.volume)));
    }));
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
  var _slicedToArray;

  module1.link("@babel/runtime/helpers/slicedToArray", {
    default: function (v) {
      _slicedToArray = v;
    }
  }, 0);
  module1.export({
    Menu: function () {
      return Menu;
    }
  });
  var React, useState;
  module1.link("react", {
    "default": function (v) {
      React = v;
    },
    useState: function (v) {
      useState = v;
    }
  }, 0);
  module1.link("../api/deviceMethods");
  module1.link("../api/oscMethods");

  ___INIT_METEOR_FAST_REFRESH(module);

  var _s = $RefreshSig$();

  var Menu = function () {
    _s();

    var _useState = useState(0),
        _useState2 = _slicedToArray(_useState, 2),
        counter = _useState2[0],
        setCounter = _useState2[1];

    var increment = function () {
      setCounter(counter + 1);
    };

    var perfState = 'waiting';

    var callMethod = function () {
      Meteor.call('sendOSC');
      perfState = 'playing';
    };

    var endPerformMethod = function () {
      Meteor.call('endPerfOSC');
      perfState = 'end';
    };

    var resetAllMethod = function () {
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
    Messages: function () {
      return Messages;
    }
  });
  var React;
  module1.link("react", {
    "default": function (v) {
      React = v;
    }
  }, 0);
  var useTracker;
  module1.link("meteor/react-meteor-data", {
    useTracker: function (v) {
      useTracker = v;
    }
  }, 1);
  var MsgsCollection;
  module1.link("../api/messages", {
    MsgsCollection: function (v) {
      MsgsCollection = v;
    }
  }, 2);

  ___INIT_METEOR_FAST_REFRESH(module);

  var _s = $RefreshSig$();

  var Messages = function () {
    _s();

    var messages = useTracker(function () {
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
    }, "Messages"), messages.map(function (message) {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, message.msg_id.toString().padStart(3, "0")), /*#__PURE__*/React.createElement("span", null, message.msg));
    }));
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
  var React;
  module1.link("react", {
    "default": function (v) {
      React = v;
    }
  }, 0);
  var Meteor;
  module1.link("meteor/meteor", {
    Meteor: function (v) {
      Meteor = v;
    }
  }, 1);
  var render;
  module1.link("react-dom", {
    render: function (v) {
      render = v;
    }
  }, 2);
  var App;
  module1.link("/imports/ui/App", {
    App: function (v) {
      App = v;
    }
  }, 3);
  module1.link("/imports/api/deviceMethods");
  module1.link("/imports/api/messagesMethods");
  var OSC;
  module1.link("osc-js", {
    "default": function (v) {
      OSC = v;
    }
  }, 4);

  ___INIT_METEOR_FAST_REFRESH(module);

  Meteor.startup(function () {
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
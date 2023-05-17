import { check } from 'meteor/check'
import { messageTransform } from 'osc-min/lib/osc-utilities'
import { DevicesCollection } from './devices'
import {SceneCollection} from './scenes'
import {MsgsCollection} from './messages'

Meteor.methods({
    deviceUpdate(data){
        console.log('updating device: ' + data.deviceID
        + "\n [usb: " + data.usb
        + "; Status: " + data.status
        + "; Power: " + data.battery
        + "; Volume: " + data.volume +"]");
        //console.log(DevicesCollection.find().count())
        //check(deviceID, String);
        //check(status, String);
        entity = DevicesCollection.findOne({"device":data.deviceID});
        //console.log(entity);
        DevicesCollection.update(entity._id, 
            {$set: {"status" : data.status, 
                    "usb" : data.usb,
                    "battery" : data.battery,
                    "volume" : data.volume
                }}
            );
        
        let msg = 'device-' + data.deviceID.substr(12)
         + ' updated with status: ' + data.status
         + ' & usb: ' + data.usb;
        MsgsCollection.insert({msg: msg, time: Date.now(), msg_id: MsgsCollection.find().count()+1});
        console.log(msg);
        //Meteor.call('msg', {msg: msg});

        return {"id":entity._id,
                "status":"sucess"
                };
    },
    testMethod(data){
        ip = '192.168.60.101';
        if(ip == data.deviceID)
        console.log(data);
        s = SceneCollection.findOne({"current": "true"});
        //console.log(s);
        SceneCollection.update(s._id,
            {$set: {"current": "false"
                }}
            );
        
        s = SceneCollection.findOne({number: data.current});
        //console.log(s);
        SceneCollection.update(s._id,
                {$set: {"current": "true", "prepping" : data.warning}}
            );
    },
    resetDevice(data){
        entity = DevicesCollection.findOne({"device":data.deviceID});
        //console.log(entity);
        DevicesCollection.update(entity._id, 
            {$set: {"status" : "waiting", 
                    "usb" : data.usb,
                    "battery" : data.battery,
                    "volume" : data.volume
                }}
            );
        let msg = 'device-' + data.deviceID.substr(12) + ' reset with status: ' + data.status;
        MsgsCollection.insert({msg: msg, time: Date.now(), msg_id: MsgsCollection.find().count()+1});
        console.log(msg);

        return {"id":entity._id,
                "status":"sucess"
                };
    },
    closeDevice(data){
        /*
        GH: not sure if ever called
        */ 
        //console.log("quitting" + data.deviceID);
        entity = DevicesCollection.findOne({"device":data.deviceID});
        //console.log(entity);
        DevicesCollection.update(entity._id, 
            {$set: {"status" : "not-present", 
                    "usb" : "?",
                    "battery" : "?",
                    "volume" : "?"
                }}
            );
        //console.log(data.deviceID + ' quit ');
        let msg = 'device-' + data.deviceID.substr(12) + ' app was closed.';
        MsgsCollection.insert({msg: msg, time: Date.now(), msg_id: MsgsCollection.find().count()+1});
        console.log(msg);

        return {"id":entity._id,
                "status":"sucess"
                };
    },
    
    resetAllDevices(data){

        Meteor.call('rewindOSC');
        //entity = DevicesCollection.find();
        //console.log(entity);
        DevicesCollection.update({}, 
            {$set: {"status" : "reset", 
                    "usb" : "null",
                    "battery" : "null",
                    "volume" : "null"
                }},
                {multi: true}
            );

            
            
        //    clear messages
        MsgsCollection.remove({});
        //console.log("All devices were reset.");
        let msg = "All devices in database were reset.";
        MsgsCollection.insert({msg: msg, time: Date.now(), msg_id: MsgsCollection.find().count()+1});
        console.log(msg);
    }
})

// Meteor.methods('new-test', function(){
//     console.log('new test');
// }, {
//     url: 'new-test'
// })
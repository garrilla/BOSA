import { check } from 'meteor/check'
import { messageTransform } from 'osc-min/lib/osc-utilities'
import { DevicesCollection } from './devices'
import {SceneCollection} from './scenes'

Meteor.methods({
    deviceUpdate(data){
        console.log('updating device: ' + data.deviceID
        + "; usb: " + data.usb
        + "; Staus: " + data.status
        + "; Power: " + data.battery
        + "; Volume: " + data.volume);
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
        console.log('device updated with status: ' + data.status)

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
        console.log('device reset with status: ' + data.status)

        return {"id":entity._id,
                "status":"sucess"
                };
    },
    closeDevice(data){
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
        console.log(data.deviceID + ' quit ')

        return {"id":entity._id,
                "status":"sucess"
                };
    }
})

// Meteor.methods('new-test', function(){
//     console.log('new test');
// }, {
//     url: 'new-test'
// })
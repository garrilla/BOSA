import { check } from 'meteor/check'
import { messageTransform } from 'osc-min/lib/osc-utilities'
import { MsgsCollection } from './messages'
import {SceneCollection} from './scenes'

Meteor.methods({
    msgUpdate(data){
        console.log('msg recived: ' + data.msg);

        MsgsCollection.insert({msg: entity._id
            }
            );
        console.log('inserted msg to collection: ' + data.msg)

        return {"msg:":data.msg,
                "status":"sucess"
                };
    },
    msg(stg){
        console.log(stg);
    }
})
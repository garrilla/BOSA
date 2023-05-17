import osc from 'osc-min'
import dgram from 'dgram'
import { messageTransform } from 'osc-min/lib/osc-utilities';
import {MsgsCollection} from './messages'


    Meteor.methods({
        sendOSC(){
            if (Meteor.isServer){
              const options = {
                type: 'udp4',
                send: {
                host: '192.168.60.54',
                port: 8000
                }
            }
            udp = dgram.createSocket(options.type);
            
            var message = {
                address: "/play",
                args: [{type: "integer", value: 1}]
              };
            
            //sendMsg = function(msg){
                var buf;
                buf = osc.toBuffer(message)
                udp.send(buf, 0, buf.length, options.send.port, options.send.host);
              //}
            
                 
              let msg = "Play message broadcast to OSC.";
              MsgsCollection.insert({msg: msg, time: Date.now(), msg_id: MsgsCollection.find().count()+1});
              console.log(msg);
              
             // var wtf = sendMsg(message);
    
              return {"status":"Message sent"};  
            }
            if(Meteor.isClient){
                console.log('The sendOSC function was run on the server');
            }
            
        },
        endPerfOSC(){
            if (Meteor.isServer){
                const options = {
                    type: 'udp4',
                    send: {
                    host: '192.168.60.54',
                    port: 8000
                    }
                }
                udp = dgram.createSocket(options.type);
                
                // STOP
                var message = {
                    address: "/stop",
                    args: [{type: "integer", value: 1}]
                  };
                    var buf;
                    buf = osc.toBuffer(message)
                    udp.send(buf, 0, buf.length, options.send.port, options.send.host);
                
                  // GOTO MARKER
                  var stopMarkerMessage = {
                    address: "/marker",
                    args: [{type: "integer", value: 2}]
                  };
                
                    var buf;
                    buf = osc.toBuffer(stopMarkerMessage)
                    udp.send(buf, 0, buf.length, options.send.port, options.send.host);

                  // REWIND TO START
                    var returnMessage = {
                      //address: "/frames/str",
                      address: "/time/str",
                      args: [{type: "string", value: "0"}]
                    };
                  
                      var buf;
                      buf = osc.toBuffer(returnMessage)
                      //udp.send(buf, 0, buf.length, options.send.port, options.send.host);
                
                  let msg = "Stop Performance message sent OSC";
                  MsgsCollection.insert({msg: msg, time: Date.now(), msg_id: MsgsCollection.find().count()+1});
                  console.log(msg);
                  
                 // var wtf = sendMsg(message);

                  return {"status":"endPerfOSC Message sent"};  
            }},
        rewindOSC(){
            if (Meteor.isServer){
                const options = {
                    type: 'udp4',
                    send: {
                    host: '192.168.60.54',
                    port: 8000
                    }
                }
                udp = dgram.createSocket(options.type);
                
                // REWIND TO START
                    var returnMessage = {
                      //address: "/frames/str",
                      address: "/time/str",
                      args: [{type: "string", value: "0"}]
                    };
                  
                      var buf;
                      buf = osc.toBuffer(returnMessage)
                      udp.send(buf, 0, buf.length, options.send.port, options.send.host);
                                  
                 // var wtf = sendMsg(message);

                  return {"status":"endPerfOSC Message sent"};  
            }
            if(Meteor.isClient){
                console.log('The endPerfOSC function was run on the server');
            }
          }
    });




  //Meteor.call('devices.update',"fGXsSmgrB434Hszgq","awtirednessesome");
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
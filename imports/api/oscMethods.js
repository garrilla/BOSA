import osc from 'osc-min'
import dgram from 'dgram'
import { messageTransform } from 'osc-min/lib/osc-utilities';


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
                args: [1]
              };
            
            //sendMsg = function(msg){
                var buf;
                buf = osc.toBuffer(message)
                udp.send(buf, 0, buf.length, options.send.port, options.send.host);
              //}
            
              console.log('OSC msg sent')
              
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
                
                var message = {
                    address: "/stop",
                    args: [1]
                  };
                
                //sendMsg = function(msg){
                    var buf;
                    buf = osc.toBuffer(message)
                    udp.send(buf, 0, buf.length, options.send.port, options.send.host);
                  //}

                  var returnMessage = {
                    address: "/frames/str",
                    args: ["0"]
                  };
                
                //sendMsg = function(msg){
                    var buf;
                    buf = osc.toBuffer(returnMessage)
                    udp.send(buf, 0, buf.length, options.send.port, options.send.host);
                  //}
                
                  console.log('endPerfOSC msg sent')
                  
                 // var wtf = sendMsg(message);

                  return {"status":"endPerfOSC Message sent"};  
            }
            if(Meteor.isClient){
                console.log('The endPerfOSC function was run on the server');
            }
    }});




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
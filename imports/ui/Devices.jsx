import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { DevicesCollection } from '../api/devices';

export const Devices = () => {
  const devices = useTracker(() => {
    console.log("Device collection find() = ",DevicesCollection.find().count())
    return DevicesCollection.find().fetch();
  });

  var boxclass;

  return (
    <div id="devices" className='wrapper cf dev-container'>
      <div className='header'>Device Info</div>
      {devices.map(
        device => 
        
          <div key={device.name} className={`box ${device.status} ${device.usb}`} name={device._id}> 
            <div className='device'>{device.name}</div>
            <div className='status'>usb: 
              {device.usb!='true' ? 
                <span className='warn'>{device.usb}</span> : 
                <span>{device.usb}</span>
                }
            </div><div className='status'>status: <span>{device.status}</span></div>
            <div className='status'>battery: 
              {device.battery<50 ? 
                <span className='warn'>{device.battery}</span> : 
                <span>{device.battery}</span>
                }
            </div>
            <div className='status'>volume: 
              {device.volume<100 ? 
                <span className='warn'>{device.volume}</span> : 
                <span>{device.volume}</span>
                }
              </div>
          </div>
        
      )}
    </div>
  );
};

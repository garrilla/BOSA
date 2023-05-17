import React, { useState } from 'react';
import '../api/deviceMethods'
import '../api/oscMethods'


export const Menu = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
  };

  let perfState = 'waiting'

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

  return (
    <div id="menu" className='menu-container'>
      <div className='header'>Menu</div>
      <div>
        <div className="btnSpace"><button className="button startPerformance" onClick={callMethod}>Start Performance</button></div>
        <div className="btnSpace"><button className="button endPerformance" onClick={endPerformMethod}>End Performance</button></div>
        <div className="btnSpace"><button className="button resetAll" onClick={resetAllMethod}>Reset System</button></div>
      </div>
    </div>
  );
};

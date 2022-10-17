import React, { useState } from 'react';
import '../api/deviceMethods'
import '../api/oscMethods'


export const Hello = () => {
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

  return (
    <div>
      <button className="startPerformance" onClick={callMethod}>Start Performance</button>
      <button className="endPerformance" onClick={endPerformMethod}>End Performance</button>
      
    </div>
  );
};

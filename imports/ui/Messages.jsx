import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { MsgsCollection } from '../api/messages';

export const Messages = () => {
  const messages = useTracker(() => {
    console.log("Messages collection find() = ",MsgsCollection.find().count())
    return MsgsCollection.find({},{sort: {msg_id: -1}}).fetch();
  });

  var boxclass;

  return (
    <div id="messages" className='wrapper cf message-container'>
      <div className='header'>Messages</div>
      {messages.map(
        message => 
        
          <div> 
            <span>{message.msg_id.toString().padStart(3, "0")}</span>
            <span>{message.msg}</span>
          </div>
        
      )}
    </div>
  );
};

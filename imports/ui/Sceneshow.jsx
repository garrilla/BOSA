import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { SceneCollection } from '../api/scenes';

export const Sceneshow = () => {
  const scenes = useTracker(() => {
    //console.log(ScenesCollection.find().count())
    return SceneCollection.find({current: "true"}).fetch();
  });

  var boxclass;

  return (
    <div className='wrapper cf'>
      <span></span>
      {scenes.map(
        scene => 
        
        <div className='current'>
          {scene.prepping == 'true' ? 
          <span>10s to next scene: </span>
           : 
           <span>Scene: </span>}
          <span>{scene.title}</span>
        </div>
        
      )}
    </div>
  );
};

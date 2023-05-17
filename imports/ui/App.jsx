import React from 'react';
import { Menu } from './Menu.jsx';
import { Devices } from './Devices.jsx';
import { Messages } from './Messages.jsx';

export const App = () => (
  <div>
    <h1>BOSA !</h1>
    
    <div id="flex-container" className='flex'>
      <Menu/>
      <Devices/>
      <Messages/>
      
    </div>
  </div>
);



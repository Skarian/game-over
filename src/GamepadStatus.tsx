import React from 'react';
import { useGamepad } from './useGamepad'; // Adjust the import path based on your file structure

const GamepadStatus: React.FC = () => {
  const gamepadInfo = useGamepad();

  return (
    <div>
      <h1>Gamepad Status</h1>
      <p>Connected: {gamepadInfo.connected ? 'Yes' : 'No'}</p>
      {gamepadInfo.connected && (
        <div>
          <h2>Buttons</h2>
          <p>Button A: {gamepadInfo.buttonA ? 'Pressed' : 'Not Pressed'}</p>
          <p>Button B: {gamepadInfo.buttonB ? 'Pressed' : 'Not Pressed'}</p>
          <p>Button X: {gamepadInfo.buttonX ? 'Pressed' : 'Not Pressed'}</p>
          <p>Button Y: {gamepadInfo.buttonY ? 'Pressed' : 'Not Pressed'}</p>
          <p>Start: {gamepadInfo.start ? 'Pressed' : 'Not Pressed'}</p>
          <p>Select: {gamepadInfo.select ? 'Pressed' : 'Not Pressed'}</p>
          <h2>Joysticks</h2>
          <p>Left Joystick: X = {gamepadInfo.joystick[0]}, Y = {gamepadInfo.joystick[1]}</p>
          <p>Right Joystick: X = {gamepadInfo.joystickRight[0]}, Y = {gamepadInfo.joystickRight[1]}</p>
          <h2>D-Pad</h2>
          <p>Up: {gamepadInfo.up ? 'Pressed' : 'Not Pressed'}</p>
          <p>Down: {gamepadInfo.down ? 'Pressed' : 'Not Pressed'}</p>
          <p>Left: {gamepadInfo.left ? 'Pressed' : 'Not Pressed'}</p>
          <p>Right: {gamepadInfo.right ? 'Pressed' : 'Not Pressed'}</p>
          <h2>Triggers</h2>
          <p>Left Trigger: {gamepadInfo.LT ? 'Pressed' : 'Not Pressed'}</p>
          <p>Right Trigger: {gamepadInfo.RT ? 'Pressed' : 'Not Pressed'}</p>
          <h2>Shoulder Buttons</h2>
          <p>Left Shoulder: {gamepadInfo.LB ? 'Pressed' : 'Not Pressed'}</p>
          <p>Right Shoulder: {gamepadInfo.RB ? 'Pressed' : 'Not Pressed'}</p>
        </div>
      )}
    </div>
  );
};

export default GamepadStatus;

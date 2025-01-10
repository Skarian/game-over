import "./App.css";
import React, { useEffect } from 'react';
import {
  init,
  FocusContext,
  navigateByDirection,
  setKeyMap,
} from '@noriginmedia/norigin-spatial-navigation';
import { useGamepad } from "./useGamepad";
import toast from 'react-hot-toast'
import Focus from "./Focus";
import KeyCodeDisplay from "./KeyCodeDisplay";

const notify = () => toast("Something was selected!");

// Initialize Spatial Navigation
init({
  debug: false, // Enables console debugging
  visualDebug: false, // Enables visual focus debugging
});

const Button: React.FC<{ label: string; onClick: () => void, autoFocus: boolean }> = ({ label, onClick, autoFocus }) => {
  return (
    <Focus autoFocus={autoFocus} className="px-6 py-3 rounded" focusedStyle="ring-offset-2 ring-2 bg-blue-400 text-white" unFocusedStyle="bg-gray-400 text-black" action={onClick} >
      {label}
    </Focus>
  );
};

const ButtonList: React.FC = () => {
  const buttons = [
    { label: 'Button 1', action: notify },
    { label: 'Button 2', action: notify },
    { label: 'Button 3', action: notify },
    { label: 'Button 4', action: notify },
    { label: 'Button 5', action: notify },
    { label: 'Button 6', action: notify },
    { label: 'Button 7', action: notify },
    { label: 'Button 8', action: notify },
    { label: 'Button 9', action: notify },
    { label: 'Button 10', action: notify },
    { label: 'Button 11', action: notify },
    { label: 'Button 12', action: notify },
  ];


  return (
    <div className="flex space-x-2 flex-wrap ">
      {buttons.map((button, index) => (
        <Button key={index} label={button.label} onClick={button.action} autoFocus={index === 0} />
      ))}
    </div>
  );
};

const App: React.FC = () => {

  const gamepadInfo = useGamepad();

  useEffect(() => {
    if (gamepadInfo.connected) {
      switch (gamepadInfo.joystick) {
        case "up":
          navigateByDirection("up", {});
          navigateByDirection("enter", {})
          break;
        case "down":
          navigateByDirection("down", {})
          break;
        case "right":
          navigateByDirection("right", {})
          break;
        case "left":
          navigateByDirection("left", {})
          break;
        default:
          break;
      }
      if (gamepadInfo.up) {
        navigateByDirection("up", {})
      }
      if (gamepadInfo.down) {
        navigateByDirection("down", {})
      }
      if (gamepadInfo.left) {
        navigateByDirection("left", {})
      }
      if (gamepadInfo.right) {
        navigateByDirection("right", {})
      }

    }
  }, [gamepadInfo])

  return (
    <FocusContext.Provider value="MAIN">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Gamepad Navigation Example</h1>
        <ButtonList />
        <KeyCodeDisplay />
        <ButtonList />

      </div>
    </FocusContext.Provider>
  );
};

export default App;

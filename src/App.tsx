import "./App.css";
import React, { useEffect } from 'react';
import {
  init,
  setKeyMap,
  useFocusable,
  FocusContext,
  navigateByDirection,
} from '@noriginmedia/norigin-spatial-navigation';
import { useGamepad } from "./useGamepad";

// Initialize Spatial Navigation
init({
  debug: true, // Enables console debugging
  visualDebug: false, // Enables visual focus debugging
  // distanceCalculationMethod: 'center', // Optional: Can be 'corners' (default) or 'edges'
});

// Set custom key mapping for gamepad
// setKeyMap({
//   up: [12], // D-pad Up
//   down: [13], // D-pad Down
//   left: [14], // D-pad Left
//   right: [15], // D-pad Right
//   enter: [0], // A button for activation
// });

const Button: React.FC<{ label: string; onClick: () => void, autoFocus?: boolean }> = ({ label, onClick, autoFocus }) => {
  const { ref, focused, focusSelf } = useFocusable();

  useEffect(() => {
    if (autoFocus) {
      focusSelf()
    }
  }, [autoFocus, focusSelf])

  return (
    <div
      ref={ref}
      className={`px-6 py-3 rounded cursor-pointer ${focused ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'
        }`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

const ButtonList: React.FC = () => {
  const { ref, focusKey } = useFocusable();
  const buttons = [
    { label: 'Button 1', action: () => console.log('Button 1 clicked') },
    { label: 'Button 2', action: () => console.log('Button 2 clicked') },
    { label: 'Button 3', action: () => console.log('Button 3 clicked') },
    { label: 'Button 4', action: () => console.log('Button 4 clicked') },
    { label: 'Button 5', action: () => console.log('Button 1 clicked') },
    { label: 'Button 6', action: () => console.log('Button 2 clicked') },
    { label: 'Button 7', action: () => console.log('Button 3 clicked') },
    { label: 'Button 8', action: () => console.log('Button 4 clicked') },
    { label: 'Button 9', action: () => console.log('Button 1 clicked') },
    { label: 'Button 10', action: () => console.log('Button 2 clicked') },
    { label: 'Button 11', action: () => console.log('Button 3 clicked') },
    { label: 'Button 12', action: () => console.log('Button 4 clicked') },
  ];

  const gamepadInfo = useGamepad();

  useEffect(() => {
    if (gamepadInfo.connected) {
      switch (gamepadInfo.joystick) {
        case "up":
          navigateByDirection("up", {});
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
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="">
        <div className="flex space-x-2 space-y-2 flex-wrap ">

          {buttons.map((button, index) => (
            <Button key={index} label={button.label} onClick={button.action} autoFocus={index === 0} />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
};

const App: React.FC = () => {

  return (
    <FocusContext.Provider value="MAIN">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Gamepad Navigation Example</h1>
        <ButtonList />
      </div>
    </FocusContext.Provider>
  );
};

export default App;

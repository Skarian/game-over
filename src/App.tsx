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
import toast from 'react-hot-toast'
import Focus from "./Focus";
import useSound from "use-sound";
import uiSound from "/sounds/deck_ui_navigation.mp3"

const notify = () => toast("Something has happened!");

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
  const { ref, focusKey } = useFocusable();
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

  // let audio = new Audio("/sounds/deck_ui_navigation.wav")
  const [play] = useSound(uiSound);

  const gamepadInfo = useGamepad();

  useEffect(() => {
    if (gamepadInfo.connected) {
      switch (gamepadInfo.joystick) {
        case "up":
          navigateByDirection("up", {});
          play()
          console.log("Playing audio!")
          break;
        case "down":
          navigateByDirection("down", {})
          play()
          console.log("Playing audio!")
          break;
        case "right":
          navigateByDirection("right", {})
          play()
          console.log("Playing audio!")
          break;
        case "left":
          navigateByDirection("left", {})
          play()
          console.log("Playing audio!")
          break;
        default:
          break;
      }
      if (gamepadInfo.up) {
        navigateByDirection("up", {})
        play()
        console.log("Playing audio!")
      }
      if (gamepadInfo.down) {
        navigateByDirection("down", {})
        play()
        console.log("Playing audio!")
      }
      if (gamepadInfo.left) {
        navigateByDirection("left", {})
        play()
        console.log("Playing audio!")
      }
      if (gamepadInfo.right) {
        navigateByDirection("right", {})
        play()
        console.log("Playing audio!")
      }

    }
  }, [gamepadInfo])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        // audio.currentTime = 0; // Reset playback to the beginning
        // audio.play().catch(() => {
        //   console.error("Audio playback failed. Fix your file or permissions.");
        // });
        play()
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="">
        <div className="flex space-x-2 flex-wrap ">

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

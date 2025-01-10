import "./App.css";
import React, { useState, useEffect } from 'react';
import { useGamepad } from './useGamepad'; // Adjust the import path based on your file structure

const App: React.FC = () => {
  const [focusedIndex, setFocusedIndex] = useState(0); // Index of the currently focused button
  const buttons = ['Home', 'Gamepad Status', 'About'];
  const gamepadInfo = useGamepad();

  useEffect(() => {
    if (!gamepadInfo.connected) return;

    // Update focus based on joystick input
    if (gamepadInfo.joystick === 'up') {
      setFocusedIndex((prev) => (prev - 1 + buttons.length) % buttons.length);
    } else if (gamepadInfo.joystick === 'down') {
      setFocusedIndex((prev) => (prev + 1) % buttons.length);
    }

    // Trigger action when "A" button is pressed
    if (gamepadInfo.buttonA) {
      handleButtonClick(focusedIndex);
    }
  }, [gamepadInfo.joystick, gamepadInfo.buttonA]);

  const handleButtonClick = (index: number) => {
    console.log(`Button "${buttons[index]}" clicked!`);
    // Handle the action here (e.g., navigate to a page)
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-6">Gamepad Navigation</h1>
        <div className="flex flex-col space-y-4">
          {buttons.map((button, index) => (
            <button
              key={button}
              className={`px-6 py-3 rounded ${index === focusedIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

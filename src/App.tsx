import "./App.css";
import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [gamepads, setGamepads] = useState<Gamepad[]>([]);

  useEffect(() => {
    const updateGamepads = () => {
      const gamepadList = navigator.getGamepads();
      setGamepads(
        Array.from(gamepadList).filter((g): g is Gamepad => g !== null)
      );
    };

    const intervalId = setInterval(updateGamepads, 100);

    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log("ongamepadconnected", e);
      updateGamepads();
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log("ongamepaddisconnected", e);
      updateGamepads();
    };

    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("gamepadconnected", handleGamepadConnected);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
    };
  }, []);

  return (
    <main className="border-4 border-red-900 w-screen h-screen">
      If there is nothing else there is no gamepad
      {gamepads.map((gamepad) => (
        <div key={gamepad.index} className="text-black">
          <h1>
            Gamepad: {gamepad.index} {gamepad.id}
          </h1>
          <h2>Axes</h2>
          <pre>{JSON.stringify(gamepad.axes, null, 2)}</pre>
          <h2>Buttons</h2>
          <pre>{JSON.stringify(gamepad.buttons.map((b) => b.value), null, 2)}</pre>
          <br />
        </div>
      ))}
    </main>
  );
};

export default App;

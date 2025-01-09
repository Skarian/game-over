import "./App.css";
import React, { useEffect, useState } from "react";
import GamepadStatus from "./GamepadStatus";

const App: React.FC = () => {

  return (
    <main className="border-4 border-red-900 w-screen h-screen">
      If there is nothing else there is no gamepad
      <GamepadStatus />
    </main>
  );
};

export default App;

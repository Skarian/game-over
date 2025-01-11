import "./App.css"
import React, { useEffect } from "react"
import {
  init,
  FocusContext,
  navigateByDirection,
} from "@noriginmedia/norigin-spatial-navigation"
import { useGamepad } from "./useGamepad"
import toast from "react-hot-toast"
import KeyCodeDisplay from "./KeyCodeDisplay"
import Button from "./Button"
import Controls from "./Controls"
import AppList from "./AppList"

const notify = () => toast("Something was selected!")

// Initialize Spatial Navigation
init({
  debug: false, // Enables console debugging
  visualDebug: false, // Enables visual focus debugging
  shouldFocusDOMNode: true,
})

const ButtonList: React.FC = () => {
  const buttons = [
    { label: "Button 1", action: notify },
    { label: "Button 2", action: notify },
    { label: "Button 3", action: notify },
    { label: "Button 4", action: notify },
    { label: "Button 5", action: notify },
    { label: "Button 6", action: notify },
    { label: "Button 7", action: notify },
    { label: "Button 8", action: notify },
    { label: "Button 9", action: notify },
    { label: "Button 10", action: notify },
    { label: "Button 11", action: notify },
    { label: "Button 12", action: notify },
  ]

  return (
    <div className="flex flex-wrap space-x-2">
      {buttons.map((button, index) => (
        <Button key={index} action={button.action} autoFocus={index === 0}>
          {button.label}
        </Button>
      ))}
    </div>
  )
}

const App: React.FC = () => {
  const gamepadInfo = useGamepad()

  useEffect(() => {
    if (gamepadInfo.connected) {
      switch (gamepadInfo.joystick) {
        case "up":
          navigateByDirection("up", {})
          navigateByDirection("enter", {})
          break
        case "down":
          navigateByDirection("down", {})
          break
        case "right":
          navigateByDirection("right", {})
          break
        case "left":
          navigateByDirection("left", {})
          break
        default:
          break
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
      <div className="flex h-screen flex-col bg-gray-100">
        <div className="flex flex-grow-0 items-center justify-between rounded-b-2xl bg-gray-900 px-8 py-4">
          <div className="text-5xl font-extrabold text-white">Task Manager</div>
          <Button variant="error" action={() => {}}>
            Exit
          </Button>
        </div>
        <div className="flex flex-shrink flex-grow overflow-y-auto bg-white">
          <AppList />
        </div>
        <div className="flex flex-grow-0 items-center justify-center space-x-20 rounded-t-2xl bg-gray-900 px-8 py-4">
          <Controls />
        </div>
      </div>
    </FocusContext.Provider>
  )
}

export default App

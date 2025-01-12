import "./App.css"
import React, { useEffect, useState } from "react"
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
import { invoke } from "@tauri-apps/api/core"
import AppTable from "./AppTable"

const notify = () => toast("Something was selected!")

// Initialize Spatial Navigation
init({
  debug: false, // Enables console debugging
  visualDebug: false, // Enables visual focus debugging
  shouldFocusDOMNode: true,
  domNodeFocusOptions: {
    preventScroll: true,
  },
})

export interface ProcessDetails {
  pid: string
  name: string
  memory: number // u64 in Rust maps to number in TypeScript
  cpu: number // f32 in Rust maps to number in TypeScript
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

  const [processes, setProcesses] = useState<ProcessDetails[]>([])

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const result: ProcessDetails[] = await invoke("get_process_details")
        console.log(result)
        setProcesses(result)
      } catch (error) {
        console.error("Error fetching process details:", error)
      }
    }
    fetchProcesses()
  }, [])

  const handleQuit = () => {
    console.log("quitting application")
    invoke("quit")
  }

  return (
    <FocusContext.Provider value="MAIN">
      <div className="flex h-screen flex-col bg-gray-100">
        <div className="flex flex-grow-0 items-center justify-between rounded-b-2xl bg-gray-900 px-8 py-4">
          <div className="text-5xl font-extrabold text-white">Task Manager</div>
          <Button variant="error" action={handleQuit}>
            Exit
          </Button>
        </div>
        <div className="flex flex-shrink flex-grow bg-white p-8">
          {processes.length > 0 ? (
            <AppTable processes={processes} />
          ) : (
            <div>
              <div>Loading...</div>
            </div>
          )}
        </div>
        <div className="flex flex-grow-0 items-center justify-center space-x-20 rounded-t-2xl bg-gray-900 px-8 py-4">
          <Controls />
        </div>
      </div>
    </FocusContext.Provider>
  )
}

export default App

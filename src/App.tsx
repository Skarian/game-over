import "./App.css"
import React, { useEffect, useRef, useState } from "react"
import {
  init,
  FocusContext,
  navigateByDirection,
} from "@noriginmedia/norigin-spatial-navigation"
import { useGamepad } from "./useGamepad"
// import toast from "react-hot-toast"
import Button from "./Button"
import Controls from "./Controls"
import { invoke } from "@tauri-apps/api/core"
import { listen, UnlistenFn } from "@tauri-apps/api/event"
import AppTable, { AppTableSort } from "./AppTable"

// const notify = () => toast("Something was selected!")

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
  // Gamepad Logic
  const gamepadInfo = useGamepad()
  const prevButtonYRef = useRef(false)

  useEffect(() => {
    if (gamepadInfo.connected) {
      switch (gamepadInfo.joystick) {
        case "up":
          navigateByDirection("up", {})
          // navigateByDirection("enter", {})
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
      if (!prevButtonYRef.current && gamepadInfo.buttonY) {
        handleSort(sort)
      }
      prevButtonYRef.current = gamepadInfo.buttonY
    }
  }, [gamepadInfo])

  // Keyboard Logic
  const [sort, setSort] = useState<AppTableSort>("alphabetical")

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "y" || event.key === "Y") {
        handleSort(sort)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [sort])

  const [processes, setProcesses] = useState<ProcessDetails[]>([])
  //
  useEffect(() => {
    let unlisten: UnlistenFn | null = null

    const setupListener = async () => {
      const listener = await listen<ProcessDetails[]>(
        "system-update",
        (event) => {
          console.log("Received system-update event")
          setProcesses(event.payload)
        }
      )
      unlisten = listener
    }

    setupListener()

    return () => {
      if (unlisten) {
        unlisten()
      }
    }
  }, [])

  // useEffect(() => {
  //   console.log(processes)
  // }, [processes])

  const handleQuit = () => {
    console.log("quitting application")
    invoke("quit")
  }

  function getNextSort(current: AppTableSort): AppTableSort {
    switch (current) {
      case "alphabetical":
        return "cpu"
      case "cpu":
        return "ram"
      case "ram":
        return "alphabetical"
    }
  }

  const handleSort = (currentSort: AppTableSort) => {
    let nextSort = getNextSort(currentSort)
    console.log(`Changing sort. Current: ${sort}; New: ${nextSort}`)
    setSort(nextSort)
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
        <div className="flex flex-shrink flex-grow items-center justify-center bg-white p-8">
          {processes.length > 0 ? (
            <AppTable sort={sort} processes={processes} />
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

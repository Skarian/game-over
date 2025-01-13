import React, { useEffect, useState } from "react"
import Button from "./Button"
import { invoke } from "@tauri-apps/api/core"
import { ProcessDetails } from "./App"
import { useGamepad } from "./useGamepad"
import { DownArrowIcon, UpArrowIcon } from "./icons/Icons"
import useSound from "use-sound"
import enterSound from "/sounds/deck_ui_into_game_detail.mp3"

interface AppList {
  processes: ProcessDetails[]
}

type AppListSort = "default" | "alphabetical" | "cpu" | "ram"

const AppList: React.FC<AppList> = ({ processes }) => {
  const entries = [
    { id: 0, name: "input-leap.exe", cpu: "11%", ram: "15%", type: "Other" },
    { id: 0, name: "input-leap.exe", cpu: "11%", ram: "15%", type: "Other" },
    { id: 0, name: "input-leap.exe", cpu: "11%", ram: "15%", type: "Other" },
    { id: 0, name: "input-leap.exe", cpu: "11%", ram: "15%", type: "Other" },
    { id: 0, name: "input-leap.exe", cpu: "11%", ram: "15%", type: "Other" },
    { id: 0, name: "input-leap.exe", cpu: "11%", ram: "15%", type: "Other" },
    { id: 0, name: "input-leap.exe", cpu: "11%", ram: "15%", type: "Other" },
    { id: 0, name: "input-leap.exe", cpu: "11%", ram: "15%", type: "Other" },
    { id: 0, name: "input-leap.exe", cpu: "11%", ram: "15%", type: "Other" },
    { id: 0, name: "input-leap.exe", cpu: "11%", ram: "15%", type: "Other" },
    { id: 0, name: "input-leap.exe", cpu: "11%", ram: "15%", type: "Other" },
    { id: 0, name: "input-leap.exe", cpu: "11%", ram: "15%", type: "Other" },
  ]

  const [processList, setProcessList] = useState(
    processes.sort((a, b) => parseInt(a.pid, 10) - parseInt(b.pid, 10))
  )

  const getSysInfo = () => {
    invoke("get_sys_info")
  }
  // Sorting Logic
  const [playSortSound] = useSound(enterSound)

  const [sort, setSort] = useState<AppListSort>("default")

  const appListSorts: AppListSort[] = ["default", "alphabetical", "cpu", "ram"]

  function getNextSort(current: AppListSort): AppListSort {
    const currentIndex = appListSorts.indexOf(current)
    const nextIndex = (currentIndex + 1) % appListSorts.length // Loop back to 0 after the last item
    return appListSorts[nextIndex]
  }

  const handleSort = () => {
    const newSort = getNextSort(sort)
    setSort(newSort)
    const sortedProcesses = (() => {
      switch (newSort) {
        case "alphabetical":
          return [...processes].sort((a, b) => a.name.localeCompare(b.name))
        case "cpu":
          return [...processes].sort((a, b) => b.cpu - a.cpu)
        case "ram":
          return [...processes].sort((a, b) => b.memory - a.memory)
        default:
          return processes
      }
    })()
    setProcessList(sortedProcesses)
    playSortSound()
  }

  // Gamepad Logic
  const gamepadInfo = useGamepad()

  useEffect(() => {
    if (gamepadInfo.connected) {
      if (gamepadInfo.buttonY) {
        handleSort()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "y" || event.key === "Y") {
        handleSort()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [gamepadInfo, sort, setSort, getNextSort])

  return (
    <div
      id="scrollable-container"
      className="test flex h-full w-full justify-center"
    >
      <div className="p-8">
        <table className="test table border-collapse text-3xl text-black">
          {/* head */}
          <thead className="text-3xl text-black">
            <tr>
              <th>PID</th>
              <th className="">
                <span className="flex items-center">
                  Name
                  <UpArrowIcon show={sort === "alphabetical"} />
                </span>
              </th>
              <th className="">
                <span className="flex">
                  CPU
                  <DownArrowIcon show={sort === "cpu"} />
                </span>
              </th>
              <th className="">
                <span className="flex">
                  RAM
                  <DownArrowIcon show={sort === "ram"} />
                </span>
              </th>
              <th>Close</th>
            </tr>
          </thead>
          <tbody className="">
            {processList.map((process, index) => {
              return (
                <tr>
                  <td>{process.pid}</td>
                  <td>{process.name}</td>
                  <td>{process.cpu.toFixed(2)}</td>
                  <td>{process.memory} MB</td>
                  <td>
                    <Button
                      variant="error"
                      action={getSysInfo}
                      autoFocus={index === 0}
                    >
                      X
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AppList

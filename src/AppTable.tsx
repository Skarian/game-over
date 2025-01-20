import React, { useEffect, useRef, useState } from "react"
import Button from "./Button"
import { ProcessDetails } from "./App"
import { DownArrowIcon, UpArrowIcon } from "./icons/Icons"

// Sortig Logic
export type AppTableSort = "alphabetical" | "cpu" | "ram"

interface AppTable {
  processes: ProcessDetails[]
  sort: AppTableSort
}

const AppTable: React.FC<AppTable> = ({ processes, sort }) => {
  const processList = React.useMemo(() => {
    switch (sort) {
      case "alphabetical":
        return [...processes].sort((a, b) => a.name.localeCompare(b.name))
      case "cpu":
        return [...processes].sort((a, b) => b.cpu - a.cpu)
      case "ram":
        return [...processes].sort((a, b) => b.memory - a.memory)
      default:
        return processes
    }
  }, [processes, sort])

  // Scroll Logic
  const tableRef = useRef<HTMLDivElement>(null)

  // Ensure focused Button is visible
  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const focusedElement = event.target as HTMLElement
      const tableContainer = tableRef.current

      if (tableContainer && focusedElement) {
        const headerHeight = 50 // Adjust based on your actual header height
        const buffer = 10 // Additional space to ensure full visibility
        const containerBounds = tableContainer.getBoundingClientRect()
        const elementBounds = focusedElement.getBoundingClientRect()

        // Adjust scrolling when focused element is above the visible area
        if (elementBounds.top < containerBounds.top + headerHeight + buffer) {
          tableContainer.scrollTop -=
            containerBounds.top +
            headerHeight +
            buffer -
            elementBounds.top +
            focusedElement.offsetHeight // Add the element's height to fully reveal it
        }

        // Adjust scrolling when focused element is below the visible area
        if (elementBounds.bottom > containerBounds.bottom - buffer) {
          tableContainer.scrollTop +=
            elementBounds.bottom - (containerBounds.bottom - buffer)
        }
      }
    }

    document.addEventListener("focus", handleFocus, true) // Capture phase to detect focus shifts

    return () => {
      document.removeEventListener("focus", handleFocus, true)
    }
  }, [])

  return (
    <div
      ref={tableRef}
      className="flex max-h-[calc(85vh-9rem)] flex-grow justify-center overflow-y-auto"
    >
      <table className="w-full table-auto border-collapse bg-white text-3xl">
        <thead className="sticky top-0 bg-gray-200">
          <tr>
            <th className="border-b px-2 py-2 text-left font-medium text-gray-700">
              PID
            </th>
            <th className="border-b px-2 py-2 text-left font-medium text-gray-700">
              <span className="flex">
                Name
                <UpArrowIcon show={sort === "alphabetical"} />
              </span>
            </th>
            <th className="border-b px-2 py-2 text-left font-medium text-gray-700">
              <span className="flex">
                CPU
                <DownArrowIcon show={sort === "cpu"} />
              </span>
            </th>
            <th className="border-b px-2 py-2 text-left font-medium text-gray-700">
              <span className="flex">
                RAM
                <DownArrowIcon show={sort === "ram"} />
              </span>
            </th>
            <th className="border-b px-2 py-2 text-left font-medium text-gray-700">
              Close
            </th>
          </tr>
        </thead>
        <tbody>
          {processList.map((process, index) => (
            <tr key={process.pid} className="focus:bg-gray-100">
              <td className="border-b px-4 py-2 text-gray-600">
                {process.pid}
              </td>
              <td className="border-b px-4 py-2 text-gray-600">
                {process.name}
              </td>
              <td className="border-b px-4 py-2 text-gray-600">
                {process.cpu.toFixed(2)}
              </td>
              <td className="border-b px-4 py-2 text-gray-600">
                {process.memory}MB
              </td>
              <td className="border-b px-4 py-2 text-gray-600">
                <Button
                  variant="error"
                  action={() => { }}
                  autoFocus={index === 0}
                >
                  X
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AppTable

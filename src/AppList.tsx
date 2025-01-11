import React from "react"
import Button from "./Button"

const AppList = () => {
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
  return (
    <div className="flex h-full w-full justify-center overflow-scroll">
      <div className="p-8">
        <table className="table border-collapse text-3xl text-black">
          {/* head */}
          <thead className="text-3xl text-black">
            <tr>
              <th>Name</th>
              <th>CPU</th>
              <th>RAM</th>
              <th>Type</th>
              <th>Close</th>
            </tr>
          </thead>
          <tbody className="">
            {entries.map((entry, index) => {
              return (
                <tr>
                  <td>{entry.name}</td>
                  <td>{entry.cpu}</td>
                  <td>{entry.ram}</td>
                  <td>{entry.type}</td>
                  <td>
                    <Button
                      variant="error"
                      action={() => {}}
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

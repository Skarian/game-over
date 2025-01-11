import React from "react"

const Controls = () => {
  return (
    <>
      <div className="space-x-2 text-3xl text-white">
        <kbd className="kbd kbd-sm mr-4 bg-white text-2xl text-black">A</kbd>
        Interact
      </div>
      <div className="space-x-2 text-3xl text-white">
        <kbd className="kbd kbd-sm mr-4 bg-white text-2xl text-black">X</kbd>
        Save Game
      </div>
      <div className="space-x-2 text-3xl text-white">
        <kbd className="kbd kbd-sm mr-4 bg-white text-2xl text-black">
          START
        </kbd>
        Quit
      </div>
    </>
  )
}

export default Controls

// https://github.com/Lunakepio/useGamepad/blob/main/useGamepad.jsx

import { useState, useEffect } from "react"

type GamepadInfo = {
  connected: boolean
  buttonA: boolean
  buttonB: boolean
  buttonX: boolean
  buttonY: boolean
  joystick: "left" | "right" | "up" | "down" | "neutral"
  joystickRight: "left" | "right" | "up" | "down" | "neutral"
  RB: boolean
  LB: boolean
  RT: boolean
  LT: boolean
  start: boolean
  select: boolean
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

export const useGamepad = () => {
  const [gamepadInfo, setGamepadInfo] = useState<GamepadInfo>({
    connected: false,
    buttonA: false,
    buttonB: false,
    buttonX: false,
    buttonY: false,
    joystick: "neutral",
    joystickRight: "neutral",
    RB: false,
    LB: false,
    RT: false,
    LT: false,
    start: false,
    select: false,
    up: false,
    down: false,
    left: false,
    right: false,
  })

  // Function to determine joystick direction
  const getJoystickDirection = (
    x: number,
    y: number
  ): "left" | "right" | "up" | "down" | "neutral" => {
    const threshold = 0.5 // Adjust threshold for sensitivity
    if (x < -threshold) return "left"
    if (x > threshold) return "right"
    if (y < -threshold) return "up" // Negative Y for up (inverted axis)
    if (y > threshold) return "down"
    return "neutral"
  }

  // Function to update gamepad state
  const updateGamepadState = () => {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : []
    const gamepad = gamepads[0] // Assuming the first gamepad

    if (gamepad) {
      const newGamepadInfo: GamepadInfo = {
        connected: true,
        buttonA: gamepad.buttons[0].pressed,
        buttonB: gamepad.buttons[1].pressed,
        buttonX: gamepad.buttons[2].pressed,
        buttonY: gamepad.buttons[3].pressed,
        joystick: getJoystickDirection(gamepad.axes[0], gamepad.axes[1]),
        joystickRight: getJoystickDirection(gamepad.axes[2], gamepad.axes[3]),
        LT: gamepad.buttons[6].pressed,
        RT: gamepad.buttons[7].pressed,
        LB: gamepad.buttons[4].pressed,
        RB: gamepad.buttons[5].pressed,
        start: gamepad.buttons[9].pressed,
        select: gamepad.buttons[8].pressed,
        up: gamepad.buttons[12].pressed,
        down: gamepad.buttons[13].pressed,
        left: gamepad.buttons[14].pressed,
        right: gamepad.buttons[15].pressed,
      }

      if (JSON.stringify(newGamepadInfo) !== JSON.stringify(gamepadInfo)) {
        setGamepadInfo(newGamepadInfo)
      }
    }
  }

  useEffect(() => {
    const gamepadConnected = () => {
      console.log("Gamepad connected!")
      updateGamepadState()
    }

    const gamepadDisconnected = () => {
      console.log("Gamepad disconnected!")
      setGamepadInfo({
        connected: false,
        buttonA: false,
        buttonB: false,
        buttonX: false,
        buttonY: false,
        joystick: "neutral",
        joystickRight: "neutral",
        RB: false,
        LB: false,
        RT: false,
        LT: false,
        start: false,
        select: false,
        up: false,
        down: false,
        left: false,
        right: false,
      })
    }

    window.addEventListener("gamepadconnected", gamepadConnected)
    window.addEventListener("gamepaddisconnected", gamepadDisconnected)

    const interval = setInterval(updateGamepadState, 10)

    return () => {
      window.removeEventListener("gamepadconnected", gamepadConnected)
      window.removeEventListener("gamepaddisconnected", gamepadDisconnected)
      clearInterval(interval)
    }
  }, [gamepadInfo])

  return gamepadInfo
}

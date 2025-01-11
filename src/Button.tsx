import { useFocusable } from "@noriginmedia/norigin-spatial-navigation"
import { useEffect } from "react"
import navigationSound from "/sounds/deck_ui_navigation.mp3"
import enterSound from "/sounds/deck_ui_into_game_detail.mp3"
import useSound from "use-sound"
import { useGamepad } from "./useGamepad"
import { useAnimate, usePresence } from "motion/react"
import { mergeRefs } from "react-merge-refs"

type ButtonVariant = "default" | "error"

interface ButtonProps {
  variant?: ButtonVariant // Optional with a default value
  action: () => void
  autoFocus?: boolean
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  action,
  autoFocus,
  children,
  variant = "default",
}) => {
  const [scope, animate] = useAnimate()
  const [isPresent, safeToRemove] = usePresence()
  const [playNavigation] = useSound(navigationSound)
  const [playEnter] = useSound(enterSound)

  const handleSelect = async () => {
    playEnter()
    action()
    await selectAnimation()
  }

  const { ref, focusSelf, focused } = useFocusable({
    onEnterRelease: async () => {
      await handleSelect()
    },
    onFocus: async () => {
      playNavigation()
    },
  })

  const gamepadInfo = useGamepad()

  useEffect(() => {
    if (gamepadInfo.connected && focused) {
      if (gamepadInfo.buttonA) {
        handleSelect()
      }
    }
  }, [gamepadInfo])

  useEffect(() => {
    if (autoFocus) {
      focusSelf()
    }
  }, [autoFocus, focusSelf])

  // Enter and Exit Animations
  useEffect(() => {
    if (isPresent) {
      const enterAnimation = async () => {
        await animate(scope.current, { opacity: 1 })
      }

      enterAnimation()
    } else {
      const exitAnimation = async () => {
        await animate(scope.current, { opacity: 0 })
        safeToRemove()
      }

      exitAnimation()
    }
  }, [isPresent])

  // Button Select Event Animation
  const selectAnimation = async () => {
    await animate(scope.current, { scale: 1.1 }, { duration: 0.05 })
    await animate(scope.current, { scale: 0.9 }, { duration: 0.1 })
    await animate(scope.current, { scale: 1 }, { duration: 0.1 })
  }

  const buttonBaseClass = {
    default: "btn-neutral",
    error: "btn-error",
  }[variant || "default"]

  const buttonFocusClass = {
    default: "focus:btn-primary",
    error: "btn-error",
  }[variant || "default"]

  return (
    <button
      ref={mergeRefs([ref, scope])}
      className={`btn btn-lg text-2xl opacity-0 ${buttonBaseClass} ${buttonFocusClass}`}
    >
      {children}
    </button>
  )
}

export default Button

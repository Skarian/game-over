import { useFocusable } from "@noriginmedia/norigin-spatial-navigation"
import { useEffect } from "react"
import navigationSound from "/sounds/deck_ui_navigation.mp3"
import enterSound from "/sounds/deck_ui_into_game_detail.mp3"
import useSound from "use-sound"
import { useGamepad } from "./useGamepad"
import { useAnimate, usePresence } from "motion/react"
import { mergeRefs } from "react-merge-refs"
import { useInView } from "react-intersection-observer"
import { Element } from "react-scroll"

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

  // Scrolling Behavior
  const { ref: viewRef } = useInView({ threshold: 0 })
  // useEffect(() => {
  //   if (focused && !inView) {
  //     console.log("AM SCROLLING")
  //     // scroller.scrollTo("myScrollTarget", {
  //     //   containerId: "scrollable-container",
  //     //   duration: 500,
  //     //   smooth: true,
  //     //   // offset: -100,
  //     // })
  //     ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
  //   }
  // }, [focused, inView])

  // Button Select Event Animation
  const selectAnimation = async () => {
    await animate(scope.current, { scale: 1.1 }, { duration: 0.05 })
    await animate(scope.current, { scale: 0.9 }, { duration: 0.1 })
    await animate(scope.current, { scale: 1 }, { duration: 0.1 })
  }

  const buttonBaseClass = {
    default: "btn-neutral",
    error: "btn-error bg-red-300 text-black",
  }[variant || "default"]

  const buttonFocusClass = {
    default: "focus:btn-primary",
    error: "focus:bg-red-700 focus:text-white",
  }[variant || "default"]

  return (
    <Element name="myScrollTarget">
      <button
        ref={mergeRefs([ref, scope, viewRef])}
        className={`btn btn-lg text-2xl opacity-0 ${buttonBaseClass} ${buttonFocusClass}`}
      >
        {children}
      </button>
    </Element>
  )
}

export default Button

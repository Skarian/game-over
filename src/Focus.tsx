import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useEffect } from "react";
import navigationSound from "/sounds/deck_ui_navigation.mp3"
import enterSound from "/sounds/deck_ui_into_game_detail.mp3"
import useSound from "use-sound";
import { useGamepad } from "./useGamepad";

const Focus: React.FC<{ action: () => void, autoFocus: boolean, children: React.ReactNode, focusedStyle: string, unFocusedStyle: string, className: string }> = ({ action, autoFocus, children, className }) => {
  const [playNavigation] = useSound(navigationSound);
  const [playEnter] = useSound(enterSound);
  const handleSelect = () => {
    playEnter()
    action()
  }

  const { ref, focusSelf, focused } = useFocusable({
    onEnterRelease: () => {
      handleSelect()
    },
    onFocus: () => {
      playNavigation()
    }
  });

  const gamepadInfo = useGamepad();

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

  return (
    <button
      ref={ref}
      className={className}
    >
      {children}
    </button>
  );
};

export default Focus;

import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useEffect } from "react";
import navigationSound from "/sounds/deck_ui_navigation.mp3"
import enterSound from "/sounds/deck_ui_into_game_detail.mp3"
import useSound from "use-sound";

const Focus: React.FC<{ action: () => void, autoFocus: boolean, children: React.ReactNode, focusedStyle: string, unFocusedStyle: string, className: string }> = ({ action, autoFocus, children, focusedStyle, unFocusedStyle, className }) => {
  const [playNavigation] = useSound(navigationSound);
  const [playEnter] = useSound(enterSound);
  const { ref, focusSelf, focused } = useFocusable({
    onEnterRelease: () => {
      action()
      playEnter()
    },
    // onArrowPress: (direction, props, details) => {
    //   playNavigation()
    //   return true
    // },
    onFocus: () => {
      playNavigation()
    }
  });


  useEffect(() => {
    if (autoFocus) {
      focusSelf()
    }
  }, [autoFocus, focusSelf])

  return (
    <div
      ref={ref}
      className={`${className} ${focused ? focusedStyle : unFocusedStyle}`}
    >
      {children}
    </div>
  );
};

export default Focus;

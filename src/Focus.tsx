import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useEffect } from "react";

const Focus: React.FC<{ action: () => void, autoFocus: boolean, children: React.ReactNode, focusedStyle: string, unFocusedStyle: string, className: string }> = ({ action, autoFocus, children, focusedStyle, unFocusedStyle, className }) => {
  const { ref, focusSelf, focused } = useFocusable({ onEnterRelease: action });

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

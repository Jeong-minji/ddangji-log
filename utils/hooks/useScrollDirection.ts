import { throttling } from "../throttle";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const HEADER_HEIGHT = 48;

const useScrollDirection = () => {
  const [isScrollDown, setIsScrollDown] = useState(false);

  const scrollPosition = useRef(0);

  const handleScroll = useCallback(() => {
    const position = window.pageYOffset;

    if (position < HEADER_HEIGHT) setIsScrollDown(false);
    else setIsScrollDown(position > scrollPosition.current);

    scrollPosition.current = position;
  }, []);

  const throttle = useMemo(() => throttling(300), []);

  const throttleScroll = () => throttle(handleScroll);

  useEffect(() => {
    window.addEventListener("scroll", throttleScroll);
    return () => window.removeEventListener("scroll", throttleScroll);
  }, [throttleScroll]);

  return { isScrollUp: !isScrollDown, isScrollDown };
};

export default useScrollDirection;

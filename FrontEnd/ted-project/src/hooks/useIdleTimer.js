// src/hooks/useIdleTimer.js
import { useEffect, useRef } from 'react';

const useIdleTimer = (onIdle, timeout = 300000) => { // 5 λεπτά = 300000 ms
  const timer = useRef(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(onIdle, timeout);
    };

    const handleEvents = () => {
      resetTimer();
    };

    window.addEventListener('mousemove', handleEvents);
    window.addEventListener('keypress', handleEvents);

    resetTimer();

    return () => {
      clearTimeout(timer.current);
      window.removeEventListener('mousemove', handleEvents);
      window.removeEventListener('keypress', handleEvents);
    };
  }, [onIdle, timeout]);

  return timer;
};

export default useIdleTimer;

import { useEffect, useRef, useState } from 'react';

export default function useWorkoutTimer(initialSeconds, onFinish) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onFinish && onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return seconds;
}
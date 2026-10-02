import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** `true` quando o sistema pede para reduzir movimento. Falhas na consulta contam como `false`. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(() => AccessibilityInfo.isReduceMotionEnabled())
      .then((value) => {
        if (active) setReduced(!!value);
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (value: boolean) =>
      setReduced(!!value),
    );
    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  return reduced;
}

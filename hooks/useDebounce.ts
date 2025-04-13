import { useEffect, useCallback } from "react";
import { TDependencies, TEffectFn } from "./types/DebounceType";

export default function useDebounce(
  effect: TEffectFn,
  dependencies: TDependencies,
  delay: number
) {
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}

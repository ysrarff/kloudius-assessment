import { useEffect, useCallback } from "react";

type TEffect = () => void;
type TDependencies = React.DependencyList;

export default function useDebounce(
  effect: TEffect,
  dependencies: TDependencies,
  delay: number
) {
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}

import { useCallback, useRef } from 'react';

export function useRefWithCallback<T>({
  onChange,
}: {
  onChange: (node: T | null) => void;
}) {
  const ref = useRef<T | null>(null);

  const setRef = useCallback((node: T | null) => {
    onChange(node);

    if (node) {
    }

    ref.current = node;
  }, []);

  return { ref, setRef };
}

import { useEffect, useRef, useState } from "react";

export function useDropdown<T extends HTMLElement = HTMLDivElement>(
  onChange?: (value: string) => void,
) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<T>(null);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((v) => !v);

  const select = (value: string) => {
    onChange?.(value);
    close();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return { isOpen, toggle, select, rootRef };
}

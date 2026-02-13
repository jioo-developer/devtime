import { useEffect } from "react";

export function useInfiniteScroll({
  enabled,
  targetRef,
  onIntersect,
  rootMargin = "0px",
  threshold = 0,
}: {
  enabled: boolean;
  targetRef: React.RefObject<Element | null>;
  onIntersect: () => void;
  rootMargin?: string;
  threshold?: number;
}) {
  useEffect(() => {
    if (!enabled) return;

    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onIntersect();
      },
      { rootMargin, threshold },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, targetRef, onIntersect, rootMargin, threshold]);
}

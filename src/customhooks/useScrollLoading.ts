import { useEffect, useRef, useCallback } from "react";

export const useScrollLoading = (
  containerRef: React.RefObject<HTMLDivElement>,
  visibleCount: number,
  totalCount: number,
  _globalKey: string,
  increaseCount: () => void,
  expandedSections: Record<string, boolean> // Add this parameter
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingDivRef = useRef<HTMLDivElement>(null);

  // Function to check if more tables should be loaded
  const checkAndLoadMore = useCallback(() => {
    if (visibleCount >= totalCount) return;

    const container = containerRef.current;
    if (!container) return;

    // Check if we need to load more based on collapsed sections
    const collapsedSectionsCount = Object.values(expandedSections).filter(expanded => !expanded).length;
    const expandedSectionsCount = Object.values(expandedSections).filter(expanded => expanded).length;
    
    // If more than half of the sections are collapsed, load more
    if (collapsedSectionsCount > expandedSectionsCount && visibleCount < totalCount) {
      increaseCount();
      return;
    }

    // Check if container has enough content to scroll
    const containerHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;
    const scrollTop = container.scrollTop;

    // If there's not enough content to scroll or we're near the bottom
    if (scrollHeight <= containerHeight || (scrollTop + containerHeight) >= scrollHeight - 100) {
      if (visibleCount < totalCount) {
        increaseCount();
      }
    }
  }, [visibleCount, totalCount, expandedSections, increaseCount, containerRef]);

  // Intersection Observer for the loading div
  useEffect(() => {
    if (!loadingDivRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < totalCount) {
          increaseCount();
        }
      },
      {
        root: containerRef.current,
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    observer.observe(loadingDivRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleCount, totalCount, increaseCount, containerRef]);

  // Check and load more when expanded sections change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAndLoadMore();
    }, 100); // Small delay to ensure DOM updates

    return () => clearTimeout(timeoutId);
  }, [expandedSections, checkAndLoadMore]);

  // Initial load check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAndLoadMore();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return { loadingDivRef };
};
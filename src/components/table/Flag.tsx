import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVisibleCount } from "../../features/data/dataSlice.ts";
import type { RootState } from "../../Store/Store.ts";
import { applyFilter } from "./GridUtils.tsx";
import { useLocalStorageSync } from "../../customhooks/useLocalStorageSync.ts";
export const useFlagManager = (
  globalKey: string,
  groupedItems: any[],
  visibleCount: number
) => {
  const dispatch = useDispatch();
  const filteredGroupedItems = applyFilter(
    groupedItems,
    useSelector((state: RootState) => state.data.showOnlyZero)
  );
  const [flagInput, setFlagInput] = useState(() => {
    const savedFlag = localStorage.getItem(globalKey);
    return savedFlag === "0" ? "0" : "1";
  });
  const [isOpen, setIsOpen] = useState(() => {
    const savedFlag = localStorage.getItem(globalKey);
    return savedFlag !== "0";
  });
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  const prevGroupedItemsLength = useRef(groupedItems.length);

  useLocalStorageSync(globalKey, (newValue: string) => {
    const value = newValue === "0" ? "0" : "1";
    setFlagInput(value);
    const shouldBeOpen = value !== "0";
    setIsOpen(shouldBeOpen);

    const newExpandedState: { [key: string]: boolean } = {};
    groupedItems.forEach((section: any) => {
      const sectionId = section.section_id.toString();
      newExpandedState[sectionId] = shouldBeOpen;
    });
    setExpandedSections(newExpandedState);

    if (value === "0") {
      dispatch(setVisibleCount(filteredGroupedItems.length));
    } else {
      const newCount = Math.max(1, Math.min(3, filteredGroupedItems.length));
      dispatch(setVisibleCount(newCount));
    }
  });
  useEffect(() => {
    const initialExpandedState: { [key: string]: boolean } = {};
    groupedItems.forEach((section: any) => {
      const sectionId = section.section_id.toString();
      if (expandedSections[sectionId] === undefined) {
        initialExpandedState[sectionId] = isOpen;
      }
    });
    if (Object.keys(initialExpandedState).length > 0) {
      setExpandedSections((prev) => ({ ...prev, ...initialExpandedState }));
    }
  }, [groupedItems, isOpen]);

  useEffect(() => {
    const currentFlag = localStorage.getItem(globalKey) || "1";
    const currentLength = groupedItems.length;
    const prevLength = prevGroupedItemsLength.current;
    if (currentLength > prevLength) {
      if (currentFlag === "1") {
        const newVisibleCount = Math.max(
          visibleCount + 1,
          Math.min(visibleCount + 1, currentLength)
        );
        dispatch(setVisibleCount(newVisibleCount));
      } else {
        dispatch(setVisibleCount(currentLength));
      }
    } else if (currentLength < prevLength) {
      const newVisibleCount = Math.min(visibleCount, currentLength);
      dispatch(setVisibleCount(Math.max(1, newVisibleCount)));
    } else if (currentLength > 0 && visibleCount === 1) {
      const initialCount = currentFlag === "1" ? 1 : currentLength;
      dispatch(setVisibleCount(initialCount));
    }
    prevGroupedItemsLength.current = currentLength;
  }, [groupedItems.length, visibleCount, dispatch]);

  const handleFlagInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") {
      setFlagInput("");
      return;
    }
    if (value === "0" || value === "1") {
      setFlagInput(value);
      localStorage.setItem(globalKey, value);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: globalKey,
          newValue: value,
          oldValue: localStorage.getItem(globalKey),
          storageArea: localStorage,
        })
      );
      const shouldBeOpen = value !== "0";
      setIsOpen(shouldBeOpen);
      const newExpandedState: { [key: string]: boolean } = {};
      groupedItems.forEach((section: any) => {
        const sectionId = section.section_id.toString();
        newExpandedState[sectionId] = shouldBeOpen;
      });
      setExpandedSections(newExpandedState);
      if (value === "0") {
        dispatch(setVisibleCount(filteredGroupedItems.length));
      } else {
        const newCount = Math.max(1, Math.min(3, filteredGroupedItems.length));
        dispatch(setVisibleCount(newCount));
      }
    }
  };

  const handleFlagInputBlur = () => {
    if (flagInput === "") {
      setFlagInput("1");
      localStorage.setItem(globalKey, "1");
      setIsOpen(true);
      dispatch(
        setVisibleCount(Math.max(1, Math.min(2, filteredGroupedItems.length)))
      );
    }
  };

  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return {
    flagInput,
    isOpen,
    expandedSections,
    handleFlagInputChange,
    handleFlagInputBlur,
    toggleSectionExpansion,
    setExpandedSections,
  };
};

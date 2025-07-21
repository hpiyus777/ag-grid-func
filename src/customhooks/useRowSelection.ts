import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setSelectedRows } from "../features/data/dataSlice";
import type { GridApi } from "ag-grid-community";

export const useRowSelection = (
  gridRefs: React.MutableRefObject<{ [key: string]: GridApi }>
) => {
  const dispatch = useDispatch();

  const handleSelectionChange = useCallback(() => {
    const selectedNodes: string[] = [];
    Object.values(gridRefs.current).forEach((api) => {
      const nodes = api?.getSelectedNodes() || [];
      nodes.forEach((node) => {
        if (node.data?.item_id) {
          selectedNodes.push(node.data.item_id);
        }
      });
    });

    dispatch(setSelectedRows(selectedNodes));
    const isAnySelected = selectedNodes.length > 0;

    const mainContainer = document.querySelector(".data-grid-container");
    if (mainContainer) {
      if (isAnySelected) {
        mainContainer.classList.add("selection-active");
      } else {
        mainContainer.classList.remove("selection-active");
      }
    }
  }, [dispatch, gridRefs]);

  return handleSelectionChange;
};

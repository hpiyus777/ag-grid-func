import { useRef } from "react";
import type { GridApi } from "ag-grid-community";
import { useDispatch } from "react-redux";
import { moveItemBetweenSections } from "../features/data/dataSlice";

export const useGridApiManager = (groupedItems: any) => {
  const dispatch = useDispatch();
  const gridRefs = useRef<{ [key: string]: GridApi }>({});

  const addDropZone = (
    fromApi: GridApi,
    toApi: GridApi,
    fromSectionId: string,
    toSectionId: string
  ) => {
    const dropZoneParams = toApi.getRowDropZoneParams({
      onDragStop: (params: any) => {
        const draggedNodes = params.nodes;
        const overIndex = params.overIndex;

        // Dragged items ka data
        const movedData = draggedNodes.map((node: any) => ({
          ...node.data,
          section_id: toSectionId,
          section_name: groupedItems.find(
            (s: any) => s.section_id.toString() === toSectionId
          )?.section_name,
        }));

        // Redux action with index
        dispatch(
          moveItemBetweenSections({
            items: movedData,
            fromSectionId,
            toSectionId,
            targetIndex: overIndex >= 0 ? overIndex : 0,
          })
        );
      },
    });

    if (dropZoneParams) {
      fromApi.addRowDropZone(dropZoneParams);
    }
  };

  const onGridReady = (params: any, sectionId: string) => {
    gridRefs.current[sectionId] = params.api;

    Object.entries(gridRefs.current).forEach(([otherSectionId, otherApi]) => {
      if (otherSectionId !== sectionId) {
        addDropZone(params.api, otherApi, sectionId, otherSectionId);
        addDropZone(otherApi, params.api, otherSectionId, sectionId);
      }
    });
  };

  return { gridRefs, onGridReady };
};

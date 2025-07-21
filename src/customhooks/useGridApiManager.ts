import { useRef } from "react";
import type { GridApi } from "ag-grid-community";
import { useDispatch } from "react-redux";
import { moveItemBetweenSections } from "../features/data/dataSlice";

export const useGridApiManager = (groupedItems: any) => {
  const dispatch = useDispatch();
  const gridRefs = useRef<{ [key: string]: GridApi }>({}); //bdha sec na obj ,key store kre sec id wise

  const addDropZone = (
    //Importatnat: cross DND mate dropjone banavel che
    fromApi: GridApi, //aaythi row lese
    toApi: GridApi, //aaya mukse
    fromSectionId: string,
    toSectionId: string
  ) => {
    const dropZoneParams = toApi.getRowDropZoneParams({
      onDragStop: (params: any) => {
        const movedData = params.nodes.map((node: any) => ({
          //jysre row drop krvama aavse to e params.nodes ma mlse node no data copy krvama aave che and ketlik field upate krvama aave che
          ...node.data, //pelano data rakhe
          section_id: toSectionId,
          section_name: groupedItems.find((s: any) => s.section_id.toString())
            ?.section_name,
        }));

        dispatch(
          moveItemBetweenSections({
            items: movedData, //jy row ne move kri hse
            fromSectionId, //jyathi upadi hse
            toSectionId, //jya add kri
          })
        );
      },
    });

    if (dropZoneParams) {
      //agar  valid value hse to
      fromApi.addRowDropZone(dropZoneParams); //drop add krse
    }
  };

  const onGridReady = (params: any, sectionId: string) => {
    //section is wise grid api ne store kre
    gridRefs.current[sectionId] = params.api;

    Object.entries(gridRefs.current).forEach(([otherSectionId, otherApi]) => {
      if (otherSectionId !== sectionId) {
        addDropZone(params.api, otherApi, sectionId, otherSectionId); //crnt grid paramsapi biji gird other api mate dropzone set kre
        addDropZone(otherApi, params.api, otherSectionId, sectionId); //biji gird other api peli grid paramsapi  mate dropzone set kre
      }
      console.log("Grid ready for section:", sectionId);
    });
  }; //new je column hoy ene autofit kre table ma and cross dnd dropzone new mate pn kre+

  return { gridRefs, onGridReady };
};

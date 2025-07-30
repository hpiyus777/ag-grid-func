import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseVisibleCount,
  setGroupedSections,
  deleteSelectedRows,
  openSidebarForSection,
  addNewSectionWithItems,
  deleteSectionById,
} from "../../features/data/dataSlice.ts";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AgGridLoader from "./AgGridLoader.tsx";
import React from "react";
import "../../App.css";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"; //ag grid ni grid api and olumn definitions
import type { RootState } from "../../Store/Store.ts";
import AddSectionDropdown from "./Dropdown";
import Hide from "./Hide";
import YesNo from "./YesNo";
import DltBtn from "./DltBtn";
import TbleHeder from "./TbleHeder";
import NoRecords from "./NoRecords.tsx";
import { Collapse } from "antd";
import { defaultColDef, getColumnDefs } from "./ColumnDefs.tsx";
import { applyFilter, calculateGridHeight } from "./GridUtils.tsx";
import { useFlagManager } from "./Flag.tsx";
import { useScrollLoading } from "../../customhooks/useScrollLoading.ts";
import { useFetchData } from "../../customhooks/useFetchData.ts";
import { useRowSelection } from "../../customhooks/useRowSelection.ts";
import { useGridApiManager } from "../../customhooks/useGridApiManager.ts";
const DataGrid = React.memo(() => {
  const dispatch = useDispatch(); //action dispatch kva
  const { Panel } = Collapse;
  const globalKey = "Flag"; // Key for localStorage to manage expand/collapse state
  const selectedRows = useSelector(
    (state: RootState) => state.data.selectedRows
  ); //redux store mathi row ni id lese

  const { loading, fetchData, sectionLoading, setSectionLoadingState } =
    useFetchData();
  const visibleCount = useSelector(
    (state: RootState) => state.data.visibleCount
  );
  const [showOnlyZero, setShowOnlyZero] = useState("No"); //Zero quantity/unit cost filter valu calculation
  const [showMarkup, setShowMarkup] = useState(true); //markup show hide kre eye btn thi
  const containerRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const groupedItems = useSelector(
    (state: RootState) => state.data.groupedItems
  );
  const { gridRefs, onGridReady } = useGridApiManager(groupedItems);
  const {
    flagInput,
    expandedSections,
    handleFlagInputChange,
    handleFlagInputBlur,
    toggleSectionExpansion,
  } = useFlagManager(globalKey, groupedItems, visibleCount);

  const filteredGroupedItems = applyFilter(groupedItems, showOnlyZero);

  // Updated hook call with expandedSections

  const { loadingDivRef } = useScrollLoading(
    containerRef,
    visibleCount,
    filteredGroupedItems.length,
    globalKey,
    () => dispatch(increaseVisibleCount(1)),
    expandedSections // Pass expandedSections to the hook
  );

  const handleSelectionChange = useRowSelection(gridRefs); //selcted row ni id lese and style update krse
  const handleDragEnd = (result: { source: any; destination: any }) => {
    const { source, destination } = result;
    if (!destination || !source) return;

    const reordered = Array.from(groupedItems);
    const [movedSection] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, movedSection);

    dispatch(setGroupedSections(reordered)); //aakha table ne  dnd krva mate
  };

  // Enhanced grid ready handler with loading state
  const handleGridReady = (params: any, sectionId: string) => {
    onGridReady(params, sectionId);

    // Simulate section-specific loading (you can remove this in production)
    setSectionLoadingState(sectionId, false);
    setTimeout(() => {
      setSectionLoadingState(sectionId, false);
    }, 100);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]); //data fatch from JSON file on component mount with common component

  const rowSelection = "multiple"; ///slect multiple rows
  if (loading || groupedItems.length === 0) {
    return (
      <div className="h-screen overflow-y-auto">
        <div className="flex justify-end items-center gap-2 sticky top-0 bg-white z-10 py-2">
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex items-center gap-4 justify-between w-[calc(100%-75px)]">
              <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-20 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-10 px-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="p-4 mainDiv my-4 mb-6 rounded-lg shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-6 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-6 w-6 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mr-3" />
                  <span className="text-gray-600 text-sm">Loading data...</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto"
      style={{
        scrollBehavior: "smooth",
      }}
    >
      <div className="flex justify-end items-center gap-2 sticky top-0 bg-white z-10 py-2">
        <div className="flex justify-between items-center w-full gap-2">
          <div className="flex items-center gap-4 justify-between w-[calc(100%-75px)]">
            <AddSectionDropdown />
            <Hide showMarkup={showMarkup} setShowMarkup={setShowMarkup} />
            <YesNo
              showOnlyZero={showOnlyZero}
              setShowOnlyZero={setShowOnlyZero}
            />
          </div>
          <DltBtn
            selectedRows={selectedRows}
            onDelete={() => dispatch(deleteSelectedRows(selectedRows))}
          />
        </div>
        <div className="flex items-center gap-2 mx-6 whitespace-nowrap">
          <label className="text-sm font-medium flex">0 or 1</label>
          <select
            value={flagInput}
            onChange={handleFlagInputChange}
            onBlur={handleFlagInputBlur}
          >
            <option value="0">0</option>
            <option value="1">1</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-10 px-1 h-screen">
        <div className="data-grid-container">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tables" type="TABLE">
              {(provided) => (
                <div
                  key={`${groupedItems.length}-${visibleCount}`}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {filteredGroupedItems
                    .slice(0, visibleCount)
                    .map((sectionObj: any, index: number) => {
                      const sectionId = sectionObj.section_id.toString();
                      const isOpen = !!expandedSections[sectionId];
                      const isSectionLoading = sectionLoading[sectionId];
                      return (
                        <Draggable
                          draggableId={sectionId}
                          index={index}
                          key={sectionId}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="p-4 mainDiv my-4 mb-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
                            >
                              <TbleHeder
                                dragHandleProps={provided.dragHandleProps}
                                sectionName={sectionObj.section_name}
                                itemCount={sectionObj.items.length}
                                isOpen={isOpen}
                                onToggle={() =>
                                  toggleSectionExpansion(sectionId)
                                }
                                onEditClick={() =>
                                  dispatch(
                                    openSidebarForSection({
                                      section_id: sectionObj.section_id,
                                      section_name: sectionObj.section_name,
                                      itemCount: sectionObj.items.length,
                                    })
                                  )
                                }
                                onDuplicateClick={() =>
                                  dispatch(addNewSectionWithItems(sectionObj))
                                }
                                onDeleteClick={() =>
                                  dispatch(
                                    deleteSectionById(sectionObj.section_id)
                                  )
                                }
                              />
                              <Collapse
                                activeKey={isOpen ? [sectionId] : []}
                                expandIconPosition="start"
                                ghost // styling your own custom headers
                              >
                                <Panel
                                  key={sectionId}
                                  showArrow={false}
                                  header={null}
                                >
                                  <div
                                    className="ag-theme-alpine-dark"
                                    style={{
                                      height: `${calculateGridHeight(
                                        sectionObj.items.length
                                      )}px`,
                                      width: "100%",
                                      minHeight: "200px",
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                  >
                                    <AgGridReact
                                      rowData={sectionObj.items.map(
                                        (item: any) => ({ ...item })
                                      )}
                                      columnDefs={getColumnDefs(showMarkup)}
                                      defaultColDef={defaultColDef}
                                      onGridReady={(params) =>
                                        handleGridReady(params, sectionId)
                                      }
                                      rowDragManaged={true}
                                      animateRows={true}
                                      getRowId={(params) =>
                                        params.data.item_id.toString()
                                      }
                                      enableCellTextSelection={false}
                                      domLayout="normal"
                                      suppressColumnVirtualisation={true}
                                      rowHeight={48}
                                      headerHeight={48}
                                      suppressDragLeaveHidesColumns={true}
                                      suppressMoveWhenColumnDragging={true}
                                      allowDragFromColumnsToolPanel={true}
                                      suppressColumnMoveAnimation={true}
                                      suppressMoveWhenRowDragging={true}
                                      rowDragMultiRow={true}
                                      rowSelection={rowSelection}
                                      suppressMenuHide={true}
                                      onSelectionChanged={handleSelectionChange}
                                      enableBrowserTooltips={false}
                                      suppressRowClickSelection={true}
                                      noRowsOverlayComponent={NoRecords}
                                      tooltipMouseTrack={false}
                                      tooltipShowDelay={100}
                                      tooltipHideDelay={400}
                                      loading={isSectionLoading}
                                      loadingOverlayComponent={AgGridLoader}
                                      noRowsOverlayComponentParams={{
                                        text: "No Items Found",
                                      }}
                                    />
                                  </div>
                                </Panel>
                              </Collapse>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="text-sm text-gray-500 mt-2">
          loader
          <div className="bg-gray-100 p-2 rounded mt-1">
            {JSON.stringify(
              {
                tabel: visibleCount,
              },
              null,
              2
            )}
          </div>
        </div>

        {visibleCount < filteredGroupedItems.length && (
          <div ref={loadingDivRef} className="text-center py-6">
            {/* <div className="inline-flex items-center text-gray-600">
              tables... !!!!!!!!!!!!!({visibleCount} of{" "}
              {filteredGroupedItems.length})
            </div> */}
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
});

export default React.memo(DataGrid);

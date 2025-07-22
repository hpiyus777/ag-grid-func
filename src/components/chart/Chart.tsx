import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import Chart from "react-apexcharts";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  moveItemBetweenSections,
  deleteSelectedRows,
  updateSectionItems,
} from "../../features/data/dataSlice";
import { useGridApiManager } from "../../customhooks/useGridApiManager";
import { useRowSelection } from "../../customhooks/useRowSelection";
import { defaultColDef, getColumnDefs } from "../table/ColumnDefs";
import { calculateGridHeight } from "../table/GridUtils";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const ChartWithTable = ({ showMarkup = true }) => {
  const dispatch = useDispatch();
  const groupedItems = useSelector((state: any) => state.data.groupedItems);
  const selectedRows = useSelector((state: any) => state.data.selectedRows);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<any[]>([]);

  // Get section names for dropdown
  const sectionNames = useMemo(
    () => groupedItems?.map((s: any) => s.section_name) || [],
    [groupedItems]
  );

  const [selectedSection, setSelectedSection] = useState(sectionNames[0] || "");

  // Grid API management for cross-DND
  const { gridRefs, onGridReady } = useGridApiManager(groupedItems);
  const handleSelectionChange = useRowSelection(gridRefs);

  // Get selected section data
  const selectedSectionData = useMemo(() => {
    return groupedItems?.find(
      (section: { section_name: any }) =>
        section.section_name === selectedSection
    );
  }, [groupedItems, selectedSection]);

  // Calculate summary for chart - use edited data if in edit mode
  const summary = useMemo(() => {
    const dataToUse = isEditMode ? editedData : selectedSectionData?.items;

    if (!dataToUse || !dataToUse.length) {
      return { totalQuantity: 0, totalUnitCost: 0, totalValue: 0, count: 0 };
    }

    let totalQuantity = 0;
    let totalUnitCost = 0;
    let totalValue = 0;
    let count = dataToUse.length;

    for (const item of dataToUse) {
      const quantity = Number(item.quantity || 0);
      const unitCost = Number(item.unit_cost || 0);
      const markup = Number(item.markup || 0);

      totalQuantity += quantity;
      totalUnitCost += unitCost;
      totalValue += quantity * unitCost * (1 + markup / 100);
    }

    return { totalQuantity, totalUnitCost, totalValue, count };
  }, [selectedSectionData, isEditMode, editedData]);

  // Chart configuration
  const chartOptions = {
    chart: {
      type: "donut" as "donut",
      height: 350,
    },
    labels: ["Total Quantity", "Total Unit Cost", "Total Value"],
    colors: ["#3B82F6", "#10B981", "#F59E0B"],
    legend: {
      show: true,
      position: "bottom" as "bottom",
      horizontalAlign: "center" as "center",
      fontSize: "14px",
      markers: {
        size: 12,
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: any) => val.toLocaleString(),
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              color: "#374151",
              offsetY: -10,
              formatter: () => `Items: ${summary.count}`,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
              color: "#1F2937",
              offsetY: 10,
              formatter: () => `$${(summary.totalValue / 1000).toFixed(1)}K`,
            },
            total: {
              show: true,
              showAlways: true,
              label: `Items: ${summary.count}`,
              fontSize: "16px",
              fontWeight: 600,
              color: "#374151",
              formatter: () => `$${(summary.totalValue / 1000).toFixed(1)}K`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  const chartSeries = [
    summary.totalQuantity,
    summary.totalUnitCost,
    summary.totalValue,
  ];

  // Handle drag end for cross-section DND
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination || !source) return;

    // This handles the drag and drop between different sections
    if (source.droppableId !== destination.droppableId) {
      const sourceSection = groupedItems.find(
        (s: { section_id: { toString: () => any } }) =>
          s.section_id.toString() === source.droppableId
      );
      const destSection = groupedItems.find(
        (s: { section_id: { toString: () => any } }) =>
          s.section_id.toString() === destination.droppableId
      );

      if (sourceSection && destSection) {
        const draggedItem = sourceSection.items[source.index];
        const movedData = [
          {
            ...draggedItem,
            section_id: destination.droppableId,
            section_name: destSection.section_name,
          },
        ];

        dispatch(
          moveItemBetweenSections({
            items: movedData,
            fromSectionId: source.droppableId,
            toSectionId: destination.droppableId,
          })
        );
      }
    }
  };

  // Handle edit mode
  const handleEditClick = () => {
    console.log("clcick") 
    setIsEditMode(true);
    // Create deep copies of the data to make them mutable
    setEditedData(selectedSectionData.items.map((item: any) => ({ ...item })));
  };

  // Handle save changes
  // const handleSaveClick = () => {
  //   dispatch(updateSectionItems({
  //     section_id: selectedSectionData.section_id,
  //     updatedItems: editedData
  //   }));
  //   setIsEditMode(false);
  //   setEditedData([]);
  // }

  // Handle cancel edit
  const handleCancelEdit = () => {
    dispatch(
      updateSectionItems({
        section_id: selectedSectionData.section_id,
        updatedItems: editedData,
      })
    );
    console.log("cancel")
    setIsEditMode(false);
    setEditedData([]);
  };

  // Handle cell value changed
  const handleCellValueChanged = (params: any) => {
    if (isEditMode) {
      const { data, colDef, newValue } = params;
      const field = colDef.field;

      // Update the edited data
      setEditedData((prevData) => {
        const updatedData = prevData.map((item) =>
          item.item_id === data.item_id ? { ...item, [field]: newValue } : item
        );
        return updatedData;
      });
    }
  };

  if (!groupedItems || groupedItems.length === 0) {
    return <div className="p-4">No data available</div>;
  }

  if (!selectedSectionData) {
    return <div className="p-4">No section selected</div>;
  }

  return (
    <div className="p-4 mx-auto text-black space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm font-medium">Select Section:</label>
        <select
          className="w-64 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          {sectionNames.map((name: any) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {selectedSection} - Overview
        </h2>
        <Chart
          type="donut"
          height={350}
          options={chartOptions}
          series={chartSeries}
        />

        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div className="bg-blue-50 p-4 rounded-lg whitespace-nowrap text-ellipsis overflow-hidden">
            <div className="text-2xl font-bold text-blue-600">
              {summary.totalQuantity.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 ">Total Quantity</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg whitespace-nowrap text-ellipsis overflow-hidden">
            <div className="text-2xl font-bold text-green-600">
              ${summary.totalUnitCost.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Unit Cost</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg whitespace-nowrap text-ellipsis overflow-hidden">
            <div className="text-2xl font-bold text-yellow-600">
              ${summary.totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {selectedSection} - Items ({selectedSectionData.items.length})
          </h2>
          <div className="flex gap-2">
            {!isEditMode ? (
              <>
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                {selectedRows.length > 0 && (
                  <button
                    onClick={() => dispatch(deleteSelectedRows(selectedRows))}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete Selected ({selectedRows.length})
                  </button>
                )}
              </>
            ) : (
              <>
                {/* <button
                  onClick={handleSaveClick}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save
                </button> */}
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="ag-theme-alpine-dark">
            <div
              style={{
                height: `${calculateGridHeight(
                  selectedSectionData.items.length
                )}px`,
                width: "100%",
              }}
            >
              <AgGridReact
                rowData={
                  isEditMode
                    ? editedData
                    : selectedSectionData.items.map((item: any) => ({
                        ...item,
                      }))
                }
                columnDefs={getColumnDefs(showMarkup, isEditMode)}
                defaultColDef={defaultColDef}
                onGridReady={(params) =>
                  onGridReady(params, selectedSectionData.section_id.toString())
                }
                onCellValueChanged={handleCellValueChanged}
                rowDragManaged={!isEditMode}
                animateRows={true}
                getRowId={(params) => params.data.item_id.toString()}
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
                rowSelection="multiple"
                suppressMenuHide={true}
                onSelectionChanged={handleSelectionChange}
                enableBrowserTooltips={false}
                suppressRowClickSelection={true}
                tooltipMouseTrack={false}
                tooltipShowDelay={100}
                tooltipHideDelay={400}
                readOnlyEdit={false}
                stopEditingWhenCellsLoseFocus={true}
                undoRedoCellEditing={true}
                undoRedoCellEditingLimit={20}
              />
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ChartWithTable;

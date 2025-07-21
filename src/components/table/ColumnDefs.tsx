import { type ColDef } from "ag-grid-community";
import { FaEyeSlash } from "react-icons/fa";
import CustomTooltip from "./CustomTooltip";
import { IconRedner } from "./IconRedner";
import IconDelete from "./IconDelete";

const MarkupCellRenderer = (props: any) => {
  if (!props.showMarkup) {
    return (
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <FaEyeSlash />
      </div>
    );
  }
  return props.value;
};

export const getColumnDefs = (showMarkup: boolean , isEditMode: boolean = true): ColDef[] => {
  const baseColumns: ColDef[] = [
    {
      rowDrag: true,
      width: 60,
      pinned: "left" as "left",
      lockPosition: true,
      resizable: false,
      colId: "dragCol",
      cellClass: "hover-drag",
    },
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 60,
      pinned: "left" as "left",
      lockPosition: true,
      suppressMovable: true,
      resizable: false,
      colId: "checkboxCol",
      cellClass: "hover-checkbox",
    },
    {
      field: "item_id",
      headerName: "Item ID",
      width: 120,
      // cellRenderer: CustomTooltip,
      tooltipValueGetter: (params) => params.value,
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 2,
      editable: isEditMode,
      // cellRenderer: CustomTooltip,
      tooltipValueGetter: (params) => params.value,
      
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 120,
      editable: isEditMode,
      // cellRenderer: CustomTooltip,
      tooltipValueGetter: (params) => params.value,
    },
    {
      field: "unit",
      headerName: "Unit",
      width: 100,
      editable: isEditMode,
      // cellRenderer: CustomTooltip,
      tooltipValueGetter: (params) => params.value,
    },
    {
      field: "unit_cost",
      headerName: "Unit Cost",
      width: 120,
      editable: isEditMode,
      // cellRenderer: CustomTooltip,
      tooltipValueGetter: (params) => params.value,
    },
    {
      field: "markup",
      headerName: "Markup (%)",
      width: 120,
      editable: showMarkup,
      cellRenderer: MarkupCellRenderer,
      cellRendererParams: { showMarkup },
    },
    {
      field: "total",
      headerName: "Total",
      width: 120,
      editable: isEditMode,
      // cellRenderer: CustomTooltip,
      tooltipValueGetter: (params) => params.value,
    },
    {
      field: "section_name",
      headerName: "Section",
      flex: 1,
      editable: isEditMode,
      // cellRenderer: CustomTooltip,
      tooltipValueGetter: (params) => params.value,
    },
    {
      field: "item_type_name",
      headerName: "Type",
      flex: 1,
      editable: isEditMode,
      // cellRenderer: CustomTooltip,
      tooltipValueGetter: (params) => params.value,
    },
    {
      resizable: false,
      cellRenderer: IconRedner,
      width: 70,
      suppressMovable: true,
      suppressNavigable: true,
    },
    {
      resizable: false,
      cellRenderer: IconDelete,
      width: 70,
    },
  ];

  return baseColumns;
};

export const defaultColDef: ColDef = {
  resizable: true,
  sortable: false,
  tooltipComponent: CustomTooltip,
   tooltipValueGetter: (params) => params.value,
};






























// import { type ColDef } from "ag-grid-community";
// import { FaEyeSlash } from "react-icons/fa";
// import CustomTooltip from "./CustomTooltip";
// import IconDelete from "./IconDelete";



// const MarkupCellRenderer = (props: any) => {
//   if (!props.showMarkup) {
//     return (
//       <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
//         <FaEyeSlash />
//       </div>
//     );
//   }
//   return props.value;
// };

// export const getColumnDefs = (showMarkup: boolean, isEditMode: boolean = true ): ColDef[] => {
//   const baseColumns: ColDef[] = [
//     {
//       rowDrag: !isEditMode,
//       width: 60,
//       pinned: "left" as "left",
//       lockPosition: "left" as "left",
//       resizable: false,
//       colId: "dragCol",
//       cellClass: "ag-row-drag hover-drag",
//       suppressMovable: true,
//       headerName: "",
//       hide: isEditMode,
//     },
//     {
//       headerCheckboxSelection: !isEditMode,
//       checkboxSelection: !isEditMode,
//       width: 60,
//       pinned: "left" as "left",
//       lockPosition: "left" as "left",
//       suppressMovable: true,
//       resizable: false,
//       colId: "checkboxCol",
//       cellClass: "hover-checkbox",
//       headerName: "",
//       hide: isEditMode,
//     },
//     {
//       field: "item_id",
//       headerName: "Item ID",
//       width: 120,
//       tooltipValueGetter: (params) => params.value,
//       editable: false,
//     },
//     {
//       field: "subject",
//       headerName: "Subject",
//       flex: 2,
//       editable: isEditMode,
//       tooltipValueGetter: (params) => params.value,
//     },
//     {
//       field: "quantity",
//       headerName: "Quantity",
//       width: 120,
//       editable: isEditMode ,
//       tooltipValueGetter: (params) => params.value,
//       cellEditor: 'agNumberCellEditor',
//       cellEditorParams: {
//         min: 0,
//         precision: 2,
//       },
//     },
//     {
//       field: "unit",
//       headerName: "Unit",
//       width: 100,
//       editable: false,
//       tooltipValueGetter: (params) => params.value,
//     },
//     {
//       field: "unit_cost",
//       headerName: "Unit Cost",
//       width: 120,
//       editable: isEditMode,
//       tooltipValueGetter: (params) => params.value,
//       cellEditor: 'agNumberCellEditor',
//       cellEditorParams: {
//         min: 0,
//         precision: 2,
//       },
//     },
//     {
//       field: "markup",
//       headerName: "Markup (%)",
//       width: 120,
//       editable: isEditMode && showMarkup,
//       cellRenderer: MarkupCellRenderer,
//       cellRendererParams: { showMarkup },
//       cellEditor: 'agNumberCellEditor',
//       cellEditorParams: {
//         min: 0,
//         max: 1000,
//         precision: 2,
//       },
//     },
//     {
//       field: "total",
//       headerName: "Total",
//       width: 120,
//       editable: false,
//       tooltipValueGetter: (params) => params.value,
//     },
//     {
//       field: "section_name",
//       headerName: "Section",
//       flex: 1,
//       editable: false,
//       tooltipValueGetter: (params) => params.value,
//     },
//     {
//       field: "item_type_name",
//       headerName: "Type",
//       flex: 1,
//       editable: false,
//       tooltipValueGetter: (params) => params.value,
//     },
//     {
//       resizable: false,
//       cellRenderer: IconDelete,
//       width: 70,
//       headerName: "",
//       hide: isEditMode,
//     },
//   ];

//   return baseColumns;
// };

// export const defaultColDef: ColDef = {
//   resizable: true,
//   sortable: false,
//   tooltipComponent: CustomTooltip,
//   tooltipValueGetter: (params) => params.value,
// };
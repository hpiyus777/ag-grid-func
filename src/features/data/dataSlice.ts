// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import type { GridItem, DataState } from "../../Types";

// const initialState: DataState = {
//   gridData: [],
//   groupedItems: [],
//   loading: false,
//   error: null,
//   visibleCount: 1, //ketla table add thase on load pr A aaya nkki thay
//   isOpen: false,
//   selectedRowData: "",
//   selectedRows: [],
//   sidebarMode: "row",
//   currentSectionData: null,
//   visibleSections: undefined,
//   mountedSections: undefined,
//   pendingDrops: undefined,
//   showOnlyZero: undefined,
//   sections: undefined
// };

// export const dataSlice = createSlice({
//   name: "data",
//   initialState,
//   reducers: {
//     setGridData: (
//       state,
//       action: PayloadAction<{
//         items: GridItem[];
//         sections: { section_id: number; section_name: string }[];
//       }>
//     ) => {
//       state.gridData = action.payload.items;

//       const groupedBySection: { [key: string]: GridItem[] } = {};

//       for (const item of action.payload.items) {
//         const section = item.section_name || "  no sec ne=am";
//         if (!groupedBySection[section]) {
//           groupedBySection[section] = [];
//         }
//         groupedBySection[section].push(item);
//       }

//       const groupedById = action.payload.items.reduce((acc, item) => {
//         const key = Number(item.section_id);
//         if (!acc[key]) acc[key] = [];
//         acc[key].push(item);
//         return acc;
//       }, {} as Record<number, GridItem[]>);

//       state.groupedItems = action.payload.sections.map((section) => ({
//         section_id: section.section_id,
//         section_name: section.section_name,
//         items: groupedById[section.section_id] || [],
//       }));
//     },
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },
//     setError: (state, action: PayloadAction<string | null>) => {
//       state.error = action.payload;
//     },
//     increaseVisibleCount: (state, action: PayloadAction<number>) => {
//       const maxCount = state.groupedItems.length;
//       const newCount = Math.min(state.visibleCount + action.payload, maxCount);
//       console.log("Reducer: Increasing visible count", {
//         current: state.visibleCount,
//         increment: action.payload,
//         new: newCount,
//         max: maxCount,
//       });
//       state.visibleCount = newCount;
//     },
//     resetVisibleCount: (state) => {
//       state.visibleCount = 1; //ketla table add thase on load pr A aaya nkki thay
//     },
//     setVisibleCount: (state, action: PayloadAction<number>) => {
//       const maxCount = state.groupedItems.length;
//       state.visibleCount = Math.min(action.payload, maxCount);
//     },
//     moveItemBetweenSections: (state, action) => {
//       const { items, fromSectionId, toSectionId } = action.payload;

//       const fromSection = state.groupedItems.find(
//         (s) => s.section_id.toString() === fromSectionId
//       );
//       const toSection = state.groupedItems.find(
//         (s) => s.section_id.toString() === toSectionId
//       );

//       if (fromSection && toSection) {
//         fromSection.items = fromSection.items.filter(
//           (item) =>
//             !items.some(
//               (movedItem: { item_id: number }) =>
//                 movedItem.item_id === item.item_id
//             )
//         );

//         toSection.items = [...toSection.items, ...items];
//       }
//     },
//     setGroupedSections: (state, action) => {
//       state.groupedItems = action.payload;
//     },
//     toggleSidebar: (state, action) => {
//       state.isOpen = action.payload;
//     },
//     setSelectedRowData: (state, action) => {
//       state.selectedRowData = action.payload;
//     },
//     setSelectedRows: (state, action) => {
//       state.selectedRows = action.payload;
//     },
//     deleteSelectedRows: (state, action) => {
//       // dlt mate row
//       const rowsToDelete = action.payload || state.selectedRows;
//       const idsToDelete = rowsToDelete.map((id: any) =>
//         typeof id === "string" ? parseInt(id, 10) : Number(id)
//       );
//       //section row ne taget kre
//       state.groupedItems = state.groupedItems.map((section) => ({
//         ...section,
//         items: section.items.filter(
//           (item) => !idsToDelete.includes(Number(item.item_id))
//         ),
//       }));
//       //dlt pchi sec clear kre
//       state.selectedRows = [];
//     },
//     updateSectionName: (state, action) => {
//       const { sectionId, newName } = action.payload;
//       const section = state.groupedItems.find(
//         (s) => s.section_id === sectionId
//       );
//       if (section) {
//         section.section_name = newName;
//         if (
//           state.currentSectionData &&
//           state.currentSectionData.section_id === sectionId
//         ) {
//           state.currentSectionData.section_name = newName;
//         }
//       }
//     },
//     openSidebarForRow: (state, action) => {
//       state.isOpen = true;

//       state.sidebarMode = "row";

//       state.selectedRowData = action.payload;

//       state.currentSectionData = null;
//     },
//     openSidebarForSection: (state, action) => {
//       state.isOpen = true;
//       state.sidebarMode = "section";
//       state.selectedRowData = "";
//       state.currentSectionData = {
//         section_id: action.payload.section_id,
//         section_name: action.payload.section_name,
//         itemCount: action.payload.itemCount || 0,
//       };
//     },
//     openSidebarForAddSection: (state) => {
//       state.isOpen = true;
//       state.sidebarMode = "addSection";
//       state.selectedRowData = "";
//       state.currentSectionData = null;
//     },
//     openSidebarForAddItem: (state) => {
//       state.isOpen = true;
//       state.sidebarMode = "addItem";
//       state.selectedRowData = "";
//       state.currentSectionData = null;
//     },
//     addNewSection: (
//       state,
//       action: PayloadAction<{
//         sectionName: string;
//         description?: string;
//         isOptional?: boolean;
//       }>
//     ) => {
//       const { sectionName, description, isOptional } = action.payload;
//       const maxId = Math.max(...state.groupedItems.map((s) => s.section_id), 0);
//       const newSectionId = maxId + 1;

//       const newSection = {
//         section_id: newSectionId,
//         section_name: sectionName,
//         description: description || "",
//         isOptional: isOptional || false,
//         items: [],
//       };

//       state.groupedItems.unshift(newSection);
//       state.isOpen = false;
//       state.sidebarMode = "row";
//     },
//     addNewItem: (
//       state,
//       action: PayloadAction<{
//         itemName: string;
//         itemType: string;
//         assignedTo?: string;
//         costCode?: string;
//         variation?: string;
//         quantity: number;
//         unitCost: number;
//         markup: number;
//         description?: string;
//         internalNote?: string;
//         isOptional?: boolean;
//         sectionId: number;
//       }>
//     ) => {
//       const {
//         itemName,
//         itemType,
//         assignedTo,
//         costCode,
//         variation,
//         quantity,
//         unitCost,
//         markup,
//         isOptional,
//         sectionId,
//       } = action.payload;

//       //  max item_id kadhe sec marthi
//       const allItems = state.groupedItems.flatMap((section) => section.items);
//       const maxItemId = Math.max(...allItems.map((item) => item.item_id), 0);
//       const newItemId = maxItemId + 1;

//       // Calculate
//       const totalCost = quantity * unitCost;
//       const markupAmount = (totalCost * markup) / 100;
//       const totalRevenue = totalCost + markupAmount;

//       // sec gotse item add krva
//       const targetSection = state.groupedItems.find(
//         (section) => section.section_id === sectionId
//       );

//       if (targetSection) {
//         const newItem: GridItem = {
//           item_id: newItemId,
//           section_id: sectionId.toString(),
//           section_name: targetSection.section_name,
//           subject: itemName,
//           item_type_name: itemType,
//           assigned_to: assignedTo || "",
//           cost_code: costCode || "",
//           variation: variation || "",
//           quantity: quantity,
//           unit: "each",
//           unit_cost: unitCost.toString(),
//           markup: markup.toString(),
//           total: totalRevenue.toString(),
//           is_optional: isOptional || false,
//           estimate_id: 0,
//           company_estimate_id: "",
//           newItem: undefined,
//           sub: ""
//         };

//         targetSection.items.push(newItem);
//         state.gridData.push(newItem);
//       }

//       state.isOpen = false;
//       state.sidebarMode = "row";
//     },
//     addNewSectionWithItems: (state, action) => {
//       const originalSection = action.payload;
//       const newSectionId = Date.now(); // unique section_id

//       const copiedItems = originalSection.items.map((item: any) => ({
//         ...item,
//         item_id: `${item.item_id}-${Math.random().toString(36).substr(2, 5)}`, // unique item_id and jyare new sec clone krse to e sauthi upper add thay te mate
//         section_id: newSectionId.toString(),
//       }));

//       const newSection = {
//         section_id: newSectionId,
//         section_name: `${originalSection.section_name} Copy`,
//         items: copiedItems,
//       };

//       state.groupedItems.unshift(newSection);
//     },
//     deleteSectionById: (state, action) => {
//       //state.groupedItems  mathi item id lese and dlt krse like groupitem ma sec id and deletsec id same hse to dlt thase
//       const sectionIdToDelete = action.payload;
//       state.groupedItems = state.groupedItems.filter(
//         (section) => section.section_id !== sectionIdToDelete //
//       );
//     },
//   },
// });

// export const {
//   setGridData,
//   setLoading,
//   setError,
//   increaseVisibleCount,
//   resetVisibleCount,
//   moveItemBetweenSections,
//   setGroupedSections,
//   toggleSidebar,
//   setSelectedRowData,
//   deleteSelectedRows,
//   setSelectedRows,
//   updateSectionName,
//   openSidebarForRow,
//   openSidebarForAddSection,
//   openSidebarForSection,
//   openSidebarForAddItem,
//   addNewSection,
//   addNewItem,
//   setVisibleCount,
//   addNewSectionWithItems,
//   deleteSectionById,
// } = dataSlice.actions;

// export default dataSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GridItem, DataState } from "../../Types";

const initialState: DataState = {
  gridData: [],
  groupedItems: [],
  loading: false,
  error: null,
  visibleCount: 1, //ketla table add thase on load pr A aaya nkki thay
  isOpen: false,
  selectedRowData: "",
  selectedRows: [],
  sidebarMode: "row",
  currentSectionData: null,
  visibleSections: undefined,
  mountedSections: undefined,
  pendingDrops: undefined,
  showOnlyZero: undefined,
  sections: undefined,
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setGridData: (
      state,
      action: PayloadAction<{
        items: GridItem[];
        sections: { section_id: number; section_name: string }[];
      }>
    ) => {
      state.gridData = action.payload.items;

      const groupedBySection: { [key: string]: GridItem[] } = {};

      for (const item of action.payload.items) {
        const section = item.section_name || "  no sec ne=am";
        if (!groupedBySection[section]) {
          groupedBySection[section] = [];
        }
        groupedBySection[section].push(item);
      }

      const groupedById = action.payload.items.reduce((acc, item) => {
        const key = Number(item.section_id);
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {} as Record<number, GridItem[]>);

      state.groupedItems = action.payload.sections.map((section) => ({
        section_id: section.section_id,
        section_name: section.section_name,
        items: groupedById[section.section_id] || [],
      }));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    increaseVisibleCount: (state, action: PayloadAction<number>) => {
      const maxCount = state.groupedItems.length;
      const newCount = Math.min(state.visibleCount + action.payload, maxCount);
      console.log("Reducer: Increasing visible count", {
        current: state.visibleCount,
        increment: action.payload,
        new: newCount,
        max: maxCount,
      });
      state.visibleCount = newCount;
    },
    resetVisibleCount: (state) => {
      state.visibleCount = 1; //ketla table add thase on load pr A aaya nkki thay
    },
    setVisibleCount: (state, action: PayloadAction<number>) => {
      const maxCount = state.groupedItems.length;
      state.visibleCount = Math.min(action.payload, maxCount);
    },
    moveItemBetweenSections: (state, action) => {
      const { items, fromSectionId, toSectionId } = action.payload;

      const fromSection = state.groupedItems.find(
        (s) => s.section_id.toString() === fromSectionId
      );
      const toSection = state.groupedItems.find(
        (s) => s.section_id.toString() === toSectionId
      );

      if (fromSection && toSection) {
        fromSection.items = fromSection.items.filter(
          (item) =>
            !items.some(
              (movedItem: { item_id: number }) =>
                movedItem.item_id === item.item_id
            )
        );

        toSection.items = [...toSection.items, ...items];
      }
    },
    setGroupedSections: (state, action) => {
      state.groupedItems = action.payload;
    },
    toggleSidebar: (state, action) => {
      state.isOpen = action.payload;
    },
    setSelectedRowData: (state, action) => {
      state.selectedRowData = action.payload;
    },
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload;
    },
    deleteSelectedRows: (state, action) => {
      // dlt mate row
      const rowsToDelete = action.payload || state.selectedRows;
      const idsToDelete = rowsToDelete.map((id: any) =>
        typeof id === "string" ? parseInt(id, 10) : Number(id)
      );
      //section row ne taget kre
      state.groupedItems = state.groupedItems.map((section) => ({
        ...section,
        items: section.items.filter(
          (item) => !idsToDelete.includes(Number(item.item_id))
        ),
      }));
      //dlt pchi sec clear kre
      state.selectedRows = [];
    },
    updateSectionName: (state, action) => {
      const { sectionId, newName } = action.payload;
      const section = state.groupedItems.find(
        (s) => s.section_id === sectionId
      );
      if (section) {
        section.section_name = newName;
        if (
          state.currentSectionData &&
          state.currentSectionData.section_id === sectionId
        ) {
          state.currentSectionData.section_name = newName;
        }
      }
    },
    openSidebarForRow: (state, action) => {
      state.isOpen = true;

      state.sidebarMode = "row";

      state.selectedRowData = action.payload;

      state.currentSectionData = null;
    },
    openSidebarForSection: (state, action) => {
      state.isOpen = true;
      state.sidebarMode = "section";
      state.selectedRowData = "";
      state.currentSectionData = {
        section_id: action.payload.section_id,
        section_name: action.payload.section_name,
        itemCount: action.payload.itemCount || 0,
      };
    },
    openSidebarForAddSection: (state) => {
      state.isOpen = true;
      state.sidebarMode = "addSection";
      state.selectedRowData = "";
      state.currentSectionData = null;
    },
    openSidebarForAddItem: (state) => {
      state.isOpen = true;
      state.sidebarMode = "addItem";
      state.selectedRowData = "";
      state.currentSectionData = null;
    },
    addNewSection: (
      state,
      action: PayloadAction<{
        sectionName: string;
        description?: string;
        isOptional?: boolean;
      }>
    ) => {
      const { sectionName, description, isOptional } = action.payload;
      const maxId = Math.max(...state.groupedItems.map((s) => s.section_id), 0);
      const newSectionId = maxId + 1;

      const newSection = {
        section_id: newSectionId,
        section_name: sectionName,
        description: description || "",
        isOptional: isOptional || false,
        items: [],
      };

      state.groupedItems.unshift(newSection);
      state.isOpen = false;
      state.sidebarMode = "row";
    },
    addNewItem: (
      state,
      action: PayloadAction<{
        itemName: string;
        itemType: string;
        assignedTo?: string;
        costCode?: string;
        variation?: string;
        quantity: number;
        unitCost: number;
        markup: number;
        description?: string;
        internalNote?: string;
        isOptional?: boolean;
        sectionId: number;
      }>
    ) => {
      const {
        itemName,
        itemType,
        assignedTo,
        costCode,
        variation,
        quantity,
        unitCost,
        markup,
        isOptional,
        sectionId,
      } = action.payload;

      //  max item_id kadhe sec marthi
      const allItems = state.groupedItems.flatMap((section) => section.items);
      const maxItemId = Math.max(...allItems.map((item) => item.item_id), 0);
      const newItemId = maxItemId + 1;

      // Calculate
      const totalCost = quantity * unitCost;
      const markupAmount = (totalCost * markup) / 100;
      const totalRevenue = totalCost + markupAmount;

      // sec gotse item add krva
      const targetSection = state.groupedItems.find(
        (section) => section.section_id === sectionId
      );

      if (targetSection) {
        const newItem: GridItem = {
          item_id: newItemId,
          section_id: sectionId.toString(),
          section_name: targetSection.section_name,
          subject: itemName,
          item_type_name: itemType,
          assigned_to: assignedTo || "",
          cost_code: costCode || "",
          variation: variation || "",
          quantity: quantity,
          unit: "each",
          unit_cost: unitCost.toString(),
          markup: markup.toString(),
          total: totalRevenue.toString(),
          is_optional: isOptional || false,
          estimate_id: 0,
          company_estimate_id: "",
          newItem: undefined,
          sub: "",
        };

        targetSection.items.push(newItem);
        state.gridData.push(newItem);
      }

      state.isOpen = false;
      state.sidebarMode = "row";
    },
    addNewSectionWithItems: (state, action) => {
      const originalSection = action.payload;
      const newSectionId = Date.now(); // unique section_id

      const copiedItems = originalSection.items.map((item: any) => ({
        ...item,
        item_id: `${item.item_id}-${Math.random().toString(36).substr(2, 5)}`, // unique item_id and jyare new sec clone krse to e sauthi upper add thay te mate
        section_id: newSectionId.toString(),
      }));

      const newSection = {
        section_id: newSectionId,
        section_name: `${originalSection.section_name} Copy`,
        items: copiedItems,
      };

      state.groupedItems.unshift(newSection);
    },
    deleteSectionById: (state, action) => {
      //state.groupedItems  mathi item id lese and dlt krse like groupitem ma sec id and deletsec id same hse to dlt thase
      const sectionIdToDelete = action.payload;
      state.groupedItems = state.groupedItems.filter(
        (section) => section.section_id !== sectionIdToDelete //
      );
    },
    updateSectionItems: (state, action) => {
      const { section_id, updatedItems } = action.payload;
      const section = state.groupedItems.find(
        (s) => s.section_id === section_id
      );
      if (section) {
        updatedItems.forEach((updatedItem:any) => {
          const index = section.items.findIndex(
            (item) => item.item_id === updatedItem.item_id
          );
          if (index !== -1) {
            section.items[index] = updatedItem;
          }
        });
      }
    },
  },
});

export const {
  setGridData,
  setLoading,
  setError,
  increaseVisibleCount,
  resetVisibleCount,
  moveItemBetweenSections,
  setGroupedSections,
  toggleSidebar,
  setSelectedRowData,
  deleteSelectedRows,
  setSelectedRows,
  updateSectionName,
  updateSectionItems,
  openSidebarForRow,
  openSidebarForAddSection,
  openSidebarForSection,
  openSidebarForAddItem,
  addNewSection,
  addNewItem,
  setVisibleCount,
  addNewSectionWithItems,
  deleteSectionById,
} = dataSlice.actions;

export default dataSlice.reducer;

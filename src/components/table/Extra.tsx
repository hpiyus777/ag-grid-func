import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  toggleSidebar,
  addNewItem,
  addNewSection,
  updateSectionName,
} from "../../features/data/dataSlice";
import type { RootState } from "../../Store/Store";
import type { RowData } from "../../Types";
import Input from "./Input";
import Form from "./Form";
import Pricing from "./Pricing";

const Extra = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.data.isOpen);
  const sidebarMode = useSelector((state: RootState) => state.data.sidebarMode);
  const groupedItems = useSelector(
    (state: RootState) => state.data.groupedItems
  );
  const currentSectionData = useSelector(
    (state: RootState) => state.data.currentSectionData
  );
  const selectedRowData = useSelector(
    (state: RootState) => state.data.selectedRowData as RowData
  );
  // console.log(selectedRowData, "hndbjbdbfjbdbfjk");
  const [sectionNameInput, setSectionNameInput] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionDescription, setNewSectionDescription] = useState("");
  const [isOptional, setIsOptional] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState("Material");
  const [assignedTo, setAssignedTo] = useState("");
  const [costCode, setCostCode] = useState("");
  const [variation, setVariation] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitCost, setUnitCost] = useState(0);
  const [markup, setMarkup] = useState(0);
  const [selectedSectionId, setSelectedSectionId] = useState(0);
  const [isItemOptional, setIsItemOptional] = useState(false);

  useEffect(() => {
    if (sidebarMode === "section" && currentSectionData) {
      setSectionNameInput(currentSectionData.section_name || "");
    }
  }, [sidebarMode, currentSectionData]);

  useEffect(() => {
    if (sidebarMode === "addSection") {
      setNewSectionName("");
      setNewSectionDescription("");
      setIsOptional(false);
    }
  }, [sidebarMode]);

  useEffect(() => {
    if (sidebarMode === "addItem") {
      setItemName("");
      setItemType("Material");
      setAssignedTo("");
      setCostCode("");
      setVariation("");
      setQuantity(0);
      setUnitCost(0);
      setMarkup(0);
      setSelectedSectionId(
        groupedItems.length > 0 ? groupedItems[0].section_id : 0
      );
      setIsItemOptional(false);
    }
  }, [sidebarMode, groupedItems]);

  useEffect(() => {
    // console.log("Sidebar Mode:", sidebarMode);
    // console.log("Selected Row Data:", selectedRowData);
  }, [sidebarMode, selectedRowData]);

  const sidebarTitles = {
    section: "Section Details",
    addSection: "Add Section",
    addItem: "Add Estimate-srl Item",
  };

  const handleAddItem = () => {
    if (!itemName.trim() || !selectedSectionId) return;
    dispatch(
      addNewItem({
        itemName: itemName.trim(),
        itemType,
        assignedTo: assignedTo.trim(),
        costCode: costCode.trim(),
        variation: variation.trim(),
        quantity,
        unitCost,
        markup,
        isOptional: isItemOptional,
        sectionId: selectedSectionId,
      })
    );
  };

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    dispatch(
      addNewSection({
        sectionName: newSectionName.trim(),
        description: newSectionDescription.trim(),
        isOptional,
      })
    );
    setNewSectionName("");
    setNewSectionDescription("");
    setIsOptional(false);
  };

  const handleSectionNameSave = () => {
    if (!currentSectionData || !sectionNameInput.trim()) return;
    dispatch(
      updateSectionName({
        sectionId: currentSectionData.section_id,
        newName: sectionNameInput.trim(),
      })
    );
  };
  // console.log("Side:", selectedRowData);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg transform transition-transform duration-150 will-change-transform text-black ${
        isOpen
          ? "translate-x-0 pointer-events-auto z-[1000]"
          : "translate-x-full pointer-events-none"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl">
            {sidebarTitles[sidebarMode as keyof typeof sidebarTitles] ||
              "Item Details"}
          </h2>
          <button
            onClick={() => dispatch(toggleSidebar(false))}
            className="text-2xl px-2 border border-red-400 rounded-full cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {sidebarMode === "addItem" && (
            <>
              <Input
                label="Item Name *"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Enter item name"
              />
              <div className="grid grid-cols-2 gap-4">
                <Form
                  label="Item Type *"
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  options={["Material", "Labor", "Equipment", "Subcontractor"]}
                />

                <Input
                  label="Assigned To"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Assigned to"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Cost Code"
                  value={costCode}
                  onChange={(e) => setCostCode(e.target.value)}
                  placeholder="Cost code"
                />
                <Input
                  label="Variation"
                  value={variation}
                  onChange={(e) => setVariation(e.target.value)}
                  placeholder="Variation"
                />
              </div>
              <Form
                label="Section *"
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(Number(e.target.value))}
                options={groupedItems.map((section) => ({
                  value: section.section_id,
                  label: section.section_name,
                }))}
              />
              <Pricing
                quantity={quantity}
                setQuantity={setQuantity}
                unitCost={unitCost}
                setUnitCost={setUnitCost}
                markup={markup}
                setMarkup={setMarkup}
              />
              <button
                onClick={handleAddItem}
                disabled={!itemName.trim() || !selectedSectionId}
                className={`w-full py-3 rounded font-medium cursor-pointer ${
                  itemName.trim() && selectedSectionId
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                Save
              </button>
            </>
          )}

          {sidebarMode === "addSection" && (
            <>
              <Input
                label="Section Name *"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Enter section name"
              />
              <Input
                label="Description"
                value={newSectionDescription}
                onChange={(e) => setNewSectionDescription(e.target.value)}
                placeholder="Enter description"
              />
              <button
                onClick={handleAddSection}
                disabled={!newSectionName.trim()}
                className={`w-full py-3 rounded font-medium cursor-pointer ${
                  newSectionName.trim()
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                Add
              </button>
            </>
          )}

          {sidebarMode === "section" && currentSectionData && (
            <>
              <div className="flex gap-2 items-center">
                <Input
                  label="Section Name *"
                  value={sectionNameInput}
                  onChange={(e) => setSectionNameInput(e.target.value)}
                  placeholder="Enter section name"
                />
                <button
                  onClick={handleSectionNameSave}
                  className="px-4 py-2 bg-blue-600  cursor-pointer rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
              <div className="bg-gray-400 p-4 mt-4 rounded">
                <p className="text-sm text-black">
                  Section ID: {currentSectionData.section_id}
                </p>
                <p className="text-sm text-black">
                  Total Items: {currentSectionData.itemCount || 0}
                </p>
              </div>
            </>
          )}

          {(sidebarMode === "viewItem" || sidebarMode === "row") &&
            selectedRowData && (
              <>
                <Input
                  className="text-black"
                  label="Item Name"
                  value={selectedRowData.subject || ""}
                  readOnly
                />
                <div className="">
                  <Input label="Item Type" value="Material" readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Cost Code" value="unit_cost" readOnly />
                  <Input label="Variation" value="variation_id" readOnly />
                </div>
                <Pricing
                  quantity={selectedRowData.quantity || 0}
                  unitCost={Number(selectedRowData.unit_cost) || 0}
                  markup={Number(selectedRowData.markup) || 0}
                  isEditable={false}
                  setQuantity={() => {}}
                  setUnitCost={() => {}}
                  setMarkup={() => {}}
                />
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Extra;

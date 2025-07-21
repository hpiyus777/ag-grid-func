import FormInput from "./Input";

type PricingBlockProps = {
  quantity: number;
  setQuantity?: (val: number) => void;
  unitCost: number;
  setUnitCost?: (val: number) => void;
  markup: number;
  setMarkup?: (val: number) => void;
  isEditable?: boolean;
};

const Pricing = ({
  quantity,
  setQuantity,
  unitCost,
  setUnitCost,
  markup,
  setMarkup,
  isEditable = true,
}: PricingBlockProps) => {
  const totalCost = quantity * unitCost;
  const totalRevenue = totalCost + (totalCost * markup) / 100;

  return (
    <div className="mb-6">
      <h3 className="text-lg mb-4">Pricing</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormInput
          label="QTY"
          type="number"
          value={quantity}
          onChange={
            isEditable && setQuantity
              ? (e) => setQuantity(Number(e.target.value))
              : undefined
          }
          readOnly={!isEditable}
        />
        <FormInput
          label="Unit Cost/Unit"
          type="number"
          value={unitCost}
          onChange={
            isEditable && setUnitCost
              ? (e) => setUnitCost(Number(e.target.value))
              : undefined
          }
          readOnly={!isEditable}
        />
      </div>
      <FormInput
        label="Total Cost"
        value={`$${totalCost.toFixed(2)}`}
        readOnly
      />
      <FormInput
        label="Markup"
        type="number"
        value={markup}
        onChange={
          isEditable && setMarkup
            ? (e) => setMarkup(Number(e.target.value))
            : undefined
        }
        readOnly={!isEditable}
      />
      <FormInput
        label="Total Revenue"
        value={`$${totalRevenue.toFixed(2)}`}
        readOnly
      />
    </div>
  );
};

export default Pricing;

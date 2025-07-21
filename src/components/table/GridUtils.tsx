

// // Filter items based on zero quantity or unit cost
// export const applyFilter = (items: any[], filterType: string): any[] => {
//   if (filterType === 'Yes') {
//     return items.map((section) => ({
//       ...section,
//       items: section.items.filter(
//         (item: { quantity: any; unit_cost: any }) =>
//           Number(item.quantity) === 0 || Number(item.unit_cost) === 0
//       ),
//     }));
//   }
//   return items;
// };//je table ma quantity and  unit_cost = 0 hse te show krse (yes /no walu )

// // Calculate grid height based on row count
// export const calculateGridHeight = (rowCount: number): number => {
//   const headerHeight = 48;
//   const totalHeight = headerHeight + rowCount * 48;
//   return totalHeight;
// };//row sa lenght mujab table ni height nkki krse















export const applyFilter = (items: any[], filterType: string): any[] => {
  if (filterType === "Yes") {
    return items.map((section) => ({
      ...section,
      items: section.items.filter(
        (item: { quantity: any; unit_cost: any }) =>
          Number(item.quantity) === 0 || Number(item.unit_cost) === 0
      ),
    }));
  }
  return items;
};

export const calculateGridHeight = (rowCount: number): number => {
  const headerHeight = 48;
  const totalHeight = headerHeight + rowCount * 48;
  return totalHeight;
};
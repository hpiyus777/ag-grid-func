// import { Tooltip } from "@mui/material";

// const CustomTooltip = (props: any) => {
//   return (
//     <Tooltip
//       title={props.value}
//       arrow
//       placement="top"
//       componentsProps={{
//         tooltip: {
//           sx: {
//             bgcolor: "#1c1c1c",
//             color: "white",
//             fontSize: "13px",
//             fontWeight: "bold",
//             boxShadow: 3,
//             borderRadius: "6px",
//             py: "6px",
//             px: "10px",
//           },
//         },
//         arrow: {
//           sx: {
//             color: "#ffff",
//           },
//         },
//       }}
//     >
//       <span>{props.value}</span>
//     </Tooltip>
//   );
// };

// export default CustomTooltip;

// CustomTooltip.tsx (for AG Grid's tooltipComponent)


interface CustomTooltipProps {
  value?: string;
}

const CustomTooltip = (props: CustomTooltipProps) => {
  const { value } = props;

  return (
    <div
      style={{
        backgroundColor: "#1c1c1c",
        color: "#fff",
        fontSize: "13px",
        fontWeight: "bold",
        borderRadius: "6px",
        padding: "6px 10px",
        textAlign: "center",
        maxWidth: "200px", 
        whiteSpace: "normal", 
      }}
    >
      {value}
    </div>
  );
};

export default CustomTooltip;

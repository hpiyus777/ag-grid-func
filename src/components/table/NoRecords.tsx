import { memo } from "react";
import NoRecordImage from "../../assets/IMG.png";
import { twMerge } from "tailwind-merge";
const NoRecords = ({
  image = NoRecordImage,
  text = "No Records Available",
  rootClassName = "",
  textClassName = "",
  className = "",
  imageWSize = "60",
  imageHSize = "60",
}) => {
  return (
    <div
      className={twMerge(
        `flex flex-col gap-[15px] py-3 justify-center items-center ${className}`
      )}
    >
      <img
        src={image}
        alt="No Records Available"
        className={twMerge(`w-[60px] mx-auto ${rootClassName}`)}
        width={imageWSize}
        height={imageHSize}
      />
      <div className={`text-xs text-black font-semibold ${textClassName}`}>
        {text}
      </div>
    </div>
  );
};

export default memo(NoRecords);

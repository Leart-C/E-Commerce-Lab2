import { ReactNode } from "react";

interface IProps {
  variant: "primary" | "secondary" | "danger" | "light";
  type: "submit" | "button";
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

const Button = ({
  variant,
  type,
  label,
  onClick,
  loading,
  disabled,
  icon,
}: IProps) => {
  const primaryClasses =
    " text-white bg-[#754eb4] border-[#754eb4] hover:shadow-[0_0_5px_5px_#754eb44c]";

  const secondaryClasses =
    " text-white bg-transparent border-0 hover:bg-[#7E8EF1]";

  const dangerClasses =
    " text-white bg-[#AE899A] border-[#AE899A] hover:shadow-[0_0_5px_5px_#ae899a70]";

  const lightClasses =
    " text-[#754eb4] border-[#754eb4] hover:shadow-[0_0_5px_5px_#754eb44c]";

  const classNameCreator = (): string => {
    let finalClassName = `flex ${icon && "space-x-4"} items-center outline-none duration-300 h-10 text-md font-normal px-6 rounded-md border-2`;
    if (variant === "primary") {
      finalClassName += primaryClasses;
    } else if (variant === "secondary") {
      finalClassName += secondaryClasses;
    } else if (variant === "danger") {
      finalClassName += dangerClasses;
    } else if (variant === "light") {
      finalClassName += lightClasses;
    }
    finalClassName +=
      " disabled:shadow-none disabled:bg-gray-300 disabled:border-gray-300";
    return finalClassName;
  };

  const loadingIconCreator = () => {
    return (
      <div className="w-6 h-6 rounded-full animate-spin border-2 border-gray-400 border-t-gray-800"></div>
    );
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={classNameCreator()}
      disabled={disabled}
    >
      {icon && icon}
      {loading ? loadingIconCreator() : label}
    </button>
  );
};

export default Button;

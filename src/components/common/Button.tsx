import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  title: string;
  onClick?: () => void;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  className?: string | null;
}

export const Button: FC<ButtonProps> = ({
  title,
  onClick,
  leftIcon,
  rightIcon,
  className=null,
}) => {
  return (
    <button
      className={twMerge("btn btn-sm font-bold tracking-wide", className??'')}
      onClick={onClick}
    >
      {leftIcon ? leftIcon : null}
      {title}
      <span className="text-lg">{rightIcon ? rightIcon : null}</span>
    </button>
  );
};

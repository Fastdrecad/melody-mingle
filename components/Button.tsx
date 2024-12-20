import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "avatar";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      disabled,
      type = "button",
      variant = "default",
      ...props
    },
    ref
  ) => {
    return (
      <button
        type={type}
        className={twMerge(
          `rounded-full border border-transparent 
           disabled:cursor-not-allowed disabled:opacity-50 
           transition`,
          variant === "default" &&
            "w-full bg-green-500 px-5 py-2 text-black font-bold hover:opacity-75",
          variant === "avatar" &&
            "bg-white aspect-square h-[38px] p-0 flex items-center justify-center hover:opacity-75",
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

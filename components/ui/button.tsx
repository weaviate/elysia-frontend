import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-background_alt text-secondary hover:bg-foreground hover:text-primary",
        destructive: "bg-error/10 text-error hover:bg-error/20",
        accept: "bg-accent/10 text-accent hover:bg-accent/20",
        outline:
          "border border-input shadow-sm hover:bg-foreground_alt hover:text-primary",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "hover:bg-foreground_alt hover:text-primary border border-transparent",
        link: "text-primary underline-offset-4 hover:underline",
        save: "bg-accent/10 text-accent hover:bg-accent/20 w-full sm:w-auto backdrop-blur-sm",
        cancel:
          "bg-error/10 text-error hover:bg-error/20 w-full sm:w-auto backdrop-blur-sm",
        clean:
          "bg-background/10 text-primary hover:bg-background/20 w-full sm:w-auto border border-primary backdrop-blur-sm",
        subtle:
          "bg-background/10 text-secondary hover:bg-background/20 hover:border-primary hover:text-primary w-full sm:w-auto border border-secondary backdrop-blur-sm",
        subtle_cancel:
          "bg-background/10 text-secondary hover:bg-error/20 hover:border-error hover:text-error w-full sm:w-auto border border-secondary backdrop-blur-sm",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

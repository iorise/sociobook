import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const shellVariants = cva("grid items-center gap-8 pb-8 pt-6 md:py-8", {
  variants: {
    variant: {
      default: "container",
      sidebar:
        "sticky top-14 z-30 h-[calc(100vh_-_3.5rem)] w-full shrink-0 gap-0 py-4",
      centered: "mx-auto mb-16 mt-20 max-w-md justify-center",
      markdown: "container max-w-3xl gap-0 py-8 md:py-10 lg:py-10",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof shellVariants> {
  as?: React.ElementType;
}

function Shell({
  className,
  as: Comp = "section",
  variant,
  ...props
}: ShellProps) {
  return (
    <Comp className={cn(shellVariants({ variant }), className)} {...props} />
  );
}

function SidebarShell({
  className,
  as: Comp = "aside",
  variant,
  ...props
}: ShellProps) {
  return (
    <Comp
      className={cn(
        "sticky top-14 z-30 h-[calc(100vh_-_3.5rem)] w-full shrink-0 gap-0 py-4",
        className
      )}
      {...props}
    />
  );
}

export { Shell, SidebarShell, shellVariants };

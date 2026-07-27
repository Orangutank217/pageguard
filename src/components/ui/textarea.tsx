import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-xl border border-[#e5e5ea] bg-white px-3 py-2 text-base transition-colors outline-none placeholder:text-[#86868b] focus-visible:border-[#0071e3] focus-visible:ring-3 focus-visible:ring-[#0071e3]/50 disabled:cursor-not-allowed disabled:bg-[#f5f5f7] disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

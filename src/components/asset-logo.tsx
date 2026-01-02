import { useState } from "react"
import { MiniLoadingSpinner } from "./mini-loading-spinner"
import { cn } from "@/lib/utils" // se estiver usando shadcn / tailwind helpers

interface AssetLogoProps {
  src?: string
  className?: string
  iconSize?: number // opcional, caso queira controle fino do ícone
}

export function AssetLogo({
  src,
  className,
  iconSize = 16
}: AssetLogoProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const baseClasses = "rounded-sm object-contain"

  if (!src || error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-my-background border border-lime-base/50",
          baseClasses,
          className
        )}
      >
        <span
          className="material-symbols-outlined text-lime-base"
          style={{ fontSize: iconSize }}
        >
          finance_mode
        </span>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {!loaded && (
        <MiniLoadingSpinner
          isLoading
          size="sm"
          className="inset-0 m-auto text-lime-base/50"
        />
      )}

      <img
        src={src}
        alt=""
        className={cn(baseClasses, loaded ? "opacity-100" : "opacity-0")}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  )
}

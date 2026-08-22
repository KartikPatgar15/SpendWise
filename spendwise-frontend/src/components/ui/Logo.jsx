// src/components/ui/Logo.jsx
// Brand logo component supporting full banner and compact mark.

import fullLogo from "../../assets/spendwise-logo-full.png";
import iconLogo from "../../assets/spendwise-logo-icon.png";

export default function Logo({
  variant = "auto", // "full" | "icon" | "auto"
  size = "md",      // "sm" | "md" | "lg"
  className = "",
  showTagline = false,
}) {
  // Height map for clean sizing
  const heights = {
    sm: "h-7 sm:h-8",
    md: "h-8 sm:h-10",
    lg: "h-11 sm:h-14",
  };

  const iconSizes = {
    sm: "w-7 h-7 sm:w-8 sm:h-8",
    md: "w-8 h-8 sm:w-10 sm:h-10",
    lg: "w-11 h-11 sm:w-14 sm:h-14",
  };

  if (variant === "icon") {
    return (
      <img
        src={iconLogo}
        alt="SpendWise"
        className={`${iconSizes[size] || iconSizes.md} object-contain shrink-0 drop-shadow-sm select-none ${className}`}
      />
    );
  }

  if (variant === "full") {
    return (
      <img
        src={fullLogo}
        alt="SpendWise — Track • Plan • Save • Grow"
        className={`${heights[size] || heights.md} w-auto object-contain shrink-0 select-none ${className}`}
      />
    );
  }

  // Auto mode: responsive (icon on small mobile, full logo on sm/md and above)
  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* Mobile-only icon mark */}
      <img
        src={iconLogo}
        alt="SpendWise"
        className={`sm:hidden ${iconSizes[size] || iconSizes.md} object-contain shrink-0`}
      />
      {/* Tablet/Desktop full logo banner */}
      <img
        src={fullLogo}
        alt="SpendWise"
        className={`hidden sm:block ${heights[size] || heights.md} w-auto object-contain shrink-0`}
      />
    </div>
  );
}

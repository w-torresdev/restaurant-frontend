import React, { type InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, icon: Icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <input
            ref={ref}
            className={`block w-full rounded-xl border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 ${
              Icon ? "pl-10" : ""
            } ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 dark:border-slate-800 focus:border-primary-500"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

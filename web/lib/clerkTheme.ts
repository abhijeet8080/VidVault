// clerkTheme.ts
import type { Appearance } from "@clerk/types"

export const clerkAppearance: Appearance = {
  layout: {
    socialButtonsVariant: "iconButton",
    socialButtonsPlacement: "bottom",
    logoPlacement: "inside",
  },
  variables: {
    colorPrimary: "#4F46E5", // indigo-600
    colorText: "#111827", // gray-900
    colorBackground: "white",
    colorInputBackground: "#F9FAFB", // gray-50
    colorInputText: "#111827",
    borderRadius: "0.75rem", // rounded-xl
    fontFamily: "inherit",
  },
  elements: {
    card: "shadow-xl backdrop-blur-lg bg-white/95 dark:bg-[#0D0D0D]/95 border border-gray-200 dark:border-gray-800 rounded-2xl",
    headerTitle: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
    headerSubtitle: "text-sm text-gray-500 dark:text-gray-400",
    formButtonPrimary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all rounded-xl px-4 py-2 font-medium",
    formFieldInput:
      "rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400",
    formFieldLabel: "text-sm font-medium text-gray-700 dark:text-gray-300",
    footerActionText: "text-gray-600 dark:text-gray-400",
    footerActionLink: "text-indigo-600 dark:text-indigo-400 hover:underline font-semibold",
    socialButtonsBlockButton:
      "border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#222] transition-all",
  },
}

export type Locale = "zh" | "en" | "ja" | "ko" | "fr" | "es";

export const locales: { code: Locale; label: string; nativeLabel: string; flag: string }[] = [
  { code: "zh", label: "Chinese", nativeLabel: "中文", flag: "CN" },
  { code: "en", label: "English", nativeLabel: "English", flag: "US" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "JP" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", flag: "KR" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "FR" },
  { code: "es", label: "Spanish", nativeLabel: "Español", flag: "ES" },
];

export const defaultLocale: Locale = "zh";

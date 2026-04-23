import { API_URL } from "@/config/api";
// This root layout only wraps the [locale] layout.
// It MUST NOT contain <html> or <body> tags — those are in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

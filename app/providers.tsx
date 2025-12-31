"use client";
import { ThemeProvider } from "next-themes";
import {BrandThemeSync} from "@/widget/theme/BrandThemeSync";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"     // usa .dark en <html>
            defaultTheme="system" // respeta SO
            enableSystem
            disableTransitionOnChange
        >
            <BrandThemeSync/>
            {children}
        </ThemeProvider>
    );
}

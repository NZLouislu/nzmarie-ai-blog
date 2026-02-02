"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { usePathname } from "next/navigation";

export default function LanguageHandler({ initialLanguage }: { initialLanguage: "en" | "zh" }) {
    const { setLanguage } = useLanguageStore();
    const pathname = usePathname();

    useEffect(() => {
        // Determine language from pathname
        const lang = pathname.startsWith("/cn") ? "zh" : "en";
        setLanguage(lang);
    }, [pathname, setLanguage]);

    return null;
}

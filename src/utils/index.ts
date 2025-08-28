//Convertie en texte brut
export function stripHtml(html?: string) {
    if (!html) return "";
    if (typeof window === "undefined") {
        return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    }
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").trim();
}

// Définir un nombre maximum de mot
export function truncateWords(text: string, maxWords: number) {
    const words = text.trim().split(/\s+/);
    return words.length <= maxWords ? text : words.slice(0, maxWords).join(" ") + "…";
}

// Définir un nombre maximum de mot
export function formatDate(d?: string | Date | null, locale = "fr-FR") {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" });
}

// Récupère tous les types de l'api
export function pickMembers<T = any>(payload: unknown): T[] {
    const p = payload as any;
    if (Array.isArray(p)) return p as T[];
    return (p?.member ?? p?.["hydra:member"] ?? p?.data ?? p?.results ?? []) as T[];
}

export const Colors = {
    baseBg: "#0b1321",
    lightBg: "#111a2c"
};


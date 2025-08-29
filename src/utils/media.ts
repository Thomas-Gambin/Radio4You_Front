// utils/media.ts
import { api } from "./api";

const PLACEHOLDER = "/placeholder.png";

//Génère une url d'image en récupérant l'adresse de la bdd ou le placeholder
function getAssetsBase(): string {
    const envBase = import.meta.env?.VITE_PUBLIC_ASSETS_BASE_URL as string | undefined;
    if (envBase) return envBase.replace(/\/+$/, "");

    const raw = api?.defaults?.baseURL;
    if (raw) {
        try {
            const u = new URL(raw, window.location.origin);
            return `${u.protocol}//${u.host}`;
        } catch {
        }
    }

    return window.location.origin.replace(/\/+$/, "");
}

function isAbsoluteUrl(u: string): boolean {
    return /^https?:\/\//i.test(u) || u.startsWith("//");
}

export function coverOriginalUrl(coverUrl?: string | null): string {
    if (!coverUrl) return PLACEHOLDER;
    const raw = coverUrl.trim();
    if (!raw) return PLACEHOLDER;

    if (isAbsoluteUrl(raw)) return raw;

    const base = getAssetsBase();

    try {
        if (raw.startsWith("public/uploads/")) return `${base}/${raw.replace(/^public\//, "")}`;
        if (raw.startsWith("/uploads/")) return `${base}${raw}`;
        if (raw.startsWith("uploads/")) return `${base}/${raw}`;

        return `${base}/uploads/covers/${encodeURIComponent(raw)}`;
    } catch {
        return PLACEHOLDER;
    }
}

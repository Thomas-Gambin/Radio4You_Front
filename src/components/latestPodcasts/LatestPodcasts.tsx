import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import type { Podcast } from "../../@types/podcast";

//Convertie en texte brut
function stripHtml(html?: string) {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || "").trim();
}

// Définir un nombre maximum de mot
function truncateWords(text: string, maxWords: number) {
    const words = text.trim().split(/\s+/);
    return words.length <= maxWords ? text : words.slice(0, maxWords).join(" ") + "…";
}

// Met la date au format JJ/MM/AAAA
function formatDate(d?: string | Date | null) {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

// Récupère tous les types de l'api
const pickMembers = (payload: any) =>
    Array.isArray(payload)
        ? payload
        : payload?.member ?? payload?.["hydra:member"] ?? payload?.data ?? payload?.results ?? [];

// Récupère les données de l'api en mettant une limit
async function fetchLatestPodcasts(limit = 3, signal?: AbortSignal): Promise<Podcast[]> {
    const { data } = await api.get("/podcasts", {
        params: {
            page: 1,
            itemsPerPage: limit,
            "order[createddAt]": "desc",
        },
        signal,
    });

    const raw: any[] = pickMembers(data);
    return raw.slice(0, limit).map((p: any): Podcast => {
        const src = p?.attributes ? { id: p.id, ...p.attributes } : p;
        return {
            id: src.id,
            title: src.title ?? "Sans titre",
            coverUrl: src.coverUrl ?? src.cover?.url ?? src.image?.url ?? src.image ?? undefined,
            description: src.description ?? src.content ?? src.summary ?? "",
            publishedAt: (src.publishedAt ?? src.createdAt ?? "").toString(),
        };
    });
}

export default function LatestPodcasts({ maxWords = 40 }: { maxWords?: number }) {
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [pods, setPods] = useState<Podcast[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const list = await fetchLatestPodcasts(3, controller.signal);
                setPods(list);
            } catch (e: any) {
                if (e?.name !== "CanceledError" && e?.message !== "canceled") {
                    setErr(e?.message ?? "Erreur réseau");
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, []);

    return (
        <section id="podcasts" className="relative isolate">
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                <div className="mb-6 md:mb-10 flex items-end justify-between">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white">Derniers podcasts</h2>
                    <Link
                        to="/podcasts"
                        className="hidden sm:inline-block text-sm font-semibold text-white/80 hover:text-white transition">
                        Tous les podcasts →
                    </Link>
                </div>
                <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {loading &&
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-3 animate-pulse">
                                <div className="aspect-[16/9] w-full rounded-xl bg-white/10" />
                                <div className="mt-3 h-5 w-3/4 rounded bg-white/10" />
                                <div className="mt-2 h-4 w-full rounded bg-white/10" />
                                <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
                            </div>
                        ))}
                    {!loading && err && (
                        <div className="col-span-full rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">
                            Erreur de chargement des podcasts : {err}
                        </div>
                    )}
                    {!loading && !err && pods.length === 0 && (
                        <div className="col-span-full rounded-xl border border-white/10 bg-white/5 p-6 text-white/80 text-center">
                            Aucun podcast pour le moment.
                        </div>
                    )}
                    {!loading &&
                        !err &&
                        pods.map((p) => {
                            const plain = truncateWords(stripHtml(p.description), maxWords);
                            return (
                                <article
                                    key={p.id}
                                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-transform duration-300 hover:scale-[1.03] cursor-pointer">
                                    {p.coverUrl ? (
                                        <div className="aspect-[16/9] w-full overflow-hidden">
                                            <img
                                                src={p.coverUrl}
                                                alt={p.title}
                                                className="h-full w-full object-cover"
                                                loading="lazy" />
                                        </div>
                                    ) : (
                                        <div className="aspect-[16/9] w-full bg-white/5" />
                                    )}
                                    <div className="p-4">
                                        <time className="text-xs uppercase tracking-wide text-white/60">
                                            {formatDate(p.publishedAt)}
                                        </time>
                                        <h3 className="mt-1 line-clamp-2 text-lg font-bold text-white">{p.title}</h3>
                                        {plain && <p className="mt-2 text-sm text-white/70">{plain}</p>}
                                        <div className="mt-3">
                                            <Link
                                                to={`/podcasts/${p.id}`}
                                                className="inline-block rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 transition">
                                                Écouter
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                </div>
                <div className="mt-8 sm:hidden text-center">
                    <Link
                        to="/podcasts"
                        className="inline-block rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5 transition">
                        Tous les podcasts
                    </Link>
                </div>
            </div>
        </section>
    );
}

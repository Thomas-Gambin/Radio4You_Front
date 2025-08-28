import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Article } from "../../@types/article";
import Card from "../../components/card/Card";
import { pickMembers } from "../../utils";
import { api } from "../../utils/api";
import { ROUTES } from "../../App";

// Définie le nombre de podcasts qu'on affiche par requête
const BATCH = 6;

// Récupère les infos de l'url
function getPageFromUrl(u?: string | null): number | null {
    if (!u) return null;
    try {
        const url = u.startsWith("http") ? new URL(u) : new URL(u, window.location.origin);
        const p = url.searchParams.get("page");
        return p ? Number(p) : null;
    } catch {
        return null;
    }
}

// Récupère les articles
export default function ArticlesPage() {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<Article[]>([]);
    const [lastPage, setLastPage] = useState<number | null>(null);
    const [hasNext, setHasNext] = useState(false);
    const [lastBatchCount, setLastBatchCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get("/articles", {
                    params: {
                        page,
                        itemsPerPage: BATCH,
                        "order[createdAt]": "desc",
                        pagination: true,
                    },
                    signal: controller.signal,
                    headers: { Accept: "application/ld+json" },
                });

                const batch = pickMembers<Article>(data);
                const view = data?.["hydra:view"] ?? {};
                const last = getPageFromUrl(view?.["hydra:last"]);
                const next = Boolean(view?.["hydra:next"]);

                setItems((prev) => (page === 1 ? batch : [...prev, ...batch]));
                setLastPage(last);
                setHasNext(next);
                setLastBatchCount(batch.length);
            } catch (e: any) {
                if (e?.code !== "ERR_CANCELED" && e?.name !== "CanceledError") {
                    setError(e?.message ?? "Erreur inconnue");
                }
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [page]);

    // Permet de savoir si il reste des podcasts
    const hasMore = useMemo(() => {
        if (lastPage !== null) return page < lastPage;
        if (hasNext) return true;
        return lastBatchCount === BATCH;
    }, [page, lastPage, hasNext, lastBatchCount]);

    return (
        <section className="relative isolate">
            <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
                <div className="mb-6 md:mb-8 flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white text-center md:text-left w-full">
                        Tous les articles
                    </h1>
                    <Link
                        to={ROUTES.HOME}
                        className="hidden sm:inline-block text-sm font-semibold text-white/80 hover:text-white transition">
                        Retour à l’accueil →
                    </Link>
                </div>
                <div className="flex flex-col gap-6">
                    {loading && items.length === 0 &&
                        Array.from({ length: BATCH }).map((_, i) => (
                            <div
                                key={`s-${i}`}
                                className="rounded-2xl border border-white/10 bg-white/5 p-3 animate-pulse">
                                <div className="aspect-[16/9] w-full rounded-xl bg-white/10" />
                                <div className="mt-3 h-5 w-3/4 rounded bg-white/10" />
                                <div className="mt-2 h-4 w-full rounded bg-white/10" />
                                <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
                            </div>
                        ))}
                    {!loading && error && items.length === 0 && (
                        <div className="col-span-full rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">
                            Erreur de chargement : {error}
                        </div>
                    )}
                    {!loading && !error && items.length === 0 && (
                        <div className="col-span-full rounded-xl border border-white/10 bg-white/5 p-6 text-white/80 text-center">
                            Aucun article pour le moment.
                        </div>
                    )}
                    {items.map((it) => (
                        <Card key={it.id} type="article" item={it} />
                    ))}
                </div>
                <div className="mt-10 text-center">
                    {hasMore ? (
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-60 transition">
                            {loading ? "Chargement…" : "Voir plus"}
                        </button>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Article } from "../../@types/article";
import Card from "../../components/card/Card";
import { pickMembers } from "../../utils";
import { api } from "../../utils/api";
import { ROUTES } from "../../App";
import { coverOriginalUrl } from "../../utils/media";

const BATCH = 6;

export default function ArticlesPage() {
    const [uiPage, setUiPage] = useState(1);
    const [allItems, setAllItems] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // inverse pour afficher le dernier en 1er
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get("/articles", {
                    params: { pagination: false },
                    signal: controller.signal,
                    headers: { Accept: "application/ld+json, application/json" },
                });

                const raw = pickMembers<any>(data);

                // Tri par id décroissant
                raw.sort((a, b) => Number(b?.id ?? 0) - Number(a?.id ?? 0));

                // on gère l'url de l'image ou on en met une par defaut
                const normalized: Article[] = raw.map((a: any) => ({
                    id: a.id,
                    title: a.title ?? "Sans titre",
                    content: a.content ?? a.body ?? a.excerpt ?? "",
                    coverUrl: coverOriginalUrl(a.coverUrl ?? a.cover?.url ?? a.image?.url ?? a.image ?? undefined),
                    createdAt: a.createdAt ?? a.publishedAt ?? a.date ?? null,
                    updatedAt: a.updatedAt ?? null,
                }));

                setAllItems(normalized);
                setUiPage(1);
            } catch (e: any) {
                if (e?.code !== "ERR_CANCELED" && e?.name !== "CanceledError") {
                    setError(e?.message ?? "Erreur inconnue");
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, []);

    const items = useMemo(() => {
        const end = uiPage * BATCH;
        return allItems.slice(0, end);
    }, [allItems, uiPage]);

    const hasMore = items.length < allItems.length;

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
                    {items.map(it => (
                        <Card key={it.id} type="article" item={it} />
                    ))}
                </div>
                <div className="mt-10 text-center">
                    {hasMore ? (
                        <button
                            onClick={() => setUiPage(p => p + 1)}
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

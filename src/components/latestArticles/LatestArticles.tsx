import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import { ROUTES } from "../../App";
import type { Article } from "../../@types/article";
import { stripHtml, truncateWords, formatDate, pickMembers, Colors, slugify } from "../../utils/index";
import { coverOriginalUrl } from "../../utils/media";

// Récupère les données de l'api en mettant une limit
async function fetchLatestArticles(limit = 3, signal?: AbortSignal): Promise<Article[]> {
    const { data } = await api.get("/articles", {
        params: {
            page: 1,
            itemsPerPage: limit,
            "order[createdAt]": "desc",
        },
        signal,
    });

    const raw: any[] = pickMembers(data);
    return raw.slice(0, limit).map((a: any) => {
        const candidate =
            a.coverUrl ??
            a.cover?.url ??
            a.image?.url ??
            a.image ??
            undefined;

        const absolute = coverOriginalUrl(candidate) ?? undefined;

        return {
            id: a.id,
            title: a.title ?? "Sans titre",
            coverUrl: absolute,
            content: a.content ?? a.body ?? a.excerpt ?? "",
            createdAt: a.createdAt ?? a.publishedAt ?? a.date ?? null,
        } as Article;
    });
}

export default function LatestArticles({ maxWords = 50 }: { maxWords?: number }) {
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const list = await fetchLatestArticles(3, controller.signal);
                setArticles(list);
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
        <section id="articles" className="relative isolate" style={{ backgroundColor: Colors.lightBg }}>
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                <div className="mb-6 md:mb-10 flex items-center justify-center sm:items-end sm:justify-between">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center sm:text-left">
                        Derniers articles
                    </h2>
                    <Link
                        to={ROUTES.ARTICLES}
                        className="hidden sm:inline-block text-sm font-semibold text-white/80 hover:text-white transition">
                        Tous les articles →
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
                            Erreur de chargement des articles : {err}
                        </div>
                    )}
                    {!loading && !err && articles.length === 0 && (
                        <div className="col-span-full rounded-xl border border-white/10 bg-white/5 p-6 text-white/80 text-center">
                            Aucun article pour le moment.
                        </div>
                    )}
                    {!loading &&
                        !err &&
                        articles.map((a) => {
                            const plain = truncateWords(stripHtml(a.content), maxWords);
                            return (
                                <article
                                    key={a.id}
                                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-transform duration-300 hover:scale-[1.03]">
                                    {a.coverUrl ? (
                                        <div className="aspect-[16/9] w-full overflow-hidden">
                                            <img
                                                src={a.coverUrl}
                                                alt={a.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-[16/9] w-full bg-white/5" />
                                    )}
                                    <div className="p-4">
                                        <time className="text-xs uppercase tracking-wide text-white/60">
                                            {formatDate(a.createdAt)}
                                        </time>
                                        <h3 className="mt-1 line-clamp-2 text-lg font-bold text-white">{a.title}</h3>
                                        {plain && <p className="mt-2 text-sm text-white/70">{plain}</p>}
                                        <div className="mt-3">
                                            <Link
                                                to={`/articles/${a.id}-${slugify(a.title)}`}
                                                className="inline-block rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 transition">
                                                Lire l’article
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                </div>
                <div className="mt-8 sm:hidden text-center">
                    <Link
                        to={ROUTES.ARTICLES}
                        className="inline-block rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5 transition">
                        Tous les articles
                    </Link>
                </div>
            </div>
            <div className="w-full">
                <svg
                    className="h-24 md:h-28 w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    style={{ color: Colors.baseBg }}
                    aria-hidden="true">
                    <path
                        className="fill-current"
                        fillOpacity="0.99"
                        d="M0,288L60,245.3C120,203,240,117,360,112C480,107,600,181,720,229.3C840,277,960,299,1080,256C1200,213,1320,107,1380,53.3L1440,0L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                        fill="currentColor" />
                </svg>
            </div>
        </section>
    );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import { ROUTES } from "../../App";
import type { Article } from "../../@types/article";
import { stripHtml, truncateWords, formatDate, pickMembers, Colors, slugify } from "../../utils";
import { coverOriginalUrl } from "../../utils/media";

// On récupère les 4 derniers articles
async function fetchLatestArticles(limit = 4, signal?: AbortSignal): Promise<Article[]> {
    const { data } = await api.get("/articles", {
        params: { pagination: false },
        signal,
        headers: { Accept: "application/ld+json, application/json" },
    });

    const raw: any[] = pickMembers(data);
    // On récupère le dernier article du tableau
    const lastN = raw
        .slice()
        .sort((a, b) => Number(b?.id ?? 0) - Number(a?.id ?? 0))
        .slice(0, limit);

    return lastN.map((a: any) => {
        const candidate = a.coverUrl ?? a.cover?.url ?? a.image?.url ?? a.image ?? undefined;
        return {
            id: a.id,
            title: a.title ?? "Sans titre",
            coverUrl: coverOriginalUrl(candidate),
            content: a.content ?? a.body ?? a.excerpt ?? "",
            createdAt: a.createdAt ?? a.publishedAt ?? a.date ?? null,
            updatedAt: a.updatedAt ?? null,
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
                const list = await fetchLatestArticles(4, controller.signal);
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

    const featured = !loading && !err && articles[0] ? articles[0] : null;
    const others = !loading && !err ? articles.slice(1, 4) : [];

    return (
        <section id="articles" className="relative isolate" style={{ backgroundColor: Colors.lightBg }}>
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                <div className="mb-6 md:mb-10 flex items-center justify-center sm:items-end sm:justify-between">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center sm:text-left">
                        Derniers articles
                    </h2>
                    <Link
                        to={ROUTES.ARTICLES}
                        className="hidden sm:inline-block text-sm font-semibold text-white/80 hover:text-white transition"
                    >
                        Tous les articles →
                    </Link>
                </div>
                {/* Plus récent*/}
                {!loading && !err && featured && (
                    <article className="mb-10 mx-auto max-w-6xl xl:max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
                            <Link
                                to={`/articles/${featured.id}-${slugify(featured.title)}`}
                                className="block relative overflow-hidden"
                            >
                                <div className="aspect-[16/9] sm:aspect-[16/9] md:aspect-[16/8] lg:aspect-[21/10] w-full">
                                    <img
                                        src={featured.coverUrl}
                                        alt={featured.title}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                                        loading="lazy"
                                    />
                                </div>
                            </Link>
                            <div className="p-4 md:p-5 lg:p-6 flex flex-col justify-center">
                                <time className="text-xs font-semibold uppercase tracking-wide">
                                    {formatDate(featured.createdAt)}
                                </time>
                                <Link to={`/articles/${featured.id}-${slugify(featured.title)}`}>
                                    <h3 className="mt-1 text-2xl md:text-[28px] lg:text-3xl font-extrabold text-white leading-tight hover:underline">
                                        {featured.title}
                                    </h3>
                                </Link>
                                <p className="mt-2 text-white/80 leading-relaxed line-clamp-3">
                                    {truncateWords(stripHtml(featured.content), Math.min(60, Math.max(40, maxWords)))}
                                </p>
                                <div className="mt-4">
                                    <Link
                                        to={`/articles/${featured.id}-${slugify(featured.title)}`}
                                        className="inline-block rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5 transition"
                                    >
                                        Lire l’article
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </article>
                )}
                {/* 3 cartes */}
                {!loading && !err && others.length > 0 && (
                    <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {others.map((a) => {
                            const plain = truncateWords(stripHtml(a.content), maxWords);
                            return (
                                <article
                                    key={a.id}
                                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-transform duration-300 hover:scale-[1.03]"
                                >
                                    <div className="aspect-[16/9] w-full overflow-hidden">
                                        <img
                                            src={a.coverUrl}
                                            alt={a.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <time className="text-xs uppercase tracking-wide text-white/60">
                                            {formatDate(a.createdAt)}
                                        </time>
                                        <h3 className="mt-1 line-clamp-2 text-lg font-bold text-white">{a.title}</h3>
                                        {plain && <p className="mt-2 text-sm text-white/70">{plain}</p>}
                                        <div className="mt-3">
                                            <Link
                                                to={`/articles/${a.id}-${slugify(a.title)}`}
                                                className="inline-block rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 transition"
                                            >
                                                Lire l’article
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
                <div className="mt-8 sm:hidden text-center">
                    <Link
                        to={ROUTES.ARTICLES}
                        className="inline-block rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5 transition"
                    >
                        Tous les articles
                    </Link>
                </div>
            </div>
            {/* Vague en bas */}
            <div className="w-full">
                <svg
                    className="h-24 md:h-28 w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    style={{ color: Colors.baseBg }}
                    aria-hidden="true"
                >
                    <path
                        className="fill-current"
                        fillOpacity="0.99"
                        d="M0,288L60,245.3C120,203,240,117,360,112C480,107,600,181,720,229.3C840,277,960,299,1080,256C1200,213,1320,107,1380,53.3L1440,0L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                        fill="currentColor"
                    />
                </svg>
            </div>
        </section>
    );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Article } from "../../@types/article";
import { formatDate } from "../../utils";
import { api } from "../../utils/api";
import { sanitizeHtml } from "../../utils/sanitize";
import { coverOriginalUrl } from "../../utils/media";

export default function ArticleDetailPage() {
    const { idslug } = useParams<{ idslug: string }>();
    const id = (idslug ?? "").split("-")[0];
    const navigate = useNavigate();

    const [article, setArticle] = useState<Article | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (!id) {
            setError("Paramètre manquant.");
            return;
        }

        const controller = new AbortController();

        (async () => {
            try {
                const res = await api.get<any>(`/articles/${id}`, {
                    signal: controller.signal,
                    headers: { Accept: "application/ld+json, application/json" },
                });

                const a = res.data;

                // on récupère le meilleur candidat fourni par l'API
                const candidate =
                    a.coverUrl ??
                    a.cover?.url ??
                    a.image?.url ??
                    a.image ??
                    undefined;

                const absolute = coverOriginalUrl(candidate) ?? undefined;

                const normalized: Article = {
                    id: a.id,
                    title: a.title ?? "Sans titre",
                    content: a.content ?? a.body ?? a.excerpt ?? "",
                    coverUrl: absolute,
                    createdAt: a.createdAt ?? a.publishedAt ?? a.date ?? null,
                };

                setArticle(normalized);
                if (normalized?.title) document.title = `${normalized.title} — Radio4You`;
            } catch (err: any) {
                if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
                if (err?.response?.status === 404) {
                    navigate("/404");
                    return;
                }
                setError("Article introuvable");
            }
        })();

        return () => controller.abort();
    }, [id, navigate]);

    if (error) return <p className="text-red-500 px-4 py-8">{error}</p>;
    if (!article) return <p className="text-gray-400 px-4 py-8">Chargement…</p>;

    const safeHtml = sanitizeHtml(article.content ?? "");

    return (
        <article className="max-w-3xl mx-auto px-4 py-10 text-white">
            {article.coverUrl && !imgError ? (
                <img
                    src={article.coverUrl}
                    alt={article.title}
                    className="w-full rounded-2xl shadow-lg mb-6 object-cover max-h-[460px]"
                    loading="eager"
                    onError={() => setImgError(true)}
                />
            ) : (
                <div className="w-full rounded-2xl shadow-lg mb-6 object-cover max-h-[460px] bg-white/10 aspect-[16/9]" />
            )}
            <h1 className="mt-2 text-3xl md:text-4xl font-bold mb-3 text-center">
                {article.title}
            </h1>
            {article.createdAt && (
                <div className="mb-6 text-sm text-white/70 text-center">
                    {formatDate(article.createdAt)}
                </div>
            )}
            <div
                className="prose prose-invert max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: safeHtml }} />
            <div className="mt-10 flex justify-center md:justify-start">
                <Link
                    to="/articles"
                    className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10">
                    ← Retour à la liste
                </Link>
            </div>
        </article>
    );
}

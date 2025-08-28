import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Article } from "../../@types/article";
import { formatDate } from "../../utils";
import { api } from "../../utils/api";

export default function ArticlePage() {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await api.get(`/articles/${id}`);

                if (res.status === 404) {
                    navigate("/404");
                    return;
                }

                setArticle(res.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                    console.error("Erreur lors du chargement :", err.message);
                } else {
                    setError("Une erreur inconnue est survenue.");
                }
            }
        })();
    }, [id, navigate]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!article) return <p className="text-gray-400">Chargement...</p>;

    return (
        <article className="max-w-3xl mx-auto px-4 py-10 text-white">
            {article.coverUrl && (
                <img
                    src={article.coverUrl}
                    alt={article.title}
                    className="w-full rounded-2xl shadow-lg mb-6 object-cover max-h-[460px]"
                />
            )}

            <h1 className="text-3xl md:text-4xl font-bold mb-3">{article.title}</h1>

            {article.createdAt && (
                <div className="mb-6 text-sm text-white/70">
                    {formatDate(article.createdAt)}
                </div>
            )}

            {article.content ? (
                <div className="prose prose-invert max-w-none leading-relaxed">
                    {article.content.split("\n").map((p, i) => (
                        <p key={i} className="mb-4">{p}</p>
                    ))}
                </div>
            ) : (
                <p className="text-white/60 italic">Pas de contenu.</p>
            )}

            <div className="mt-10">
                <Link
                    to="/articles"
                    className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10"
                >
                    ← Retour à la liste
                </Link>
            </div>
        </article>
    );
}

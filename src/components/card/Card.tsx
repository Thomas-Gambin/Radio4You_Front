import { Link } from "react-router-dom";
import type { Article } from "../../@types/article";
import type { Podcast } from "../../@types/podcast";
import { stripHtml, truncateWords, formatDate } from "../../utils";

type ContentType = "article" | "podcast";

interface Props {
    type: ContentType;
    item: Article | Podcast;
    className?: string;
    withExcerpt?: boolean;
    maxWords?: number;
}

export default function Card({
    type,
    item,
    className = "",
    withExcerpt = true,
    maxWords = 30,
}: Props) {
    // Texte à résumer : content (article) ou description (podcast)
    const raw =
        type === "article"
            ? (item as Article).content
            : (item as Podcast).description ?? "";

    const plain = withExcerpt ? truncateWords(stripHtml(raw), maxWords) : "";
    const href = type === "article" ? `/articles/${item.id}` : `/podcasts/${item.id}`;

    return (
        <article
            className={`group flex flex-row items-stretch overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-transform duration-300 hover:scale-[1.01] ${className}`}
        >
            {/* Média à gauche (largeur fixe, ratio visuel) */}
            {item.coverUrl ? (
                <Link
                    to={href}
                    className="relative w-40 sm:w-64 md:w-72 flex-shrink-0 overflow-hidden"
                >
                    <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="relative w-72 h-60 flex-shrink-0 overflow-hidden"
                        loading="lazy"
                    />
                </Link>
            ) : (
                <div className="w-40 sm:w-64 md:w-72 flex-shrink-0 bg-white/10 aspect-[16/10]" />
            )}

            {/* Contenu à droite */}
            <div className="flex-1 p-4">
                {"createdAt" in item && item.createdAt && (
                    <time className="text-xs uppercase tracking-wide text-white/60">
                        {formatDate((item as any).createdAt)}
                    </time>
                )}

                <Link to={href}>
                    <h3 className="mt-1 text-lg font-bold text-white line-clamp-2">
                        {item.title}
                    </h3>
                </Link>

                {withExcerpt && plain && (
                    <p className="mt-2 text-sm text-white/70 line-clamp-3">{plain}</p>
                )}

                <div className="mt-3">
                    <Link
                        to={href}
                        className="inline-block rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 transition"
                    >
                        {type === "article" ? "Lire" : "Écouter"}
                    </Link>
                </div>
            </div>
        </article>
    );
}

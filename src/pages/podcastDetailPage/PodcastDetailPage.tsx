import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Podcast } from "../../@types/podcast";
import { formatDate } from "../../utils";
import { api } from "../../utils/api";
import { sanitizeHtml } from "../../utils/sanitize";
import { ROUTES } from "../../App";
import { coverOriginalUrl } from "../../utils/media";

// Construit une URL absolue pour la vidéo upload
function toPublicVideoSrc(path?: string | null, backendOrigin?: string): string | undefined {
    if (!path) return undefined;
    const s = String(path).trim();
    if (!s) return undefined;
    if (/^https?:\/\//i.test(s)) return s;

    const rel = s.startsWith("/") ? s : `/uploads/videos/${s.replace(/^\/+/, "")}`;

    const base = backendOrigin ?? window.location.origin;
    return new URL(rel, base).toString();
}

// Extraction de l'ID YouTube
function getYouTubeId(url?: string | null): string | null {
    if (!url) return null;
    try {
        const src = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        const u = new URL(src);
        const host = u.hostname.replace(/^www\./, "");

        if (host === "youtu.be") return u.pathname.slice(1) || null;

        if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
            if (u.pathname === "/watch") return u.searchParams.get("v");
            const m = u.pathname.match(/\/(embed|shorts|v)\/([A-Za-z0-9_-]{11})/);
            if (m) return m[2];
        }
    } catch { }

    // Recréait une autre url youtube si 1ere
    const m2 = url.match(/([A-Za-z0-9_-]{11})(?:\?.*)?$/);
    return m2 ? m2[1] : null;
}

export default function PodcastDetailPage() {
    const { idslug } = useParams<{ idslug: string }>();
    const id = (idslug ?? "").split("-")[0];
    const navigate = useNavigate();

    const [podcast, setPodcast] = useState<Podcast | null>(null);
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
                const res = await api.get<any>(`/podcasts/${id}`, {
                    signal: controller.signal,
                    headers: { Accept: "application/ld+json, application/json" },
                });

                const p = res.data;

                const backendOrigin = new URL(
                    (res.request && res.request.responseURL) || res.config?.baseURL || window.location.href
                ).origin;

                const candidate =
                    p.coverUrl ??
                    p.cover?.url ??
                    p.image?.url ??
                    p.image ??
                    undefined;
                const absoluteCover = coverOriginalUrl(candidate) ?? undefined;

                // Chemins vidéo (URL YouTube ou fichier uploadé)
                const videoPathRaw = p.videoPath ?? p.video_path ?? p.video_file ?? undefined;
                const localVideo = toPublicVideoSrc(videoPathRaw, backendOrigin);
                const youTubeUrl = p.videoUrl ?? p.video ?? undefined;

                const normalized: Podcast = {
                    id: p.id,
                    title: p.title ?? "Sans titre",
                    description: p.description ?? p.content ?? "",
                    coverUrl: absoluteCover,
                    videoUrl: youTubeUrl,
                    videoPath: localVideo,
                    createdAt: String(p.createdAt ?? p.publishedAt ?? p.date ?? ""),
                };

                setPodcast(normalized);
                if (normalized?.title) document.title = `${normalized.title} — Radio4You`;
            } catch (err: any) {
                if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
                if (err?.response?.status === 404) {
                    navigate("/404");
                    return;
                }
                setError("Podcast introuvable");
            }
        })();

        return () => controller.abort();
    }, [id, navigate]);

    if (error) return <p className="text-red-500 px-4 py-8">{error}</p>;
    if (!podcast) return <p className="text-gray-400 px-4 py-8">Chargement…</p>;

    const safeHtml = sanitizeHtml(podcast.description ?? "");

    // Priorité: fichier local, sinon YouTube
    const localVideoSrc = podcast.videoPath ?? undefined;
    const ytId = getYouTubeId(podcast.videoUrl);
    const embedSrc = ytId ? `https://www.youtube.com/embed/${encodeURIComponent(ytId)}?rel=0` : null;

    return (
        <article className="max-w-3xl mx-auto px-4 py-10 text-white">
            {podcast.coverUrl && !imgError && (
                <img
                    src={podcast.coverUrl}
                    alt={podcast.title}
                    className="w-full rounded-2xl shadow-lg mb-6 object-cover max-h-[300px]"
                    loading="eager"
                    onError={() => setImgError(true)} />
            )}
            <h1 className="mt-2 text-3xl md:text-4xl font-bold mb-3 text-center">
                {podcast.title}
            </h1>
            {podcast.createdAt && (
                <div className="mb-6 text-sm text-white/70 text-center">
                    {formatDate(podcast.createdAt)}
                </div>
            )}
            {podcast.description ? (
                <div
                    className="prose prose-invert max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: safeHtml }} />
            ) : (
                <p className="text-white/60 italic">Pas de description.</p>
            )}
            {localVideoSrc ? (
                <div className="mb-12 mt-8">
                    <video
                        key={localVideoSrc}
                        controls
                        preload="metadata"
                        playsInline
                        className="w-full rounded-xl border border-white/10"
                        onError={(e) => {
                            const el = e.currentTarget;
                            console.warn('VIDEO ERROR', {
                                src: el.currentSrc || localVideoSrc,
                                error: el.error?.code,
                            });
                        }}
                        onLoadedMetadata={(e) => {
                            const el = e.currentTarget;
                            console.info('VIDEO OK', { duration: el.duration, src: el.currentSrc });
                        }}>
                        <source src={localVideoSrc} type="video/mp4" />
                        Votre navigateur ne supporte pas la balise vidéo.
                    </video>
                </div>
            ) : embedSrc ? (
                <div className="mb-12 mt-8">
                    <div className="relative w-full" style={{ paddingTop: "55%" }}>
                        <iframe
                            src={embedSrc}
                            title={podcast.title}
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="absolute inset-0 h-full w-full rounded-xl border border-white/10"
                            loading="lazy" />
                    </div>
                </div>
            ) : null}
            <div className="mt-10 flex justify-center md:justify-start">
                <Link
                    to={ROUTES.PODCASTS}
                    className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10">
                    ← Retour à la liste
                </Link>
            </div>
        </article>
    );
}

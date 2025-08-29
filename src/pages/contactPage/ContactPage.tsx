import { useState, useMemo } from "react";
import type { FormData } from "../../@types/mail";

const initial: FormData = {
    name: "",
    email: "",
    company: "",
    website: "",
    budget: "",
    objective: "notoriety",
    audience: "",
    message: "",
    consent: false,
    phone: "",
};

const TO_EMAIL = "sponsors@radio4you.example";

export default function ContactPage() {
    const [data, setData] = useState<FormData>(initial);
    const [err, setErr] = useState<string | null>(null);

    function onChange<K extends keyof FormData>(key: K, value: FormData[K]) {
        setData((d) => ({ ...d, [key]: value }));
    }

    function validate(d: FormData): string | null {
        if (!d.name.trim()) return "Le nom est requis.";
        if (!/^\S+@\S+\.\S+$/.test(d.email)) return "Email invalide.";
        if (!d.message.trim()) return "Merci de décrire votre projet.";
        if (!d.consent) return "Merci d’accepter la politique de confidentialité.";
        // Bloc les bots
        if (d.phone && d.phone.trim().length > 0) return "Une erreur est survenue.";
        return null;
    }

    const mailtoHref = useMemo(() => {
        const subject = `Sponsoring — ${data.company?.trim() || data.name.trim() || "Demande"}`;
        const lines = [
            `Bonjour Radio4You,`,
            ``,
            `Je souhaite sponsoriser vos contenus.`,
            ``,
            `Nom : ${data.name}`,
            `Email : ${data.email}`,
            data.company ? `Société : ${data.company}` : null,
            data.website ? `Site web : ${data.website}` : null,
            data.budget ? `Budget estimé : ${data.budget}` : null,
            `Objectif principal : ${labelObjective(data.objective)}`,
            data.audience ? `Public visé : ${data.audience}` : null,
            ``,
            `Message :`,
            data.message,
            ``,
            `— Envoyé depuis la page Devenir sponsor`,
        ].filter(Boolean);

        const body = lines.join("\n");

        return `mailto:${encodeURIComponent(TO_EMAIL)}?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;
    }, [data]);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        const v = validate(data);
        if (v) {
            setErr(v);
            return;
        }
        window.location.href = mailtoHref;
    }

    return (
        <section className="relative isolate text-white">
            <div className="mx-auto max-w-7xl px-4 pt-12 md:px-6 md:pt-16">
                <div className="text-center md:text-left">
                    <span className="inline-block rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
                        Partenariats
                    </span>
                    <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">
                        Devenir sponsor de Radio4You
                    </h1>
                    <p className="mt-4 text-white/80 max-w-2xl md:max-w-3xl">
                        Associez votre marque à nos podcasts et playlists. Formats natifs, sponsoring d’émission,
                        pré-roll audio ou intégration vidéo YouTube : construisons ensemble une collab efficace.
                    </p>
                </div>
            </div>
            {/* Partie gauche */}
            <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
                <div className="grid gap-6 md:grid-cols-5">
                    <aside className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-xl font-bold">Pourquoi sponsoriser ?</h2>
                        <ul className="mt-3 space-y-2 text-white/80">
                            <li>• Audience élevée</li>
                            <li>• Visibilité nationale</li>
                            <li>• Actif sur l'actualité en lien avec la musique </li>
                        </ul>
                        <div className="mt-6 rounded-xl border border-green-400/30 bg-green-400/10 p-4">
                            <p className="text-sm text-white/80">
                                Indiquez votre **budget estimé** et votre **objectif**. On vous répond vite avec une reco adaptée.
                            </p>
                        </div>
                    </aside>
                    {/* Partie droite */}
                    <form onSubmit={onSubmit} className="md:col-span-3 rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
                        {err && (
                            <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-red-200">
                                {err}
                            </div>
                        )}
                        <div className="hidden">
                            <label htmlFor="phone">Phone</label>
                            <input
                                id="phone"
                                name="phone"
                                value={data.phone}
                                onChange={(e) => onChange("phone", e.target.value)} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1" htmlFor="name">Nom *</label>
                                <input
                                    id="name"
                                    className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 outline-none focus:border-white/40"
                                    value={data.name}
                                    onChange={(e) => onChange("name", e.target.value)}
                                    required />
                            </div>
                            <div>
                                <label className="block text-sm mb-1" htmlFor="email">Email *</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 outline-none focus:border-white/40"
                                    value={data.email}
                                    onChange={(e) => onChange("email", e.target.value)}
                                    required />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1" htmlFor="company">Société</label>
                                <input
                                    id="company"
                                    className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 outline-none focus:border-white/40"
                                    value={data.company}
                                    onChange={(e) => onChange("company", e.target.value)}
                                    placeholder="Nom de votre entreprise" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1" htmlFor="website">Site web</label>
                                <input
                                    id="website"
                                    type="url"
                                    className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 outline-none focus:border-white/40"
                                    value={data.website}
                                    onChange={(e) => onChange("website", e.target.value)}
                                    placeholder="https://…" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1" htmlFor="budget">Budget estimé</label>
                                <select
                                    id="budget"
                                    className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 outline-none focus:border-white/40"
                                    value={data.budget}
                                    onChange={(e) => onChange("budget", e.target.value)}>
                                    <option value="">Sélectionner…</option>
                                    <option value="<2k">Moins de 2 000 €</option>
                                    <option value="2-5k">2 000 – 5 000 €</option>
                                    <option value="5-10k">5 000 – 10 000 €</option>
                                    <option value="10k+">Plus de 10 000 €</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Objectif principal</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { key: "notoriety", label: "Notoriété" },
                                        { key: "leads", label: "Leads" },
                                        { key: "downloads", label: "Téléchargements" },
                                        { key: "other", label: "Autre" },
                                    ].map((o) => (
                                        <label
                                            key={o.key}
                                            className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer ${data.objective === o.key ? "border-white/40 bg-white/10" : "border-white/15"
                                                }`}>
                                            <input
                                                type="radio"
                                                name="objective"
                                                className="accent-white"
                                                checked={data.objective === (o.key as FormData["objective"])}
                                                onChange={() => onChange("objective", o.key as FormData["objective"])} />
                                            <span className="text-sm">{o.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm mb-1" htmlFor="audience">Public visé</label>
                            <input
                                id="audience"
                                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 outline-none focus:border-white/40"
                                value={data.audience}
                                onChange={(e) => onChange("audience", e.target.value)}
                                placeholder="Ex : 18–34 ans, FR, musique chill/hip-hop…" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1" htmlFor="message">Votre projet *</label>
                            <textarea
                                id="message"
                                rows={6}
                                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 outline-none focus:border-white/40"
                                value={data.message}
                                onChange={(e) => onChange("message", e.target.value)}
                                placeholder="Parlez-nous de votre marque, produit, échéance, KPIs…"
                                required />
                        </div>
                        <label className="flex items-start gap-3 text-sm">
                            <input
                                type="checkbox"
                                className="mt-1 accent-white"
                                checked={data.consent}
                                onChange={(e) => onChange("consent", e.target.checked)} />
                            <span>
                                J’accepte que mes informations soient utilisées pour être recontacté
                            </span>
                        </label>
                        <div className="pt-2 flex flex-col sm:flex-row gap-3">
                            <button
                                type="submit"
                                className="w-full sm:w-auto rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/10">
                                Ouvrir mon e-mail pour envoyer
                            </button>
                        </div>
                        <p className="text-xs text-white/50">
                            Besoin d’un contact direct ? Écrivez-nous :{" "}
                            <a className="underline" href={`mailto:${TO_EMAIL}`}>{TO_EMAIL}</a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}

function labelObjective(o: FormData["objective"]) {
    switch (o) {
        case "notoriety":
            return "Notoriété";
        case "leads":
            return "Leads";
        case "downloads":
            return "Téléchargements";
        default:
            return "Autre";
    }
}

// src/pages/legal/LegalPage.tsx
import { Link } from "react-router-dom";
import { ROUTES } from "../../App";

export default function LegalPage() {
    return (
        <section className="relative isolate text-white">
            <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center md:text-left">
                    Mentions légales
                </h1>
                <div className="prose prose-invert max-w-none leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-xl font-bold">Éditeur du site</h2>
                        <p>
                            <strong>Radio4You</strong><br />
                            Société DEV4YOU<br />
                            38 Rue Lieutenant Chancel,
                            <br />
                            83160 LA VALETTE-DU-VAR
                            <br />
                            Email : <a href="mailto:contact@radio4you.fr">contact@radio4you.fr</a>
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold">Hébergement</h2>
                        <p>
                            Ce site est hébergé par :<br />
                            <strong>OVH SAS</strong><br />
                            2 rue Kellermann — 59100 Roubaix — France<br />
                            Site web : <a href="https://www.ovhcloud.com" target="_blank" rel="noreferrer">www.ovhcloud.com</a>
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold">Propriété intellectuelle</h2>
                        <p>
                            L’ensemble du contenu du site (textes, images, logos, sons, vidéos, etc.)
                            est protégé par le droit d’auteur et appartient à Radio4You, sauf mention contraire.
                            Toute reproduction, représentation ou diffusion sans autorisation préalable
                            est interdite.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold">Données personnelles</h2>
                        <p>
                            Les informations collectées via nos formulaires sont utilisées uniquement
                            pour vous répondre et ne sont pas cédées à des tiers.
                            Vous disposez d’un droit d’accès, de rectification et de suppression
                            de vos données conformément au Règlement Général sur la Protection des Données (RGPD).
                            Pour exercer vos droits :{" "}
                            <a href="mailto:contact@radio4you.fr">contact@radio4you.fr</a>.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-bold">Responsabilité</h2>
                        <p>
                            Radio4You s’efforce d’assurer l’exactitude et la mise à jour des informations
                            diffusées sur ce site. Toutefois, nous ne pouvons garantir l’absence d’erreurs
                            ou d’omissions. L’utilisateur reste responsable de l’usage qu’il fait des informations.
                        </p>
                    </section>
                </div>
                <div className="mt-12 text-center">
                    <Link
                        to={ROUTES.HOME}
                        className="inline-block rounded-xl border border-white/15 px-5 py-3 font-semibold hover:bg-white/10">
                        ← Retour à l’accueil
                    </Link>
                </div>
            </div>
        </section>
    );
}

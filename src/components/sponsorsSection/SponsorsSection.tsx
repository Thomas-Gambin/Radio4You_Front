import React from "react";
import { Colors } from "../../utils";
type Logo = { src: string; alt: string; href?: string };

const logos: Logo[] = [
    { src: "/logos/logo_SocieteGenerale.webp", alt: "Société Générale" },
    { src: "/logos/lidl.png", alt: "Lidl" },
    { src: "/logos/Logo_Stade_Toulousain.png", alt: "Stade Toulousain" },
];

export default function SponsorsSection() {

    const groupsCount = 10;
    const duration = "20s";

    const trackVars = {
        "--copies": groupsCount,
        "--duration": duration,
    } as React.CSSProperties;

    return (
        <section
            id="sponsors"
            className="relative isolate overflow-visible"
            style={{ backgroundColor: Colors.baseBg }}
            aria-labelledby="sponsors-title">
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
                <h2
                    id="sponsors-title"
                    className="text-white text-2xl md:text-3xl font-extrabold mb-8 text-center">
                    En partenariat avec
                </h2>
                <div className="sponsors-viewport mx-auto max-w-6xl">
                    <div className="sponsors-track" style={trackVars}>
                        {Array.from({ length: groupsCount }).map((_, groupIndex) => (
                            <div className="sponsors-group" key={groupIndex}>
                                {logos.map((logo, logoIndex) => {
                                    const key = `${groupIndex}-${logoIndex}`;
                                    const Img = (
                                        <img src={logo.src} alt={logo.alt} />
                                    );
                                    return (
                                        <div className="sponsor-item" key={key}>
                                            {logo.href ? (
                                                <a href={logo.href} target="_blank" rel="noreferrer noopener" aria-label={logo.alt}>
                                                    {Img}
                                                </a>
                                            ) : (
                                                Img
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full">
                <svg
                    className="h-28 md:h-36 w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    style={{ color: Colors.lightBg }}
                    aria-hidden="true">
                    <path
                        className="fill-current"
                        fillOpacity="0.99"
                        d="M0,272 C240,208 480,96 720,144 C960,192 1200,256 1440,224 L1440,320 L0,320 Z"
                        fill="currentColor" />
                </svg>
            </div>
        </section>
    );
}

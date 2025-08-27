const logos = [
    { src: "/logos/logo_SocieteGenerale.webp", alt: "Société Générale" },
    { src: "/logos/lidl.png", alt: "Lidl" },
    { src: "/logos/Logo_Stade_Toulousain.png", alt: "Stade Toulousain" },
];

export default function SponsorsSection() {
    return (
        <section className="relative bg-[#0b1321] py-12 text-center">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-8">
                En partenariat avec
            </h2>

            <div className="sponsors-viewport mx-auto max-w-6xl">
                <div className="sponsors-track">
                    {Array.from({ length: 10 }).map((_, groupIndex) => (
                        <div className="sponsors-group" key={groupIndex}>
                            {logos.map((logo, logoIndex) => (
                                <div key={`${groupIndex}-${logoIndex}`} className="sponsor-item">
                                    <img src={logo.src} alt={logo.alt} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

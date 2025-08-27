export default function Hero() {
    return (
        <section className="relative isolate overflow-hidden bg-[#0b1321] pt-20 md:pt-24">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-6 lg:gap-16 md:grid-cols-12">
                {/* Colonne gauche */}
                <div className="relative md:col-span-5">
                    <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-white/60">En direct partout</p>
                    <h1 className="mt-4 text-4xl leading-[1.05] font-extrabold md:text-6xl">
                        Votre radio <span className="text-[#41d165]">régionale</span>,<br className="hidden sm:block" /> 24/7
                    </h1>
                    <p className="mt-5 max-w-xl text-base md:text-lg text-white/70">
                        Actus locales, playlists récentes, podcasts exclusifs et invités de la région.
                        Branchez-vous et profitez-en partout où que vous soyez.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
                        <a href="#direct" className="rounded-2xl border border-white/15 px-6 py-3 text-base font-semibold text-white hover:bg-white/5 transition">Voir les articles</a>
                        <a href="#podcasts" className="rounded-2xl border border-white/15 px-6 py-3 text-base font-semibold text-white hover:bg-white/5 transition">Voir les podcasts</a>
                    </div>
                </div>
                {/* Image */}
                <div className="relative md:col-span-7 justify-self-end">
                    <div className="relative mx-auto max-w-none">
                        <img
                            src="/micro.png"
                            alt="Micro Radio4You"
                            className="rounded-[1.75rem] object-cover w-[520px] sm:w-[620px] md:w-[760px] lg:w-[900px] xl:w-[1040px]"
                        />
                    </div>
                </div>
            </div>
            <div className="h-10 md:h-16" />
        </section>
    );
}

import { Link } from "react-router-dom";
import Hero from "../../components/hero/Hero"
import SponsorsSection from "../../components/sponsorsSection/SponsorsSection";
import LatestArticles from "../../components/latestArticles/LatestArticles";
import LatestPodcasts from "../../components/latestPodcasts/LatestPodcasts";

export default function Homepage() {
    return (
        <main className="min-h-[calc(100vh-64px)] bg-[#0b1321] text-white">
            <Hero />
            <SponsorsSection />
            <LatestArticles />
            <LatestPodcasts />
        </main>
    );
}

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { PlayerContextType } from "../@types/playerContextType";

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [playing, setPlaying] = useState(false);
    const togglePlay = () => setPlaying((p) => !p);
    const start = () => setPlaying(true);

    return (
        <PlayerContext.Provider value={{ playing, togglePlay, start }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error("error with context")
    return ctx;
}
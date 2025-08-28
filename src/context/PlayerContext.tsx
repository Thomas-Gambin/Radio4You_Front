import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { PlayerContextType } from "../@types/playerContextType";
import type { FetchOpts } from "../@types/jamendo";

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [playing, setPlaying] = useState(false);
    const [jamendoParams, setJamendoParams] = useState<FetchOpts>({});

    const togglePlay = () => setPlaying((p) => !p);
    const start = () => setPlaying(true);

    const value = useMemo<PlayerContextType>(
        () => ({ playing, togglePlay, start, jamendoParams, setJamendoParams }),
        [playing, jamendoParams]
    );

    return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error("error with context");
    return ctx;
}

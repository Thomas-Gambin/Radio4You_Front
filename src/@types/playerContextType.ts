import type { FetchOpts } from "./jamendo";

export type PlayerContextType = {
    playing: boolean;
    togglePlay: () => void;
    start: () => void;
    jamendoParams: FetchOpts;
    setJamendoParams: (p: FetchOpts) => void;
}
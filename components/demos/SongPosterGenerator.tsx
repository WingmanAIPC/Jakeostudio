import React, { useState } from "react";

const STYLE_NAMES = [
  "Swiss International Style",
  "Psychedelic Concert Poster",
  "Minimalist Bauhaus",
  "Risograph Print",
  "Japanese Woodblock",
  "Art Deco",
  "Soviet Constructivist",
  "Vaporwave",
  "Brutalist Typography",
  "Retro Futurism",
];

const SongPosterGenerator: React.FC = () => {
  const [song, setSong] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [styleName, setStyleName] = useState<string | null>(null);
  const [submittedSong, setSubmittedSong] = useState("");

  const generate = async (songInput?: string) => {
    const target = songInput || song;
    if (!target.trim()) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);
    setSubmittedSong(target);

    try {
      const res = await fetch("/api/poster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song: target.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to generate (${res.status})`);
      }

      const data = await res.json();
      setImageUrl(data.imageUrl);
      setStyleName(data.style);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSong("");
    setImageUrl(null);
    setError(null);
    setStyleName(null);
    setSubmittedSong("");
  };

  return (
    <div className="flex flex-col items-center gap-6 min-h-[400px]">
      {!imageUrl && !loading && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md pt-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-2xl mb-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-white text-center">Song Poster Designer</h3>
          <p className="text-sm text-zinc-400 text-center max-w-xs">
            Enter your favorite song and get a custom designed poster in seconds.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); generate(); }}
            className="w-full flex gap-2"
          >
            <input
              type="text"
              value={song}
              onChange={(e) => setSong(e.target.value)}
              placeholder="e.g. Bohemian Rhapsody - Queen"
              className="flex-1 bg-zinc-900 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={!song.trim()}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Generate
            </button>
          </form>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-4 pt-12">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 animate-pulse" />
            <div className="absolute inset-2 rounded-xl bg-zinc-950 flex items-center justify-center">
              <svg className="w-8 h-8 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-zinc-400">Creating your poster...</p>
          <p className="text-xs text-zinc-600">{submittedSong}</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-3 pt-8">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => generate(submittedSong)}
            className="px-4 py-2 rounded-full border border-white/20 text-sm text-zinc-300 hover:text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {imageUrl && (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="relative max-w-sm w-full">
            <img
              src={imageUrl}
              alt={`AI-generated poster for ${submittedSong}`}
              className="w-full rounded-2xl border border-white/10 shadow-2xl"
            />
            {styleName && (
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[10px] text-zinc-300 border border-white/10">
                {styleName}
              </div>
            )}
          </div>

          <p className="text-sm text-zinc-400">{submittedSong}</p>

          <div className="flex gap-2">
            <button
              onClick={() => generate(submittedSong)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Generate Another
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-full border border-white/20 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Try Another Song
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongPosterGenerator;

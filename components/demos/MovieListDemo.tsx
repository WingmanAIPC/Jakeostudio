import React, { useState, useEffect } from "react";

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  releaseDate: string;
  rating: number;
  overview: string;
}

type SortKey = "title" | "releaseDate" | "rating";
type SortDir = "asc" | "desc";

const MovieListDemo: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setLoading(true);
        const res = await fetch("/data/movies.json", { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Movie[] = await res.json();
        setMovies(data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
    return () => controller.abort();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "rating" ? "desc" : "asc");
    }
  };

  const filtered = movies
    .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      else if (sortKey === "releaseDate") cmp = a.releaseDate.localeCompare(b.releaseDate);
      else cmp = a.rating - b.rating;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  if (loading) {
    return (
      <div role="status" aria-label="Loading movies" className="flex items-center justify-center py-12 text-zinc-400 text-sm">
        <svg className="animate-spin h-5 w-5 mr-3 text-zinc-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading movies…
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="text-red-400 text-sm py-8 text-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search movies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search movies by title"
          className="w-full sm:w-64 px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <p role="status" className="text-zinc-500 text-sm py-6 text-center">
          No movies match &ldquo;{search}&rdquo;
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" aria-label="Movie list">
            <caption className="sr-only">
              A list of movies with poster, title, release date, and rating.
            </caption>
            <thead>
              <tr className="border-b border-white/10 text-zinc-400">
                <th scope="col" className="py-2 pr-3 font-medium w-12">
                  #
                </th>
                <th
                  scope="col"
                  className="py-2 pr-3 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("title")}
                >
                  Title{sortIndicator("title")}
                </th>
                <th
                  scope="col"
                  className="py-2 pr-3 font-medium cursor-pointer hover:text-white transition-colors hidden sm:table-cell"
                  onClick={() => handleSort("releaseDate")}
                >
                  Released{sortIndicator("releaseDate")}
                </th>
                <th
                  scope="col"
                  className="py-2 pr-2 font-medium cursor-pointer hover:text-white transition-colors text-right"
                  onClick={() => handleSort("rating")}
                >
                  Rating{sortIndicator("rating")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((movie) => (
                <tr
                  key={movie.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-2 pr-3">
                    <img
                      src={movie.posterUrl}
                      alt={`${movie.title} poster`}
                      className="w-8 h-12 object-cover rounded"
                      loading="lazy"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <div className="font-medium text-zinc-100">{movie.title}</div>
                    <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1 max-w-xs">
                      {movie.overview}
                    </div>
                  </td>
                  <td className="py-2 pr-3 text-zinc-400 hidden sm:table-cell whitespace-nowrap">
                    {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-2 pr-2 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium">
                      <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {movie.rating.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-zinc-600 mt-3">
        {filtered.length} of {movies.length} movies
      </p>
    </div>
  );
};

export default MovieListDemo;

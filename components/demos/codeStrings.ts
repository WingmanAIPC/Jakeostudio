export const movieListCode = `import React, { useState, useEffect } from "react";

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
        const res = await fetch("/data/movies.json", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const data: Movie[] = await res.json();
        setMovies(data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "Failed to fetch movies"
        );
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
    .filter((m) =>
      m.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      else if (sortKey === "releaseDate")
        cmp = a.releaseDate.localeCompare(b.releaseDate);
      else cmp = a.rating - b.rating;
      return sortDir === "asc" ? cmp : -cmp;
    });

  if (loading) return <div role="status">Loading movies…</div>;
  if (error) return <div role="alert">Error: {error}</div>;

  return (
    <div>
      <input
        type="search"
        placeholder="Search movies…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search movies by title"
      />

      <table aria-label="Movie list">
        <caption className="sr-only">
          A list of movies with poster, title, release date, and rating.
        </caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" onClick={() => handleSort("title")}>
              Title
            </th>
            <th scope="col" onClick={() => handleSort("releaseDate")}>
              Released
            </th>
            <th scope="col" onClick={() => handleSort("rating")}>
              Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((movie) => (
            <tr key={movie.id}>
              <td>
                <img
                  src={movie.posterUrl}
                  alt={\`\${movie.title} poster\`}
                  loading="lazy"
                />
              </td>
              <td>{movie.title}</td>
              <td>
                {new Date(movie.releaseDate).toLocaleDateString()}
              </td>
              <td>⭐ {movie.rating.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{filtered.length} of {movies.length} movies</p>
    </div>
  );
};`;

export const motionPlaygroundCode = `import React, { useState, useCallback } from "react";

const EASING_OPTIONS = [
  { label: "ease", value: "ease" },
  { label: "ease-in-out", value: "ease-in-out" },
  { label: "ease-in", value: "ease-in" },
  { label: "ease-out", value: "ease-out" },
  { label: "linear", value: "linear" },
  { label: "spring", value: "cubic-bezier(0.175, 0.885, 0.32, 1.275)" },
];

const TRANSFORM_OPTIONS = [
  { label: "Scale", value: "scale", unit: "", range: [0.5, 2], default: 1 },
  { label: "Rotate", value: "rotate", unit: "deg", range: [0, 360], default: 0 },
  { label: "TranslateY", value: "translateY", unit: "px", range: [-60, 60], default: 0 },
  { label: "Skew", value: "skewX", unit: "deg", range: [-30, 30], default: 0 },
];

const SHADOW_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Soft", value: "0 8px 24px -4px" },
  { label: "Hard", value: "0 4px 0 0" },
  { label: "Glow", value: "0 0 24px 4px" },
];

interface MotionState {
  duration: number;
  easing: string;
  transformType: number;
  transformValue: number;
  hoverColor: string;
  hoverShadow: string;
  hoverBorderRadius: number;
}

const BASE_COLOR = "#6366f1";

const MotionPlayground: React.FC = () => {
  const [state, setState] = useState<MotionState>({ ...DEFAULTS });
  const [isHovered, setIsHovered] = useState(false);

  const transform = TRANSFORM_OPTIONS[state.transformType];

  const buildTransform = (val: number) =>
    transform.unit === ""
      ? \`\${transform.value}(\${val})\`
      : \`\${transform.value}(\${val}\${transform.unit})\`;

  // Base (resting) style
  const baseStyle: React.CSSProperties = {
    transition: \`all \${state.duration}ms \${state.easing}\`,
    transform: buildTransform(transform.default),
    backgroundColor: BASE_COLOR,
    borderRadius: 12,
    boxShadow: "none",
  };

  // Hover style — applies configured transforms
  const hoveredStyle: React.CSSProperties = {
    ...baseStyle,
    transform: buildTransform(state.transformValue),
    backgroundColor: state.hoverColor,
    borderRadius: state.hoverBorderRadius,
    boxShadow: state.hoverShadow === "none"
      ? "none"
      : \`\${state.hoverShadow} \${state.hoverColor}66\`,
  };

  const cardStyle = isHovered ? hoveredStyle : baseStyle;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Card with hover interaction */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={cardStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="avatar" />
          <div className="line" />
        </div>
      </div>

      {/* Controls for hover properties */}
      <div>
        <label>Duration: {state.duration}ms</label>
        <input type="range" min={100} max={2000} step={50}
          value={state.duration}
          onChange={(e) => setState(s => ({ ...s, duration: +e.target.value }))}
        />

        <label>Easing</label>
        {EASING_OPTIONS.map(opt => (
          <button key={opt.label}
            onClick={() => setState(s => ({ ...s, easing: opt.value }))}>
            {opt.label}
          </button>
        ))}

        <label>Transform</label>
        <input type="range"
          min={transform.range[0]} max={transform.range[1]}
          value={state.transformValue}
          onChange={(e) => setState(s => ({ ...s, transformValue: +e.target.value }))}
        />

        <label>Shadow</label>
        {SHADOW_OPTIONS.map(opt => (
          <button key={opt.label}
            onClick={() => setState(s => ({ ...s, hoverShadow: opt.value }))}>
            {opt.label}
          </button>
        ))}

        <label>Radius: {state.hoverBorderRadius}px</label>
        <input type="range" min={0} max={50}
          value={state.hoverBorderRadius}
          onChange={(e) => setState(s => ({ ...s, hoverBorderRadius: +e.target.value }))}
        />

        <button onClick={randomize}>Randomize</button>
        <button onClick={() => setState({ ...DEFAULTS })}>Reset</button>
      </div>
    </div>
  );
};`;

export const responsiveDemoCode = `import React, { useState, useRef, useCallback, useEffect } from "react";

const BREAKPOINTS = [
  { label: "Mobile", maxWidth: 480, cols: 1, color: "#ef4444" },
  { label: "Tablet", maxWidth: 768, cols: 2, color: "#f59e0b" },
  { label: "Desktop", maxWidth: Infinity, cols: 4, color: "#10b981" },
];

const CARDS = [
  { title: "Analytics", icon: "📊" },
  { title: "Settings", icon: "⚙️" },
  { title: "Messages", icon: "💬" },
  { title: "Profile", icon: "👤" },
  { title: "Calendar", icon: "📅" },
  { title: "Storage", icon: "📁" },
  { title: "Reports", icon: "📈" },
  { title: "Security", icon: "🔒" },
];

const ResponsiveDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [isDragging, setIsDragging] = useState(false);
  const [maxWidth, setMaxWidth] = useState(800);

  useEffect(() => {
    const updateMax = () => {
      if (containerRef.current?.parentElement) {
        setMaxWidth(containerRef.current.parentElement.clientWidth - 32);
      }
    };
    updateMax();
    window.addEventListener("resize", updateMax);
    return () => window.removeEventListener("resize", updateMax);
  }, []);

  const activeBreakpoint =
    BREAKPOINTS.find((bp) => containerWidth <= bp.maxWidth) || BREAKPOINTS[2];
  const cols = activeBreakpoint.cols;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const startX = e.clientX;
    const startWidth = containerWidth;

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      setContainerWidth(Math.max(280, Math.min(maxWidth, startWidth + delta)));
    };
    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [containerWidth, maxWidth]);

  return (
    <div>
      {/* Breakpoint indicators */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {BREAKPOINTS.map((bp) => (
          <span key={bp.label} style={{
            color: activeBreakpoint.label === bp.label ? bp.color : "#666",
            fontWeight: activeBreakpoint.label === bp.label ? 600 : 400,
          }}>
            {bp.label} {bp.maxWidth < Infinity ? \`≤\${bp.maxWidth}px\` : ""}
          </span>
        ))}
        <span style={{ marginLeft: "auto" }}>
          {Math.round(containerWidth)}px
        </span>
      </div>

      {/* Resizable container with drag handle */}
      <div ref={containerRef}
        style={{ width: containerWidth, maxWidth: "100%", position: "relative" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: \`repeat(\${cols}, 1fr)\`,
          gap: 12,
          padding: 16,
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
        }}>
          {CARDS.map((card) => (
            <div key={card.title} className="grid-card">
              <span>{card.icon}</span>
              <span>{card.title}</span>
            </div>
          ))}
        </div>

        {/* Drag handle on the right edge */}
        <div onMouseDown={handleMouseDown}
          style={{
            position: "absolute", top: 0, right: 0, bottom: 0,
            width: 12, cursor: "col-resize",
          }}
        />
      </div>
    </div>
  );
};`;

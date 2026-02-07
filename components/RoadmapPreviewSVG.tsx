type Props = {
  total: number;
  completed: number;
};

export default function RoadmapPreviewSVG({ total, completed }: Props) {
  const nodes = Math.max(total, 6);
  const spacing = 70;

  const points = Array.from({ length: nodes }).map((_, i) => ({
    x: i * spacing,
    y: i % 2 === 0 ? 60 : 110,
  }));

  const currentIndex = Math.min(completed, nodes - 1);
  const currentX = points[currentIndex].x;

  const VIEW_WIDTH = 320;
  const CENTER_X = VIEW_WIDTH / 2;

  // 🔥 translate supaya current node di tengah
  const translateX = CENTER_X - currentX;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} 160`}
      className="w-full h-40 overflow-hidden"
      fill="none"
    >
      <g transform={`translate(${translateX}, 0)`}>
        {/* PATH */}
        <path
          d={`M ${points.map(p => `${p.x} ${p.y}`).join(" L ")}`}
          stroke="currentColor"
          strokeWidth="2"
          className="roadmap-path"
        />

        {/* NODES */}
        {points.map((p, i) => {
          const active = i < completed;
          const current = i === currentIndex;

          return (
            <g key={i}>
              {/* Pulse */}
              {current && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="18"
                  className="roadmap-pulse"
                />
              )}

              {/* Node */}
              <circle
                cx={p.x}
                cy={p.y}
                r="8"
                className={
                  active
                    ? "fill-white dark:fill-white"
                    : "fill-zinc-600"
                }
              />

              {/* Check */}
              {active && (
                <path
                  d={`M${p.x - 4} ${p.y} l3 3 l5 -5`}
                  stroke="black"
                  strokeWidth="2"
                />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

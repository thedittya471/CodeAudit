"use client";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

type Tone = "accent" | "green" | "blue";

type DayEvent = { title: string; tag: string; tone: Tone };

const EVENTS: Record<number, DayEvent> = {
  4: { title: "Review posted", tag: "PR #142 · CLEAN", tone: "green" },
  8: { title: "Reviewing", tag: "PR #156", tone: "accent" },
  14: { title: "Review posted", tag: "PR #161", tone: "blue" },
  20: { title: "PR merged", tag: "2 ISSUES FIXED", tone: "accent" },
  23: { title: "Review posted", tag: "PR #170 · CLEAN", tone: "green" },
  29: { title: "Reviewing", tag: "PR #181", tone: "accent" },
};

const TONE_CELL: Record<Tone, string> = {
  accent: "bg-[#ff4d00]/10",
  green: "bg-emerald-500/10",
  blue: "bg-blue-500/10",
};

const TONE_TEXT: Record<Tone, string> = {
  accent: "text-[#ff7a3d]",
  green: "text-emerald-300",
  blue: "text-blue-300",
};

// First two cells empty so the 1st lands on a Tuesday (like a real month grid).
const LEAD = 2;
const TOTAL = 35;

export function ReviewCalendar() {
  const cells = Array.from({ length: TOTAL }, (_, i) => {
    const day = i - LEAD + 1;
    return day >= 1 && day <= 31 ? day : null;
  });

  return (
    <div className="w-full overflow-hidden border-l border-t border-white/10">
      {/* weekday header */}
      <div className="grid grid-cols-7">
        {DAYS.map((d) => (
          <div
            key={d}
            className="border-b border-r border-white/10 px-2 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#5d5d66]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const ev = day ? EVENTS[day] : undefined;
          return (
            <div
              key={i}
              className={`relative flex min-h-[64px] flex-col border-b border-r border-white/10 p-1.5 sm:min-h-[78px] ${
                ev ? TONE_CELL[ev.tone] : ""
              }`}
            >
              <span className="font-mono text-[11px] text-[#75757e]">{day ?? ""}</span>
              {ev ? (
                <div className="mt-auto">
                  <p className={`truncate text-[11px] font-medium ${TONE_TEXT[ev.tone]}`}>
                    {ev.title}
                  </p>
                  <p className="truncate font-mono text-[8px] uppercase tracking-wide text-[#5d5d66]">
                    {ev.tag}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

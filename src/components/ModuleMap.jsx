import { useNavigate } from "react-router-dom";
import { MODULES } from "../modules/registry";
import { useUser } from "../context/UserContext";
import {
  GOLD, AMBER, GREEN, SLATE,
  BG, SURF, SURF2, BORDER,
  TP, TB, TM, FD, FB, FM
} from "../theme";

export default function ModuleMap() {
  const navigate = useNavigate();
  const { isCompleted, resetProgress, investorProfile } = useUser();

  const completedCount = MODULES.filter(m => isCompleted(m.id)).length;
  const totalAvailable = MODULES.filter(m => m.status === "available").length;
  const pct = Math.round((completedCount / totalAvailable) * 100);

  const handleClick = (mod) => {
    if (mod.status === "coming_soon") return;
    navigate(mod.path);
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "28px 20px 80px", maxWidth: 800, margin: "0 auto" }}>

      {investorProfile && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <button
            onClick={() => { if (window.confirm("Sign out and clear all progress?")) resetProgress(); }}
            style={{
              background: "none", border: "1px solid " + BORDER, borderRadius: 8,
              padding: "6px 14px", fontFamily: FM, fontSize: 10, color: TM,
              textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer"
            }}
          >
            Sign Out
          </button>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "24px 0 32px" }}>
        <div style={{ fontFamily: FM, fontSize: 10, color: GOLD, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
          Investment Club
        </div>
        <h1 style={{ fontFamily: FD, fontSize: "clamp(26px,5vw,40px)", color: TP, margin: "0 0 8px" }}>
          Your Learning Journey
        </h1>
        <p style={{ fontFamily: FB, fontSize: 15, color: TB, margin: "0 0 24px" }}>
          Six modules. One complete foundation.
        </p>
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase", letterSpacing: "0.1em" }}>Progress</span>
            <span style={{ fontFamily: FM, fontSize: 10, color: GOLD }}>{completedCount} / {totalAvailable} complete</span>
          </div>
          <div style={{ background: SURF2, borderRadius: 6, height: 8, overflow: "hidden" }}>
            <div style={{
              width: pct + "%", background: "linear-gradient(90deg, " + GOLD + " 0%, " + AMBER + " 100%)",
              height: "100%", borderRadius: 6, transition: "width 0.6s ease"
            }} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {MODULES.map((mod) => {
          const completed = isCompleted(mod.id);
          const comingSoon = mod.status === "coming_soon";
          const isFirst = mod.tier === "free";
          return (
            <div
              key={mod.id}
              onClick={() => handleClick(mod)}
              style={{
                background: completed ? "linear-gradient(135deg, " + GOLD + "10 0%, transparent 100%)" : SURF,
                border: "1px solid " + (completed ? GOLD + "40" : BORDER),
                borderRadius: 14, padding: "18px 20px",
                cursor: comingSoon ? "default" : "pointer",
                opacity: comingSoon ? 0.5 : 1,
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 16,
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: completed ? GOLD + "20" : SURF2,
                border: "1px solid " + (completed ? GOLD + "40" : BORDER),
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22
              }}>
                {completed ? "✅" : comingSoon ? "🔒" : mod.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: FD, fontSize: 16, color: completed ? GOLD : TP }}>{mod.title}</span>
                  {isFirst && (
                    <span style={{ fontFamily: FM, fontSize: 8, color: GREEN, background: GREEN + "20", padding: "2px 7px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Free Preview
                    </span>
                  )}
                  {comingSoon && (
                    <span style={{ fontFamily: FM, fontSize: 8, color: AMBER, background: AMBER + "20", padding: "2px 7px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Coming Soon
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: FB, fontSize: 13, color: TB, lineHeight: 1.4 }}>{mod.description}</div>
                <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 6 }}>
                  ~{mod.estimatedMinutes} min
                </div>
              </div>
              {!comingSoon && (
                <div style={{ fontFamily: FM, fontSize: 16, color: completed ? GOLD : SLATE, flexShrink: 0 }}>→</div>
              )}
            </div>
          );
        })}
      </div>

      {completedCount > 0 && (
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button
            onClick={() => { if (window.confirm("Reset all progress?")) resetProgress(); }}
            style={{
              background: "none", border: "1px solid " + BORDER, borderRadius: 8,
              padding: "8px 16px", fontFamily: FM, fontSize: 10, color: TM,
              textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer"
            }}
          >
            Reset Progress
          </button>
        </div>
      )}
    </div>
  );
}
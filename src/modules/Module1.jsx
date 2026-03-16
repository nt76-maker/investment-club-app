import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { ChevronRight, TrendingUp, Clock, Users, BookOpen, CheckCircle, RotateCcw, Home, AlertTriangle } from "lucide-react";

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const G = {
  black:      "#000000",
  surface:    "#0D0D0D",
  surfaceAlt: "#141414",
  border:     "rgba(255,255,255,0.08)",
  borderGold: "rgba(212,160,23,0.35)",
  gold:       "#D4A017",
  goldDim:    "rgba(212,160,23,0.12)",
  white:      "#F5F0E8",
  muted:      "#8A8070",
  subtle:     "#C5BAA8",
  body:       "#C5BAA8",
};

const font = "'Georgia', 'Times New Roman', serif";

// ─────────────────────────────────────────────
// VOCABULARY BANK
// ─────────────────────────────────────────────
const VOCAB = {
  inflation:         { term: "Inflation",          def: "The gradual rise in prices over time, which reduces how much your money can buy." },
  purchasing_power:  { term: "Purchasing Power",   def: "How much goods and services your money can actually buy. Inflation erodes it silently over time." },
  deflation:         { term: "Deflation",          def: "A decrease in prices over time — often driven by technology making things cheaper to produce and distribute." },
  opportunity_cost:  { term: "Opportunity Cost",   def: "What you give up by choosing one option over another. Keeping money in savings has an opportunity cost too." },
  compound_interest: { term: "Compound Interest",  def: "Earning returns on your returns. Your money grows on itself — the longer it runs, the faster it accelerates." },
  time_in_market:    { term: "Time in the Market", def: "The principle that staying invested over long periods matters far more than trying to pick the perfect moment." },
};

// ─────────────────────────────────────────────
// VOCAB TOOLTIP
// ─────────────────────────────────────────────
const V = ({ id, children }) => {
  const [show, setShow] = useState(false);
  const vocab = VOCAB[id];
  if (!vocab) return <span>{children}</span>;
  return (
    <span style={{ position: "relative", display: "inline" }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onTouchStart={() => setShow(s => !s)}
        style={{ fontWeight: 700, borderBottom: `2px solid ${G.gold}`, color: G.gold, cursor: "help" }}
      >
        {children}
      </span>
      {show && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 10px)", left: "50%",
          transform: "translateX(-50%)", background: "#130F00",
          border: `1px solid ${G.gold}`, borderRadius: "8px",
          padding: "12px 16px", width: "240px", zIndex: 999,
          boxShadow: "0 16px 48px rgba(0,0,0,0.9)", pointerEvents: "none",
        }}>
          <span style={{ display: "block", color: G.gold, fontWeight: 700, fontSize: "10px", marginBottom: "6px", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: font }}>{vocab.term}</span>
          <span style={{ color: G.white, fontSize: "13px", lineHeight: "1.6", fontFamily: font }}>{vocab.def}</span>
        </span>
      )}
    </span>
  );
};

// ─────────────────────────────────────────────
// SHARED STYLES
// ─────────────────────────────────────────────
const S = {
  page:     { maxWidth: "760px", margin: "0 auto", padding: "44px 24px 100px" },
  tag:      { fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: G.gold, fontFamily: font, marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" },
  h1:       { fontSize: "clamp(28px,5vw,46px)", fontWeight: 700, lineHeight: 1.12, color: G.white, marginBottom: "20px", letterSpacing: "-0.02em", fontFamily: font },
  h2:       { fontSize: "clamp(19px,3vw,26px)", fontWeight: 700, color: G.white, marginBottom: "14px", letterSpacing: "-0.01em", fontFamily: font },
  lead:     { fontSize: "18px", lineHeight: 1.75, color: G.muted, marginBottom: "32px", fontFamily: font },
  body:     { fontSize: "16px", lineHeight: 1.85, color: G.body,  marginBottom: "18px", fontFamily: font },
  card:     { background: G.surface,    border: `1px solid ${G.border}`,     borderRadius: "14px", padding: "28px", marginBottom: "20px" },
  goldCard: { background: "linear-gradient(135deg,#0F0B00 0%,#1C1400 100%)", border: `1px solid ${G.borderGold}`, borderRadius: "14px", padding: "28px", marginBottom: "20px" },
  dimCard:  { background: G.surfaceAlt, border: `1px solid ${G.border}`,     borderRadius: "14px", padding: "24px", marginBottom: "20px" },
  btn:      { background: G.gold, color: G.black, border: "none", borderRadius: "8px", padding: "14px 28px", fontSize: "15px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", transition: "opacity 0.2s", fontFamily: font, letterSpacing: "0.02em" },
  btnGhost: { background: "transparent", color: G.gold, border: `1px solid ${G.borderGold}`, borderRadius: "8px", padding: "11px 22px", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: font },
};

const tipStyle = {
  contentStyle: { background: "#0D0D0D", border: `1px solid ${G.borderGold}`, borderRadius: "8px", color: G.white, fontFamily: font, fontSize: "13px" },
  labelStyle:   { color: G.gold },
};

// ─────────────────────────────────────────────
// READING GATE
// ─────────────────────────────────────────────
const ReadingGate = ({ onNext, label = "Continue", delay = 5000 }) => {
  const [ready, setReady] = useState(false);
  const [secs,  setSecs]  = useState(Math.ceil(delay / 1000));
  useEffect(() => {
    const iv = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    const to = setTimeout(() => { setReady(true); clearInterval(iv); }, delay);
    return () => { clearInterval(iv); clearTimeout(to); };
  }, []);
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "36px" }}>
      {ready
        ? <button style={S.btn} onClick={onNext}>{label} <ChevronRight size={16} /></button>
        : <span style={{ color: G.muted, fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", fontFamily: font }}>
            <Clock size={14} style={{ color: G.gold }} /> Reading… {secs}s
          </span>
      }
    </div>
  );
};

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
// Purchasing power of $1.00 in 1971 — derived from BLS CPI-U data
const dollarData = [
  { year: "1971", value: 1.00 }, { year: "1975", value: 0.78 },
  { year: "1980", value: 0.55 }, { year: "1985", value: 0.42 },
  { year: "1990", value: 0.34 }, { year: "1995", value: 0.28 },
  { year: "2000", value: 0.24 }, { year: "2005", value: 0.21 },
  { year: "2010", value: 0.18 }, { year: "2015", value: 0.16 },
  { year: "2020", value: 0.15 }, { year: "2024", value: 0.12 },
];

const clydeData = [
  { year: "2019", balance: 8000, power: 8000 },
  { year: "2020", balance: 8040, power: 7720 },
  { year: "2021", balance: 8080, power: 7280 },
  { year: "2022", balance: 8121, power: 6940 },
  { year: "2023", balance: 8162, power: 6750 },
];

const buildCompound = (monthly, rate, years, startAge) =>
  Array.from({ length: years + 1 }, (_, i) => ({
    age:   startAge + i,
    value: Math.round(monthly * 12 * (((1 + rate / 100) ** i - 1) / (rate / 100))),
  }));

const fmt = n => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`;

// ─────────────────────────────────────────────
// OPTION BUTTON (shared)
// ─────────────────────────────────────────────
const OptionBtn = ({ id, label, chosen, correct, revealed, onClick }) => {
  const isSelected = chosen === id;
  const isCorrect  = id === correct;
  return (
    <button onClick={() => !revealed && onClick(id)} style={{
      width: "100%", textAlign: "left", cursor: revealed ? "default" : "pointer",
      background: revealed ? (isCorrect ? G.goldDim : G.surface) : (isSelected ? "rgba(212,160,23,0.08)" : G.surface),
      border: `1px solid ${revealed ? (isCorrect ? G.borderGold : G.border) : (isSelected ? G.borderGold : G.border)}`,
      borderRadius: "10px", padding: "16px 20px", color: G.white, fontSize: "15px",
      marginBottom: "10px", fontFamily: font, display: "flex", alignItems: "flex-start",
      gap: "14px", lineHeight: 1.65, transition: "all 0.2s",
    }}>
      <span style={{
        width: "27px", height: "27px", borderRadius: "50%", flexShrink: 0,
        background: revealed && isCorrect ? G.gold : isSelected ? "rgba(212,160,23,0.25)" : "rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: revealed && isCorrect ? G.black : G.white, fontSize: "12px", fontWeight: 700,
      }}>
        {revealed && isCorrect ? <CheckCircle size={14} /> : id.toUpperCase()}
      </span>
      {label}
    </button>
  );
};

// ─────────────────────────────────────────────
// WELCOME
// ─────────────────────────────────────────────
const WelcomeScreen = ({ onStart }) => {
  const [name, setName] = useState("");
  return (
    <div style={S.page}>
      <div style={{ textAlign: "center", paddingTop: "40px", paddingBottom: "48px" }}>
        <div style={{ display: "inline-flex", width: "72px", height: "72px", borderRadius: "50%", alignItems: "center", justifyContent: "center", background: G.goldDim, border: `1px solid ${G.borderGold}`, marginBottom: "28px" }}>
          <TrendingUp size={30} style={{ color: G.gold }} />
        </div>
        <div style={S.tag}>Investment Club · Beginner Course</div>
        <h1 style={{ ...S.h1, textAlign: "center", fontSize: "clamp(32px,6vw,52px)" }}>
          Your investing journey<br />starts here.
        </h1>
        <p style={{ ...S.lead, textAlign: "center", maxWidth: "500px", margin: "0 auto 44px" }}>
          Six modules. Real market scenarios. Plain English —
          until you're ready for the vocabulary that comes with it.
        </p>
      </div>

      <div style={{ ...S.goldCard, maxWidth: "460px", margin: "0 auto 32px" }}>
        <p style={{ color: G.muted, fontSize: "12px", marginBottom: "10px", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: font }}>First name</p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onStart(name.trim())}
          placeholder="Enter your first name…"
          style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: `1px solid ${G.borderGold}`, borderRadius: "6px", padding: "13px 16px", color: G.white, fontSize: "16px", outline: "none", boxSizing: "border-box", fontFamily: font }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "44px" }}>
        {["📚 6 core modules", "🎮 Real market scenarios", "💡 Vocabulary you'll actually use"].map(f => (
          <div key={f} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: "6px", padding: "8px 16px", fontSize: "13px", color: G.muted, fontFamily: font }}>{f}</div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <button style={{ ...S.btn, opacity: name.trim() ? 1 : 0.4, fontSize: "16px", padding: "16px 40px" }} onClick={() => name.trim() && onStart(name.trim())}>
          Begin Module 1 <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MODULE MAP
// ─────────────────────────────────────────────
const ModuleMap = ({ userName, onSelect }) => {
  const mods = [
    { id: 1, title: "Why Invest At All?",   emoji: "💡", time: "15 min", desc: "Inflation, opportunity cost & the power of compounding",  on: true },
    { id: 2, title: "The Building Blocks",  emoji: "🧱", time: "15 min", desc: "Stocks, bonds, ETFs — what they are and how they differ", on: false },
    { id: 3, title: "How Markets Work",     emoji: "📊", time: "20 min", desc: "Bull markets, bear markets, and why prices move",         on: false },
    { id: 4, title: "Building a Portfolio", emoji: "🗂️", time: "20 min", desc: "Diversification, asset allocation, index funds",         on: false },
    { id: 5, title: "Real-World Investing", emoji: "🌍", time: "15 min", desc: "Brokerages, fees, dollar-cost averaging",                on: false },
    { id: 6, title: "Making Decisions",     emoji: "🧠", time: "25 min", desc: "Evaluating companies, avoiding mistakes, meet Harry",    on: false },
  ];
  return (
    <div style={S.page}>
      <div style={S.tag}><BookOpen size={13} /> Course Overview</div>
      <h1 style={S.h1}>Welcome back, {userName}.</h1>
      <p style={S.lead}>Select a module to continue your journey.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {mods.map(m => (
          <div key={m.id} onClick={() => m.on && onSelect(m.id)} style={{
            background: m.on ? "linear-gradient(135deg,#0F0B00,#1C1400)" : G.surface,
            border: `1px solid ${m.on ? G.borderGold : G.border}`,
            borderRadius: "12px", padding: "20px 24px", cursor: m.on ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", gap: "20px", opacity: m.on ? 1 : 0.45, transition: "all 0.2s",
          }}>
            <div style={{ fontSize: "26px", flexShrink: 0 }}>{m.on ? m.emoji : "🔒"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: m.on ? G.white : G.subtle, marginBottom: "3px", fontFamily: font }}>Module {m.id}: {m.title}</div>
              <div style={{ fontSize: "13px", color: G.muted, fontFamily: font }}>{m.desc}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: "12px", color: m.on ? G.gold : G.subtle, fontFamily: font }}>{m.time}</div>
              {m.on && <div style={{ fontSize: "11px", color: G.gold, marginTop: "4px", letterSpacing: "0.05em", fontFamily: font }}>▶ START</div>}
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: G.subtle, fontSize: "13px", marginTop: "24px", textAlign: "center", fontFamily: font }}>Modules 2–6 unlock as the course is developed.</p>
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION 1 — THE SILENT PROBLEM
// ─────────────────────────────────────────────
const Section1 = ({ onNext }) => (
  <div style={S.page}>
    <div style={S.tag}><AlertTriangle size={13} /> Section 1 of 6 · The Silent Problem</div>
    <h1 style={S.h1}>Your money is losing value.<br />Right now.</h1>
    <p style={S.lead}>Not because someone is stealing it. Not because you're spending it. Because of a quiet, relentless force called <V id="inflation">inflation</V>.</p>

    <div style={S.card}>
      <h2 style={{ ...S.h2, fontSize: "19px" }}>Feel it in everyday life</h2>
      <p style={S.body}>A grocery cart that cost <strong style={{ color: G.white }}>$100 in the year 2000</strong> costs roughly <strong style={{ color: G.white }}>$185 today</strong>. The groceries haven't changed. Your $100 just buys less of them. That erosion is measured in something called <V id="purchasing_power">purchasing power</V> — and inflation chips away at it every single year, whether you notice or not.</p>
    </div>

    <div style={S.goldCard}>
      <div style={{ display: "flex", gap: "14px" }}>
        <div style={{ fontSize: "22px", flexShrink: 0 }}>⚠️</div>
        <div>
          <div style={{ fontWeight: 700, color: G.gold, marginBottom: "10px", fontFamily: font }}>The savings account trap</div>
          <p style={{ ...S.body, marginBottom: 0 }}>A typical savings account earns about <strong style={{ color: G.white }}>0.5% per year</strong>. Inflation historically averages around <strong style={{ color: G.white }}>3–4% per year</strong>. That gap — roughly 3% annually — means your money is effectively shrinking, even as the number on your screen holds steady.</p>
        </div>
      </div>
    </div>

    <div style={S.dimCard}>
      <div style={{ display: "flex", gap: "14px" }}>
        <div style={{ fontSize: "22px" }}>💬</div>
        <div>
          <div style={{ fontWeight: 700, color: G.gold, marginBottom: "6px", fontSize: "14px", fontFamily: font }}>Meet Clyde</div>
          <p style={{ ...S.body, fontStyle: "italic", marginBottom: "6px", color: G.muted }}>"I've got $8,000 sitting in my savings account. It feels safe. I haven't touched it in five years."</p>
          <p style={{ fontSize: "13px", color: G.subtle, margin: 0, fontFamily: font }}>We'll come back to Clyde. His story gets interesting.</p>
        </div>
      </div>
    </div>

    <ReadingGate onNext={onNext} label="Next: The Counterforce" />
  </div>
);

// ─────────────────────────────────────────────
// SECTION 2 — THE COUNTERFORCE
// ─────────────────────────────────────────────
const Section2 = ({ onNext }) => (
  <div style={S.page}>
    <div style={S.tag}><TrendingUp size={13} /> Section 2 of 6 · The Counterforce</div>
    <h1 style={S.h1}>Inflation isn't the only<br />force at work.</h1>
    <p style={S.lead}>There's an opposing force — <V id="deflation">deflation</V> — and technology has been driving it in your favor your entire life.</p>

    <div style={S.card}>
      <div style={{ fontSize: "28px", marginBottom: "14px" }}>🖥️</div>
      <h2 style={{ ...S.h2, fontSize: "19px" }}>The ENIAC — 1945</h2>
      <p style={S.body}>The world's first general-purpose computer occupied a <strong style={{ color: G.white }}>50 by 30 foot room</strong>, used over <strong style={{ color: G.white }}>17,000 vacuum tubes</strong>, and cost the equivalent of <strong style={{ color: G.white }}>roughly $7 million in today's dollars</strong>.</p>
      <p style={{ ...S.body, marginBottom: 0 }}>Your iPhone does millions of times more — fits in your pocket — for a fraction of that price. Technology relentlessly drives the cost of things down. That's deflation in action.</p>
    </div>

    {/* Dollar devaluation chart */}
    <div style={S.goldCard}>
      <h2 style={{ ...S.h2, fontSize: "19px", marginBottom: "6px" }}>The dollar since Nixon ended the gold standard</h2>
      <p style={{ ...S.body, color: G.muted, marginBottom: "20px", fontSize: "14px" }}>
        In August 1971, President Nixon severed the dollar's link to gold. The chart below shows what $1.00 from that moment is worth in purchasing power today — a loss of over <strong style={{ color: G.white }}>87%</strong> in five decades.
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={dollarData} margin={{ top: 8, right: 8, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id="gGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={G.gold} stopOpacity={0.3} />
              <stop offset="95%" stopColor={G.gold} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" stroke={G.subtle} tick={{ fontSize: 11, fill: G.muted, fontFamily: font }} />
          <YAxis stroke={G.subtle} tick={{ fontSize: 11, fill: G.muted, fontFamily: font }} tickFormatter={v => `$${v.toFixed(2)}`} domain={[0, 1.1]} />
          <Tooltip {...tipStyle} formatter={v => [`$${v.toFixed(2)}`, "Purchasing power of $1 (1971)"]} />
          <Area type="monotone" dataKey="value" stroke={G.gold} strokeWidth={2.5} fill="url(#gGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <p style={{ color: G.subtle, fontSize: "12px", marginTop: "10px", textAlign: "center", fontFamily: font }}>
        Source: U.S. Bureau of Labor Statistics CPI-U data. Educational purposes only.
      </p>
    </div>

    <div style={S.card}>
      <h2 style={{ ...S.h2, fontSize: "19px" }}>Why markets trend upward over time</h2>
      <p style={S.body}>The stock market isn't just a place where people bet on prices. It's a mechanism that captures the value human innovation creates. Every time technology makes something cheaper, faster, or better — that value flows into companies, and into markets.</p>
      <p style={{ ...S.body, marginBottom: 0 }}>This is why markets have trended upward over the long run. Not by luck — because human progress is real and ongoing. And <V id="time_in_market">time in the market</V> is how you participate in it.</p>
    </div>

    <ReadingGate onNext={onNext} label="Next: The Argument Against" />
  </div>
);

// ─────────────────────────────────────────────
// SECTION 3 — THE ARGUMENT AGAINST
// ─────────────────────────────────────────────
const Section3 = ({ onNext }) => (
  <div style={S.page}>
    <div style={S.tag}><BookOpen size={13} /> Section 3 of 6 · The Argument Against</div>
    <h1 style={S.h1}>The most common objection<br />deserves a real answer.</h1>
    <p style={S.lead}>"What if I lose my money?" That's completely reasonable. But most people who ask it are only running half the calculation.</p>

    <div style={S.card}>
      <h2 style={{ ...S.h2, fontSize: "19px" }}>The incomplete equation</h2>
      <p style={S.body}>When people focus only on the risk of investing, they're seeing one side of the ledger and ignoring the other. Here's the full picture:</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "20px 0" }}>
        {[
          { label: "Risk of investing",     text: "Market values can drop in the short term. That's real and worth understanding." },
          { label: "Risk of not investing", text: "Inflation quietly erodes your purchasing power. You miss the market's long-term growth." },
        ].map(r => (
          <div key={r.label} style={{ background: G.surfaceAlt, border: `1px solid ${G.border}`, borderRadius: "10px", padding: "18px" }}>
            <div style={{ color: G.gold, fontWeight: 700, marginBottom: "8px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: font }}>{r.label}</div>
            <div style={{ color: G.body, fontSize: "14px", lineHeight: 1.65, fontFamily: font }}>{r.text}</div>
          </div>
        ))}
      </div>
      <p style={{ ...S.body, marginBottom: 0 }}>Choosing a savings account isn't choosing safety — it's choosing a different kind of risk. That missed growth has a name: <V id="opportunity_cost">opportunity cost</V>.</p>
    </div>

    <div style={S.goldCard}>
      <div style={{ fontWeight: 700, color: G.gold, marginBottom: "14px", fontSize: "17px", fontFamily: font }}>The complete question</div>
      <p style={{ ...S.body, color: G.muted, marginBottom: "10px", fontStyle: "italic" }}>Not: "Is investing risky?"</p>
      <p style={{ ...S.body, marginBottom: 0 }}>But: <strong style={{ color: G.white }}>"Which is riskier — participating in the market, or sitting on the sidelines while inflation shrinks my money and technology creates value I'm not capturing?"</strong> When you run the full calculation, doing nothing often carries more risk than most people realize.</p>
    </div>

    <div style={S.dimCard}>
      <div style={{ display: "flex", gap: "14px" }}>
        <div style={{ fontSize: "22px" }}>💬</div>
        <div>
          <div style={{ fontWeight: 700, color: G.gold, marginBottom: "6px", fontSize: "14px", fontFamily: font }}>Clyde, reconsidering</div>
          <p style={{ ...S.body, fontStyle: "italic", marginBottom: 0, color: G.muted }}>"Wait — so my savings account isn't actually the safe option? I've been measuring the wrong thing this whole time?"</p>
        </div>
      </div>
    </div>

    <ReadingGate onNext={onNext} label="Next: The Power of Compounding" />
  </div>
);

// ─────────────────────────────────────────────
// SECTION 4 — COMPOUND INTEREST
// ─────────────────────────────────────────────
const Section4 = ({ onNext }) => {
  const [monthly, setMonthly] = useState(200);
  const [age,     setAge]     = useState(25);

  const earlyData  = buildCompound(monthly, 7, 65 - age, age);
  const lateData   = buildCompound(monthly, 7, Math.max(0, 65 - (age + 10)), age + 10);
  const earlyFinal = earlyData[earlyData.length - 1]?.value || 0;
  const lateFinal  = lateData[lateData.length  - 1]?.value  || 0;

  const chartData = Array.from({ length: 66 - age }, (_, i) => ({
    age:   age + i,
    early: earlyData[i]?.value || 0,
    late:  i >= 10 ? (lateData[i - 10]?.value || 0) : null,
  }));

  return (
    <div style={S.page}>
      <div style={S.tag}><TrendingUp size={13} /> Section 4 of 6 · Compound Interest</div>
      <h1 style={S.h1}>The most powerful force<br />in investing.</h1>
      <p style={S.lead}>Imagine a snowball rolling downhill — small at first, but gathering more snow as it grows. The bigger it gets, the faster it grows. That's <V id="compound_interest">compound interest</V>.</p>

      <div style={S.card}>
        <p style={S.body}>When your investment earns a return, that return is added to your balance. Next year, you earn a return on the larger balance. You're earning returns on your returns — and over decades, the math becomes extraordinary. The single most important variable isn't how much you invest. It's <V id="time_in_market">time in the market</V>.</p>
      </div>

      <div style={S.goldCard}>
        <h2 style={{ ...S.h2, fontSize: "19px", marginBottom: "24px" }}>See it for yourself</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px" }}>
          {[
            { label: "Monthly investment", display: `$${monthly}`, min: 50,  max: 1000, step: 50, val: monthly, set: setMonthly },
            { label: "Your age today",     display: age,            min: 18,  max: 50,   step: 1,  val: age,     set: setAge },
          ].map(sl => (
            <div key={sl.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
                <label style={{ color: G.muted, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: font }}>{sl.label}</label>
                <span style={{ color: G.gold, fontWeight: 700, fontSize: "20px", fontFamily: font }}>{sl.display}</span>
              </div>
              <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.val}
                onChange={e => sl.set(+e.target.value)}
                style={{ width: "100%", accentColor: G.gold, cursor: "pointer" }} />
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: `Start at ${age}`,      val: earlyFinal, highlight: true },
            { label: `Start at ${age + 10}`, val: lateFinal,  highlight: false },
          ].map(r => (
            <div key={r.label} style={{ background: r.highlight ? "rgba(212,160,23,0.1)" : G.surfaceAlt, border: `1px solid ${r.highlight ? G.borderGold : G.border}`, borderRadius: "10px", padding: "18px", textAlign: "center" }}>
              <div style={{ color: G.muted, fontSize: "12px", marginBottom: "8px", fontFamily: font }}>{r.label}</div>
              <div style={{ color: r.highlight ? G.gold : G.muted, fontSize: "28px", fontWeight: 700, fontFamily: font }}>{fmt(r.val)}</div>
              <div style={{ color: G.subtle, fontSize: "12px", fontFamily: font }}>by age 65</div>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <XAxis dataKey="age" stroke={G.subtle} tick={{ fontSize: 11, fill: G.muted }} />
            <YAxis stroke={G.subtle} tick={{ fontSize: 11, fill: G.muted }} tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`} />
            <Tooltip {...tipStyle} formatter={fmt} labelFormatter={l => `Age ${l}`} />
            <Line type="monotone" dataKey="early" stroke={G.gold}  strokeWidth={2.5} dot={false} name={`Start at ${age}`} />
            <Line type="monotone" dataKey="late"  stroke={G.muted} strokeWidth={2}   dot={false} name={`Start at ${age+10}`} strokeDasharray="5 3" connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ color: G.subtle, fontSize: "12px", marginTop: "12px", textAlign: "center", fontFamily: font }}>Assumes 7% average annual return. Past performance does not guarantee future results.</p>
      </div>

      <div style={{ ...S.dimCard, borderColor: G.borderGold }}>
        <div style={{ display: "flex", gap: "14px" }}>
          <div style={{ fontSize: "22px" }}>💬</div>
          <div>
            <div style={{ fontWeight: 700, color: G.gold, marginBottom: "6px", fontSize: "14px", fontFamily: font }}>Pete</div>
            <p style={{ ...S.body, fontStyle: "italic", marginBottom: 0, color: G.muted }}>"I don't check my portfolio every day. I started small at 22 and let time do the work. That chart is basically my entire strategy."</p>
          </div>
        </div>
      </div>

      <ReadingGate onNext={onNext} label="Next: Meet the Club" />
    </div>
  );
};

// ─────────────────────────────────────────────
// SECTION 5 — MEET THE CLUB
// ─────────────────────────────────────────────
const Section5 = ({ onNext }) => {
  const chars = [
    { name: "Clyde", emoji: "🤝", title: "The Cautious One",   desc: "Has $8,000 in a savings account. Prioritizes safety. Hates the idea of losing money — even a dollar.", quote: "I just want to know it's still there when I need it." },
    { name: "Betty", emoji: "😌", title: "The Index Investor", desc: "Put her money in a simple index fund two years ago and mostly forgot about it. Doesn't watch the news.", quote: "I don't try to beat the market. I just own a piece of all of it." },
    { name: "Pete",  emoji: "🎯", title: "The Patient One",    desc: "Started investing small amounts at 22. Consistent, unhurried, 15 years in. Never chases trends.", quote: "Time does the heavy lifting. I just don't get in the way." },
  ];
  return (
    <div style={S.page}>
      <div style={S.tag}><Users size={13} /> Section 5 of 6 · Meet the Club</div>
      <h1 style={S.h1}>You won't be going<br />through this alone.</h1>
      <p style={S.lead}>Three people will make decisions alongside you — each with a completely different approach. None of them are wrong.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        {chars.map(c => (
          <div key={c.name} style={{ ...S.goldCard, padding: "24px", textAlign: "center", marginBottom: 0 }}>
            <div style={{ fontSize: "34px", marginBottom: "12px" }}>{c.emoji}</div>
            <div style={{ fontWeight: 700, color: G.white, fontSize: "17px", marginBottom: "3px", fontFamily: font }}>{c.name}</div>
            <div style={{ color: G.gold, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px", fontFamily: font }}>{c.title}</div>
            <p style={{ color: G.muted, fontSize: "13px", lineHeight: 1.65, marginBottom: "14px", fontFamily: font }}>{c.desc}</p>
            <p style={{ color: G.subtle, fontSize: "13px", fontStyle: "italic", margin: 0, fontFamily: font }}>"{c.quote}"</p>
          </div>
        ))}
      </div>

      <div style={S.goldCard}>
        <p style={{ ...S.body, margin: 0 }}>After each scenario, you'll see how Clyde, Betty, and Pete responded to the same situation — and what happened to each of them. <strong style={{ color: G.white }}>Make your own call first.</strong> Then see how theirs compare. There's no shame in any outcome. The point is to understand the trade-offs.</p>
      </div>

      <ReadingGate onNext={onNext} label="Start Scenario 1" delay={3000} />
    </div>
  );
};

// ─────────────────────────────────────────────
// SCENARIO 1 — CLYDE'S SAVINGS ACCOUNT
// ─────────────────────────────────────────────
const Scenario1 = ({ onNext }) => {
  const [chosen,   setChosen]   = useState(null);
  const [revealed, setRevealed] = useState(false);

  const options = [
    { id: "a", label: "He's fine — his money is still there, the number hasn't gone down." },
    { id: "b", label: "He's actually lost purchasing power, even though the balance looks the same." },
    { id: "c", label: "He should have put everything into stocks immediately — savings accounts are always a mistake." },
  ];

  const outcomes = {
    a: { verdict: "Not quite",                           text: "The number held steady — but what it can buy didn't. Inflation doesn't touch your balance; it touches your purchasing power. Clyde has $8,162 but it only stretches as far as about $6,750 would have in 2019. The loss is invisible in his account and very real everywhere else." },
    b: { verdict: "Exactly right",                       text: "His balance grew slightly — but inflation averaged 3.5% per year while his account earned just 0.5%. That 3% annual gap quietly eroded roughly $1,250 of purchasing power over five years. Clyde lost value without spending a thing." },
    c: { verdict: "Good instinct — but not quite there", text: "A savings account isn't always the wrong tool — it depends on your goals and timeline. The problem isn't that Clyde saved; it's that he never considered what his money was doing while it sat there. There's a thoughtful middle ground between a savings account and going all in on stocks." },
  };

  const reactions = [
    { name: "Clyde", emoji: "🤝", quote: "\"Wait — I didn't spend anything and I still lost value? I need to completely rethink this.\"" },
    { name: "Betty", emoji: "😌", quote: "\"This is exactly why I moved my money into an index fund. It doesn't need to be exciting — it just needs to outpace inflation.\"" },
    { name: "Pete",  emoji: "🎯", quote: "\"Once I understood purchasing power, keeping large amounts in a savings account long-term stopped making sense. The math just doesn't work in your favor.\"" },
  ];

  return (
    <div style={S.page}>
      <div style={S.tag}>🎮 Scenario 1 of 2</div>

      <div style={S.goldCard}>
        <div style={{ fontSize: "11px", color: G.gold, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", fontFamily: font }}>📰 The Situation</div>
        <h2 style={{ ...S.h2, fontSize: "21px" }}>Clyde's Wake-Up Call</h2>
        <p style={S.body}>It's 2024. Clyde has kept his <strong style={{ color: G.white }}>$8,000</strong> in a savings account since 2019 — earning 0.5% annual interest while inflation averaged 3.5% per year. His balance today: <strong style={{ color: G.white }}>$8,162</strong>.</p>

        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={clydeData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <XAxis dataKey="year" stroke={G.subtle} tick={{ fontSize: 11, fill: G.muted }} />
            <YAxis stroke={G.subtle} tick={{ fontSize: 11, fill: G.muted }} domain={[6000, 8500]} tickFormatter={v => `$${(v/1000).toFixed(1)}K`} />
            <Tooltip {...tipStyle} formatter={(v, n) => [`$${v.toLocaleString()}`, n === "balance" ? "Account Balance" : "Real Purchasing Power"]} />
            <Line type="monotone" dataKey="balance" stroke={G.gold}  strokeWidth={2.5} dot={false} name="balance" />
            <Line type="monotone" dataKey="power"   stroke={G.muted} strokeWidth={2}   dot={false} name="power" strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "10px" }}>
          {[{ c: G.gold, label: "Account Balance" }, { c: G.muted, label: "Real Purchasing Power", dash: true }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: G.muted, fontFamily: font }}>
              <div style={{ width: "20px", height: "0", borderTop: `2px ${l.dash ? "dashed" : "solid"} ${l.c}` }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ ...S.h2, fontSize: "18px" }}>What do you think happened to Clyde's money?</h2>
      {options.map(o => <OptionBtn key={o.id} {...o} chosen={chosen} correct="b" revealed={revealed} onClick={setChosen} />)}

      {chosen && !revealed && (
        <div style={{ textAlign: "center", marginTop: "18px" }}>
          <button style={S.btn} onClick={() => setRevealed(true)}>Reveal Outcome <ChevronRight size={16} /></button>
        </div>
      )}

      {revealed && (
        <>
          <div style={{ ...S.goldCard, marginTop: "28px" }}>
            <div style={{ fontWeight: 700, color: G.gold, fontSize: "17px", marginBottom: "12px", fontFamily: font }}>{outcomes[chosen].verdict}</div>
            <p style={{ ...S.body, marginBottom: 0 }}>{outcomes[chosen].text}</p>
          </div>

          <h2 style={{ ...S.h2, fontSize: "17px", marginTop: "28px" }}>How the club responded</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {reactions.map(r => (
              <div key={r.name} style={{ ...S.dimCard, display: "flex", gap: "14px", marginBottom: 0 }}>
                <div style={{ fontSize: "20px" }}>{r.emoji}</div>
                <div>
                  <div style={{ color: G.gold, fontWeight: 700, fontSize: "13px", marginBottom: "5px", fontFamily: font }}>{r.name}</div>
                  <p style={{ color: G.muted, fontStyle: "italic", margin: 0, fontSize: "14px", lineHeight: 1.65, fontFamily: font }}>{r.quote}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...S.goldCard, marginTop: "24px" }}>
            <div style={{ fontWeight: 700, color: G.gold, marginBottom: "8px", fontFamily: font }}>💡 The Lesson</div>
            <p style={{ ...S.body, marginBottom: 0 }}>The cost of doing nothing is invisible but real. Account balance alone is an incomplete measure of financial health. <V id="purchasing_power">Purchasing power</V> tells the full story — and <V id="opportunity_cost">opportunity cost</V> is what you pay when you ignore it.</p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "28px" }}>
            <button style={S.btn} onClick={onNext}>Scenario 2 <ChevronRight size={16} /></button>
          </div>
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// SCENARIO 2 — THE EARLY STARTER
// ─────────────────────────────────────────────
const Scenario2 = ({ onNext }) => {
  const [chosen,   setChosen]   = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [skin,     setSkin]     = useState("a");

  const skins = {
    a: { label: "Retirement",          title: "The Ten-Year Difference",    setup: "Two friends, Maya and Jordan, both earn the same salary. At 22, Maya starts putting $200/month into an index fund. Jordan waits until 32, then invests the same $200/month. Both invest until 65 at a 7% average annual return." },
    b: { label: "House down payment",  title: "Starting Five Years Earlier", setup: "Alex wants a house in 15 years and sets aside $300/month. Their friend Sam starts the exact same plan five years earlier. Same monthly amount, same 7% average annual return." },
  };

  const earlyFinal = buildCompound(200, 7, 43, 22).slice(-1)[0]?.value || 0;
  const lateFinal  = buildCompound(200, 7, 33, 32).slice(-1)[0]?.value || 0;

  const chartData = Array.from({ length: 44 }, (_, i) => ({
    age:    22 + i,
    maya:   buildCompound(200, 7, i, 22).slice(-1)[0]?.value || 0,
    jordan: i >= 10 ? (buildCompound(200, 7, i - 10, 32).slice(-1)[0]?.value || 0) : null,
  }));

  const options = [
    { id: "a", label: `About ${fmt(lateFinal * 1.15)} — starting early helps a little` },
    { id: "b", label: `${fmt(earlyFinal)} vs ${fmt(lateFinal)} — a gap of ${fmt(earlyFinal - lateFinal)}` },
    { id: "c", label: "Roughly the same — they invested the same monthly amount after all" },
  ];

  return (
    <div style={S.page}>
      <div style={S.tag}>🎮 Scenario 2 of 2</div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        {Object.entries(skins).map(([key, val]) => (
          <button key={key} onClick={() => setSkin(key)} style={{ ...S.btnGhost, fontSize: "13px", padding: "8px 18px", background: skin === key ? G.goldDim : "transparent", borderColor: skin === key ? G.gold : G.border, color: skin === key ? G.gold : G.muted }}>{val.label}</button>
        ))}
      </div>

      <div style={S.goldCard}>
        <div style={{ fontSize: "11px", color: G.gold, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", fontFamily: font }}>📰 The Situation</div>
        <h2 style={{ ...S.h2, fontSize: "21px" }}>{skins[skin].title}</h2>
        <p style={{ ...S.body, marginBottom: 0 }}>{skins[skin].setup}</p>
      </div>

      <h2 style={{ ...S.h2, fontSize: "18px" }}>How big is the gap at age 65?</h2>
      {options.map(o => <OptionBtn key={o.id} {...o} chosen={chosen} correct="b" revealed={revealed} onClick={setChosen} />)}

      {chosen && !revealed && (
        <div style={{ textAlign: "center", marginTop: "18px" }}>
          <button style={S.btn} onClick={() => setRevealed(true)}>Reveal Outcome <ChevronRight size={16} /></button>
        </div>
      )}

      {revealed && (
        <>
          <div style={S.goldCard}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              {[
                { label: "Started at 22", val: earlyFinal, hi: true },
                { label: "Started at 32", val: lateFinal,  hi: false },
              ].map(r => (
                <div key={r.label} style={{ background: r.hi ? "rgba(212,160,23,0.1)" : G.surfaceAlt, border: `1px solid ${r.hi ? G.borderGold : G.border}`, borderRadius: "10px", padding: "18px", textAlign: "center" }}>
                  <div style={{ color: G.muted, fontSize: "12px", marginBottom: "8px", fontFamily: font }}>{r.label}</div>
                  <div style={{ color: r.hi ? G.gold : G.muted, fontSize: "28px", fontWeight: 700, fontFamily: font }}>{fmt(r.val)}</div>
                  <div style={{ color: G.subtle, fontSize: "12px", fontFamily: font }}>by age 65</div>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                <XAxis dataKey="age" stroke={G.subtle} tick={{ fontSize: 11, fill: G.muted }} />
                <YAxis stroke={G.subtle} tick={{ fontSize: 11, fill: G.muted }} tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`} />
                <Tooltip {...tipStyle} formatter={fmt} labelFormatter={l => `Age ${l}`} />
                <Line type="monotone" dataKey="maya"   stroke={G.gold}  strokeWidth={2.5} dot={false} name="Started at 22" />
                <Line type="monotone" dataKey="jordan" stroke={G.muted} strokeWidth={2}   dot={false} name="Started at 32" strokeDasharray="5 3" connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>

            <p style={{ ...S.body, textAlign: "center", marginBottom: 0, marginTop: "16px" }}>Same monthly amount. Same return rate. One decade earlier. A difference of <strong style={{ color: G.gold }}>{fmt(earlyFinal - lateFinal)}</strong>.</p>
          </div>

          <div style={{ ...S.dimCard, borderColor: G.borderGold }}>
            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ fontSize: "22px" }}>😌</div>
              <div>
                <div style={{ fontWeight: 700, color: G.gold, marginBottom: "6px", fontSize: "14px", fontFamily: font }}>Betty</div>
                <p style={{ ...S.body, fontStyle: "italic", marginBottom: 0, color: G.muted }}>"I didn't do anything fancy. I just started. That is genuinely the whole strategy."</p>
              </div>
            </div>
          </div>

          <div style={S.goldCard}>
            <div style={{ fontWeight: 700, color: G.gold, marginBottom: "8px", fontFamily: font }}>💡 The Lesson</div>
            <p style={{ ...S.body, marginBottom: 0 }}><V id="time_in_market">Time in the market</V> is worth more than the amount you invest. <V id="compound_interest">Compound interest</V> rewards patience above everything else. Starting early — even with a small amount — is the single most powerful investment decision most people can make.</p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "28px" }}>
            <button style={S.btn} onClick={onNext}>Take the Quiz <ChevronRight size={16} /></button>
          </div>
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// QUIZ
// ─────────────────────────────────────────────
const Quiz = ({ onFinish }) => {
  const questions = [
    {
      q:       "What does inflation do to money sitting in a savings account over time?",
      opts:    ["It grows the balance automatically", "It reduces how much the money can buy", "It has no effect — only spending reduces value", "It increases purchasing power"],
      correct: 1,
      exp:     "Inflation raises the price of goods and services over time. Even if your bank balance holds steady, it buys progressively less — that's the erosion of purchasing power. The number stays the same; the buying ability behind it doesn't.",
    },
    {
      q:       "True or False: As long as the number in my bank account hasn't gone down, I haven't lost anything.",
      opts:    ["True — if the number is the same, the value is the same", "False — the number can be unchanged while purchasing power falls", "True — losses only count when you withdraw money", "False — bank balances always decrease automatically"],
      correct: 1,
      exp:     "This is one of the most persistent misconceptions in personal finance. The nominal balance and the real value are two different things. Inflation creates a growing gap between them silently and continuously.",
    },
    {
      q:       "What is opportunity cost in the context of not investing?",
      opts:    ["The fees charged by a brokerage account", "The interest you miss on a savings account", "The market growth and value you forgo by keeping money on the sidelines", "The cost of buying stocks at the wrong time"],
      correct: 2,
      exp:     "Opportunity cost is what you give up by choosing one option over another. When you choose not to invest, you forgo the market's long-term returns — which, compounded over decades, can be a very substantial sum.",
    },
  ];

  const [current,   setCurrent]   = useState(0);
  const [selected,  setSelected]  = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [tally,     setTally]     = useState(0);

  const q          = questions[current];
  const isCorrect  = selected === q.correct;

  const handleSubmit = () => { setSubmitted(true); if (isCorrect) setTally(t => t + 1); };
  const handleNext   = () => {
    const finalScore = tally + (isCorrect ? 1 : 0);
    if (current < questions.length - 1) { setCurrent(c => c + 1); setSelected(null); setSubmitted(false); }
    else onFinish(finalScore);
  };

  return (
    <div style={S.page}>
      <div style={S.tag}><BookOpen size={13} /> Knowledge Check</div>
      <h1 style={S.h1}>Module 1 Quiz</h1>

      <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
        {questions.map((_, i) => (
          <div key={i} style={{ height: "3px", flex: 1, borderRadius: "2px", background: i < current ? G.gold : i === current ? "rgba(212,160,23,0.4)" : G.border, transition: "background 0.3s" }} />
        ))}
      </div>

      <div style={{ color: G.muted, fontSize: "13px", marginBottom: "18px", fontFamily: font }}>Question {current + 1} of {questions.length}</div>

      <div style={S.card}>
        <h2 style={{ ...S.h2, fontSize: "18px", marginBottom: 0 }}>{q.q}</h2>
      </div>

      {q.opts.map((opt, i) => {
        const isSel = selected === i;
        const isCor = i === q.correct;
        return (
          <button key={i} onClick={() => !submitted && setSelected(i)} style={{
            width: "100%", textAlign: "left", cursor: submitted ? "default" : "pointer",
            background: submitted ? (isCor ? G.goldDim : G.surface) : (isSel ? "rgba(212,160,23,0.08)" : G.surface),
            border: `1px solid ${submitted ? (isCor ? G.borderGold : G.border) : (isSel ? G.borderGold : G.border)}`,
            borderRadius: "10px", padding: "16px 20px", color: G.white, fontSize: "15px",
            marginBottom: "10px", fontFamily: font, display: "flex", alignItems: "flex-start",
            gap: "12px", lineHeight: 1.65, transition: "all 0.2s",
          }}>
            <span style={{ width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0, background: submitted && isCor ? G.gold : isSel ? "rgba(212,160,23,0.25)" : "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: submitted && isCor ? G.black : G.white, fontSize: "12px", fontWeight: 700 }}>
              {submitted && isCor ? <CheckCircle size={14} /> : String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        );
      })}

      {selected !== null && !submitted && (
        <div style={{ textAlign: "center", marginTop: "18px" }}>
          <button style={S.btn} onClick={handleSubmit}>Submit Answer</button>
        </div>
      )}

      {submitted && (
        <>
          <div style={{ ...S.goldCard, marginTop: "20px" }}>
            <div style={{ color: G.gold, fontWeight: 700, marginBottom: "10px", fontFamily: font }}>
              {isCorrect ? "✓ Exactly right" : "Not quite — here's the nuance"}
            </div>
            <p style={{ ...S.body, marginBottom: 0 }}>{q.exp}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "18px" }}>
            <button style={S.btn} onClick={handleNext}>
              {current < questions.length - 1 ? "Next Question" : "See Results"} <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// RESULTS
// ─────────────────────────────────────────────
const Results = ({ score, total, userName, onRestart, onMap }) => {
  const pct = Math.round((score / total) * 100);
  return (
    <div style={S.page}>
      <div style={{ textAlign: "center", paddingTop: "20px", marginBottom: "40px" }}>
        <div style={{ fontSize: "60px", marginBottom: "16px" }}>{pct === 100 ? "🏆" : pct >= 66 ? "🎯" : "📚"}</div>
        <div style={S.tag}>Module 1 Complete</div>
        <h1 style={{ ...S.h1, textAlign: "center" }}>{pct === 100 ? "Perfect score" : pct >= 66 ? "Well done" : "Good start"}, {userName}.</h1>
        <p style={{ ...S.lead, textAlign: "center" }}>You got <strong style={{ color: G.white }}>{score} out of {total}</strong> questions right.{pct < 100 && " These concepts will appear again — they're worth sitting with."}</p>
      </div>

      <div style={S.goldCard}>
        <h2 style={{ ...S.h2, fontSize: "18px", marginBottom: "20px" }}>Vocabulary earned in this module</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {Object.values(VOCAB).map(v => (
            <div key={v.term} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <CheckCircle size={15} style={{ color: G.gold, marginTop: "3px", flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: 700, color: G.gold, fontFamily: font }}>{v.term}</span>
                <span style={{ color: G.muted, fontSize: "14px", fontFamily: font }}> — {v.def}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <h2 style={{ ...S.h2, fontSize: "17px", marginBottom: "8px" }}>Coming up in Module 2</h2>
        <p style={{ ...S.body, marginBottom: 0, color: G.muted }}>Now you know <em>why</em> investing matters. Next: what do you actually invest <em>in</em>? Stocks, bonds, ETFs — they behave very differently, and knowing the distinction changes every decision you'll make going forward.</p>
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "36px", flexWrap: "wrap" }}>
        <button style={S.btn}      onClick={onMap}>    <Home size={16} /> Module Map</button>
        <button style={S.btnGhost} onClick={onRestart}><RotateCcw size={15} /> Restart Module 1</button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function Module1() {
  const navigate = useNavigate();
  const { completeModule } = useUser();
  const [screen,    setScreen]    = useState("welcome");
  const [userName,  setUserName]  = useState("");
  const [quizScore, setQuizScore] = useState(0);

  const go = s => { setScreen(s); window.scrollTo(0, 0); };

  const steps      = ["s1","s2","s3","s4","s5","sc1","sc2","quiz","results"];
  const progress   = ["welcome","map"].includes(screen) ? 0 : ((steps.indexOf(screen) + 1) / steps.length) * 100;
  const sectionLbl = { s1:"Section 1 · The Silent Problem", s2:"Section 2 · The Counterforce", s3:"Section 3 · The Argument Against", s4:"Section 4 · Compound Interest", s5:"Section 5 · Meet the Club", sc1:"Scenario 1", sc2:"Scenario 2", quiz:"Quiz" }[screen] || "";

  const screens = {
    welcome: <WelcomeScreen onStart={n  => { setUserName(n); go("map"); }} />,
    map:     <ModuleMap     userName={userName} onSelect={id => id === 1 && go("s1")} />,
    s1:      <Section1  onNext={() => go("s2")} />,
    s2:      <Section2  onNext={() => go("s3")} />,
    s3:      <Section3  onNext={() => go("s4")} />,
    s4:      <Section4  onNext={() => go("s5")} />,
    s5:      <Section5  onNext={() => go("sc1")} />,
    sc1:     <Scenario1 onNext={() => go("sc2")} />,
    sc2:     <Scenario2 onNext={() => go("quiz")} />,
    quiz:    <Quiz      onFinish={s => { setQuizScore(s); completeModule("1"); go("results"); }} />,
    results: <Results   score={quizScore} total={3} userName={userName} onRestart={() => go("s1")} onMap={() => { completeModule("1"); navigate("/"); }} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: G.black, fontFamily: font, color: G.white }}>
      {/* Header */}
      <header style={{ background: "rgba(0,0,0,0.94)", borderBottom: `1px solid ${G.border}`, padding: "15px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: G.gold, fontWeight: 700, fontSize: "17px", fontFamily: font, letterSpacing: "-0.01em" }}>
          <TrendingUp size={20} style={{ color: G.gold }} />
          Investment Club
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {sectionLbl && <div style={{ color: G.muted, fontSize: "12px", fontFamily: font }}>{sectionLbl}</div>}
          <div style={{ background: G.goldDim, border: `1px solid ${G.borderGold}`, borderRadius: "20px", padding: "4px 14px", fontSize: "11px", color: G.gold, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: font }}>Module 1</div>
        </div>
      </header>

      {/* Progress bar */}
      {!["welcome","map"].includes(screen) && (
        <div style={{ height: "2px", background: "rgba(255,255,255,0.04)" }}>
          <div style={{ height: "100%", background: G.gold, width: `${progress}%`, transition: "width 0.5s ease", boxShadow: `0 0 10px ${G.gold}` }} />
        </div>
      )}

      {screens[screen]}
    </div>
  );
}

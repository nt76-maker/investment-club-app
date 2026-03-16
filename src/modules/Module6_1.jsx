import { useState } from "react";
import { TrendingUp, BarChart2, Eye, Brain, DollarSign, Target, ChevronRight, Award } from "lucide-react";
import { GOLD, AMBER, GREEN, RED, BLUE, PURPLE, SLATE, BG, SURF, SURF2, BORDER, BORDERHI, TP, TB, TM, FD, FB, FM } from "../theme";
import { Card, SL, H1, H2, Body, Btn, Page, VT } from "../components/ui";

const MOAT_COMPANIES = [
  {
    name: "Apple", ticker: "AAPL", emoji: "🍎",
    moat: 5, moatLabel: "Fortress",
    moatColor: GREEN,
    reasons: ["Ecosystem lock-in — iPhone, Mac, iPad, Watch all work better together", "Brand loyalty among the strongest in consumer tech", "App Store creates recurring revenue from 1B+ active devices"],
    weakness: "Premium pricing limits market share in developing economies",
    buffettTake: "Buffett's largest holding. He calls it 'probably the best business I know in the world.'"
  },
  {
    name: "Coca-Cola", ticker: "KO", emoji: "🥤",
    moat: 5, moatLabel: "Fortress",
    moatColor: GREEN,
    reasons: ["Brand recognised in 200+ countries — impossible to replicate", "Distribution network of 30M+ retail outlets worldwide", "50+ years of consecutive dividend increases"],
    weakness: "Faces headwinds from health-conscious consumers shifting away from sugary drinks",
    buffettTake: "Buffett has held Coke since 1988. He drinks 5 cans a day and says: 'I'm one quarter Coca-Cola.'"
  },
  {
    name: "McDonald's", ticker: "MCD", emoji: "🍟",
    moat: 4, moatLabel: "Strong",
    moatColor: AMBER,
    reasons: ["Real estate model — owns the land under most franchises", "Brand recognition and consistency across 40,000+ locations", "Franchise model means low capital risk for the parent company"],
    weakness: "Dependent on franchise quality control; vulnerable to food trend shifts",
    buffettTake: "Not a Buffett holding, but widely cited as a textbook moat: the golden arches are a global trust signal."
  },
  {
    name: "Tesla", ticker: "TSLA", emoji: "⚡",
    moat: 2, moatLabel: "Narrow",
    moatColor: RED,
    reasons: ["Early mover advantage in EV market and Supercharger network", "Software/OTA update capability ahead of traditional automakers"],
    weakness: "No proprietary battery chemistry, no franchise network, faces serious competition from legacy automakers and Chinese EV makers",
    buffettTake: "Buffett doesn't own Tesla. He prefers businesses he believes will look the same in 20 years."
  },
];

const QUANT_COMPANIES = [
  {
    name: "Apple", ticker: "AAPL", emoji: "🍎",
    marketCap: 3100, sharePrice: 195, sharesOut: "15.9B",
    revenue: 383, profit: 97, profitMargin: 25,
    eps: 6.13, pe: 31.8,
    sector: "Technology",
    color: BLUE,
  },
  {
    name: "McDonald's", ticker: "MCD", emoji: "🍟",
    marketCap: 210, sharePrice: 285, sharesOut: "730M",
    revenue: 23, profit: 8.5, profitMargin: 37,
    eps: 11.56, pe: 24.7,
    sector: "Consumer Staples",
    color: AMBER,
  },
  {
    name: "Amazon", ticker: "AMZN", emoji: "📦",
    marketCap: 1900, sharePrice: 185, sharesOut: "10.3B",
    revenue: 575, profit: 30, profitMargin: 5,
    eps: 2.90, pe: 63.8,
    sector: "Technology / Retail",
    color: GREEN,
  },
  {
    name: "Coca-Cola", ticker: "KO", emoji: "🥤",
    marketCap: 265, sharePrice: 61, sharesOut: "4.3B",
    revenue: 46, profit: 10.7, profitMargin: 23,
    eps: 2.47, pe: 24.7,
    sector: "Consumer Staples",
    color: RED,
  },
];

const MYSTERY_PAIR = [
  {
    id: "A",
    clues: ["Revenue: $46B", "Profit margin: 23%", "P/E ratio: 24.7", "Market cap: $265B", "Dividend paid every year for 60+ years"],
    reveal: "Coca-Cola (KO)",
    verdict: "Steady, profitable, reliable — but slow growth. Suits conservative investors who want income over excitement.",
    color: RED,
  },
  {
    id: "B",
    clues: ["Revenue: $575B", "Profit margin: 5%", "P/E ratio: 63.8", "Market cap: $1,900B", "Has never paid a dividend"],
    reveal: "Amazon (AMZN)",
    verdict: "Enormous revenue but reinvests almost everything. High P/E reflects expectations of explosive future profit — not current earnings.",
    color: GREEN,
  },
];

// ── SCREEN 1: OPENING ─────────────────────────────────────────────────────────
const OpeningScreen = ({ onNext }) => {
  const [lens, setLens] = useState(null);
  const [phase, setPhase] = useState(0);

  return (
    <Page>
      <div style={{ textAlign: "center", padding: "32px 0 24px" }}>
        <SL c={GOLD}>Module 6 — Part 1</SL>
        <H1 style={{ fontSize: "clamp(26px,5vw,40px)" }}>Making Decisions</H1>
        <Body style={{ maxWidth: 520, margin: "0 auto 8px", fontSize: 16 }}>
          You know how markets work. You know how to invest consistently. Now comes the hardest skill: deciding <em style={{ color: GOLD }}>what</em> to buy — and at <em style={{ color: GOLD }}>what price</em>.
        </Body>
      </div>

      <div style={{ background: "linear-gradient(135deg, "+SURF+" 0%, #0a0a0a 100%)", border: "1px solid "+BORDERHI, borderRadius: 16, padding: "28px 24px", marginBottom: 24 }}>
        <SL c={GOLD}>The two lenses every investor uses</SL>
        <H2 style={{ marginBottom: 20 }}>Every investment decision comes down to two questions</H2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            {
              key: "qual", icon: "🔍", color: PURPLE, label: "Qualitative",
              question: "Is this a good business?",
              desc: "Reading the story — brand strength, management, competitive advantages, industry trends. You're asking if this company deserves to exist and grow.",
              signals: ["Strong brand recognition", "Clear competitive moat", "Capable leadership", "Favourable industry trend"],
            },
            {
              key: "quant", icon: "📊", color: BLUE, label: "Quantitative",
              question: "Is this a good price?",
              desc: "Running the numbers — P/E ratio, market cap, revenue, earnings. You're asking whether the market is pricing this business fairly.",
              signals: ["P/E ratio vs peers", "Revenue growth rate", "Profit margins", "Market cap vs earnings"],
            },
          ].map(l => (
            <div
              key={l.key}
              onClick={() => setLens(lens === l.key ? null : l.key)}
              style={{
                background: lens === l.key ? l.color+"15" : SURF2,
                border: "1.5px solid "+(lens === l.key ? l.color : BORDER),
                borderRadius: 12, padding: "18px 16px", cursor: "pointer", transition: "all 0.25s"
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{l.icon}</div>
              <div style={{ fontFamily: FM, fontSize: 9, color: l.color, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>{l.label}</div>
              <div style={{ fontFamily: FD, fontSize: 16, color: TP, marginBottom: 8 }}>{l.question}</div>
              <Body style={{ fontSize: 13, margin: 0 }}>{l.desc}</Body>
            </div>
          ))}
        </div>

        {lens && (
          <div style={{ background: BG, border: "1px solid "+(lens === "qual" ? PURPLE : BLUE)+"40", borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ fontFamily: FM, fontSize: 9, color: lens === "qual" ? PURPLE : BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              {lens === "qual" ? "Qualitative signals — things you read and observe" : "Quantitative signals — things you calculate and compare"}
            </div>
            {(lens === "qual"
              ? ["Strong brand recognition", "Clear competitive moat", "Capable leadership", "Favourable industry trend"]
              : ["P/E ratio vs peers", "Revenue growth rate", "Profit margins", "Market cap vs earnings"]
            ).map(s => (
              <div key={s} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: lens === "qual" ? PURPLE : BLUE, flexShrink: 0 }} />
                <span style={{ fontFamily: FB, fontSize: 14, color: TB }}>{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Card gold>
        <SL>The key insight</SL>
        <H2 style={{ color: GOLD }}>Neither lens works alone</H2>
        <Body>
          A <strong style={{ color: TP }}>great business at a terrible price</strong> is a bad investment. You could buy the best company in the world and still lose money if you overpay.
        </Body>
        <Body style={{ margin: 0 }}>
          A <strong style={{ color: TP }}>mediocre business at a bargain price</strong> can still make money. The skill is holding both lenses simultaneously — and knowing which one matters more in a given situation.
        </Body>
      </Card>

      <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
        {[
          { icon: "🔍", label: "Qualitative Analysis", desc: "Competitive moats, brand strength, industry trends" },
          { icon: "📊", label: "Quantitative Analysis", desc: "P/E ratio, market cap, revenue vs profit, EPS" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 16, background: SURF2, borderRadius: 10, padding: "14px 18px", border: "1px solid "+BORDER }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <div>
              <div style={{ fontFamily: FB, fontSize: 14, color: TP, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontFamily: FM, fontSize: 10, color: SLATE, textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <Btn onClick={onNext} style={{ fontSize: 14, padding: "14px 40px" }}>Start with Qualitative →</Btn>
      </div>
    </Page>
  );
};

// ── SCREEN 2: QUALITATIVE ─────────────────────────────────────────────────────
const QualScreen = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [moatRatings, setMoatRatings] = useState({});

  const company = selected !== null ? MOAT_COMPANIES[selected] : null;

  const MoatBar = ({ value, color }) => (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width: 22, height: 8, borderRadius: 3, background: i <= value ? color : SURF2, transition: "background 0.3s" }} />
      ))}
    </div>
  );

  return (
    <Page>
      <SL c={PURPLE}>Step 1 of 3 — Qualitative</SL>
      <H1>Reading the Business</H1>
      <Body>
        Before you open a spreadsheet, ask a simpler question: <em style={{ color: GOLD }}>"Is this a good business?"</em> That's <VT id="qualitative analysis">qualitative analysis</VT> — and it starts with understanding what makes a company hard to compete with.
      </Body>

      <div style={{ background: "linear-gradient(135deg, "+PURPLE+"10 0%, transparent 100%)", border: "1px solid "+PURPLE+"30", borderRadius: 14, padding: "22px 20px", marginBottom: 20 }}>
        <SL c={PURPLE}>The three questions</SL>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            {
              q: "Does it have a moat?",
              icon: "🏰",
              body: "A <moat> is a sustainable competitive advantage — something that makes it hard for rivals to steal customers. The wider the moat, the safer the business.",
              examples: "Apple's ecosystem. Coca-Cola's global brand. McDonald's real estate. Berkshire's insurance float.",
            },
            {
              q: "Do you understand what it does?",
              icon: "🧠",
              body: "Warren Buffett's most famous rule: never invest in a business you can't explain simply. If you can't describe how a company makes money in one sentence, you don't understand it well enough.",
              examples: "\"Apple sells devices and services to loyal customers.\" ✓ vs \"This AI biotech uses quantum algorithms to...\" ✗",
            },
            {
              q: "Is the trend behind it or against it?",
              icon: "🌊",
              body: "A great business in a dying industry is still a bad investment. A mediocre business riding a powerful tailwind can look like a genius pick.",
              examples: "Tailwinds: cloud computing, ageing populations, emerging market growth. Headwinds: print media, combustion engines, physical retail.",
            },
          ].map(item => (
            <div key={item.q} style={{ background: SURF2, borderRadius: 10, padding: "16px 18px", border: "1px solid "+BORDER }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ fontFamily: FD, fontSize: 16, color: TP }}>{item.q}</div>
              </div>
              <Body style={{ fontSize: 13, margin: "0 0 8px" }}>{item.body}</Body>
              <div style={{ background: BG, borderRadius: 7, padding: "8px 12px" }}>
                <span style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.08em" }}>Examples · </span>
                <span style={{ fontFamily: FB, fontSize: 12, color: SLATE }}>{item.examples}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <SL>Interactive — Rate the Moat</SL>
        <H2 style={{ marginBottom: 4 }}>How strong is each company's competitive advantage?</H2>
        <Body style={{ fontSize: 13, marginBottom: 16 }}>Tap a company to explore its <VT id="moat">moat</VT> — then see how analysts actually rate it.</Body>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {MOAT_COMPANIES.map((c, i) => (
            <button
              key={c.name}
              onClick={() => { setSelected(i); setRevealed(false); }}
              style={{
                background: selected === i ? c.moatColor+"15" : BG,
                border: "1.5px solid "+(selected === i ? c.moatColor : BORDER),
                borderRadius: 10, padding: "14px", cursor: "pointer", textAlign: "left",
                transition: "all 0.2s"
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{c.emoji}</div>
              <div style={{ fontFamily: FD, fontSize: 15, color: TP, marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.ticker}</div>
            </button>
          ))}
        </div>

        {company && (
          <div style={{ background: BG, border: "1px solid "+company.moatColor+"40", borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontFamily: FD, fontSize: 18, color: TP }}>{company.emoji} {company.name}</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Moat strength</div>
                <MoatBar value={company.moat} color={company.moatColor} />
                <div style={{ fontFamily: FM, fontSize: 9, color: company.moatColor, marginTop: 3, textTransform: "uppercase" }}>{company.moatLabel}</div>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              {company.reasons.map(r => (
                <div key={r} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: company.moatColor, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontFamily: FB, fontSize: 13, color: TB }}>{r}</span>
                </div>
              ))}
            </div>

            <div style={{ background: AMBER+"10", border: "1px solid "+AMBER+"30", borderRadius: 7, padding: "8px 12px", marginBottom: 10 }}>
              <span style={{ fontFamily: FM, fontSize: 9, color: AMBER, textTransform: "uppercase", letterSpacing: "0.08em" }}>Weakness · </span>
              <span style={{ fontFamily: FB, fontSize: 12, color: TB }}>{company.weakness}</span>
            </div>

            <div style={{ background: GOLD+"10", border: "1px solid "+GOLD+"30", borderRadius: 7, padding: "8px 12px" }}>
              <span style={{ fontFamily: FM, fontSize: 9, color: GOLD, textTransform: "uppercase", letterSpacing: "0.08em" }}>Buffett's take · </span>
              <span style={{ fontFamily: FB, fontSize: 12, color: TB, fontStyle: "italic" }}>{company.buffettTake}</span>
            </div>
          </div>
        )}
      </Card>

      <div style={{ background: SURF2, border: "1px solid "+BORDER, borderRadius: 10, padding: "14px 18px", marginBottom: 24 }}>
        <span style={{ fontFamily: FM, fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: "0.08em" }}>Remember · </span>
        <span style={{ fontFamily: FB, fontSize: 14, color: TB }}>Qualitative analysis tells you whether a business is worth owning. It doesn't tell you what price to pay. That's where we're headed next.</span>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
        <Btn outline onClick={onBack} small>← Back</Btn>
        <Btn onClick={onNext}>The Numbers →</Btn>
      </div>
    </Page>
  );
};

// ── SCREEN 3: QUANTITATIVE ────────────────────────────────────────────────────
const QuantScreen = ({ onNext, onBack }) => {
  const [activeMetric, setActiveMetric] = useState("marketcap");
  const [activeCompany, setActiveCompany] = useState(0);
  const [mysteryChoice, setMysteryChoice] = useState(null);
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [peSlider, setPeSlider] = useState(25);

  const co = QUANT_COMPANIES[activeCompany];

  const metrics = [
    { id: "marketcap", label: "Market Cap", icon: "🏢" },
    { id: "revprofit", label: "Revenue vs Profit", icon: "💰" },
    { id: "eps", label: "EPS", icon: "📐" },
    { id: "pe", label: "P/E Ratio", icon: "⚖️" },
  ];

  const peVerdict = peSlider < 15
    ? { label: "Potentially Undervalued", color: GREEN, note: "Low P/E can mean a bargain — or a company in trouble. Always check why it's cheap." }
    : peSlider < 25
    ? { label: "Fairly Valued", color: AMBER, note: "In line with the S&P 500 historical average (~20). No obvious bargain, no obvious overpricing." }
    : peSlider < 40
    ? { label: "Growth Premium", color: AMBER, note: "You're paying a premium — the market expects earnings to grow significantly. Justified if growth materialises." }
    : { label: "Expensive Territory", color: RED, note: "Very high expectations baked in. If growth disappoints, the stock can fall sharply even on good news." };

  return (
    <Page>
      <SL c={BLUE}>Step 2 of 3 — Quantitative</SL>
      <H1>Running the Numbers</H1>
      <Body>
        <VT id="quantitative analysis">Quantitative analysis</VT> is how you put a price on what you found qualitatively. Four numbers tell you most of what you need to know about whether a company is fairly priced.
      </Body>

      {/* Metric selector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        {metrics.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveMetric(m.id)}
            style={{
              background: activeMetric === m.id ? BLUE+"20" : BG,
              border: "1.5px solid "+(activeMetric === m.id ? BLUE : BORDER),
              borderRadius: 8, padding: "10px 6px", cursor: "pointer",
              textAlign: "center", transition: "all 0.2s"
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 4 }}>{m.icon}</div>
            <div style={{ fontFamily: FM, fontSize: 9, color: activeMetric === m.id ? BLUE : TM, textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1.3 }}>{m.label}</div>
          </button>
        ))}
      </div>

      {/* Market Cap */}
      {activeMetric === "marketcap" && (
        <div>
          <Card blue>
            <SL c={BLUE}>Market Capitalisation</SL>
            <H2 style={{ marginBottom: 8 }}>What does it actually cost to buy the whole company?</H2>
            <Body>
              <VT id="market cap">Market cap</VT> = Share Price × Total Shares Outstanding. It's the most honest measure of a company's size — not its stock price.
            </Body>
            <div style={{ background: BG, borderRadius: 10, padding: "16px", marginBottom: 14 }}>
              <div style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>The common misconception</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { name: "Berkshire Hathaway", ticker: "BRK.A", price: "$617,000", shares: "1.45M", cap: "$896B", color: AMBER },
                  { name: "Apple", ticker: "AAPL", price: "$195", shares: "15.9B", cap: "$3,100B", color: BLUE },
                ].map(c => (
                  <div key={c.name} style={{ background: SURF2, borderRadius: 8, padding: "12px 14px", border: "1px solid "+c.color+"30" }}>
                    <div style={{ fontFamily: FD, fontSize: 14, color: TP, marginBottom: 8 }}>{c.name}</div>
                    <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Share Price</div>
                    <div style={{ fontFamily: FD, fontSize: 18, color: c.color, marginBottom: 8 }}>{c.price}</div>
                    <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Shares Outstanding</div>
                    <div style={{ fontFamily: FB, fontSize: 13, color: TB, marginBottom: 8 }}>{c.shares}</div>
                    <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Market Cap</div>
                    <div style={{ fontFamily: FD, fontSize: 18, color: GREEN }}>{c.cap}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, background: GOLD+"10", border: "1px solid "+GOLD+"30", borderRadius: 8, padding: "10px 14px" }}>
                <Body style={{ margin: 0, fontSize: 13, color: GOLD }}>
                  Berkshire's stock price is 3,000× higher than Apple's — but Apple is worth 3.5× more. Stock price alone tells you nothing about company size.
                </Body>
              </div>
            </div>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
            {[
              { label: "Large Cap", range: "> $10B", note: "Apple, Microsoft, Amazon — stable, liquid, widely researched", color: BLUE },
              { label: "Mid Cap", range: "$2B–$10B", note: "Growing companies — more risk but more potential upside", color: AMBER },
              { label: "Small Cap", range: "< $2B", note: "Early-stage businesses — highest risk, highest potential", color: RED },
            ].map(tier => (
              <div key={tier.label} style={{ background: SURF2, borderRadius: 8, padding: "12px 12px", border: "1px solid "+tier.color+"30", textAlign: "center" }}>
                <div style={{ fontFamily: FM, fontSize: 9, color: tier.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{tier.label}</div>
                <div style={{ fontFamily: FD, fontSize: 15, color: TP, marginBottom: 6 }}>{tier.range}</div>
                <div style={{ fontFamily: FB, fontSize: 11, color: TB, lineHeight: 1.4 }}>{tier.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue vs Profit */}
      {activeMetric === "revprofit" && (
        <div>
          <Card green>
            <SL c={GREEN}>Revenue vs Profit</SL>
            <H2 style={{ marginBottom: 8 }}>Money coming in vs money actually kept</H2>
            <Body>
              <VT id="revenue">Revenue</VT> is the top line — total sales. <VT id="profit">Profit</VT> is the bottom line — what's left after all costs. A company with huge revenue but tiny profit is very different from one with modest revenue and fat margins.
            </Body>
            <div style={{ background: BG, borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Select a company</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {QUANT_COMPANIES.map((c, i) => (
                  <button key={c.name} onClick={() => setActiveCompany(i)} style={{
                    background: activeCompany === i ? c.color+"20" : SURF2,
                    border: "1px solid "+(activeCompany === i ? c.color : BORDER),
                    borderRadius: 6, padding: "6px 12px", cursor: "pointer",
                    color: activeCompany === i ? c.color : TB, fontFamily: FM, fontSize: 11
                  }}>{c.emoji} {c.name}</button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div style={{ background: SURF, borderRadius: 8, padding: "14px" }}>
                  <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Annual Revenue</div>
                  <div style={{ fontFamily: FD, fontSize: 26, color: co.color }}>${co.revenue}B</div>
                  <div style={{ fontFamily: FM, fontSize: 10, color: TB, marginTop: 3 }}>Total money coming in</div>
                </div>
                <div style={{ background: SURF, borderRadius: 8, padding: "14px" }}>
                  <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Annual Profit</div>
                  <div style={{ fontFamily: FD, fontSize: 26, color: GREEN }}>${co.profit}B</div>
                  <div style={{ fontFamily: FM, fontSize: 10, color: TB, marginTop: 3 }}>Money kept after all costs</div>
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase" }}>Profit Margin</span>
                  <span style={{ fontFamily: FM, fontSize: 11, color: co.profitMargin > 20 ? GREEN : co.profitMargin > 10 ? AMBER : RED }}>{co.profitMargin}%</span>
                </div>
                <div style={{ background: SURF2, borderRadius: 6, height: 16, overflow: "hidden" }}>
                  <div style={{ width: co.profitMargin+"%", background: co.profitMargin > 20 ? GREEN : co.profitMargin > 10 ? AMBER : RED, height: "100%", borderRadius: 6, transition: "width 0.6s ease" }} />
                </div>
              </div>
              <Body style={{ margin: 0, fontSize: 13, color: co.profitMargin > 20 ? GREEN : co.profitMargin > 10 ? TB : AMBER }}>
                {co.profitMargin > 25
                  ? co.name+" keeps "+co.profitMargin+"¢ of every $1 in sales. That's exceptional — most industries average 5–10%."
                  : co.profitMargin > 10
                  ? co.name+" keeps "+co.profitMargin+"¢ of every $1 in sales. Healthy, but not exceptional."
                  : co.name+" keeps only "+co.profitMargin+"¢ of every $1 in sales. Thin margins mean even small cost increases hurt badly."}
              </Body>
            </div>
          </Card>
        </div>
      )}

      {/* EPS */}
      {activeMetric === "eps" && (
        <Card blue>
          <SL c={BLUE}>Earnings Per Share (EPS)</SL>
          <H2 style={{ marginBottom: 8 }}>Your slice of the company's profit</H2>
          <Body>
            <VT id="EPS">EPS</VT> = Total Profit ÷ Shares Outstanding. It translates a company's total earnings into a per-share number so you can compare companies of very different sizes fairly.
          </Body>
          <div style={{ background: BG, borderRadius: 10, padding: "16px", marginBottom: 14 }}>
            <div style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>The formula in action</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              <div style={{ textAlign: "center", background: SURF2, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", marginBottom: 4 }}>Total Profit</div>
                <div style={{ fontFamily: FD, fontSize: 22, color: GREEN }}>$97B</div>
              </div>
              <div style={{ fontFamily: FD, fontSize: 28, color: TM }}>÷</div>
              <div style={{ textAlign: "center", background: SURF2, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", marginBottom: 4 }}>Shares Outstanding</div>
                <div style={{ fontFamily: FD, fontSize: 22, color: BLUE }}>15.9B</div>
              </div>
              <div style={{ fontFamily: FD, fontSize: 28, color: TM }}>=</div>
              <div style={{ textAlign: "center", background: GOLD+"15", borderRadius: 8, padding: "12px 16px", border: "1px solid "+GOLD+"40" }}>
                <div style={{ fontFamily: FM, fontSize: 9, color: GOLD, textTransform: "uppercase", marginBottom: 4 }}>Apple EPS</div>
                <div style={{ fontFamily: FD, fontSize: 22, color: GOLD }}>$6.13</div>
              </div>
            </div>
            <Body style={{ margin: 0, fontSize: 13 }}>
              Apple earns $6.13 for every share that exists. If you own 10 shares, your proportional slice of Apple's annual profit is $61.30 — whether or not it's paid to you as a dividend.
            </Body>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {QUANT_COMPANIES.map(c => (
              <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: BG, borderRadius: 8, padding: "10px 14px", border: "1px solid "+c.color+"25" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{c.emoji}</span>
                  <div>
                    <div style={{ fontFamily: FD, fontSize: 14, color: TP }}>{c.name}</div>
                    <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase" }}>${c.profit}B profit · {c.sharesOut} shares</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>EPS</div>
                  <div style={{ fontFamily: FD, fontSize: 18, color: c.color }}>${c.eps}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* P/E Ratio */}
      {activeMetric === "pe" && (
        <div>
          <Card gold>
            <SL c={GOLD}>Price-to-Earnings Ratio</SL>
            <H2 style={{ marginBottom: 8 }}>How many years of earnings are you prepaying?</H2>
            <Body>
              <VT id="P/E ratio">P/E ratio</VT> = Share Price ÷ EPS. A P/E of 25 means you're paying $25 for every $1 the company earns annually — the equivalent of prepaying 25 years of profits upfront.
            </Body>
            <div style={{ background: BG, borderRadius: 10, padding: "16px", marginBottom: 14 }}>
              <div style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Interactive — drag to explore</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: FB, fontSize: 14, color: TB }}>P/E Ratio</span>
                <span style={{ fontFamily: FD, fontSize: 22, color: peVerdict.color }}>{peSlider}x</span>
              </div>
              <input
                type="range" min={5} max={80} value={peSlider}
                onChange={e => setPeSlider(Number(e.target.value))}
                style={{ width: "100%", marginBottom: 12, accentColor: peVerdict.color }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                {[5, 15, 25, 40, 80].map(v => (
                  <span key={v} style={{ fontFamily: FM, fontSize: 9, color: TM }}>{v}x</span>
                ))}
              </div>
              <div style={{ background: peVerdict.color+"12", border: "1px solid "+peVerdict.color+"40", borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontFamily: FM, fontSize: 10, color: peVerdict.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{peVerdict.label}</div>
                <Body style={{ margin: 0, fontSize: 13 }}>{peVerdict.note}</Body>
              </div>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {QUANT_COMPANIES.map(c => (
                <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: BG, borderRadius: 8, padding: "10px 14px", border: "1px solid "+c.color+"25" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{c.emoji}</span>
                    <div style={{ fontFamily: FD, fontSize: 14, color: TP }}>{c.name}</div>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase" }}>Price</div>
                      <div style={{ fontFamily: FB, fontSize: 13, color: TB }}>${c.sharePrice}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase" }}>EPS</div>
                      <div style={{ fontFamily: FB, fontSize: 13, color: TB }}>${c.eps}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase" }}>P/E</div>
                      <div style={{ fontFamily: FD, fontSize: 18, color: c.color }}>{c.pe}x</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Mystery company challenge */}
          <Card>
            <SL>Challenge — Which is the better value?</SL>
            <H2 style={{ marginBottom: 4 }}>Two mystery companies. Same question.</H2>
            <Body style={{ fontSize: 13, marginBottom: 16 }}>Based on the numbers alone — which looks like the better investment? Choose, then we'll reveal who they are.</Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              {MYSTERY_PAIR.map(m => (
                <button
                  key={m.id}
                  onClick={() => { if (!mysteryRevealed) setMysteryChoice(m.id); }}
                  style={{
                    background: mysteryChoice === m.id ? GOLD+"15" : BG,
                    border: "1.5px solid "+(mysteryChoice === m.id ? GOLD : BORDER),
                    borderRadius: 10, padding: "16px", cursor: mysteryRevealed ? "default" : "pointer",
                    textAlign: "left", transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontFamily: FM, fontSize: 11, color: GOLD, marginBottom: 10 }}>Company {m.id}</div>
                  {m.clues.map(c => (
                    <div key={c} style={{ fontFamily: FB, fontSize: 12, color: TB, marginBottom: 4 }}>• {c}</div>
                  ))}
                </button>
              ))}
            </div>
            {mysteryChoice && !mysteryRevealed && (
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <Btn onClick={() => setMysteryRevealed(true)} color={GOLD}>Reveal the Companies →</Btn>
              </div>
            )}
            {mysteryRevealed && (
              <div style={{ display: "grid", gap: 10 }}>
                {MYSTERY_PAIR.map(m => (
                  <div key={m.id} style={{ background: m.color+"10", border: "1px solid "+m.color+"40", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontFamily: FD, fontSize: 16, color: m.color }}>{m.reveal}</div>
                      {mysteryChoice === m.id && <span style={{ fontFamily: FM, fontSize: 10, color: GOLD, background: GOLD+"20", padding: "2px 8px", borderRadius: 4 }}>Your pick</span>}
                    </div>
                    <Body style={{ margin: 0, fontSize: 13 }}>{m.verdict}</Body>
                  </div>
                ))}
                <div style={{ background: GOLD+"10", border: "1px solid "+GOLD+"30", borderRadius: 8, padding: "12px 14px" }}>
                  <Body style={{ margin: 0, fontSize: 13, color: GOLD, fontStyle: "italic" }}>
                    Neither is objectively better — it depends on your goals. Coca-Cola suits an income-focused investor. Amazon suits a growth-focused one. Quantitative analysis tells you what you're paying — not what you should want.
                  </Body>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "space-between", marginTop: 8 }}>
        <Btn outline onClick={onBack} small>← Back</Btn>
        <Btn onClick={onNext}>Continue to Part 2 →</Btn>
      </div>
    </Page>
  );
};

// ── APP ───────────────────────────────────────────────────────────────────────
export default function Module6_1() {
  const [screen, setScreen] = useState("opening");
  const go = s => { setScreen(s); window.scrollTo(0, 0); };

  if (screen === "opening") return <OpeningScreen onNext={() => go("qual")} />;
  if (screen === "qual") return <QualScreen onNext={() => go("quant")} onBack={() => go("opening")} />;
  if (screen === "quant") return <QuantScreen onNext={() => go("done")} onBack={() => go("qual")} />;

  return (
    <Page>
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <SL c={GOLD}>Part 1 Complete</SL>
        <H1>Analysis done. Decisions next.</H1>
        <Body style={{ maxWidth: 480, margin: "0 auto 24px" }}>
          You can now read a business qualitatively and evaluate it quantitatively. In Part 2, you'll learn why even investors who understand all of this still make costly mistakes — and how to avoid them.
        </Body>
        <Btn onClick={() => go("opening")} outline>← Review Part 1</Btn>
      </div>
    </Page>
  );
}

import { useState } from "react";
import { Brain, AlertTriangle, TrendingDown, TrendingUp, RefreshCw, CheckCircle, XCircle, Award } from "lucide-react";
import { GOLD, AMBER, GREEN, RED, BLUE, PURPLE, SLATE, BG, SURF, SURF2, BORDER, BORDERHI, TP, TB, TM, FD, FB, FM } from "../theme";
import { Card, SL, H1, H2, Body, Btn, Page, VT } from "../components/ui";

const BIASES = [
  {
    id: "loss",
    name: "Loss Aversion",
    icon: "😰",
    color: RED,
    oneLine: "Losses feel about twice as painful as equivalent gains feel good.",
    example: "You happily risk $100 on a coin flip to win $100 — unless you're flipping to avoid losing $100 you already have. Same odds, same stakes, completely different emotional weight.",
    realInvesting: "You hold a losing stock far too long hoping to 'get back to even.' Meanwhile you sell winning stocks too quickly to 'lock in gains' before they disappear.",
    antidote: "Evaluate every position fresh: 'If I didn't already own this, would I buy it today at this price?' If no — sell. The price you paid is history. It doesn't affect the future.",
  },
  {
    id: "anchor",
    name: "Anchoring",
    icon: "⚓",
    color: AMBER,
    oneLine: "You fixate on a reference price — usually what you paid — and let it distort all future decisions.",
    example: "You bought a stock at $80. It falls to $50. You refuse to sell until it 'gets back to $80.' But the market has no idea what you paid — and doesn't care.",
    realInvesting: "Your $80 purchase price has zero relevance to whether the stock will rise from $50. The only question is: does this stock deserve to be owned at $50? That's a different analysis entirely.",
    antidote: "Write down your investment thesis when you buy. When you're considering selling, evaluate whether that thesis is still intact — not whether you're 'up' or 'down.'",
  },
  {
    id: "herd",
    name: "Herd Mentality",
    icon: "🐑",
    color: PURPLE,
    oneLine: "You buy what everyone is buying and sell when everyone is selling — usually at exactly the wrong time.",
    example: "Bitcoin hits $60,000, headlines scream. Everyone piles in. It crashes to $20,000. Same people panic-sell. Classic buy-high-sell-low via social proof.",
    realInvesting: "By the time an investment is famous enough for everyone to know about it, the easy money has usually already been made. The crowd is almost always late.",
    antidote: "Ask yourself: 'Why am I buying this right now? Is it because the fundamentals are strong — or because I've seen it everywhere this week?' Attention ≠ opportunity.",
  },
  {
    id: "recency",
    name: "Recency Bias",
    icon: "📰",
    color: BLUE,
    oneLine: "Whatever just happened feels like it will keep happening — forever.",
    example: "After a 2-year bull market: 'Stocks always go up.' After a 6-month crash: 'Stocks always go down.' Neither is true. Both feel completely true when you're living through them.",
    realInvesting: "Investors pour money into markets after strong years (buying high) and withdraw during bad years (selling low). The exact opposite of what builds wealth.",
    antidote: "Zoom out. Every 10-year chart of the S&P 500 shows crashes that felt catastrophic and were actually buying opportunities. The most important question isn't 'what happened last month?' — it's 'what do I expect over the next 10 years?'",
  },
];

const BIAS_SCENARIO = {
  setup: "You bought a stock at $80 six months ago. It's now trading at $58 — down 27.5%. A friend says they've heard it might drop to $40. The company's fundamentals haven't changed significantly.",
  portfolioEntry: "$80.00",
  portfolioNow: "$58.00",
  change: "-27.5%",
  options: [
    {
      id: "A",
      text: "Hold. I'm not selling at a loss — I'll wait until it gets back to $80.",
      bias: "Anchoring",
      biasColor: AMBER,
      explanation: "You're anchored to your $80 purchase price, which has no bearing on the stock's future. The market doesn't know what you paid. The question isn't 'will it recover to $80?' — it's 'do I want to own this at $58?'"
    },
    {
      id: "B",
      text: "Sell immediately. If my friend is right about $40, I should cut my losses now.",
      bias: "Herd Mentality + Loss Aversion",
      biasColor: PURPLE,
      explanation: "Acting on a friend's tip is herd mentality. Panic-selling based on fear of further loss is loss aversion. Neither is a reasoned investment decision. Your friend has no more information than the market does."
    },
    {
      id: "C",
      text: "Re-evaluate the thesis. Has anything fundamental changed? If not, consider buying more at this lower price.",
      bias: "None — this is the rational approach",
      biasColor: GREEN,
      explanation: "If the company's fundamentals are intact, a 27.5% price drop means you can buy the same business for less. This is exactly what disciplined investors do — they separate price movement from business value."
    },
    {
      id: "D",
      text: "Buy more — the stock went up last year, so it should recover.",
      bias: "Recency Bias",
      biasColor: BLUE,
      explanation: "Past price performance doesn't predict future results. The stock going up last year is irrelevant to whether it goes up next year. This reasoning would lead you to buy more of anything that recently fell — regardless of why."
    },
  ],
};

const MISTAKES = [
  {
    icon: "⏱️", color: AMBER,
    mistake: "Trying to time the market",
    why: "Everyone thinks they can spot the top and the bottom. Even professional fund managers fail at this consistently. The data is brutal: missing just the 10 best days in a decade cuts your returns by half.",
    better: "Time in the market beats timing the market. Every time.",
  },
  {
    icon: "📱", color: RED,
    mistake: "Checking your portfolio every day",
    why: "Daily checking turns long-term investing into short-term anxiety. The more you check, the more you react to noise. Studies show frequent checkers earn less — they trade more and worse.",
    better: "Check quarterly. Set an alert for moves >10%. Otherwise, let it run.",
  },
  {
    icon: "😱", color: RED,
    mistake: "Selling during a crash",
    why: "Crashes feel permanent. They never are — at least not for diversified index investors. Selling during a crash locks in your loss and guarantees you miss the recovery.",
    better: "If you can't stomach a 30% drop without selling, your allocation is too aggressive for your risk tolerance. Fix that before a crash — not during one.",
  },
  {
    icon: "🎯", color: AMBER,
    mistake: "Putting everything in one stock",
    why: "Even great companies go to zero. Enron was in the Fortune 500. Blockbuster was a blue chip. Concentration risk is real — and painful.",
    better: "No single stock should be more than 5–10% of your portfolio. Index funds solve this automatically.",
  },
  {
    icon: "💸", color: SLATE,
    mistake: "Ignoring fees and taxes",
    why: "A 1% annual fee sounds trivial. Over 30 years on $10,000 at 7% growth, it costs you ~$50,000. Capital gains taxes can turn a 20% gain into a 14% gain overnight.",
    better: "Use tax-advantaged accounts (Roth IRA, 401k) first. Always check the expense ratio before buying any fund.",
  },
  {
    icon: "⏳", color: GREEN,
    mistake: "Waiting until you know enough to start",
    why: "There's no finish line for investment knowledge. Every day you wait is a day of compounding lost forever. A 22-year-old who invests $200/month will have more at 65 than a 32-year-old investing $400/month.",
    better: "Start with $50 in a total market index fund. Learn while your money grows. Perfect is the enemy of started.",
  },
];

const SELL_SCENARIOS = [
  {
    situation: "The company you invested in just announced their CEO is leaving, margins are shrinking, and a major competitor entered their core market.",
    recommendation: "sell",
    label: "Sell",
    color: RED,
    reason: "The original investment thesis has broken. You invested in this company for specific reasons — if those reasons no longer apply, the case for holding no longer applies either.",
    legitimate: true,
  },
  {
    situation: "Your stock is down 18%. The market is in a general selloff. Nothing fundamental has changed at the company.",
    recommendation: "hold",
    label: "Hold",
    color: GREEN,
    reason: "This is emotional, not rational. The market drops regularly — and always has recovered. Selling because price went down (without a change in fundamentals) is exactly the mistake that destroys returns.",
    legitimate: false,
  },
  {
    situation: "Your position has grown to 35% of your total portfolio after a strong run. You need to rebalance back to your target allocation.",
    recommendation: "sell",
    label: "Sell (partial)",
    color: AMBER,
    reason: "Rebalancing is a legitimate reason to trim a position. This isn't selling because of fear or emotion — it's maintaining your intentional risk level. Selling the excess preserves your strategy.",
    legitimate: true,
  },
  {
    situation: "Your stock is up 40% in 6 months. You're nervous it might pull back.",
    recommendation: "hold",
    label: "Hold",
    color: GREEN,
    reason: "This is recency bias and loss aversion working together. If the thesis is intact, a rising price is not a reason to sell. Selling winners early is one of the most common and costly mistakes investors make.",
    legitimate: false,
  },
];

const QUIZ = [
  {
    q: "A company has revenue of $500M and profit of $25M. What is its profit margin?",
    opts: ["0.5%", "2%", "5%", "20%"],
    correct: 2,
    explanation: "Profit margin = Profit ÷ Revenue. $25M ÷ $500M = 5%. This is quite thin — any increase in costs could wipe out profits entirely."
  },
  {
    q: "Company A has a P/E ratio of 12. Company B has a P/E of 45. What does this most likely tell us?",
    opts: [
      "Company A is definitely a better investment",
      "Company B's stock price is higher than Company A's",
      "The market expects much faster earnings growth from Company B",
      "Company A is larger than Company B"
    ],
    correct: 2,
    explanation: "A high P/E reflects growth expectations, not size or quality. Investors pay 45x earnings for Company B because they expect its earnings to grow rapidly. Whether that growth materialises is the real question."
  },
  {
    q: "You bought a stock at $100. It's now $70. Your analysis suggests the company is still fundamentally strong. What does anchoring tell you to do — even though it's the wrong move?",
    opts: [
      "Buy more at the lower price",
      "Hold until it 'gets back to $100'",
      "Sell immediately before it falls further",
      "Diversify into other stocks"
    ],
    correct: 1,
    explanation: "Anchoring makes you fixate on your $100 purchase price as a target. But the market doesn't care what you paid. The rational question is: 'Would I buy this today at $70?' If yes — hold or buy more. If no — sell, regardless of your entry price."
  },
  {
    q: "What is the key difference between market cap and stock price?",
    opts: [
      "Market cap is adjusted for inflation, stock price is not",
      "Stock price is what you pay per share; market cap is the total value of all shares",
      "Market cap is only calculated for large companies",
      "They measure the same thing in different currencies"
    ],
    correct: 1,
    explanation: "Stock price is simply what one share costs. Market cap = stock price × total shares outstanding. A $5,000 stock in a company with 100,000 shares has a $500M market cap — smaller than a $10 stock with 100M shares and a $1B market cap."
  },
  {
    q: "Which of these is a legitimate reason to sell a stock?",
    opts: [
      "The price dropped 20% and you're nervous",
      "Everyone on social media is saying to sell",
      "The original reason you bought no longer applies",
      "The stock hasn't moved in 3 months"
    ],
    correct: 2,
    explanation: "Selling because 'the thesis is broken' is the most rational reason to exit a position. Fear, social pressure, and impatience are emotional — not investment — reasons. Patience is a core investing skill."
  },
];

// ── QUIZ OPTION COMPONENT ─────────────────────────────────────────────────────
const QuizOption = ({ opt, i, selected, submitted, correct, onSelect }) => {
  const isSelected = selected === i;
  const isRight = i === correct;
  let bg = SURF2, border = BORDER, color = TB;
  if (isSelected && !submitted) { bg = GOLD+"15"; border = BORDERHI; color = TP; }
  if (submitted && isRight) { bg = GREEN+"15"; border = GREEN+"60"; color = TP; }
  if (submitted && isSelected && !isRight) { bg = RED+"15"; border = RED+"60"; color = TP; }
  return (
    <button onClick={() => !submitted && onSelect(i)} disabled={submitted} style={{
      background: bg, border: "1.5px solid "+border, borderRadius: 10, padding: "14px 18px",
      textAlign: "left", cursor: submitted ? "default" : "pointer", color,
      fontFamily: FB, fontSize: 15, lineHeight: 1.5, transition: "all 0.2s", width: "100%"
    }}>
      <span style={{ fontFamily: FM, fontSize: 11, color: isSelected && !submitted ? GOLD : TM, marginRight: 10 }}>
        {String.fromCharCode(65+i)}.
      </span>
      {opt}
    </button>
  );
};

// ── SCREEN 1: BEHAVIOURAL FINANCE ─────────────────────────────────────────────
const BehaviourScreen = ({ onNext, onBack }) => {
  const [activeBias, setActiveBias] = useState(0);
  const [scenarioChoice, setScenarioChoice] = useState(null);
  const [scenarioRevealed, setScenarioRevealed] = useState(false);

  const bias = BIASES[activeBias];

  return (
    <Page>
      <SL c={PURPLE}>Step 1 of 3 — Behavioural Finance</SL>
      <H1>Your Biggest Enemy Is You</H1>
      <Body>
        You can understand every metric in this module and still lose money — because your brain has built-in biases that were useful on the savannah but are disastrous in financial markets. The investors who beat the market aren't smarter. They're more self-aware.
      </Body>

      {/* Bias explainer cards */}
      <Card purple>
        <SL c={PURPLE}>Four biases every investor carries</SL>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          {BIASES.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setActiveBias(i)}
              style={{
                background: activeBias === i ? b.color+"20" : BG,
                border: "1.5px solid "+(activeBias === i ? b.color : BORDER),
                borderRadius: 10, padding: "12px 14px", cursor: "pointer", textAlign: "left",
                transition: "all 0.2s"
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{b.icon}</div>
              <div style={{ fontFamily: FD, fontSize: 14, color: activeBias === i ? b.color : TP }}>{b.name}</div>
              <div style={{ fontFamily: FB, fontSize: 11, color: SLATE, marginTop: 3, lineHeight: 1.4 }}>{b.oneLine.slice(0, 50)}...</div>
            </button>
          ))}
        </div>

        <div style={{ background: BG, border: "1px solid "+bias.color+"40", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 30 }}>{bias.icon}</span>
            <div>
              <div style={{ fontFamily: FD, fontSize: 20, color: bias.color }}>{bias.name}</div>
              <div style={{ fontFamily: FB, fontSize: 13, color: TB, fontStyle: "italic", marginTop: 2 }}>{bias.oneLine}</div>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Real example</div>
            <Body style={{ fontSize: 13, margin: 0 }}>{bias.example}</Body>
          </div>

          <div style={{ background: RED+"08", border: "1px solid "+RED+"25", borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
            <div style={{ fontFamily: FM, fontSize: 9, color: RED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>What it does to your portfolio</div>
            <Body style={{ fontSize: 13, margin: 0 }}>{bias.realInvesting}</Body>
          </div>

          <div style={{ background: GREEN+"08", border: "1px solid "+GREEN+"25", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontFamily: FM, fontSize: 9, color: GREEN, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>The antidote</div>
            <Body style={{ fontSize: 13, margin: 0 }}>{bias.antidote}</Body>
          </div>
        </div>
      </Card>

      {/* Live scenario */}
      <Card>
        <SL>Now live it — the scenario</SL>
        <H2 style={{ marginBottom: 4 }}>Which bias are you most likely to fall into?</H2>
        <Body style={{ fontSize: 13, marginBottom: 16 }}>Read the situation. Pick what feels most natural. Then we'll show you which psychological trap each option represents.</Body>

        <div style={{ background: SURF2, border: "1px solid "+BORDER, borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>📰 The situation</div>
          <Body style={{ fontSize: 14, margin: "0 0 14px" }}>{BIAS_SCENARIO.setup}</Body>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Entry Price", value: BIAS_SCENARIO.portfolioEntry, color: TB },
              { label: "Current Price", value: BIAS_SCENARIO.portfolioNow, color: RED },
              { label: "Change", value: BIAS_SCENARIO.change, color: RED },
            ].map(s => (
              <div key={s.label} style={{ background: BG, borderRadius: 7, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontFamily: FD, fontSize: 18, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
          {BIAS_SCENARIO.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => { if (!scenarioRevealed) setScenarioChoice(opt.id); }}
              style={{
                background: scenarioChoice === opt.id ? GOLD+"12" : BG,
                border: "1.5px solid "+(scenarioChoice === opt.id ? GOLD : BORDER),
                borderRadius: 10, padding: "14px 16px", cursor: scenarioRevealed ? "default" : "pointer",
                textAlign: "left", transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontFamily: FM, fontSize: 11, color: scenarioChoice === opt.id ? GOLD : TM, flexShrink: 0, marginTop: 2 }}>{opt.id}.</span>
                <span style={{ fontFamily: FB, fontSize: 14, color: TB }}>{opt.text}</span>
              </div>
            </button>
          ))}
        </div>

        {scenarioChoice && !scenarioRevealed && (
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <Btn onClick={() => setScenarioRevealed(true)} color={PURPLE}>Reveal the Biases →</Btn>
          </div>
        )}

        {scenarioRevealed && (
          <div style={{ display: "grid", gap: 8 }}>
            {BIAS_SCENARIO.options.map(opt => (
              <div
                key={opt.id}
                style={{
                  background: opt.biasColor+"10",
                  border: "1px solid "+opt.biasColor+"40",
                  borderRadius: 10, padding: "14px 16px",
                  outline: scenarioChoice === opt.id ? "2px solid "+GOLD : "none"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: FM, fontSize: 9, color: opt.biasColor, textTransform: "uppercase", letterSpacing: "0.1em", background: opt.biasColor+"20", padding: "2px 8px", borderRadius: 4 }}>
                    {opt.bias}
                  </span>
                  {scenarioChoice === opt.id && (
                    <span style={{ fontFamily: FM, fontSize: 9, color: GOLD }}>← Your choice</span>
                  )}
                </div>
                <Body style={{ margin: 0, fontSize: 13 }}>{opt.explanation}</Body>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
        <Btn outline onClick={onBack} small>← Back</Btn>
        <Btn onClick={onNext}>Common Mistakes →</Btn>
      </div>
    </Page>
  );
};

// ── SCREEN 2: COMMON MISTAKES ─────────────────────────────────────────────────
const MistakesScreen = ({ onNext, onBack }) => {
  const [expanded, setExpanded] = useState(null);

  return (
    <Page>
      <SL c={RED}>Step 2 of 3 — Common Mistakes</SL>
      <H1>Everyone Makes These</H1>
      <Body>
        Most investors make these mistakes. Many make them repeatedly. The goal isn't perfection — it's recognition. Once you can name the mistake as it's happening, you can pause before acting on it.
      </Body>

      <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
        {MISTAKES.map((m, i) => (
          <div
            key={m.mistake}
            style={{
              background: expanded === i ? SURF : SURF2,
              border: "1px solid "+(expanded === i ? m.color+"50" : BORDER),
              borderRadius: 12, overflow: "hidden", transition: "all 0.25s"
            }}
          >
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              style={{
                width: "100%", background: "none", border: "none", cursor: "pointer",
                padding: "16px 18px", display: "flex", alignItems: "center", gap: 14,
                textAlign: "left"
              }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FD, fontSize: 15, color: expanded === i ? m.color : TP }}>{m.mistake}</div>
              </div>
              <div style={{ fontFamily: FM, fontSize: 14, color: TM, flexShrink: 0 }}>
                {expanded === i ? "▲" : "▼"}
              </div>
            </button>

            {expanded === i && (
              <div style={{ padding: "0 18px 18px" }}>
                <div style={{ background: BG, borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                  <div style={{ fontFamily: FM, fontSize: 9, color: RED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Why it happens</div>
                  <Body style={{ margin: 0, fontSize: 13 }}>{m.why}</Body>
                </div>
                <div style={{ background: GREEN+"10", border: "1px solid "+GREEN+"30", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontFamily: FM, fontSize: 9, color: GREEN, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>The better move</div>
                  <Body style={{ margin: 0, fontSize: 13, color: GREEN }}>{m.better}</Body>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: "linear-gradient(135deg, "+GOLD+"12 0%, transparent 100%)", border: "1px solid "+BORDERHI, borderRadius: 14, padding: "20px 20px", marginBottom: 24 }}>
        <SL c={GOLD}>The pattern behind all six</SL>
        <H2 style={{ color: GOLD, marginBottom: 8 }}>Short-term emotion vs long-term strategy</H2>
        <Body style={{ margin: 0 }}>
          Every mistake on this list comes from letting how you feel right now override what you committed to when you thought clearly. The antidote is always the same: write down your strategy before markets move, then follow it — not your feelings — when they do.
        </Body>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
        <Btn outline onClick={onBack} small>← Back</Btn>
        <Btn onClick={onNext}>When to Sell →</Btn>
      </div>
    </Page>
  );
};

// ── SCREEN 3: WHEN TO SELL ────────────────────────────────────────────────────
const SellScreen = ({ onNext, onBack }) => {
  const [choices, setChoices] = useState({});
  const [revealed, setRevealed] = useState({});

  const choose = (i, val) => {
    if (revealed[i]) return;
    setChoices(prev => ({ ...prev, [i]: val }));
  };

  const reveal = (i) => {
    if (!choices[i]) return;
    setRevealed(prev => ({ ...prev, [i]: true }));
  };

  const allAnswered = SELL_SCENARIOS.every((_, i) => revealed[i]);

  return (
    <Page>
      <SL c={AMBER}>Step 3 of 3 — When to Sell</SL>
      <H1>The Question Nobody Teaches</H1>
      <Body>
        Everyone talks about what to buy. Almost nobody talks about when to sell. Yet selling decisions — when you make them and why — are just as important as buying. There are three legitimate reasons to sell, and a long list of emotional ones that feel legitimate but aren't.
      </Body>

      <Card gold>
        <SL c={GOLD}>The three legitimate reasons to sell</SL>
        <div style={{ display: "grid", gap: 10, marginBottom: 4 }}>
          {[
            { icon: "💔", title: "The thesis is broken", desc: "The reason you bought no longer applies. Management changed, competitive advantage eroded, industry disrupted. If you wouldn't buy it today knowing what you know — you should sell." },
            { icon: "💵", title: "You need the money", desc: "Investing is for money you don't need for at least 3–5 years. If life changes and you genuinely need the funds — sell. That's what the money was for." },
            { icon: "⚖️", title: "Rebalancing your portfolio", desc: "A position has grown to dominate your portfolio beyond your target allocation. Trimming it back isn't giving up — it's maintaining discipline over concentration risk." },
          ].map(item => (
            <div key={item.title} style={{ display: "flex", gap: 12, background: BG, borderRadius: 9, padding: "12px 14px", border: "1px solid "+GOLD+"20" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontFamily: FD, fontSize: 14, color: GOLD, marginBottom: 4 }}>{item.title}</div>
                <Body style={{ margin: 0, fontSize: 13 }}>{item.desc}</Body>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sell or Hold scenarios */}
      <Card>
        <SL>Sell or Hold?</SL>
        <H2 style={{ marginBottom: 4 }}>Four real situations. You decide.</H2>
        <Body style={{ fontSize: 13, marginBottom: 20 }}>For each scenario, choose whether you'd sell or hold — then see the rationale.</Body>

        <div style={{ display: "grid", gap: 16 }}>
          {SELL_SCENARIOS.map((s, i) => (
            <div key={i} style={{ background: BG, border: "1px solid "+(revealed[i] ? s.color+"40" : BORDER), borderRadius: 12, padding: "16px 18px", transition: "border-color 0.3s" }}>
              <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Scenario {i+1}</div>
              <Body style={{ fontSize: 14, margin: "0 0 14px" }}>{s.situation}</Body>

              {!revealed[i] && (
                <div style={{ display: "flex", gap: 10, marginBottom: choices[i] ? 10 : 0 }}>
                  {["sell", "hold"].map(v => (
                    <button
                      key={v}
                      onClick={() => choose(i, v)}
                      style={{
                        flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer",
                        background: choices[i] === v ? (v === "sell" ? RED+"20" : GREEN+"20") : SURF2,
                        border: "1.5px solid "+(choices[i] === v ? (v === "sell" ? RED : GREEN) : BORDER),
                        color: choices[i] === v ? (v === "sell" ? RED : GREEN) : TB,
                        fontFamily: FM, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em",
                        transition: "all 0.2s"
                      }}
                    >{v === "sell" ? "🔴 Sell" : "🟢 Hold"}</button>
                  ))}
                </div>
              )}

              {choices[i] && !revealed[i] && (
                <Btn small onClick={() => reveal(i)} color={GOLD} style={{ width: "100%", marginTop: 4 }}>
                  See the Answer →
                </Btn>
              )}

              {revealed[i] && (
                <div style={{ background: s.color+"10", border: "1px solid "+s.color+"40", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ fontFamily: FM, fontSize: 10, color: s.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
                    {choices[i] === s.recommendation
                      ? <span style={{ fontFamily: FM, fontSize: 9, color: GREEN, background: GREEN+"15", padding: "2px 7px", borderRadius: 4 }}>✓ You got it</span>
                      : <span style={{ fontFamily: FM, fontSize: 9, color: AMBER, background: AMBER+"15", padding: "2px 7px", borderRadius: 4 }}>Not quite</span>
                    }
                  </div>
                  <Body style={{ margin: 0, fontSize: 13 }}>{s.reason}</Body>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {allAnswered && (
        <div style={{ background: "linear-gradient(135deg, "+GREEN+"12 0%, transparent 100%)", border: "1px solid "+GREEN+"40", borderRadius: 14, padding: "20px 20px", marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🎯</div>
          <H2 style={{ color: GREEN }}>The pattern</H2>
          <Body style={{ margin: 0 }}>
            Every "hold" scenario involved price movement with no fundamental change. Every "sell" scenario involved either a broken thesis or deliberate portfolio management. The market going up or down is not a reason to do anything — unless something has changed in the business itself.
          </Body>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
        <Btn outline onClick={onBack} small>← Back</Btn>
        <Btn onClick={onNext}>Take the Quiz →</Btn>
      </div>
    </Page>
  );
};

// ── QUIZ SCREEN ───────────────────────────────────────────────────────────────
const QuizScreen = ({ onNext }) => {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const q = QUIZ[qIdx];
  const isCorrect = selected === q.correct;
  const isLast = qIdx === QUIZ.length - 1;

  const submit = () => { if (submitted || selected === null) return; setSubmitted(true); if (isCorrect) setScore(s => s+1); };
  const next = () => {
    if (isLast) { onNext(score + (isCorrect ? 1 : 0)); return; }
    setQIdx(i => i+1); setSelected(null); setSubmitted(false);
  };

  return (
    <Page>
      <SL c={TM}>Final Check</SL>
      <H1>Module 6 Quiz</H1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {QUIZ.map((_, i) => (
            <div key={i} style={{ width: 28, height: 6, borderRadius: 3, background: i < qIdx ? GREEN : i === qIdx ? GOLD : SURF2 }} />
          ))}
        </div>
        <span style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {qIdx+1} / {QUIZ.length}
        </span>
      </div>

      <Card gold style={{ marginBottom: 20 }}>
        <H2 style={{ lineHeight: 1.5 }}>{q.q}</H2>
      </Card>

      <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
        {q.opts.map((opt, i) => (
          <QuizOption key={i} opt={opt} i={i} selected={selected} submitted={submitted} correct={q.correct} onSelect={setSelected} />
        ))}
      </div>

      {!submitted ? (
        <Btn onClick={submit} disabled={selected === null} style={{ width: "100%" }}>
          Confirm Answer →
        </Btn>
      ) : (
        <div>
          <div style={{ background: isCorrect ? GREEN+"12" : RED+"12", border: "1px solid "+(isCorrect ? GREEN : RED)+"40", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
            <div style={{ fontFamily: FD, fontSize: 16, color: isCorrect ? GREEN : RED, marginBottom: 8 }}>
              {isCorrect ? "✓ Correct" : "Not quite"}
            </div>
            <Body style={{ margin: 0, fontSize: 14 }}>{q.explanation}</Body>
          </div>
          <Btn onClick={next} style={{ width: "100%" }}>
            {isLast ? "See Results →" : "Next Question →"}
          </Btn>
        </div>
      )}
    </Page>
  );
};

// ── RESULTS SCREEN ────────────────────────────────────────────────────────────
const ResultsScreen = ({ score, onRestart }) => {
  const total = QUIZ.length;
  const pct = Math.round((score / total) * 100);
  const tier = score >= 5 ? { label: "Analyst", color: GOLD, emoji: "🏆", msg: "Outstanding. You've covered every core concept from qualitative analysis to behavioural finance. You're thinking like an investor." }
    : score >= 4 ? { label: "Investor", color: GREEN, emoji: "📈", msg: "Strong work. You have a solid grasp of the concepts. Review any questions you missed and you'll have a complete foundation." }
    : score >= 3 ? { label: "Learner", color: AMBER, emoji: "📚", msg: "Good progress. A few areas to revisit — but you understand the framework. Go back through the module and the gaps will close." }
    : { label: "Rookie", color: BLUE, emoji: "🌱", msg: "This is a lot to absorb. Don't worry — go back through the module at your own pace. The concepts will click with repetition." };

  const vocabLearned = [
    "Qualitative analysis", "Quantitative analysis", "Competitive moat",
    "Market cap", "Revenue vs Profit", "EPS", "P/E ratio", "Valuation",
    "Loss aversion", "Anchoring", "Herd mentality", "Recency bias",
  ];

  return (
    <Page>
      <div style={{ textAlign: "center", padding: "24px 0 28px" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{tier.emoji}</div>
        <SL c={tier.color}>Module 6 Complete</SL>
        <H1 style={{ color: tier.color }}>You're a {tier.label}</H1>
        <div style={{ fontFamily: FD, fontSize: 48, color: tier.color, margin: "8px 0" }}>
          {score}/{total}
        </div>
        <div style={{ fontFamily: FM, fontSize: 11, color: TM, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>{pct}% correct</div>
        <Body style={{ maxWidth: 480, margin: "0 auto", fontSize: 15 }}>{tier.msg}</Body>
      </div>

      <Card gold style={{ marginBottom: 20 }}>
        <SL>Vocabulary Earned</SL>
        <H2 style={{ color: GOLD, marginBottom: 14 }}>12 new terms in your investing toolkit</H2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {vocabLearned.map(term => (
            <div key={term} style={{ display: "flex", alignItems: "center", gap: 8, background: BG, borderRadius: 7, padding: "8px 12px" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
              <span style={{ fontFamily: FB, fontSize: 13, color: TB }}>{term}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ background: "linear-gradient(135deg, "+GOLD+"12 0%, "+PURPLE+"08 100%)", border: "1px solid "+BORDERHI, borderRadius: 14, padding: "22px 20px", marginBottom: 24 }}>
        <SL c={GOLD}>Your complete journey</SL>
        <H2 style={{ color: TP, marginBottom: 14 }}>Six modules. One complete foundation.</H2>
        <div style={{ display: "grid", gap: 8 }}>
          {[
            { num: "1", title: "Why Invest?", note: "Inflation, compound interest, time value of money" },
            { num: "2", title: "Building Blocks", note: "Stocks, bonds, ETFs, fees" },
            { num: "3", title: "How Markets Work", note: "Price discovery, crashes, psychology" },
            { num: "4", title: "Know Yourself + Simulator", note: "Investor profile, historical scenario testing" },
            { num: "5", title: "Real-World Investing", note: "Brokerages, fees, time horizon, DCA" },
            { num: "6", title: "Making Decisions", note: "Qual/quant analysis, biases, when to sell" },
          ].map(m => (
            <div key={m.num} style={{ display: "flex", gap: 12, alignItems: "center", background: BG, borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: GOLD+"20", border: "1px solid "+GOLD+"40", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: FM, fontSize: 10, color: GOLD }}>{m.num}</span>
              </div>
              <div>
                <div style={{ fontFamily: FD, fontSize: 14, color: TP }}>{m.title}</div>
                <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{m.note}</div>
              </div>
              <div style={{ marginLeft: "auto", color: GREEN, fontSize: 16 }}>✅</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: SURF2, border: "1px solid "+BORDER, borderRadius: 12, padding: "18px 20px", marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontFamily: FD, fontSize: 18, color: TP, marginBottom: 8 }}>What comes next?</div>
        <Body style={{ fontSize: 14, margin: "0 auto 16px", maxWidth: 460 }}>
          You've built the foundation. The next step is doing it for real — opening a brokerage account, making your first investment, and experiencing these concepts with real money (even if it's just $50).
        </Body>
        <Body style={{ fontSize: 13, color: GOLD, fontStyle: "italic", margin: 0 }}>
          "The best time to plant a tree was 20 years ago. The second best time is now."
        </Body>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Btn outline onClick={onRestart} small color={SLATE}>↺ Restart Module</Btn>
      </div>
    </Page>
  );
};

// ── APP ───────────────────────────────────────────────────────────────────────
export default function Module6_2() {
  const [screen, setScreen] = useState("behaviour");
  const [quizScore, setQuizScore] = useState(0);
  const go = s => { setScreen(s); window.scrollTo(0, 0); };

  if (screen === "behaviour") return <BehaviourScreen onNext={() => go("mistakes")} onBack={() => go("behaviour")} />;
  if (screen === "mistakes") return <MistakesScreen onNext={() => go("sell")} onBack={() => go("behaviour")} />;
  if (screen === "sell") return <SellScreen onNext={() => go("quiz")} onBack={() => go("mistakes")} />;
  if (screen === "quiz") return <QuizScreen onNext={s => { setQuizScore(s); go("results"); }} />;
  if (screen === "results") return <ResultsScreen score={quizScore} onRestart={() => go("behaviour")} />;
  return null;
}

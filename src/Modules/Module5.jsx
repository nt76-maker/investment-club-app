import { useState, useEffect, useRef } from "react";
import { TrendingUp, DollarSign, Clock, Target, ChevronRight, ChevronLeft, CheckCircle, XCircle, BarChart2, RefreshCw, Play, Pause, ArrowDown, ArrowUp, Minus, BookOpen, Zap, Award } from "lucide-react";
import { GOLD, AMBER, GREEN, RED, BLUE, PURPLE, SLATE, BG, SURF, SURF2, BORDER, BORDERHI, TP, TB, TM, FD, FB, FM } from "../theme";
import { Card, SL, H1, H2, Body, Btn, Page, VT } from "../components/ui";

const QUIZ = [
  {
    q: "What is a brokerage account?",
    opts: ["A savings account with higher interest rates","A place where you can buy and sell investments like stocks","A government retirement program","A type of loan for investing"],
    correct: 1,
    explanation: "A brokerage account is your gateway to investing — it holds your money and lets you buy and sell stocks, bonds, ETFs, and more. You open one with a brokerage like Fidelity, Schwab, or Robinhood."
  },
  {
    q: "You invest $100/month in an index fund for 12 months. In month 6, the fund price drops 20%. What happens to your average cost?",
    opts: ["It goes up because you lost money","It goes down because month 6's shares were cheaper","It stays the same — DCA keeps your average fixed","You should stop investing immediately"],
    correct: 1,
    explanation: "When price drops, your monthly $100 buys MORE shares than usual at a lower price. This pulls your average cost per share DOWN — exactly the DCA advantage. Those cheap shares will be worth more when prices recover."
  },
  {
    q: "An ETF has an expense ratio of 0.03%. A similar ETF has an expense ratio of 1.2%. You invest $10,000. After 30 years at 7% growth, roughly how much more does the 0.03% fund leave you with?",
    opts: ["About $500 more","About $2,000 more","About $50,000 more","They end up about the same"],
    correct: 2,
    explanation: "Fees compound just like returns — but in the wrong direction. A 1.2% annual fee sounds small but over 30 years it can cost you $50,000+ on a $10,000 investment. Always check expense ratios before buying a fund."
  },
  {
    q: "What does 'time horizon' mean?",
    opts: ["The time of day you should place trades","How long until you'll need the money you're investing","How long a stock has been trading","The time it takes to open a brokerage account"],
    correct: 1,
    explanation: "Time horizon is how long your money can stay invested before you need it. Longer horizon = more time to recover from dips = can take more risk. Short horizon = need safer investments because there's no time to recover from a crash."
  },
  {
    q: "Sarah invests $500 lump sum in January. Tom invests $100/month for 5 months — same total. The stock crashes in February then recovers by June. Who likely ends up with more?",
    opts: ["Sarah — she invested everything early at a lower price","Tom — he bought extra shares during the February crash","They end up exactly the same","Impossible to say — it always depends on luck"],
    correct: 1,
    explanation: "Tom's DCA strategy meant he bought heavily during the February crash. While Sarah's full $500 experienced the crash and recovery, Tom's later $100 purchases scooped up cheap shares that grew significantly. DCA turns market dips into opportunities."
  }
];
const OpeningScreen = ({ onNext }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <Page>
      <div style={{ textAlign: "center", padding: "40px 0 20px" }}>
        <SL c={GOLD}>Module 5</SL>
        <H1 style={{ fontSize: "clamp(28px,5vw,42px)" }}>Real-World Investing</H1>
        <Body style={{ color: TB, maxWidth: 520, margin: "0 auto 24px", fontSize: 16 }}>
          You know the theory. Now let's talk about actually doing it.
        </Body>
      </div>

      <div style={{
        background: "linear-gradient(135deg, "+SURF+" 0%, #0a0a0a 100%)",
        border: "1px solid "+BORDERHI, borderRadius: 16, padding: "32px 28px",
        textAlign: "center", marginBottom: 32,
        opacity: phase ? 1 : 0, transform: phase ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease"
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📈</div>
        <H2 style={{ color: GOLD, marginBottom: 12 }}>The Strategy That Changed Everything</H2>
        <Body style={{ fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
          Most investors wait for the "right moment." They watch prices. They hesitate. They miss out.

          The investors who actually build wealth follow one simple, boring, powerful strategy — and stick to it no matter what.
        </Body>
      </div>

      <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
        {[
          { icon: "🏦", label: "How to buy your first investment", desc: "Brokerage accounts explained simply" },
          { icon: "💸", label: "Why fees are the silent killer", desc: "The math behind expense ratios" },
          { icon: "⏳", label: "Why your timeline changes everything", desc: "Matching risk to your time horizon" },
          { icon: "🎯", label: "Dollar-Cost Averaging — your first real strategy", desc: "Learn the concept, then play the challenge" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 16, background: SURF2, borderRadius: 10, padding: "14px 18px", border: "1px solid "+BORDER }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <div>
              <div style={{ fontFamily: FB, fontSize: 14, color: TP, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <Btn onClick={onNext} style={{ fontSize: 14, padding: "14px 40px" }}>Let's Do This →</Btn>
      </div>
    </Page>
  );
};
const BrokerageScreen = ({ onNext, onBack }) => (
  <Page>
    <div style={{ marginBottom: 8 }}>
      <SL c={TM}>Step 1 of 4</SL>
      <H1>How to Actually Buy a Stock</H1>
      <Body>Before you can invest, you need somewhere to put your money. That's where a <VT id="brokerage">brokerage account</VT> comes in.</Body>
    </div>

    <Card gold>
      <SL>Think of it like this</SL>
      <H2 style={{ color: GOLD }}>A brokerage is like a store for investments</H2>
      <Body>
        You walk in with money. You pick what you want to buy — a stock, a fund, a bond. You pay. They hold it for you. When you want to sell, they handle that too.
        <br /><br />
        The difference? This store is open 6.5 hours a day, Monday–Friday, and your "shelves" are the entire global stock market.
      </Body>
    </Card>

    <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
      <SL c={GOLD}>The 3 types of brokerage accounts</SL>
      {[
        { title: "Standard (Taxable)", icon: "📂", desc: "Open to anyone, no limits on how much you deposit. Full flexibility — withdraw anytime. You'll owe tax on gains (more on that in a future module).", tag: "Most flexible" },
        { title: "Roth IRA", icon: "🛡️", desc: "Retirement account. Invest after-tax dollars now, pay zero tax on gains later. Annual contribution limit ~$7,000. Best for long-term investing.", tag: "Best for retirement" },
        { title: "401(k)", icon: "🏢", desc: "Employer-sponsored retirement account. Often includes an employer match — that's free money. Contributions are pre-tax. Tax details coming in Module 7.", tag: "If your employer offers it" },
      ].map(item => (
        <div key={item.title} style={{ background: SURF2, border: "1px solid "+BORDER, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ fontFamily: FD, fontSize: 16, color: TP }}>{item.title}</span>
            </div>
            <span style={{ fontFamily: FM, fontSize: 9, color: GOLD, background: GOLD+"15", padding: "3px 8px", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>{item.tag}</span>
          </div>
          <Body style={{ margin: 0, fontSize: 14 }}>{item.desc}</Body>
        </div>
      ))}
    </div>

    <Card>
      <SL>When you place a trade</SL>
      <H2>Market Orders vs. Limit Orders</H2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <div style={{ background: BG, borderRadius: 8, padding: "14px", border: "1px solid "+BORDER }}>
          <div style={{ fontFamily: FM, fontSize: 10, color: AMBER, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Market Order</div>
          <Body style={{ fontSize: 13, margin: 0 }}>"Buy now at whatever the price is." Fast, simple. Good for beginners most of the time.</Body>
        </div>
        <div style={{ background: BG, borderRadius: 8, padding: "14px", border: "1px solid "+BORDER }}>
          <div style={{ fontFamily: FM, fontSize: 10, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Limit Order</div>
          <Body style={{ fontSize: 13, margin: 0 }}>"Buy only if price drops to $X." More control, but no guarantee it executes.</Body>
        </div>
      </div>
    </Card>

    <div style={{ background: SURF2, border: "1px solid "+GREEN+"40", borderRadius: 10, padding: "16px 18px", marginBottom: 24 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 18 }}>✅</span>
        <div>
          <div style={{ fontFamily: FD, fontSize: 15, color: GREEN, marginBottom: 4 }}>For most beginners: Keep it simple</div>
          <Body style={{ margin: 0, fontSize: 14 }}>Open a brokerage account (Fidelity or Schwab are widely recommended for beginners). Enable a Roth IRA if you have earned income. Use market orders. Start with an index fund like VOO or VTI. That's genuinely it.</Body>
        </div>
      </div>
    </div>

    <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
      <Btn outline onClick={onBack} small>← Back</Btn>
      <Btn onClick={onNext}>Fees — The Silent Killer →</Btn>
    </div>
  </Page>
);
const FeesScreen = ({ onNext, onBack }) => (
  <Page>
    <SL c={TM}>Step 2 of 4</SL>
    <H1>What It Costs to Invest</H1>
    <Body>Every investment fund charges an annual fee called an <VT id="expense ratio">expense ratio</VT>. You never see it leave your account — it's quietly deducted from your returns. Over decades, it's one of the biggest differences between building wealth and leaving money on the table.</Body>

    <div style={{ background: "linear-gradient(135deg, "+RED+"10 0%, transparent 100%)", border: "1px solid "+RED+"30", borderRadius: 14, padding: "22px 20px", marginBottom: 16 }}>
      <SL c={RED}>You already saw the math in Module 2</SL>
      <H2 style={{ color: TP, marginBottom: 14 }}>Here's the one rule to remember</H2>
      <div style={{ background: BG, border: "1px solid "+GOLD+"50", borderRadius: 10, padding: "18px 20px", textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>The fee rule</div>
        <div style={{ fontFamily: FD, fontSize: 26, color: GOLD, marginBottom: 6 }}>Keep it under 0.20%</div>
        <Body style={{ margin: 0, fontSize: 14 }}>Index funds from Vanguard, Fidelity, and Schwab typically charge 0.03%–0.10%. Actively managed funds often charge 0.75%–1.5%. That difference compounds into tens of thousands of dollars over a lifetime.</Body>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "Vanguard VOO", fee: "0.03%", verdict: "Excellent", color: GREEN },
          { label: "Fidelity ZERO funds", fee: "0.00%", verdict: "Excellent", color: GREEN },
          { label: "Typical robo-advisor", fee: "0.25%", verdict: "Acceptable", color: AMBER },
          { label: "Actively managed fund", fee: "0.75–1.5%", verdict: "Avoid if possible", color: RED },
        ].map(item => (
          <div key={item.label} style={{ background: SURF2, borderRadius: 8, padding: "12px 14px", border: "1px solid "+item.color+"25" }}>
            <div style={{ fontFamily: FB, fontSize: 13, color: TP, marginBottom: 4 }}>{item.label}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FM, fontSize: 12, color: item.color }}>{item.fee}</span>
              <span style={{ fontFamily: FM, fontSize: 9, color: item.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.verdict}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <Card>
      <SL>One more cost to know</SL>
      <H2>The Bid-Ask Spread</H2>
      <Body>When you buy a stock, you pay the "ask" price. When you sell, you get the "bid" price. The <VT id="bid-ask spread">bid-ask spread</VT> is the tiny gap between them — the market's built-in transaction cost.</Body>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: BG, borderRadius: 8, padding: "12px 14px", border: "1px solid "+GREEN+"30" }}>
          <div style={{ fontFamily: FM, fontSize: 9, color: GREEN, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Large, popular stocks</div>
          <div style={{ fontFamily: FD, fontSize: 15, color: TP, marginBottom: 4 }}>Apple, S&P 500 ETFs</div>
          <Body style={{ margin: 0, fontSize: 12 }}>Spread is fractions of a cent. Barely noticeable.</Body>
        </div>
        <div style={{ background: BG, borderRadius: 8, padding: "12px 14px", border: "1px solid "+AMBER+"30" }}>
          <div style={{ fontFamily: FM, fontSize: 9, color: AMBER, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Small, obscure stocks</div>
          <div style={{ fontFamily: FD, fontSize: 15, color: TP, marginBottom: 4 }}>Low-volume tickers</div>
          <Body style={{ margin: 0, fontSize: 12 }}>Spread can be significant — an extra hidden cost every trade.</Body>
        </div>
      </div>
      <Body style={{ marginTop: 12, marginBottom: 0, color: GREEN, fontStyle: "italic", fontSize: 13 }}>
        Stick to index ETFs like VOO or VTI: rock-bottom expense ratios, near-zero spreads, and instant diversification in one purchase.
      </Body>
    </Card>

    <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
      <Btn outline onClick={onBack} small>← Back</Btn>
      <Btn onClick={onNext}>Time Horizon →</Btn>
    </div>
  </Page>
);
const TimeHorizonScreen = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState(null);

  const horizons = [
    {
      id: "short", label: "1–3 Years", icon: "🏖️", color: BLUE,
      title: "Short-term: Protect what you have",
      alloc: { stocks: 20, bonds: 40, cash: 40 },
      reasoning: "You might need this money soon — for a house, a car, a life event. You can't afford a 30% crash and a 2-year wait to recover. Capital preservation comes first.",
      tools: ["High-yield savings account", "Short-term bond ETFs", "CDs (Certificates of Deposit)"],
      warning: "Putting short-term money in 100% stocks is one of the most common beginner mistakes."
    },
    {
      id: "medium", label: "5–10 Years", icon: "🎓", color: AMBER,
      title: "Medium-term: Balanced growth",
      alloc: { stocks: 60, bonds: 30, cash: 10 },
      reasoning: "You have time to recover from most downturns, but not a full decade of bear market. A balanced mix grows your money while managing risk.",
      tools: ["Broad market index funds", "Bond index funds", "Target-date funds"],
      warning: "Stay away from highly speculative stocks — one bad bet could derail a decade of saving."
    },
    {
      id: "long", label: "20–30+ Years", icon: "🚀", color: GREEN,
      title: "Long-term: Maximize growth",
      alloc: { stocks: 90, bonds: 8, cash: 2 },
      reasoning: "The S&P 500 has never had a negative 20-year period in history. Time is your superpower. Short-term crashes become buying opportunities, not disasters.",
      tools: ["S&P 500 or total market index funds", "International index funds", "Reinvest all dividends"],
      warning: "The only mistake here is panicking and selling during downturns. Time in the market beats timing the market."
    }
  ];

  const sel = horizons.find(h => h.id === selected);

  return (
    <Page>
      <SL c={TM}>Step 3 of 4</SL>
      <H1>Your Time Horizon Changes Everything</H1>
      <Body>The single most important question in investing isn't "what should I buy?" It's "when will I need this money?" Pick your situation:</Body>

      <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
        {horizons.map(h => (
          <div
            key={h.id}
            onClick={() => setSelected(h.id)}
            style={{
              background: selected===h.id ? h.color+"15" : SURF,
              border: "1.5px solid "+selected===h.id ? h.color : BORDER,
              borderRadius: 12, padding: "16px 20px", cursor: "pointer",
              transition: "all 0.25s"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 28 }}>{h.icon}</span>
              <div>
                <div style={{ fontFamily: FD, fontSize: 17, color: TP }}>{h.label}</div>
                <div style={{ fontFamily: FM, fontSize: 10, color: h.color, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{h.title}</div>
              </div>
              <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", border: "2px solid "+selected===h.id ? h.color : SLATE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {selected===h.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: h.color }} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {sel && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <Card>
            <SL>Why this allocation</SL>
            <H2>{sel.title}</H2>
            <Body>{sel.reasoning}</Body>

            <div style={{ display: "flex", gap: 6, marginBottom: 16, height: 20 }}>
              {[
                { label: "Stocks", pct: sel.alloc.stocks, color: GREEN },
                { label: "Bonds", pct: sel.alloc.bonds, color: BLUE },
                { label: "Cash", pct: sel.alloc.cash, color: AMBER },
              ].map(bar => (
                <div key={bar.label} title={bar.label+": "+bar.pct+"%"} style={{ flex: bar.pct, background: bar.color, borderRadius: 4 }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              {[
                { label: "Stocks", pct: sel.alloc.stocks, color: GREEN },
                { label: "Bonds", pct: sel.alloc.bonds, color: BLUE },
                { label: "Cash", pct: sel.alloc.cash, color: AMBER },
              ].map(bar => (
                <div key={bar.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: bar.color }} />
                  <span style={{ fontFamily: FM, fontSize: 10, color: TB, textTransform: "uppercase" }}>{bar.label}: {bar.pct}%</span>
                </div>
              ))}
            </div>

            <SL c={TB}>Good tools for this horizon</SL>
            {sel.tools.map(t => (
              <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: sel.color, flexShrink: 0 }} />
                <span style={{ fontFamily: FB, fontSize: 14, color: TB }}>{t}</span>
              </div>
            ))}

            <div style={{ marginTop: 14, background: AMBER+"10", border: "1px solid "+AMBER+"30", borderRadius: 8, padding: "10px 14px" }}>
              <span style={{ fontFamily: FM, fontSize: 10, color: AMBER, textTransform: "uppercase", letterSpacing: "0.08em" }}>⚠ Watch out · </span>
              <span style={{ fontFamily: FB, fontSize: 13, color: TB }}>{sel.warning}</span>
            </div>
          </Card>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "space-between", marginTop: 8 }}>
        <Btn outline onClick={onBack} small>← Back</Btn>
        <Btn onClick={onNext} disabled={!selected}>The DCA Strategy →</Btn>
      </div>
    </Page>
  );
};
const DCA_WEEKS = [
  { week:1, price:108, headline:"📰 Analyst Downgrade", news:"A Wall Street firm cuts Tesla to 'neutral', citing slowing EV demand. Stock drops $12.", insight:"Price fell below your $120 avg. Every share you buy now pulls your average cost DOWN.", mood:"dip" },
  { week:2, price:98, headline:"📰 Market-Wide Selloff", news:"Panic sends tech stocks tumbling. Tesla hits a 6-week low. Fear is high.", insight:"Another drop. Scary? Yes. But you're buying the most shares per dollar you've seen yet.", mood:"crash" },
  { week:3, price:112, headline:"📰 Relief Rally", news:"Fed signals no more rate hikes. Markets stabilize. Tesla bounces.", insight:"Bounced — but still below $120. Buying here still brings your average down.", mood:"bounce" },
  { week:4, price:95, headline:"📰 Earnings Miss", news:"Tesla misses delivery estimates. Stock hits its lowest point. Panic selling begins.", insight:"Biggest dip of the game. Shares are cheapest here. This is the moment DCA is built for.", mood:"crash" },
  { week:5, price:118, headline:"📰 Recovery Begins", news:"New model launch announced. Analyst upgrades flood in. Buyers return.", insight:"Almost back to $120. If you bought the dips, your avg cost is well below this.", mood:"bounce" },
  { week:6, price:134, headline:"📰 Strong Earnings Beat", news:"Tesla crushes estimates. Deliveries at a record high. Stock surges past its previous high.", insight:"Final week. Every share you own below $134 is profitable. The dip buyers win.", mood:"rally" }
];

const STARTING_SHARES = 3;
const STARTING_PRICE = 120;
const STARTING_CASH = 200;
const PAYCHECK_WEEKS = { 2: 300, 4: 300 }; // cash added AFTER these weeks complete
const TOTAL_BUDGET = 800; // 200 + 300 + 300
const TOTAL_WEEKS = 6;
const perfectDCAResult = (() => {
  // Perfect DCA: split budget proportionally — $200 in weeks 1-2, $300 in weeks 3-4, $300 in weeks 5-6
  const allotments = [100, 100, 150, 150, 150, 150]; // sums to 800
  let shares = STARTING_SHARES, invested = STARTING_SHARES * STARTING_PRICE;
  DCA_WEEKS.forEach((w, i) => {
    const amt = allotments[i];
    shares += amt / w.price;
    invested += amt;
  });
  const finalPrice = DCA_WEEKS[TOTAL_WEEKS - 1].price;
  return { shares, invested, value: shares * finalPrice, avgCost: invested / shares };
})();
const holdResult = (() => {
  const finalPrice = DCA_WEEKS[TOTAL_WEEKS - 1].price;
  return {
    shares: STARTING_SHARES,
    invested: STARTING_SHARES * STARTING_PRICE,
    value: STARTING_SHARES * finalPrice,
    avgCost: STARTING_PRICE
  };
})();

const CrossoverMarker = ({ pur, i, allPrices, xOf, yOf }) => {
  const prevPrice = allPrices[i];
  const thisPrice = allPrices[i + 1];
  const crossed = prevPrice >= pur.avgCost && thisPrice < pur.avgCost;
  if (!crossed) return null;
  return (
    <g>
      <circle cx={xOf(i+1)} cy={yOf(thisPrice)} r={10} fill={GREEN} fillOpacity={0.2} />
      <text x={xOf(i+1)} y={yOf(thisPrice) - 14} textAnchor="middle" fill={GREEN} fontSize={11} fontFamily={FM}>✓</text>
    </g>
  );
};

const DCAChart = ({ purchases, currentWeekIdx }) => {
  const W = 680, H = 200, PAD = 36;
  const innerW = W - PAD * 2, innerH = H - PAD * 2;
  const allPrices = [STARTING_PRICE, ...DCA_WEEKS.slice(0, currentWeekIdx + 1).map(w => w.price)];
  const allWeeks = currentWeekIdx + 2; // start + weeks revealed
  const minP = Math.min(...allPrices, ...purchases.map(p => p.avgCost)) - 10;
  const maxP = Math.max(...allPrices) + 15;
  const range = maxP - minP;

  const xOf = (i) => PAD + (i / (TOTAL_WEEKS)) * innerW;
  const yOf = (p) => PAD + innerH - ((p - minP) / range) * innerH;
  const pricePts = allPrices.map((p, i) => xOf(i)+","+yOf(p)).join(" ");
  const avgHistory = [];
  if (purchases.length === 0) {
    avgHistory.push({ x: xOf(0), y: yOf(STARTING_PRICE) });
  } else {
    avgHistory.push({ x: xOf(0), y: yOf(STARTING_PRICE) });
    purchases.forEach((pur, i) => {
      avgHistory.push({ x: xOf(i + 1), y: yOf(pur.avgCost) });
    });
  }
  const avgPts = avgHistory.map(p => p.x+","+p.y).join(" ");
  const buildFillPath = () => {
    if (purchases.length < 1) return "";
    const pts = [];
    for (let i = 1; i <= purchases.length; i++) {
      pts.push(xOf(i)+","+yOf(allPrices[i]));
    }
    for (let i = purchases.length; i >= 1; i--) {
      pts.push(xOf(i)+","+yOf(purchases[i-1].avgCost));
    }
    return "M " + pts.join(" L ") + " Z";
  };

  const lastPrice = allPrices[allPrices.length - 1];
  const lastAvg = purchases.length > 0 ? purchases[purchases.length - 1].avgCost : STARTING_PRICE;
  const fillColor = lastPrice >= lastAvg ? GREEN : RED;
  const currentWeekData = currentWeekIdx >= 0 ? DCA_WEEKS[currentWeekIdx] : null;
  const yLabels = [minP + range * 0.1, minP + range * 0.35, minP + range * 0.6, minP + range * 0.85].map(v => Math.round(v));

  return (
    <div style={{ background: SURF2, border: "1px solid "+BORDER, borderRadius: 12, padding: "12px 8px 8px", marginBottom: 4 }}>
      <div style={{ display: "flex", gap: 20, marginBottom: 8, paddingLeft: 8, flexWrap: "wrap" }}>
        {[
          { color: RED, label: "Tesla Price", dash: false },
          { color: GOLD, label: "Your Avg Cost", dash: true },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {l.dash
              ? <svg width="22" height="6"><line x1="0" y1="3" x2="22" y2="3" stroke={l.color} strokeWidth="2" strokeDasharray="4 2" /></svg>
              : <div style={{ width: 22, height: 2, background: l.color }} />
            }
            <span style={{ fontFamily: FM, fontSize: 9, color: TB, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l.label}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 10, background: fillColor, opacity: 0.25, borderRadius: 2 }} />
          <span style={{ fontFamily: FM, fontSize: 9, color: fillColor, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {lastPrice >= lastAvg ? "profitable zone" : "underwater zone"}
          </span>
        </div>
      </div>

      <svg width="100%" viewBox={"0 0 "+W+" "+H} style={{ display: "block", overflow: "visible" }}>
        {/* Grid lines */}
        {yLabels.map(v => (
          <g key={v}>
            <line x1={PAD} y1={yOf(v)} x2={W - PAD} y2={yOf(v)} stroke={BORDER} strokeWidth={1} />
            <text x={PAD - 4} y={yOf(v) + 4} textAnchor="end" fill={TM} fontSize={9} fontFamily={FM}>${v}</text>
          </g>
        ))}

        {/* Week labels */}
        {[0,1,2,3,4,5,6].map(i => (
          <text key={i} x={xOf(i)} y={H - 4} textAnchor="middle" fill={TM} fontSize={8} fontFamily={FM}>
            {i === 0 ? "Start" : "Wk "+i}
          </text>
        ))}

        {/* Fill zone */}
        {purchases.length > 0 && (
          <path d={buildFillPath()} fill={fillColor} fillOpacity={0.12} />
        )}

        {/* Starting price reference line */}
        <line
          x1={PAD} y1={yOf(STARTING_PRICE)} x2={W - PAD} y2={yOf(STARTING_PRICE)}
          stroke={GOLD} strokeWidth={0.5} strokeOpacity={0.3} strokeDasharray="3 6"
        />
        <text x={W - PAD + 4} y={yOf(STARTING_PRICE) + 4} fill={GOLD} fontSize={8} fontFamily={FM} fillOpacity={0.5}>$120</text>

        {/* Avg cost line */}
        {avgHistory.length > 1 && (
          <polyline points={avgPts} fill="none" stroke={GOLD} strokeWidth={2} strokeDasharray="5 3" />
        )}

        {/* Price line */}
        {allPrices.length > 1 && (
          <polyline points={pricePts} fill="none" stroke={RED} strokeWidth={2.5} strokeLinejoin="round" />
        )}

        {/* Price dots */}
        {allPrices.map((p, i) => (
          <circle key={i} cx={xOf(i)} cy={yOf(p)} r={i === allPrices.length - 1 ? 5 : 3.5}
            fill={i === allPrices.length - 1 ? RED : BG} stroke={RED} strokeWidth={2} />
        ))}

        {/* Avg cost dots */}
        {avgHistory.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={3} fill={GOLD} />
        ))}

        {/* Crossover celebration marker */}
        {purchases.map((pur, i) => (
          <CrossoverMarker key={"cross"+i} pur={pur} i={i} allPrices={allPrices} xOf={xOf} yOf={yOf} />
        ))}
      </svg>
    </div>
  );
};

// ── DCA EXPLAIN SCREEN — teach the concept before the game ───────────────────
const DCAExplainScreen = ({ onNext, onBack }) => {
  const [step, setStep] = useState(0);

  // Worked example: building up the avg cost calculation visually step by step
  const purchases = [
    { label: "You start", shares: 1, price: 120, cumShares: 1, cumCost: 120, avg: 120, note: "You buy 1 share at $120. Your average cost is $120." },
    { label: "Price drops", shares: 1, price: 80, cumShares: 2, cumCost: 200, avg: 100, note: "Price falls to $80. You buy 1 more share. Total cost: $200 ÷ 2 shares = $100 avg." },
    { label: "Price drops more", shares: 2, price: 70, cumShares: 4, cumCost: 340, avg: 85, note: "Price falls to $70. You buy 2 more shares. Total cost: $340 ÷ 4 shares = $85 avg." },
    { label: "Price recovers", shares: 0, price: 110, cumShares: 4, cumCost: 340, avg: 85, note: "Price recovers to $110. You bought nothing — just hold. Your avg cost is still $85." },
  ];

  const current = purchases[Math.min(step, purchases.length - 1)];
  const maxAvg = 120;
  const finalPrice = 110;
  const profitPerShare = current.price - current.avg;
  const isProfitable = current.price >= current.avg;

  return (
    <Page>
      <SL c={GOLD}>Step 4 of 4</SL>
      <H1>Dollar-Cost Averaging</H1>
      <Body>Before you play the game, let's make sure the core idea is crystal clear. This is one of the most powerful concepts in investing — and it's simpler than it sounds.</Body>

      {/* What is DCA */}
      <div style={{ background: "linear-gradient(135deg, "+GOLD+"10 0%, transparent 100%)", border: "1px solid "+BORDERHI, borderRadius: 14, padding: "22px 20px", marginBottom: 20 }}>
        <SL c={GOLD}>The core idea</SL>
        <H2 style={{ color: TP }}>Instead of investing everything at once, you invest a fixed amount on a regular schedule — no matter what the price is doing.</H2>
        <Body style={{ margin: 0 }}>
          Some weeks the price will be high. Some weeks it'll be low. But because you're buying consistently, the expensive weeks are balanced out by the cheap ones. Your average cost per share ends up <em style={{ color: GREEN }}>lower than if you'd tried to time the market</em>.
        </Body>
      </div>

      {/* What is average cost */}
      <Card gold>
        <SL>First — what is "average cost"?</SL>
        <H2 style={{ marginBottom: 6 }}>The math is simple</H2>
        <div style={{ background: BG, borderRadius: 10, padding: "16px 18px", marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Average Cost Per Share</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontFamily: FD, fontSize: 22, color: TP }}>Total $ Invested</div>
            <div style={{ fontFamily: FD, fontSize: 28, color: TM }}>÷</div>
            <div style={{ fontFamily: FD, fontSize: 22, color: TP }}>Shares Owned</div>
            <div style={{ fontFamily: FD, fontSize: 28, color: TM }}>=</div>
            <div style={{ fontFamily: FD, fontSize: 26, color: GOLD }}>Avg Cost</div>
          </div>
        </div>
        <Body style={{ margin: 0, fontSize: 14 }}>
          If you own 4 shares and spent $340 in total to buy them — your average cost is <strong style={{ color: GOLD }}>$85/share</strong>. It doesn't matter that you paid different prices each time. It's just total money in, divided by shares owned.
        </Body>
      </Card>

      {/* Step-through worked example */}
      <Card>
        <SL>Watch it in action</SL>
        <H2 style={{ marginBottom: 4 }}>Step through a real example</H2>
        <Body style={{ fontSize: 13, marginBottom: 16 }}>Tap through each purchase and watch your average cost move.</Body>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {purchases.map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{ flex: 1, height: 6, borderRadius: 3, background: i <= step ? GOLD : SURF2, cursor: "pointer", transition: "background 0.3s" }}
            />
          ))}
        </div>

        {/* Visual equation for current step */}
        <div style={{ background: BG, borderRadius: 10, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontFamily: FM, fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{current.label}</div>

          {/* Share price this step */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>This week's price</div>
              <div style={{ fontFamily: FD, fontSize: 28, color: RED }}>${current.price}</div>
            </div>
            {current.shares > 0 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>You buy</div>
                <div style={{ fontFamily: FD, fontSize: 28, color: GREEN }}>+{current.shares} share{current.shares > 1 ? "s" : ""}</div>
              </div>
            )}
            {current.shares === 0 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>You buy</div>
                <div style={{ fontFamily: FD, fontSize: 20, color: SLATE }}>Nothing</div>
              </div>
            )}
          </div>

          {/* Running totals */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[
              { label: "Total invested", value: "$"+current.cumCost, color: TB },
              { label: "Shares owned", value: current.cumShares, color: TB },
              { label: "Avg cost/share", value: "$"+current.avg, color: GOLD },
            ].map(s => (
              <div key={s.label} style={{ background: SURF2, borderRadius: 7, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontFamily: FM, fontSize: 8, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: FD, fontSize: 18, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Avg cost bar vs price */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase" }}>Your avg cost</span>
              <span style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase" }}>Current price</span>
            </div>
            <div style={{ position: "relative", height: 28, background: SURF2, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: Math.round((current.avg / maxAvg) * 100)+"%", background: GOLD+"50", borderRadius: 6, transition: "width 0.5s ease" }} />
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: Math.round((current.price / maxAvg) * 100)+"%", background: RED+"30", borderRadius: 6, transition: "width 0.5s ease", borderRight: "2px solid "+RED }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: FM, fontSize: 10, color: TP }}>
                {isProfitable
                  ? "Price $"+current.price+" > Avg $"+current.avg+" → profitable"
                  : "Price $"+current.price+" < Avg $"+current.avg+" → still building"}
              </div>
            </div>
          </div>

          {/* Note */}
          <div style={{ background: isProfitable ? GREEN+"10" : AMBER+"10", border: "1px solid "+(isProfitable ? GREEN : AMBER)+"30", borderRadius: 7, padding: "10px 13px" }}>
            <Body style={{ margin: 0, fontSize: 13, color: isProfitable ? GREEN : TB }}>{current.note}</Body>
          </div>
        </div>

        {/* Step navigation */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn outline small onClick={() => setStep(s => Math.max(0, s-1))} disabled={step === 0} color={SLATE}>← Prev</Btn>
          {step < purchases.length - 1
            ? <Btn small onClick={() => setStep(s => s+1)} color={GOLD}>Next Step →</Btn>
            : <div style={{ fontFamily: FM, fontSize: 11, color: GREEN, padding: "8px 16px", border: "1px solid "+GREEN+"40", borderRadius: 8, background: GREEN+"10" }}>✓ Example complete</div>
          }
        </div>
      </Card>

      {/* The key insight */}
      <div style={{ background: SURF2, border: "1px solid "+GREEN+"40", borderRadius: 12, padding: "18px 20px", marginBottom: 8 }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>💡</div>
        <H2 style={{ color: GREEN, marginBottom: 8 }}>The insight</H2>
        <Body>
          When you bought at $80 and $70, those cheap shares <strong style={{ color: GREEN }}>pulled your average cost down</strong> — from $120 all the way to $85. So when the price recovered to $110, you were already sitting on a $25/share profit even though the price hadn't fully recovered to your original $120 entry.
        </Body>
        <Body style={{ margin: 0, fontStyle: "italic", color: GOLD }}>
          That's the power of buying the dips. Not market timing — just consistent buying when prices are lower than your average.
        </Body>
      </div>

      {/* What's coming */}
      <div style={{ background: "linear-gradient(135deg, "+GOLD+"12 0%, transparent 100%)", border: "1px solid "+BORDERHI, borderRadius: 14, padding: "20px 20px", marginBottom: 24 }}>
        <SL c={GOLD}>Up next — The Challenge</SL>
        <H2 style={{ color: TP, marginBottom: 10 }}>Now you'll play it out yourself</H2>
        <Body style={{ marginBottom: 12 }}>You already own 3 shares of Tesla at $120. You have $800 in total investing budget — but it doesn't all arrive at once.</Body>
        <div style={{ background: BG, border: "1px solid "+GOLD+"40", borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontFamily: FM, fontSize: 10, color: GOLD, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Your paycheck schedule</div>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { when: "Start", amount: "$200", note: "Your first investing allocation — available immediately" },
              { when: "After Week 2", amount: "+$300", note: "Paycheck arrives — deposited into your account" },
              { when: "After Week 4", amount: "+$300", note: "Paycheck arrives again — automatic, no matter what" },
            ].map(row => (
              <div key={row.when} style={{ display: "flex", alignItems: "center", gap: 12, background: SURF2, borderRadius: 7, padding: "10px 12px" }}>
                <div style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase", letterSpacing: "0.08em", width: 80, flexShrink: 0 }}>{row.when}</div>
                <div style={{ fontFamily: FD, fontSize: 18, color: GOLD, width: 60, flexShrink: 0 }}>{row.amount}</div>
                <div style={{ fontFamily: FB, fontSize: 13, color: TB }}>{row.note}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontFamily: FB, fontSize: 13, color: GREEN, fontStyle: "italic" }}>
            The paycheck arrives whether the market is up, down, or sideways. That's the whole point — consistent investing on a schedule removes emotion from the equation.
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { icon: "📰", label: "6 weeks", desc: "of real news & price movement" },
            { icon: "💰", label: "$800 total budget", desc: "arrives in 3 paycheck instalments" },
            { icon: "🎯", label: "One goal", desc: "get your avg cost below $120" },
          ].map(item => (
            <div key={item.label} style={{ background: BG, borderRadius: 8, padding: "12px 10px", textAlign: "center", border: "1px solid "+BORDER }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontFamily: FD, fontSize: 14, color: GOLD, marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1.4 }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, background: AMBER+"10", border: "1px solid "+AMBER+"30", borderRadius: 8, padding: "10px 14px" }}>
          <span style={{ fontFamily: FM, fontSize: 10, color: AMBER, textTransform: "uppercase", letterSpacing: "0.08em" }}>⚠ Strategy tip · </span>
          <span style={{ fontFamily: FB, fontSize: 13, color: TB }}>You start with $200. Another $300 arrives after Week 2, and $300 more after Week 4 — just like a paycheck. Blow your early cash and you may have nothing left when the biggest dip hits. That's not a warning — it's the lesson.</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
        <Btn outline onClick={onBack} small>← Back</Btn>
        <Btn onClick={onNext} style={{ fontSize: 14, padding: "13px 36px" }}>I'm Ready — Start the Game →</Btn>
      </div>
    </Page>
  );
};

const DCAScreen = ({ onNext, onBack }) => {
  const [phase, setPhase] = useState("game"); // game | results
  const [weekIdx, setWeekIdx] = useState(0);  // starts at week 1
  const [purchases, setPurchases] = useState([]); // { week, price, sharesBought, totalShares, totalInvested, avgCost, cashSpent }
  const [cash, setCash] = useState(STARTING_CASH);
  const [buyQty, setBuyQty] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [paycheckReceived, setPaycheckReceived] = useState(null); // amount of last paycheck
  const currentWeek = DCA_WEEKS[weekIdx];
  const lastPurchase = purchases[purchases.length - 1];
  const currentShares = lastPurchase ? lastPurchase.totalShares : STARTING_SHARES;
  const currentAvgCost = lastPurchase ? lastPurchase.avgCost : STARTING_PRICE;
  const currentTotalInvested = lastPurchase ? lastPurchase.totalInvested : STARTING_SHARES * STARTING_PRICE;
  const currentValue = currentWeek ? currentShares * currentWeek.price : currentShares * STARTING_PRICE;
  const isLastWeek = weekIdx === TOTAL_WEEKS - 1;
  const gameOver = weekIdx >= TOTAL_WEEKS;

  const maxBuyable = currentWeek ? Math.floor(cash / currentWeek.price) : 0;

  const handleBuy = () => {
    if (!currentWeek || confirmed) return;
    const spent = buyQty * currentWeek.price;
    const newShares = currentShares + buyQty;
    const newInvested = currentTotalInvested + spent;
    const newAvg = newInvested / newShares;
    const newCash = cash - spent;
    const prevAvg = currentAvgCost;

    setPurchases(prev => [...prev, {
      week: weekIdx + 1,
      price: currentWeek.price,
      sharesBought: buyQty,
      totalShares: newShares,
      totalInvested: newInvested,
      avgCost: newAvg,
      cashSpent: spent,
      prevAvg
    }]);
    setCash(newCash);
    setConfirmed(true);
  };

  const handleSkip = () => {
    if (confirmed) return;
    setPurchases(prev => [...prev, {
      week: weekIdx + 1,
      price: currentWeek.price,
      sharesBought: 0,
      totalShares: currentShares,
      totalInvested: currentTotalInvested,
      avgCost: currentAvgCost,
      cashSpent: 0,
      prevAvg: currentAvgCost
    }]);
    setConfirmed(true);
  };

  const handleNext = () => {
    const nextIdx = weekIdx + 1;
    setBuyQty(0);
    setConfirmed(false);
    setPaycheckReceived(null);
    if (nextIdx >= TOTAL_WEEKS) {
      setWeekIdx(TOTAL_WEEKS);
      setPhase("results");
    } else {
      // Check if a paycheck arrives when entering the next week
      const paycheck = PAYCHECK_WEEKS[nextIdx] || 0;
      if (paycheck > 0) {
        setCash(prev => prev + paycheck);
        setPaycheckReceived(paycheck);
      }
      setWeekIdx(nextIdx);
    }
  };

  const resetGame = () => {
    setPhase("game");
    setWeekIdx(0);
    setPurchases([]);
    setCash(STARTING_CASH);
    setBuyQty(0);
    setConfirmed(false);
    setPaycheckReceived(null);
  };
  if (phase === "results") {
    const finalPrice = DCA_WEEKS[TOTAL_WEEKS - 1].price;
    const userResult = {
      shares: currentShares,
      invested: currentTotalInvested,
      value: currentShares * finalPrice,
      avgCost: currentAvgCost,
      cashLeft: cash
    };
    const userGain = userResult.value - userResult.invested;
    const holdGain = holdResult.value - holdResult.invested;
    const perfectGain = perfectDCAResult.value - perfectDCAResult.invested;
    const beatHold = userGain > holdGain;
    const beatPerfect = userGain >= perfectGain * 0.9;

    return (
      <Page>
        <SL c={GOLD}>DCA Challenge Complete</SL>
        <H1>Your Results</H1>

        <div style={{ marginBottom: 20 }}>
          <DCAChart purchases={purchases} currentWeekIdx={TOTAL_WEEKS - 1} />
        </div>

        <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Your Result", avgCost: userResult.avgCost, value: userResult.value, gain: userGain, shares: userResult.shares, color: GOLD, highlight: true },
            { label: "If You'd Just Held (no extra buys)", avgCost: holdResult.avgCost, value: holdResult.value, gain: holdGain, shares: holdResult.shares, color: SLATE, highlight: false },
            { label: "Perfect DCA ($800 split evenly across all weeks)", avgCost: perfectDCAResult.avgCost, value: perfectDCAResult.value, gain: perfectGain, shares: perfectDCAResult.shares, color: GREEN, highlight: false },
          ].map(r => (
            <div key={r.label} style={{ background: r.highlight ? "linear-gradient(135deg, "+GOLD+"10 0%, transparent 100%)" : SURF2, border: "1.5px solid "+r.highlight ? GOLD+"60" : BORDER, borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontFamily: FM, fontSize: 9, color: r.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{r.label}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                {[
                  { l: "Avg Cost", v: "$"+r.avgCost.toFixed(2) },
                  { l: "Shares", v: r.shares.toFixed(2) },
                  { l: "Final Value", v: "$"+Math.round(r.value) },
                  { l: "Gain/Loss", v: (r.gain >= 0 ? "+" : "")+r.gain.toFixed(0), c: r.gain >= 0 ? GREEN : RED },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{s.l}</div>
                    <div style={{ fontFamily: FD, fontSize: 16, color: s.c || TP }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: beatHold ? "linear-gradient(135deg, "+GREEN+"15 0%, transparent 100%)" : "linear-gradient(135deg, "+AMBER+"10 0%, transparent 100%)", border: "1px solid "+beatHold ? GREEN+"40" : AMBER+"40", borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>{beatHold ? "🏆" : "📚"}</div>
          <H2 style={{ color: beatHold ? GREEN : AMBER }}>{beatHold ? "You beat the hold strategy!" : "The hold strategy edged you out"}</H2>
          <Body>
            {beatHold
              ? "By buying during the dips, you accumulated more shares at a lower average cost. When Tesla rallied to $134, your lower avg cost meant every share had more profit baked in."
              : "Buying early or unevenly meant you didn't benefit as much from the week 4 crash. The lesson: in DCA, the dips are your best friend — save cash for them."}
          </Body>
          {cash > 0 && (
            <Body style={{ color: AMBER, margin: 0 }}>
              You had ${cash.toFixed(0)} of your $800 total budget left undeployed. Unused cash doesn't grow — deploying it consistently during dips is exactly what DCA is designed for.
            </Body>
          )}
        </div>

        <Card gold style={{ marginBottom: 24 }}>
          <SL>The key insight</SL>
          <H2 style={{ color: GOLD }}>What DCA actually does to your average</H2>
          <Body>
            Every time the price dropped below your average cost, new shares acted like an anchor pulling it down. The more you bought during weeks 2 and 4, the lower your average cost fell — and the more profitable every single share became when $134 arrived.
          </Body>
          <Body style={{ margin: 0 }}>
            In real life, you do this automatically — same amount, every month, regardless of price. No decisions. No panic. No timing. Just accumulation.
          </Body>
        </Card>

        <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
          <Btn outline small onClick={resetGame} color={SLATE}>↺ Play Again</Btn>
          <Btn onClick={onNext}>Take the Quiz →</Btn>
        </div>
      </Page>
    );
  }
  const weekNumber = weekIdx + 1;
  const priceDiff = currentWeek ? currentWeek.price - STARTING_PRICE : 0;
  const priceVsAvg = currentWeek ? currentWeek.price - currentAvgCost : 0;
  const affordableShares = maxBuyable;

  if (!currentWeek) return null;

  return (
    <Page>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <SL c={GOLD}>DCA Challenge · Week {weekNumber} of {TOTAL_WEEKS}</SL>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            {DCA_WEEKS.map((_, i) => (
              <div key={i} style={{ width: 28, height: 5, borderRadius: 3, background: i < weekIdx ? GREEN : i === weekIdx ? GOLD : SURF2, transition: "background 0.3s" }} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase", letterSpacing: "0.08em" }}>Cash Available</div>
          <div style={{ fontFamily: FD, fontSize: 22, color: cash > 100 ? GREEN : cash > 0 ? AMBER : RED }}>${cash.toFixed(0)}</div>
          {PAYCHECK_WEEKS[weekIdx] && (
            <div style={{ fontFamily: FM, fontSize: 9, color: GOLD, marginTop: 2 }}>💰 +${PAYCHECK_WEEKS[weekIdx]} paycheck next week</div>
          )}
        </div>
      </div>

      {/* Chart — always visible */}
      <DCAChart purchases={purchases} currentWeekIdx={weekIdx} />

      {/* Paycheck notification */}
      {paycheckReceived && (
        <div style={{ background: "linear-gradient(135deg, "+GOLD+"20 0%, "+GREEN+"10 100%)", border: "1px solid "+GOLD+"60", borderRadius: 10, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>💰</div>
          <div>
            <div style={{ fontFamily: FD, fontSize: 16, color: GOLD, marginBottom: 3 }}>Paycheck arrived — +${paycheckReceived} added</div>
            <Body style={{ margin: 0, fontSize: 13 }}>
              Just like in real life, your investing allocation landed automatically — whether the market is up or down. This is exactly how disciplined investors build wealth: the money moves on schedule, not on emotion.
            </Body>
          </div>
        </div>
      )}

      {/* Current price vs avg cost callout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "12px 0" }}>
        <div style={{ background: SURF2, border: "1px solid "+RED+"40", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
          <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Tesla Price</div>
          <div style={{ fontFamily: FD, fontSize: 22, color: RED }}>${currentWeek.price}</div>
          <div style={{ fontFamily: FM, fontSize: 9, color: priceDiff <= 0 ? GREEN : RED, marginTop: 2 }}>
            {priceDiff <= 0 ? "↓" : "↑"} ${Math.abs(priceDiff)} vs $120
          </div>
        </div>
        <div style={{ background: SURF2, border: "1px solid "+GOLD+"40", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
          <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Your Avg Cost</div>
          <div style={{ fontFamily: FD, fontSize: 22, color: GOLD }}>${currentAvgCost.toFixed(2)}</div>
          <div style={{ fontFamily: FM, fontSize: 9, color: priceVsAvg < 0 ? GREEN : AMBER, marginTop: 2 }}>
            {priceVsAvg < 0 ? "↓ below avg — BUY opportunity" : "↑ above avg — still profitable"}
          </div>
        </div>
        <div style={{ background: SURF2, border: "1px solid "+BORDER, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
          <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Your Shares</div>
          <div style={{ fontFamily: FD, fontSize: 22, color: TP }}>{currentShares.toFixed(2)}</div>
          <div style={{ fontFamily: FM, fontSize: 9, color: TM, marginTop: 2 }}>worth ${(currentShares * currentWeek.price).toFixed(0)}</div>
        </div>
      </div>

      {/* News headline */}
      <div style={{ background: SURF, border: "1px solid "+currentWeek.mood === "crash" ? RED+"50" : currentWeek.mood === "rally" ? GREEN+"50" : BORDER, borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
        <div style={{ fontFamily: FM, fontSize: 10, color: TM, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Week {weekNumber} News</div>
        <div style={{ fontFamily: FD, fontSize: 17, color: TP, marginBottom: 6 }}>{currentWeek.headline}</div>
        <Body style={{ margin: "0 0 10px", fontSize: 14 }}>{currentWeek.news}</Body>
        <div style={{ background: priceVsAvg < 0 ? GREEN+"12" : AMBER+"12", border: "1px solid "+priceVsAvg < 0 ? GREEN+"40" : AMBER+"40", borderRadius: 7, padding: "8px 12px" }}>
          <span style={{ fontFamily: FM, fontSize: 10, color: priceVsAvg < 0 ? GREEN : AMBER, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {priceVsAvg < 0 ? "💡 DCA moment · " : "📊 Note · "}
          </span>
          <span style={{ fontFamily: FB, fontSize: 13, color: TB }}>{currentWeek.insight}</span>
        </div>
      </div>

      {/* Buy controls */}
      {!confirmed ? (
        <Card gold>
          <SL>Your decision</SL>
          <H2>How many shares do you buy this week?</H2>

          {cash <= 0 ? (
            <div style={{ background: RED+"10", border: "1px solid "+RED+"40", borderRadius: 8, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontFamily: FD, fontSize: 15, color: RED, marginBottom: 6 }}>💸 No cash available this week</div>
              <Body style={{ margin: 0, fontSize: 13 }}>
                You've deployed your current allocation. This is one of the most important DCA lessons — spending everything early leaves you unable to buy when prices are lowest.
                {PAYCHECK_WEEKS[weekIdx] ? " Your next paycheck of $"+PAYCHECK_WEEKS[weekIdx]+" arrives next week." : ""}
              </Body>
            </div>
          ) : (
            <Body style={{ fontSize: 14 }}>Price: <strong style={{ color: RED }}>${currentWeek.price}/share</strong> · You can afford up to <strong style={{ color: GREEN }}>{affordableShares} shares</strong> · Cash: <strong style={{ color: GOLD }}>${cash.toFixed(0)}</strong></Body>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {[0, 1, 2, 3, 4, 5].filter(n => n <= affordableShares).map(n => (
              <button key={n} onClick={() => setBuyQty(n)} style={{
                padding: "10px 16px", borderRadius: 8, cursor: "pointer",
                background: buyQty === n ? (n === 0 ? SLATE+"30" : GOLD+"25") : BG,
                border: "1.5px solid "+buyQty === n ? (n === 0 ? SLATE : GOLD) : BORDER,
                color: buyQty === n ? TP : TB, fontFamily: FM, fontSize: 13, fontWeight: 600,
                transition: "all 0.15s"
              }}>{n === 0 ? "Skip" : n + " share" + (n > 1 ? "s" : "")}</button>
            ))}
            {affordableShares > 5 && (
              <button onClick={() => setBuyQty(affordableShares)} style={{
                padding: "10px 16px", borderRadius: 8, cursor: "pointer",
                background: buyQty === affordableShares ? GOLD+"25" : BG,
                border: "1.5px solid "+buyQty === affordableShares ? GOLD : BORDER,
                color: buyQty === affordableShares ? TP : TB, fontFamily: FM, fontSize: 13, fontWeight: 600
              }}>All In ({affordableShares})</button>
            )}
          </div>

          {buyQty > 0 && (
            <div style={{ background: BG, borderRadius: 8, padding: "12px 14px", marginBottom: 14, border: "1px solid "+BORDER }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div>
                  <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>You'll spend</div>
                  <div style={{ fontFamily: FD, fontSize: 16, color: TP }}>${(buyQty * currentWeek.price).toFixed(0)}</div>
                </div>
                <div>
                  <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>New avg cost</div>
                  <div style={{ fontFamily: FD, fontSize: 16, color: GOLD }}>
                    ${((currentTotalInvested + buyQty * currentWeek.price) / (currentShares + buyQty)).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Cash remaining</div>
                  <div style={{ fontFamily: FD, fontSize: 16, color: cash - buyQty * currentWeek.price > 0 ? GREEN : RED }}>
                    ${(cash - buyQty * currentWeek.price).toFixed(0)}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 8, fontFamily: FM, fontSize: 10, color: priceVsAvg < 0 ? GREEN : AMBER }}>
                {currentWeek.price < currentAvgCost
                  ? "↓ Buying below your avg — this will pull your average cost down"
                  : "↑ Buying above your avg — your average will rise slightly"}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={handleSkip} outline small color={SLATE} style={{ flex: 1 }}>Skip Week</Btn>
            <Btn onClick={handleBuy} disabled={buyQty === 0} style={{ flex: 2 }}>
              {buyQty === 0 ? "Select shares above" : "Confirm Purchase →"}
            </Btn>
          </div>
        </Card>
      ) : (
        <div>
          {/* Purchase confirmed feedback */}
          <div style={{ background: lastPurchase && lastPurchase.sharesBought > 0 ? "linear-gradient(135deg, "+GREEN+"12 0%, transparent 100%)" : SURF2, border: "1px solid "+lastPurchase && lastPurchase.sharesBought > 0 ? GREEN+"40" : BORDER, borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
            {lastPurchase && lastPurchase.sharesBought > 0 ? (
              <>
                <div style={{ fontFamily: FD, fontSize: 16, color: GREEN, marginBottom: 8 }}>
                  ✓ Purchased {lastPurchase.sharesBought} share{lastPurchase.sharesBought > 1 ? "s" : ""} at ${currentWeek.price}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Previous avg cost</div>
                    <div style={{ fontFamily: FD, fontSize: 16, color: TB }}>${lastPurchase.prevAvg.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: FM, fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>New avg cost</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ fontFamily: FD, fontSize: 18, color: GOLD }}>${lastPurchase.avgCost.toFixed(2)}</div>
                      <div style={{ fontFamily: FM, fontSize: 10, color: lastPurchase.avgCost < lastPurchase.prevAvg ? GREEN : RED }}>
                        {lastPurchase.avgCost < lastPurchase.prevAvg
                          ? "↓ $"+(lastPurchase.prevAvg - lastPurchase.avgCost).toFixed(2)+" cheaper"
                          : "↑ $"+(lastPurchase.avgCost - lastPurchase.prevAvg).toFixed(2)+" higher"}
                      </div>
                    </div>
                  </div>
                </div>
                <Body style={{ margin: "10px 0 0", fontSize: 13, color: TB }}>
                  {lastPurchase.avgCost < lastPurchase.prevAvg
                    ? "Those cheap shares are working — your average cost is falling. The lower it gets, the more you profit when this stock recovers."
                    : "You bought above your average, so it nudged up. But you're still accumulating shares — and your position is growing."}
                </Body>
              </>
            ) : (
              <>
                <div style={{ fontFamily: FD, fontSize: 16, color: SLATE, marginBottom: 6 }}>Week skipped — no purchase made</div>
                <Body style={{ margin: 0, fontSize: 13 }}>
                  {currentWeek.mood === "crash" || currentWeek.mood === "dip"
                    ? "Careful — this was a dip week. Skipping means you missed a chance to pull your average cost down. Watch what happens next week."
                    : "Saving cash for the right moment can be smart — just make sure you deploy it before the game ends."}
                </Body>
              </>
            )}
          </div>

          <div style={{ textAlign: "center" }}>
            <Btn onClick={handleNext}>
              {isLastWeek ? "See My Final Results →" : "Next Week →"}
            </Btn>
          </div>
        </div>
      )}
    </Page>
  );
};

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
      fontFamily: FB, fontSize: 15, lineHeight: 1.5, transition: "all 0.2s"
    }}>
      <span style={{ fontFamily: FM, fontSize: 11, color: isSelected && !submitted ? GOLD : TM, marginRight: 10 }}>
        {String.fromCharCode(65+i)}.
      </span>
      {opt}
    </button>
  );
};
const QuizScreen = ({ onNext }) => {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const q = QUIZ[qIdx];
  const isCorrect = selected === q.correct;
  const isLast = qIdx === QUIZ.length - 1;

  const submit = () => { if (submitted) return; setSubmitted(true); if (isCorrect) setScore(s => s+1); };
  const next = () => {
    if (isLast) { onNext(score + (isCorrect ? 1 : 0)); return; }
    setQIdx(i => i+1); setSelected(null); setSubmitted(false);
  };

  return (
    <Page>
      <SL c={TM}>Knowledge Check</SL>
      <H1>Quiz</H1>

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

      {!submitted && (
        <div style={{ textAlign: "center" }}>
          <Btn onClick={submit} disabled={selected === null}>Submit Answer</Btn>
        </div>
      )}

      {submitted && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={{
            background: isCorrect ? GREEN+"15" : AMBER+"15",
            border: "1px solid "+isCorrect ? GREEN : AMBER+"40",
            borderRadius: 12, padding: "18px 20px", marginBottom: 20
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20 }}>{isCorrect ? "✅" : "💡"}</span>
              <div>
                <div style={{ fontFamily: FD, fontSize: 16, color: isCorrect ? GREEN : AMBER, marginBottom: 6 }}>
                  {isCorrect ? "That's exactly right." : "Not quite — here's the nuance:"}
                </div>
                <Body style={{ margin: 0, fontSize: 14 }}>{q.explanation}</Body>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <Btn onClick={next}>{isLast ? "See My Results →" : "Next Question →"}</Btn>
          </div>
        </div>
      )}
    </Page>
  );
};
const ResultsScreen = ({ score, onRestart }) => {
  const pct = Math.round((score / QUIZ.length) * 100);
  const grade = pct >= 80 ? { label: "Outstanding", color: GREEN, emoji: "🏆" }
    : pct >= 60 ? { label: "Solid Foundation", color: GOLD, emoji: "⭐" }
    : { label: "Keep Building", color: AMBER, emoji: "📚" };

  return (
    <Page>
      <div style={{ textAlign: "center", padding: "20px 0 32px" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{grade.emoji}</div>
        <SL c={TM}>Module 5 Complete</SL>
        <H1>Real-World Investing</H1>
        <div style={{ fontFamily: FD, fontSize: 48, color: grade.color, margin: "8px 0" }}>{score}/{QUIZ.length}</div>
        <div style={{ fontFamily: FM, fontSize: 12, color: grade.color, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 24 }}>{grade.label}</div>
      </div>

      <Card gold style={{ marginBottom: 20 }}>
        <SL>Your key takeaways</SL>
        <H2 style={{ color: GOLD, marginBottom: 16 }}>What to remember from this module</H2>
        {[
          { emoji: "🏦", point: "Open a brokerage account. Fidelity or Schwab for beginners, Roth IRA if you have earned income." },
          { emoji: "💸", point: "Fees compound against you. A 1% annual fee can cost you 50%+ of your final wealth over 30 years. Always check the expense ratio." },
          { emoji: "⏳", point: "Your time horizon determines your risk tolerance. More time = more stocks. Less time = more bonds and cash." },
          { emoji: "🎯", point: "Dollar-cost averaging is your first real strategy. Fixed amount, regular schedule, never stop during dips — that's when it works best." },
          { emoji: "📊", point: "When you buy below your average cost, those shares pull your average down. That's DCA's hidden superpower." },
        ].map(item => (
          <div key={item.emoji} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{item.emoji}</span>
            <Body style={{ margin: 0, fontSize: 14 }}>{item.point}</Body>
          </div>
        ))}
      </Card>

      <div style={{ background: SURF2, border: "1px solid "+PURPLE+"40", borderRadius: 12, padding: "20px 22px", marginBottom: 28, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🧠</div>
        <SL c={PURPLE}>Coming up in Module 6</SL>
        <H2 style={{ color: TP }}>Making Decisions</H2>
        <Body style={{ maxWidth: 460, margin: "0 auto" }}>
          You know how markets work. You have a strategy. Now learn how to read a company, interpret the news, spot common beginner traps, and know exactly when (and when not) to sell.
        </Body>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Btn outline onClick={onRestart} small color={SLATE}>↺ Review Module</Btn>
        <Btn color={PURPLE} onClick={() => {}}>Module 6 →</Btn>
      </div>

      <div style={{ textAlign: "center", marginTop: 32, paddingTop: 24, borderTop: "1px solid "+BORDER }}>
        <Body style={{ fontSize: 12, color: TM, fontStyle: "italic" }}>
          For educational purposes only — past market performance does not guarantee future results. This is not financial advice.
        </Body>
      </div>
    </Page>
  );
};
export default function Module5() {
  const [screen, setScreen] = useState("opening");
  const [quizScore, setQuizScore] = useState(0);
  const go = s => { setScreen(s); window.scrollTo(0, 0); };

  if (screen === "opening") return <OpeningScreen onNext={() => go("brokerage")} />;
  if (screen === "brokerage") return <BrokerageScreen onNext={() => go("fees")} onBack={() => go("opening")} />;
  if (screen === "fees") return <FeesScreen onNext={() => go("horizon")} onBack={() => go("brokerage")} />;
  if (screen === "horizon") return <TimeHorizonScreen onNext={() => go("dcaexplain")} onBack={() => go("fees")} />;
  if (screen === "dcaexplain") return <DCAExplainScreen onNext={() => go("dca")} onBack={() => go("horizon")} />;
  if (screen === "dca") return <DCAScreen onNext={() => go("quiz")} onBack={() => go("dcaexplain")} />;
  if (screen === "quiz") return <QuizScreen onNext={s => { setQuizScore(s); go("results"); }} />;
  if (screen === "results") return <ResultsScreen score={quizScore} onRestart={() => go("opening")} />;
  return null;
}

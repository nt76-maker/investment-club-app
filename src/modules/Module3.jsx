import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { ChevronRight, TrendingUp, Clock, CheckCircle, RotateCcw } from "lucide-react";

const GOLD="#D4A017", AMBER="#D97706", SLATE="#94A3B8", GREEN="#22C55E", RED="#EF4444";
const BG="#000", SURF="#0D0D0D", SURF2="#141414", BORDER="rgba(212,160,23,0.15)", BORDERHI="rgba(212,160,23,0.4)";
const TP="#F5F0E8", TB="#C8C0B0", TM="#7A7060", TD="#4A4438";
const FD="'Playfair Display','Georgia',serif", FB="'Georgia','Times New Roman',serif", FM="'Courier New',monospace";

const VOCAB = {
  stock_exchange: { term:"Stock Exchange",   def:"A marketplace where buyers and sellers trade shares of publicly listed companies." },
  liquidity:      { term:"Liquidity",        def:"How quickly you can convert an investment to cash without losing value." },
  bull_market:    { term:"Bull Market",      def:"Prices rise 20%+ from recent lows. Named for the bull's upward thrust." },
  bear_market:    { term:"Bear Market",      def:"Prices fall 20%+ from recent highs. Named for the bear's downward swipe." },
  correction:     { term:"Correction",       def:"A decline of 10-20% from recent highs. Less severe than a bear market, far more common." },
  sp500:          { term:"S&P 500",          def:"An index tracking 500 of the largest US companies. The most widely used market benchmark." },
  dow:            { term:"Dow Jones",        def:"An index of 30 large, well-known US companies. The oldest major index, dating to 1896." },
  nasdaq:         { term:"Nasdaq",           def:"An index heavily weighted toward technology companies including Apple, Microsoft, and Amazon." },
  benchmark:      { term:"Benchmark",        def:"A standard against which investment performance is measured." },
  sentiment:      { term:"Market Sentiment", def:"The overall mood of investors — optimistic (bullish) or pessimistic (bearish)." },
  expectations:   { term:"Expectations",     def:"What the market has already priced in. Stocks move on the gap between results and expectations." },
  crash:          { term:"Market Crash",     def:"A sudden, severe drop — typically 20%+ in a short period, driven by panic selling." },
};

const VT = ({ id, children }) => {
  const [show, setShow] = useState(false);
  const v = VOCAB[id];
  if (!v) return <span>{children}</span>;
  return (
    <span style={{ position:"relative", display:"inline" }}>
      <span
        onMouseEnter={()=>setShow(true)}
        onMouseLeave={()=>setShow(false)}
        style={{ fontWeight:700, borderBottom:"2px solid "+GOLD, color:GOLD, cursor:"help" }}
      >{children}</span>
      {show && (
        <span style={{ position:"absolute", bottom:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)", background:"#1A1400", border:"1px solid "+GOLD, borderRadius:"8px", padding:"10px 14px", width:"220px", zIndex:999, boxShadow:"0 8px 32px rgba(0,0,0,0.8)", pointerEvents:"none", display:"block" }}>
          <span style={{ display:"block", color:GOLD, fontWeight:700, fontSize:"10px", marginBottom:"5px", letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:FM }}>{v.term}</span>
          <span style={{ color:TB, fontSize:"12px", lineHeight:"1.6", fontFamily:FB }}>{v.def}</span>
        </span>
      )}
    </span>
  );
};

const Card = ({ children, style={}, gold=false, amber=false, green=false, red=false }) => {
  const bg = gold?"rgba(212,160,23,0.08)":amber?"rgba(217,119,6,0.1)":green?"rgba(34,197,94,0.08)":red?"rgba(239,68,68,0.08)":SURF;
  const br = gold?BORDERHI:amber?"rgba(217,119,6,0.25)":green?"rgba(34,197,94,0.25)":red?"rgba(239,68,68,0.25)":BORDER;
  return <div style={{ background:bg, border:"1px solid "+br, borderRadius:"14px", padding:"24px", marginBottom:"20px", ...style }}>{children}</div>;
};

const SL = ({ children }) => <div style={{ color:GOLD, fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase", fontFamily:FM, marginBottom:"12px" }}>{children}</div>;
const H1 = ({ children, style={} }) => <h1 style={{ fontFamily:FD, fontSize:"clamp(24px,5vw,40px)", fontWeight:700, color:TP, lineHeight:1.15, marginBottom:"18px", ...style }}>{children}</h1>;
const H2 = ({ children, style={} }) => <h2 style={{ fontFamily:FD, fontSize:"clamp(16px,3vw,22px)", fontWeight:700, color:TP, lineHeight:1.2, marginBottom:"12px", ...style }}>{children}</h2>;
const Body = ({ children, style={} }) => <p style={{ fontFamily:FB, fontSize:"15px", lineHeight:1.85, color:TB, marginBottom:"16px", ...style }}>{children}</p>;
const Lead = ({ children }) => <p style={{ fontFamily:FB, fontSize:"17px", lineHeight:1.75, color:TB, marginBottom:"28px" }}>{children}</p>;
const Btn = ({ children, onClick, outline=false, small=false, style={} }) => (
  <button onClick={onClick} style={{ background:outline?"transparent":GOLD, color:outline?GOLD:"#000", border:"1px solid "+GOLD, borderRadius:"8px", padding:small?"7px 14px":outline?"10px 20px":"12px 24px", fontSize:small?"12px":"14px", fontWeight:700, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"7px", fontFamily:FB, ...style }}>{children}</button>
);
const Page = ({ children }) => <div style={{ maxWidth:"780px", margin:"0 auto", padding:"32px 20px 80px" }}>{children}</div>;

const ReadingGate = ({ onReady, label="Continue" }) => {
  const [ready, setReady] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setReady(true),5000); return ()=>clearTimeout(t); },[]);
  return (
    <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"28px" }}>
      {ready
        ? <Btn onClick={onReady}>{label} <ChevronRight size={14}/></Btn>
        : <div style={{ color:TD, fontSize:"12px", display:"flex", alignItems:"center", gap:"7px", fontFamily:FM }}><Clock size={12}/> reading...</div>
      }
    </div>
  );
};

const CQ = ({ name, emoji, color, children }) => (
  <div style={{ background:SURF, border:"1px solid "+BORDER, borderRadius:"10px", padding:"14px 16px", display:"flex", gap:"10px", marginBottom:"8px" }}>
    <div style={{ fontSize:"20px" }}>{emoji}</div>
    <div>
      <div style={{ color, fontFamily:FD, fontWeight:700, fontSize:"13px", marginBottom:"5px" }}>{name}</div>
      <Body style={{ fontStyle:"italic", margin:0, fontSize:"13px" }}>{children}</Body>
    </div>
  </div>
);

const OBtn = ({ opt, chosen, correct, revealed, onClick }) => {
  const ic = chosen===opt.id;
  const ir = opt.id===correct;
  const bg = revealed ? (ir?"rgba(212,160,23,0.12)":ic?"rgba(217,119,6,0.1)":SURF) : (ic?"rgba(212,160,23,0.1)":SURF);
  const bd = revealed ? (ir?BORDERHI:ic?"rgba(217,119,6,0.4)":BORDER) : (ic?BORDERHI:BORDER);
  return (
    <button onClick={onClick} style={{ width:"100%", background:bg, border:"1px solid "+bd, borderRadius:"10px", padding:"14px 16px", textAlign:"left", color:TB, fontSize:"14px", cursor:revealed?"default":"pointer", display:"flex", alignItems:"flex-start", gap:"10px", marginBottom:"8px", fontFamily:FB, lineHeight:1.6 }}>
      <span style={{ width:"24px", height:"24px", borderRadius:"50%", flexShrink:0, marginTop:"1px", background:revealed&&ir?GOLD:ic?"rgba(212,160,23,0.18)":SURF2, border:"1px solid "+(ic||(revealed&&ir)?GOLD:BORDER), display:"flex", alignItems:"center", justifyContent:"center", color:revealed&&ir?"#000":TB, fontSize:"11px", fontWeight:700, fontFamily:FM }}>
        {revealed && ir ? <CheckCircle size={12}/> : opt.id.toUpperCase()}
      </span>
      {opt.label}
    </button>
  );
};

const MiniChart = ({ data, color, height=140, refLabel=null }) => {
  const W=600, pad=24;
  const H=height;
  const vals = data.map(d=>d.v);
  const mn=Math.min(...vals), mx=Math.max(...vals), rng=mx-mn||1;
  const px = i => pad + (i/(data.length-1))*(W-pad*2);
  const py = v => pad + ((mx-v)/rng)*(H-pad*2);
  const pts = data.map((_,i) => px(i)+","+py(data[i].v)).join(" ");
  const areaClose = " "+px(data.length-1)+","+(H-pad)+" "+px(0)+","+(H-pad);
  const c = color||GOLD;
  const gradId = "grad"+c.replace(/[^a-zA-Z0-9]/g,"");
  const refIdx = refLabel ? data.findIndex(d=>d.label===refLabel) : -1;
  return (
    <div style={{ width:"100%", overflow:"hidden" }}>
      <svg viewBox={"0 0 "+W+" "+H} style={{ width:"100%", height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={c} stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        <polygon points={pts+areaClose} fill={"url(#"+gradId+")"}/>
        <polyline points={pts} fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/>
        {data.map((d,i) => (
          <circle key={i} cx={px(i)} cy={py(d.v)} r={d.dot?5:0} fill={d.dotColor||RED} stroke="none"/>
        ))}
        {refIdx>=0 && (
          <line x1={px(refIdx)} y1={pad} x2={px(refIdx)} y2={H-pad} stroke={RED} strokeWidth="1.5" strokeDasharray="4 3"/>
        )}
        <text x={px(0)} y={H-4} textAnchor="middle" fill={TD} fontSize="9" fontFamily={FM}>{data[0].label}</text>
        <text x={px(data.length-1)} y={H-4} textAnchor="middle" fill={TD} fontSize="9" fontFamily={FM}>{data[data.length-1].label}</text>
        {refIdx>=0 && refIdx!==0 && refIdx!==data.length-1 && (
          <text x={px(refIdx)} y={H-4} textAnchor="middle" fill={RED} fontSize="9" fontFamily={FM}>{refLabel}</text>
        )}
      </svg>
    </div>
  );
};

// OPENING
const Opening = ({ onBegin }) => {
  const [phase, setPhase] = useState(0);
  useEffect(()=>{
    if (phase<5) {
      const delay = phase===0 ? 600 : 2000;
      const t = setTimeout(()=>setPhase(p=>p+1), delay);
      return ()=>clearTimeout(t);
    }
  },[phase]);
  const tickers = ["AAPL +2.4%","MSFT +1.1%","TSLA -3.2%","AMZN +0.8%","NVDA +4.1%","META -1.7%","GOOG +0.3%","JPM -0.9%","NFLX +2.8%"];
  return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center", backgroundImage:"radial-gradient(ellipse at 50% 0%, rgba(212,160,23,0.05) 0%, transparent 65%)", position:"relative", overflow:"hidden" }}>
      {phase>0 && (
        <div style={{ position:"absolute", top:0, left:0, right:0, background:SURF, borderBottom:"1px solid "+BORDER, padding:"7px 16px", display:"flex", gap:"24px", overflow:"hidden" }}>
          {tickers.map((t,i)=>(
            <span key={i} style={{ fontFamily:FM, fontSize:"11px", color:t.includes("+")?GREEN:RED, letterSpacing:"0.06em", flexShrink:0 }}>{t}</span>
          ))}
        </div>
      )}
      <div style={{ opacity:phase>0?1:0, transition:"opacity 1s", fontFamily:FM, fontSize:"10px", letterSpacing:"0.2em", color:TM, textTransform:"uppercase", marginBottom:"36px", marginTop:"20px" }}>
        Investment Club - Module 3
      </div>
      <div style={{ maxWidth:"640px" }}>
        <div style={{ opacity:phase>1?1:0, transform:phase>1?"translateY(0)":"translateY(14px)", transition:"opacity 0.9s, transform 0.9s", fontFamily:FD, fontSize:"clamp(15px,2vw,18px)", color:TB, lineHeight:1.8, marginBottom:"22px" }}>
          Watch any movie depicting the stock exchange and you will see the same scene. A vast trading floor. People clutching fists of paper, shouting over each other, faces twisted in anguish or ecstasy as numbers scroll past on the ticker circling the walls.
        </div>
        <div style={{ opacity:phase>2?1:0, transform:phase>2?"translateY(0)":"translateY(14px)", transition:"opacity 0.9s, transform 0.9s", fontFamily:FD, fontSize:"clamp(18px,3vw,26px)", fontStyle:"italic", color:TP, lineHeight:1.5, marginBottom:"22px" }}>
          It looks like a madhouse where the inmates are running the asylum.
        </div>
        <div style={{ opacity:phase>3?1:0, transform:phase>3?"translateY(0)":"translateY(14px)", transition:"opacity 0.9s, transform 0.9s", fontFamily:FB, fontSize:"clamp(14px,2vw,17px)", color:TB, lineHeight:1.8, marginBottom:"22px" }}>
          Those trading floors were real. The emotion was real. And for anyone unfamiliar with markets, that image captures exactly how investing feels — loud, frantic, and completely incomprehensible.
        </div>
        {phase>3 && (
          <div>
            <div style={{ width:"1px", height:"40px", background:"linear-gradient(to bottom,"+GOLD+",transparent)", margin:"0 auto 22px" }}/>
            <p style={{ fontFamily:FB, fontSize:"clamp(14px,2vw,17px)", color:TB, lineHeight:1.8, marginBottom:"16px" }}>
              But here is what that image never shows you: underneath all of it, every single price movement was following the exact same rule. Not chaos.
            </p>
            <div style={{ fontFamily:FD, fontSize:"clamp(22px,4vw,36px)", color:GOLD, fontStyle:"italic", marginBottom:"12px" }}>A symphony.</div>
            <p style={{ fontFamily:FB, fontSize:"clamp(14px,2vw,17px)", color:TM, lineHeight:1.8, marginBottom:"40px" }}>
              Millions of individual decisions resolving, in real time, into a single number everyone agrees on. That rule is supply and demand — and once you understand it, the madhouse disappears and the music starts to make sense.
            </p>
            <Btn onClick={onBegin} style={{ fontSize:"15px", padding:"13px 30px" }}>Show me the principle <ChevronRight size={15}/></Btn>
          </div>
        )}
      </div>
    </div>
  );
};

// S1
const S1 = ({ onNext }) => (
  <Page>
    <SL>Section 1 of 7</SL>
    <H1>What Is a Stock Market, Actually?</H1>
    <Lead>Not a building. Not a computer. Not a casino. A market is simply an agreement between buyers and sellers to exchange ownership. That is all it has ever been.</Lead>
    <Card>
      <div style={{ display:"flex", gap:"12px" }}>
        <div style={{ fontSize:"26px", flexShrink:0 }}>🚢</div>
        <div>
          <H2>Amsterdam, 1602 — again</H2>
          <Body>You already know this story from Module 2. The Dutch East India Company sold shares to the public. But once those shares existed, people needed somewhere to resell them. So merchants gathered at a bridge in Amsterdam to trade.</Body>
          <Body style={{ marginBottom:0 }}>That gathering became the Amsterdam Stock Exchange — the world's first — opened in 1611. Every <VT id="stock_exchange">stock exchange</VT> in the world today is a descendant of that bridge.</Body>
        </div>
      </div>
    </Card>
    <Card gold>
      <H2 style={{ fontSize:"18px" }}>The market is not a casino</H2>
      <Body>A casino is designed so the house always wins. Every game has built-in odds against the player.</Body>
      <Body style={{ marginBottom:0 }}>A stock market is different. When a buyer and seller trade, <strong style={{ color:TP }}>both believe they are getting a fair deal</strong> — otherwise neither would trade. The buyer thinks the stock is worth more than the price. The seller thinks the price is fair or better. Both can benefit. That is not a casino. That is one of the most efficient mechanisms humans have ever invented for determining what things are worth.</Body>
    </Card>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"10px", marginBottom:"20px" }}>
      {[{icon:"🏛️",label:"NYSE",sub:"Founded 1792"},{icon:"💻",label:"Nasdaq",sub:"Founded 1971"},{icon:"🌏",label:"Tokyo TSE",sub:"Founded 1878"},{icon:"🇬🇧",label:"London LSE",sub:"Founded 1801"}].map(e=>(
        <div key={e.label} style={{ background:SURF, border:"1px solid "+BORDER, borderRadius:"10px", padding:"14px", textAlign:"center" }}>
          <div style={{ fontSize:"22px", marginBottom:"6px" }}>{e.icon}</div>
          <div style={{ fontFamily:FD, fontWeight:700, color:TP, fontSize:"14px" }}>{e.label}</div>
          <div style={{ fontFamily:FM, fontSize:"10px", color:TM, marginTop:"3px" }}>{e.sub}</div>
        </div>
      ))}
    </div>
    <Body style={{ color:TM, fontSize:"13px" }}><VT id="liquidity">Liquidity</VT> is what makes exchanges powerful — the ability to buy or sell quickly at a fair price. Without it, your shares would be as illiquid as a house. With it, you can convert ownership to cash in seconds.</Body>
    <ReadingGate onReady={onNext} label="Next: Supply and Demand"/>
  </Page>
);

// S2
const S2 = ({ onNext }) => {
  const [buyers, setBuyers] = useState(50);
  const sellers = 100-buyers;
  const price = Math.round(100+(buyers-50)*2.4);
  const up = buyers>50, eq = buyers===50;
  const priceColor = eq?TM:up?GREEN:RED;
  return (
    <Page>
      <SL>Section 2 of 7</SL>
      <H1>The Only Principle That Matters</H1>
      <Lead>Every price movement in the history of financial markets is explained by the same force. Drag the slider below and watch it happen in real time.</Lead>
      <Card gold>
        <H2 style={{ fontSize:"18px", marginBottom:"6px" }}>The Supply and Demand Engine</H2>
        <Body style={{ color:TM, fontSize:"13px", marginBottom:"20px" }}>Move the slider to shift the balance between buyers and sellers. Watch the price respond.</Body>
        <div style={{ marginBottom:"20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
            <span style={{ fontFamily:FM, fontSize:"10px", color:RED }}>MORE SELLERS</span>
            <span style={{ fontFamily:FM, fontSize:"10px", color:GREEN }}>MORE BUYERS</span>
          </div>
          <input type="range" min={5} max={95} value={buyers} onChange={e=>setBuyers(+e.target.value)} style={{ width:"100%", accentColor:GOLD }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"20px" }}>
          {[{label:"BUYERS",val:buyers,color:GREEN},{label:"SELLERS",val:sellers,color:RED}].map(b=>(
            <div key={b.label}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                <span style={{ fontFamily:FM, fontSize:"10px", color:b.color }}>{b.label}</span>
                <span style={{ fontFamily:FM, fontSize:"12px", color:b.color, fontWeight:700 }}>{b.val}</span>
              </div>
              <div style={{ height:"8px", background:SURF2, borderRadius:"4px" }}>
                <div style={{ height:"100%", width:b.val+"%", background:b.color, borderRadius:"4px", transition:"width 0.15s" }}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:BG, borderRadius:"12px", padding:"20px", textAlign:"center", border:"1px solid "+(eq?BORDER:up?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)") }}>
          <div style={{ fontFamily:FM, fontSize:"10px", color:TM, marginBottom:"8px", letterSpacing:"0.1em" }}>CURRENT PRICE</div>
          <div style={{ fontFamily:FD, fontSize:"48px", fontWeight:700, color:priceColor, transition:"color 0.15s" }}>${price}</div>
          <div style={{ fontFamily:FM, fontSize:"12px", color:priceColor, marginTop:"6px" }}>
            {eq?"Balanced - price holds steady":up?"More buyers - price rising":"More sellers - price falling"}
          </div>
        </div>
      </Card>
      <Card>
        <H2 style={{ fontSize:"18px" }}>What actually moves prices</H2>
        <Body>Notice what the slider represents — not facts about the company, but <strong style={{ color:TP }}>people's decisions</strong>. A company does not change overnight when its stock moves. What changes is how many people want to own it at that moment.</Body>
        <Body style={{ marginBottom:0 }}>This is why markets can seem irrational. The price is not measuring the company's value today — it is measuring <VT id="expectations">expectations</VT> about its future. Every price movement in history follows this single rule.</Body>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"20px" }}>
        <Card green style={{ marginBottom:0 }}>
          <div style={{ fontFamily:FM, fontSize:"9px", color:GREEN, marginBottom:"8px", letterSpacing:"0.1em" }}>PRICE RISES</div>
          <Body style={{ fontSize:"13px", marginBottom:0 }}>Apple reports stronger than expected iPhone sales. More investors want to own AAPL than sell it. Buyers outnumber sellers. Price rises until balance is restored.</Body>
        </Card>
        <Card red style={{ marginBottom:0 }}>
          <div style={{ fontFamily:FM, fontSize:"9px", color:RED, marginBottom:"8px", letterSpacing:"0.1em" }}>PRICE FALLS</div>
          <Body style={{ fontSize:"13px", marginBottom:0 }}>A major bank reports rising loan defaults. Investors rush to sell. Sellers outnumber buyers. Price falls until balance is restored.</Body>
        </Card>
      </div>
      <ReadingGate onReady={onNext} label="Next: Bull and Bear Markets"/>
    </Page>
  );
};

// S3
const S3 = ({ onNext }) => {
  const [active, setActive] = useState(null);
  const markets = [
    { id:"b1", type:"bull", period:"1990-2000", label:"The Long Bull",    pct:"+417%", desc:"The longest bull market in US history. Driven by the internet boom, rising productivity, and falling inflation. Ended with the dot-com crash." },
    { id:"r1", type:"bear", period:"2000-2002", label:"Dot-com Bust",     pct:"-49%",  desc:"Tech stocks collapsed as companies with no earnings were revealed to have no value. The Nasdaq fell 78% peak to trough." },
    { id:"b2", type:"bull", period:"2002-2007", label:"Housing Bull",     pct:"+101%", desc:"Markets recovered on low interest rates and a booming housing market. The seeds of the next crisis were quietly being planted." },
    { id:"r2", type:"bear", period:"2007-2009", label:"Financial Crisis", pct:"-57%",  desc:"The collapse of the US housing market triggered a global banking crisis. The worst bear market since the Great Depression." },
    { id:"b3", type:"bull", period:"2009-2020", label:"The Great Bull",   pct:"+401%", desc:"The second longest bull market in history. Driven by near-zero interest rates, tech growth, and quantitative easing." },
    { id:"r3", type:"bear", period:"Mar 2020",  label:"COVID Crash",      pct:"-34%",  desc:"The fastest 30% decline in history — 33 days. Followed by the fastest recovery in history — just 5 months." },
    { id:"b4", type:"bull", period:"2020-2022", label:"Stimulus Bull",    pct:"+114%", desc:"Massive government stimulus and vaccine optimism drove a rapid recovery to new all-time highs." },
    { id:"r4", type:"bear", period:"2022",      label:"Rate Hike Bear",   pct:"-25%",  desc:"The Federal Reserve raised interest rates aggressively to fight 40-year high inflation, ending the easy-money era." },
  ];
  const sel = active ? markets.find(m=>m.id===active) : null;
  return (
    <Page>
      <SL>Section 3 of 7</SL>
      <H1>Bull Markets and Bear Markets</H1>
      <Lead>Everyone uses these terms. Very few know the precise definitions — or the data that should make long-term investors far less afraid of bears than they typically are.</Lead>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"24px" }}>
        <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:"12px", padding:"20px", textAlign:"center" }}>
          <div style={{ fontSize:"32px", marginBottom:"8px" }}>🐂</div>
          <div style={{ fontFamily:FD, fontWeight:700, color:GREEN, fontSize:"20px", marginBottom:"8px" }}><VT id="bull_market">Bull Market</VT></div>
          <Body style={{ fontSize:"13px", marginBottom:"8px" }}>Prices rise <strong style={{ color:TP }}>20% or more</strong> from recent lows</Body>
          <div style={{ fontFamily:FM, fontSize:"10px", color:TM }}>Avg duration: ~2.7 years</div>
        </div>
        <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:"12px", padding:"20px", textAlign:"center" }}>
          <div style={{ fontSize:"32px", marginBottom:"8px" }}>🐻</div>
          <div style={{ fontFamily:FD, fontWeight:700, color:RED, fontSize:"20px", marginBottom:"8px" }}><VT id="bear_market">Bear Market</VT></div>
          <Body style={{ fontSize:"13px", marginBottom:"8px" }}>Prices fall <strong style={{ color:TP }}>20% or more</strong> from recent highs</Body>
          <div style={{ fontFamily:FM, fontSize:"10px", color:TM }}>Avg duration: ~9.6 months</div>
        </div>
      </div>
      <Card gold>
        <H2 style={{ fontSize:"18px" }}>Click any market period to explore it</H2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px", marginBottom:"14px" }}>
          {markets.map(m=>(
            <button key={m.id} onClick={()=>setActive(active===m.id?null:m.id)} style={{ background:active===m.id?(m.type==="bull"?"rgba(34,197,94,0.12)":"rgba(239,68,68,0.1)"):SURF2, border:"1px solid "+(active===m.id?(m.type==="bull"?"rgba(34,197,94,0.4)":"rgba(239,68,68,0.4)"):BORDER), borderRadius:"8px", padding:"10px 6px", textAlign:"center", cursor:"pointer" }}>
              <div style={{ fontSize:"14px", marginBottom:"3px" }}>{m.type==="bull"?"🐂":"🐻"}</div>
              <div style={{ fontFamily:FM, fontSize:"8px", color:TM, marginBottom:"3px" }}>{m.period}</div>
              <div style={{ fontFamily:FD, fontWeight:700, color:m.type==="bull"?GREEN:RED, fontSize:"13px" }}>{m.pct}</div>
            </button>
          ))}
        </div>
        {sel && (
          <div style={{ background:BG, borderRadius:"10px", padding:"16px", border:"1px solid "+(sel.type==="bull"?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)") }}>
            <div style={{ fontFamily:FD, fontWeight:700, color:sel.type==="bull"?GREEN:RED, fontSize:"16px", marginBottom:"6px" }}>{sel.label} · {sel.period} · {sel.pct}</div>
            <Body style={{ margin:0, fontSize:"13px" }}>{sel.desc}</Body>
          </div>
        )}
      </Card>
      <Card amber>
        <div style={{ display:"flex", gap:"12px" }}>
          <div style={{ fontSize:"20px", flexShrink:0 }}>💡</div>
          <Body style={{ margin:0 }}>A <VT id="correction">correction</VT> — a drop of 10-20% — is different from a bear market and far more common. Corrections happen roughly every 1-2 years and are a normal part of healthy markets. Most investors confuse one with a crash and make costly decisions as a result.</Body>
        </div>
      </Card>
      <ReadingGate onReady={onNext} label="Next: Why Markets Go Up Long-Term"/>
    </Page>
  );
};

// S4
const S4 = ({ onNext }) => {
  const spData = [
    {label:"1950",v:20},{label:"1960",v:58},{label:"1970",v:92},{label:"1980",v:136},
    {label:"1990",v:330},{label:"1995",v:615},{label:"2000",v:1498},{label:"2003",v:900},
    {label:"2009",v:680},{label:"2013",v:1848},{label:"2020",v:3756},{label:"2022",v:3840},{label:"2024",v:5200}
  ];
  return (
    <Page>
      <SL>Section 4 of 7</SL>
      <H1>Why Markets Go Up Long-Term</H1>
      <Lead>Despite wars, recessions, pandemics, and political crises — the long-term trend of markets has been consistently upward. This is not an accident.</Lead>
      <Card gold>
        <H2 style={{ fontSize:"18px" }}>The S&P 500 — 1950 to today</H2>
        <Body style={{ fontSize:"13px", color:TM, marginBottom:"14px" }}>Every major crash is visible. Zoom out and the direction is unmistakable.</Body>
        <MiniChart data={spData} height={200}/>
        <Body style={{ fontSize:"11px", color:TD, textAlign:"center", margin:"8px 0 0", fontFamily:FM }}>S&P 500 approximate values. Educational purposes only.</Body>
      </Card>
      <Card>
        <H2 style={{ fontSize:"18px" }}>Why the line keeps going up</H2>
        <Body>Markets go up because they own <strong style={{ color:TP }}>companies</strong> — and companies exist to grow. Over time, three forces push corporate earnings higher:</Body>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"10px", margin:"8px 0 16px" }}>
          {[{icon:"👥",title:"Population Growth",body:"More people means more customers, more workers, more economic activity."},{icon:"💡",title:"Innovation",body:"Companies find more efficient ways to produce more value from the same inputs."},{icon:"🌐",title:"Expanding Markets",body:"Companies access new customers, new geographies, new products over time."}].map(r=>(
            <div key={r.title} style={{ background:SURF2, borderRadius:"10px", padding:"14px", textAlign:"center" }}>
              <div style={{ fontSize:"22px", marginBottom:"8px" }}>{r.icon}</div>
              <div style={{ fontFamily:FD, fontWeight:700, color:TP, fontSize:"13px", marginBottom:"6px" }}>{r.title}</div>
              <Body style={{ fontSize:"12px", margin:0, color:TM }}>{r.body}</Body>
            </div>
          ))}
        </div>
        <Body style={{ marginBottom:0 }}>This is why index fund investors sleep soundly. You do not need to pick which companies will win. You just need to own a piece of all of them — and let human productivity do the work.</Body>
      </Card>
      <CQ name="Pete" emoji="🎯" color={GOLD}>I have lived through three major crashes. Each time felt catastrophic. Each time the market recovered and went higher. The chart is the argument. Time in the market is the strategy.</CQ>
      <ReadingGate onReady={onNext} label="Next: Market Indexes"/>
    </Page>
  );
};

// S5
const S5 = ({ onNext }) => {
  const [active, setActive] = useState("sp500");
  const indexes = {
    dow:    { name:"Dow Jones", emoji:"🏛️", color:AMBER, founded:"1896", stocks:"30",     desc:"The oldest major index. Tracks 30 large, well-established US companies. Because it holds only 30 stocks, it is less representative of the overall market than the S&P 500.", strength:"125+ years of historical data", limit:"Only 30 stocks — misses most of the market" },
    sp500:  { name:"S&P 500",   emoji:"📊", color:GOLD,  founded:"1957", stocks:"500",    desc:"The gold standard. Tracks 500 of the largest US companies by market cap. When someone says the market is up today, they almost always mean the S&P 500. It is the most widely used benchmark for US equity performance.", strength:"Broad, representative, the standard benchmark", limit:"US-only — does not capture global markets" },
    nasdaq: { name:"Nasdaq",    emoji:"💻", color:SLATE, founded:"1971", stocks:"3,000+", desc:"Heavily weighted toward technology. Apple, Microsoft, Amazon, Alphabet, and Meta make up a huge portion of its weight. When tech does well, Nasdaq soars. When tech struggles, Nasdaq suffers more than other indexes.", strength:"Best measure of technology sector performance", limit:"Heavy tech concentration creates higher volatility" },
  };
  const sel = indexes[active];
  return (
    <Page>
      <SL>Section 5 of 7</SL>
      <H1>The Scoreboard: Market Indexes</H1>
      <Lead>When someone says the market was up today — what do they actually mean? They mean one of three numbers. Here is what those numbers are, and why they matter differently.</Lead>
      <div style={{ display:"flex", gap:"8px", marginBottom:"20px" }}>
        {Object.entries(indexes).map(([k,v])=>(
          <button key={k} onClick={()=>setActive(k)} style={{ flex:1, background:active===k?"rgba(212,160,23,0.08)":SURF, border:"1px solid "+(active===k?BORDERHI:BORDER), borderRadius:"10px", padding:"12px", textAlign:"center", cursor:"pointer" }}>
            <div style={{ fontSize:"20px", marginBottom:"5px" }}>{v.emoji}</div>
            <div style={{ fontFamily:FD, fontWeight:700, color:active===k?GOLD:TP, fontSize:"13px" }}>{v.name}</div>
          </button>
        ))}
      </div>
      <Card gold>
        <div style={{ marginBottom:"14px" }}>
          <div style={{ fontSize:"28px", marginBottom:"6px" }}>{sel.emoji}</div>
          <div style={{ fontFamily:FD, fontWeight:700, color:sel.color, fontSize:"22px" }}><VT id={active}>{sel.name}</VT></div>
          <div style={{ fontFamily:FM, fontSize:"10px", color:TM, marginTop:"4px" }}>Founded {sel.founded} · {sel.stocks} stocks</div>
        </div>
        <Body style={{ marginBottom:"16px" }}>{sel.desc}</Body>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
          <div style={{ background:"rgba(34,197,94,0.08)", borderRadius:"8px", padding:"10px" }}>
            <div style={{ fontFamily:FM, fontSize:"9px", color:GREEN, marginBottom:"5px", letterSpacing:"0.1em" }}>STRENGTH</div>
            <Body style={{ fontSize:"12px", margin:0 }}>{sel.strength}</Body>
          </div>
          <div style={{ background:"rgba(217,119,6,0.1)", borderRadius:"8px", padding:"10px" }}>
            <div style={{ fontFamily:FM, fontSize:"9px", color:AMBER, marginBottom:"5px", letterSpacing:"0.1em" }}>LIMITATION</div>
            <Body style={{ fontSize:"12px", margin:0 }}>{sel.limit}</Body>
          </div>
        </div>
      </Card>
      <Card amber>
        <div style={{ display:"flex", gap:"12px" }}>
          <div style={{ fontSize:"20px", flexShrink:0 }}>💡</div>
          <Body style={{ margin:0 }}>When Betty invests in a Vanguard S&P 500 ETF, she is buying the <VT id="benchmark">benchmark</VT>. Her portfolio rises and falls with the S&P 500 almost exactly. Match the market, pay almost nothing, let compounding do the work.</Body>
        </div>
      </Card>
      <ReadingGate onReady={onNext} label="Next: Crashes and Recoveries"/>
    </Page>
  );
};

// S6
const S6 = ({ onNext }) => {
  const crashes = [
    { year:"1929", name:"Great Depression",  drop:"-89%", rec:"25 years", note:"The outlier. Bank failures compounded by catastrophic policy errors. Unique in modern history.", col:RED },
    { year:"1987", name:"Black Monday",      drop:"-34%", rec:"2 years",  note:"The Dow fell 22% in a single day — the largest one-day drop in history. Largely caused by automated trading and panic.", col:AMBER },
    { year:"2000", name:"Dot-com Bust",      drop:"-49%", rec:"7 years",  note:"Companies with no earnings and no business model collapsed. The Nasdaq fell 78% peak to trough.", col:RED },
    { year:"2008", name:"Financial Crisis",  drop:"-57%", rec:"5 years",  note:"Collapse of the US housing market triggered a global banking crisis. The worst since 1929.", col:RED },
    { year:"2020", name:"COVID Crash",       drop:"-34%", rec:"5 months", note:"The fastest 30% decline in history — 33 days. Then the fastest recovery in history. Nobody saw either coming.", col:AMBER },
  ];
  return (
    <Page>
      <SL>Section 6 of 7</SL>
      <H1>Crashes, Panics and Recoveries</H1>
      <Lead>Every major market crash in history has one thing in common: the market recovered. That is not optimism. That is the historical record.</Lead>
      <div style={{ marginBottom:"24px" }}>
        {crashes.map((c,i)=>(
          <div key={i} style={{ background:SURF, border:"1px solid "+BORDER, borderRadius:"12px", padding:"16px 18px", marginBottom:"10px", display:"grid", gridTemplateColumns:"40px 1fr 60px 70px", gap:"12px", alignItems:"center" }}>
            <div style={{ fontFamily:FM, fontSize:"12px", color:TM }}>{c.year}</div>
            <div>
              <div style={{ fontFamily:FD, fontWeight:700, color:TP, fontSize:"14px", marginBottom:"3px" }}>{c.name}</div>
              <Body style={{ fontSize:"12px", color:TM, margin:0, lineHeight:1.5 }}>{c.note}</Body>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:FD, fontWeight:700, color:c.col, fontSize:"15px" }}>{c.drop}</div>
              <div style={{ fontFamily:FM, fontSize:"8px", color:TD, marginTop:"2px" }}>DECLINE</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:FD, fontWeight:700, color:GREEN, fontSize:"14px" }}>{c.rec}</div>
              <div style={{ fontFamily:FM, fontSize:"8px", color:TD, marginTop:"2px" }}>RECOVERY</div>
            </div>
          </div>
        ))}
      </div>
      <Card gold>
        <H2 style={{ fontSize:"18px" }}>The pattern that changes everything</H2>
        <Body>Crashes are not a question of if. They are a question of when. Since 1928 there has been a bear market roughly every 3-5 years. If you invest for decades, you will live through many of them.</Body>
        <Body style={{ marginBottom:0 }}>The question is not whether you can avoid crashes — nobody can. The question is whether you stay invested long enough for the recovery. Every investor who held through the crashes above recovered everything and then some.</Body>
      </Card>
      <Card amber>
        <div style={{ display:"flex", gap:"12px" }}>
          <div style={{ fontSize:"20px", flexShrink:0 }}>⚠️</div>
          <div>
            <div style={{ fontFamily:FD, fontWeight:700, color:AMBER, marginBottom:"8px" }}>The one exception</div>
            <Body style={{ margin:0, fontSize:"13px" }}>The 1929 Great Depression took 25 years to recover — not because the crash was larger, but because of catastrophic policy failures: bank failures cascaded, the money supply contracted, and tariffs strangled trade. Modern central banks and deposit insurance exist specifically to prevent a repeat.</Body>
          </div>
        </div>
      </Card>
      <CQ name="Clyde" emoji="🤝" color={AMBER}>I always thought a crash meant permanent loss. Seeing those recovery times changes everything. Even the worst ones came back.</CQ>
      <ReadingGate onReady={onNext} label="Next: News and Sentiment"/>
    </Page>
  );
};

// S7
const S7 = ({ onNext }) => (
  <Page>
    <SL>Section 7 of 7</SL>
    <H1>News, Sentiment and The Noise Machine</H1>
    <Lead>Markets move on expectations, not just facts. This single insight explains more confusing market behavior than almost anything else.</Lead>
    <Card gold>
      <H2 style={{ fontSize:"18px" }}>The expectations gap</H2>
      <Body>A company announces record profits — up 30% from last year. You go to bed expecting your shares to rise. The next morning the stock is down 8%.</Body>
      <Body>How? The market had already priced in expectations of 35% growth. The company delivered 30% — impressive, but below what was <VT id="expectations">expected</VT>. The stock did not fall because the company did badly. It fell because it did less well than expected.</Body>
      <Body style={{ marginBottom:0 }}>This is the expectations gap — and it explains why financial news is so often counterintuitive.</Body>
    </Card>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"20px" }}>
      {[
        { headline:'"Markets plunge on recession fears"', reality:"Markets fell 2.3% on one bad jobs report. A correction, not a crisis.", color:RED },
        { headline:'"Crisis deepens as investors flee"', reality:"Institutional investors rebalanced portfolios. Normal quarterly behavior.", color:AMBER },
        { headline:'"Tech stocks in freefall"', reality:"Nasdaq fell 4% after strong gains the prior two weeks. Context matters.", color:RED },
        { headline:'"Market soars on Fed pivot hopes"', reality:"S&P rose 1.8% on one official's comment — which may not represent policy.", color:GREEN },
      ].map((n,i)=>(
        <div key={i} style={{ background:SURF, border:"1px solid "+BORDER, borderRadius:"10px", padding:"14px" }}>
          <div style={{ fontFamily:FD, fontStyle:"italic", fontSize:"13px", color:n.color, marginBottom:"8px", lineHeight:1.5 }}>{n.headline}</div>
          <Body style={{ fontSize:"12px", color:TM, margin:0 }}>{n.reality}</Body>
        </div>
      ))}
    </div>
    <Card>
      <H2 style={{ fontSize:"18px" }}>The research on checking your portfolio</H2>
      <Body>Studies consistently show that investors who check their portfolios daily make worse decisions than those who check monthly. The more frequently you look, the more <VT id="sentiment">market sentiment</VT> infects your thinking.</Body>
      <Body style={{ marginBottom:0 }}>Financial news is designed to create urgency — urgency drives engagement. Words like "plunge," "crisis," and "freefall" make you watch. They are not designed to make you invest wisely.</Body>
    </Card>
    <CQ name="Pete" emoji="🎯" color={GOLD}>I read the news every morning. But I let it inform me — not instruct me. My portfolio decisions are made on fundamentals and timeline, not on what the market did yesterday.</CQ>
    <CQ name="Betty" emoji="😌" color={SLATE}>I stopped reading financial news daily about three years ago. My returns got better. That was not a coincidence.</CQ>
    <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"28px" }}>
      <Btn onClick={onNext}>Start Scenarios <ChevronRight size={14}/></Btn>
    </div>
  </Page>
);

// SC1
const SC1 = ({ onNext }) => {
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const dropData = [{label:"Start",v:5000},{label:"Wk1",v:4700},{label:"Wk2",v:4350},{label:"Now",v:4250}];
  const opts = [
    { id:"a", label:"Sell everything — lock in what I have before it falls further" },
    { id:"b", label:"Hold — do nothing and wait for the recovery" },
    { id:"c", label:"Buy more — lower prices mean the same assets are cheaper" },
    { id:"d", label:"Move half to bonds — reduce risk while keeping some exposure" },
  ];
  const outcomes = {
    a:{ v:"The most common choice — and the most costly", t:"Selling locks in your losses and guarantees you miss the recovery. Investors who sold during the 2020 COVID crash in March missed a 50%+ recovery by December of the same year. Selling during panic turns a temporary loss permanent." },
    b:{ v:"Correct — and harder than it sounds", t:"Holding through a 15% drop requires genuine emotional discipline. But investors who hold through corrections consistently outperform those who try to exit and re-enter. Time in the market beats timing the market." },
    c:{ v:"Excellent — if you have the conviction for it", t:"Buying during a drop is what Warren Buffett means by 'be greedy when others are fearful.' You are purchasing the same assets at a 15% discount. Historically, buying during significant dips has generated above-average long-term returns." },
    d:{ v:"Reasonable — but likely unnecessary", t:"If your original allocation was right for your timeline, a 15% correction is not a signal to change it. Moving to bonds during a drop means selling equities at a discount." },
  };
  const good = chosen==="b"||chosen==="c";
  return (
    <Page>
      <SL>Scenario 1 of 3 - Beginner</SL>
      <Card>
        <div style={{ fontFamily:FM, fontSize:"9px", color:GOLD, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:"12px" }}>The Situation</div>
        <H2>The Market Drop</H2>
        <Body>The whole market has fallen 15% in two weeks. Your $5,000 index fund is now worth <strong style={{ color:RED }}>$4,250</strong>. The news is calling it a "market rout." What do you do?</Body>
        <MiniChart data={dropData} color={RED} height={130}/>
      </Card>
      {opts.map(o=><OBtn key={o.id} opt={o} chosen={chosen} correct="b" revealed={revealed} onClick={()=>!revealed&&setChosen(o.id)}/>)}
      {chosen&&!revealed&&<div style={{ textAlign:"center", marginTop:"14px" }}><Btn onClick={()=>setRevealed(true)}>Reveal Outcome <ChevronRight size={14}/></Btn></div>}
      {revealed&&chosen&&(
        <>
          <Card style={{ borderColor:good?BORDERHI:"rgba(217,119,6,0.3)", background:good?"rgba(212,160,23,0.08)":"rgba(217,119,6,0.1)", marginTop:"20px" }}>
            <div style={{ color:good?GOLD:AMBER, fontFamily:FD, fontWeight:700, fontSize:"17px", marginBottom:"10px" }}>{outcomes[chosen].v}</div>
            <Body style={{ marginBottom:0 }}>{outcomes[chosen].t}</Body>
          </Card>
          <CQ name="Clyde" emoji="🤝" color={AMBER}>My instinct would be to sell. But seeing the recovery data from previous crashes — I think I need to train myself to hold instead.</CQ>
          <CQ name="Betty" emoji="😌" color={SLATE}>I do not look at my portfolio during drops. I close the app. What I cannot see cannot panic me.</CQ>
          <CQ name="Pete" emoji="🎯" color={GOLD}>A 15% drop is a sale. If groceries went on sale 15%, you would buy more. Stocks are no different.</CQ>
          <Card gold style={{ marginTop:"12px" }}>
            <div style={{ color:GOLD, fontWeight:700, fontFamily:FD, marginBottom:"8px" }}>The Lesson</div>
            <Body style={{ marginBottom:0 }}>The most dangerous moment in investing is not the crash — it is the emotional response to the crash. The returns you get from the market are not the same as the returns you experience, because panic selling destroys the difference. Holding is a strategy. Holding is hard. Holding works.</Body>
          </Card>
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"24px" }}><Btn onClick={onNext}>Scenario 2 <ChevronRight size={14}/></Btn></div>
        </>
      )}
    </Page>
  );
};

// SC2
const SC2 = ({ onNext }) => {
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const opts = [
    { id:"a", label:"Sell immediately — record profits and the stock fell? Something is very wrong." },
    { id:"b", label:"Hold — the fundamentals are strong, this drop is a market overreaction" },
    { id:"c", label:"Buy more — a company with 30% profit growth trading 8% cheaper is an opportunity" },
    { id:"d", label:"Investigate first — understand why it fell before making any decision" },
  ];
  const explanations = {
    a:"Selling because a stock fell after good news is a reactive decision driven by confusion, not analysis. The earnings were strong — the market repriced on expectations, not a fundamental problem with the business.",
    b:"Holding is defensible — but assuming the market overreacted is a hypothesis, not a fact. Before deciding the drop is wrong, understand why the market responded this way. Analysts may know something about forward guidance that you do not.",
    c:"Tempting logic — but it assumes the expectations gap was the whole story. Before buying more, check whether analysts reduced their future estimates. If the company also guided lower for next quarter, the stock may fall further.",
    d:"This is the professional response. Before any buy or sell decision, understand what actually happened. Did the company miss only on one metric? Did they lower forward guidance? The number alone is never the whole story.",
  };
  return (
    <Page>
      <SL>Scenario 2 of 3 - Intermediate</SL>
      <Card>
        <div style={{ fontFamily:FM, fontSize:"9px", color:GOLD, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:"12px" }}>The Situation</div>
        <H2>The Confusing Headline</H2>
        <Body>A company you own just reported quarterly profits — <strong style={{ color:GREEN }}>up 30% from last year</strong>. You go to bed expecting your shares to rise. The next morning the stock is <strong style={{ color:RED }}>down 8%</strong>. The headline reads: "Company misses analyst estimates despite strong earnings growth."</Body>
        <div style={{ background:BG, border:"1px solid "+BORDER, borderRadius:"10px", padding:"16px", marginTop:"8px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", textAlign:"center" }}>
            <div>
              <div style={{ fontFamily:FM, fontSize:"9px", color:TM, marginBottom:"5px" }}>ACTUAL GROWTH</div>
              <div style={{ fontFamily:FD, fontSize:"20px", color:GREEN, fontWeight:700 }}>+30%</div>
            </div>
            <div>
              <div style={{ fontFamily:FM, fontSize:"9px", color:TM, marginBottom:"5px" }}>EXPECTED</div>
              <div style={{ fontFamily:FD, fontSize:"20px", color:AMBER, fontWeight:700 }}>+35%</div>
            </div>
            <div>
              <div style={{ fontFamily:FM, fontSize:"9px", color:TM, marginBottom:"5px" }}>STOCK REACTION</div>
              <div style={{ fontFamily:FD, fontSize:"20px", color:RED, fontWeight:700 }}>-8%</div>
            </div>
          </div>
        </div>
      </Card>
      {opts.map(o=><OBtn key={o.id} opt={o} chosen={chosen} correct="d" revealed={revealed} onClick={()=>!revealed&&setChosen(o.id)}/>)}
      {chosen&&!revealed&&<div style={{ textAlign:"center", marginTop:"14px" }}><Btn onClick={()=>setRevealed(true)}>Reveal Outcome <ChevronRight size={14}/></Btn></div>}
      {revealed&&chosen&&(
        <>
          <Card style={{ borderColor:chosen==="d"?BORDERHI:"rgba(217,119,6,0.3)", background:chosen==="d"?"rgba(212,160,23,0.08)":"rgba(217,119,6,0.1)", marginTop:"20px" }}>
            <div style={{ color:chosen==="d"?GOLD:AMBER, fontFamily:FD, fontWeight:700, fontSize:"17px", marginBottom:"10px" }}>{chosen==="d"?"Exactly right":"Here is the full picture"}</div>
            <Body style={{ marginBottom:0 }}>{explanations[chosen]}</Body>
          </Card>
          <Card gold style={{ marginTop:"12px" }}>
            <div style={{ color:GOLD, fontWeight:700, fontFamily:FD, marginBottom:"8px" }}>The Lesson</div>
            <Body style={{ marginBottom:0 }}>Stock prices do not reflect what happened — they reflect the gap between what happened and what was <VT id="expectations">expected</VT>. A company can grow 30% and disappoint the market if the market expected 35%. Reacting to headlines without understanding the expectation behind them is why so many investors make costly decisions on good news days.</Body>
          </Card>
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"24px" }}><Btn onClick={onNext}>Scenario 3 <ChevronRight size={14}/></Btn></div>
        </>
      )}
    </Page>
  );
};

// SC3
const SC3 = ({ onNext }) => {
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const timeline = [
    {label:"Jan",v:100},{label:"Feb",v:94},{label:"Mar11",v:74,dot:true,dotColor:RED},
    {label:"Mar23",v:68},{label:"Apr",v:79},{label:"Jun",v:88},{label:"Aug",v:101},{label:"Dec",v:118}
  ];
  const opts = [
    { id:"a", label:"Wait for the bottom — buy once things stabilize and the worst is clearly over" },
    { id:"b", label:"Sell now — protect what you have and buy back in when things improve" },
    { id:"c", label:"Stay invested and keep buying — market timing is impossible, this will recover" },
    { id:"d", label:"Move to cash and gold — traditional safe havens during uncertainty" },
  ];
  const explanations = {
    a:"Waiting for 'the bottom' sounds rational. The problem: nobody rings a bell at the bottom. The market began recovering on March 23 — while every headline still said the worst was ahead. Investors waiting for clarity missed the fastest recovery in market history. The S&P 500 had fully recovered all losses by August 2020.",
    b:"Selling in March 2020 locked in a 26-34% loss. Investors who then waited for things to improve typically re-entered in late summer — after missing the full recovery. Selling and waiting requires being right twice: when to exit and when to re-enter. Almost nobody gets both right.",
    c:"Staying invested — or buying more — during the COVID crash was the correct decision. But let us be honest: it was genuinely terrifying in the moment. In mid-March 2020, serious economists were predicting 20-30% unemployment. Nobody knew it would recover in five months. The case for staying invested is not that you know it will recover quickly — it is that trying to time the exit and re-entry is statistically likely to make things worse.",
    d:"Gold and cash preserved value short-term. But investors who moved to safety in March 2020 then faced the same impossible question: when to move back in? Most re-entered late, missing significant gains. Panic-driven moves into safe havens typically cost more than the volatility they were meant to avoid.",
  };
  return (
    <Page>
      <SL>Scenario 3 of 3 - Advanced</SL>
      <Card>
        <div style={{ fontFamily:FM, fontSize:"9px", color:GOLD, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:"12px" }}>The Situation</div>
        <H2>March 2020</H2>
        <Body>It is March 11, 2020. The WHO has just declared COVID-19 a global pandemic. Markets have fallen <strong style={{ color:RED }}>26% in three weeks</strong>. Your $20,000 portfolio is now worth <strong style={{ color:RED }}>$14,800</strong>. There is no vaccine. Nobody knows how long lockdowns will last.</Body>
        <Body>A trusted friend says: "Wait until it bottoms out. Nobody catches a falling knife." Another says: "This is the buying opportunity of a decade."</Body>
        <MiniChart data={timeline} height={160} refLabel="Mar11" showDots={true}/>
        <Body style={{ fontSize:"11px", color:TD, textAlign:"center", margin:"6px 0 0", fontFamily:FM }}>The red dot and line mark where you are. The rest shows what actually happened — revealed after you choose.</Body>
      </Card>
      {opts.map(o=><OBtn key={o.id} opt={o} chosen={chosen} correct="c" revealed={revealed} onClick={()=>!revealed&&setChosen(o.id)}/>)}
      {chosen&&!revealed&&<div style={{ textAlign:"center", marginTop:"14px" }}><Btn onClick={()=>setRevealed(true)}>Reveal Outcome <ChevronRight size={14}/></Btn></div>}
      {revealed&&chosen&&(
        <>
          <Card style={{ borderColor:chosen==="c"?BORDERHI:"rgba(217,119,6,0.3)", background:chosen==="c"?"rgba(212,160,23,0.08)":"rgba(217,119,6,0.1)", marginTop:"20px" }}>
            <div style={{ color:chosen==="c"?GOLD:AMBER, fontFamily:FD, fontWeight:700, fontSize:"17px", marginBottom:"10px" }}>
              {chosen==="a"?"The most common choice — it missed the recovery":chosen==="b"?"The most damaging choice in hindsight":chosen==="c"?"The right call — but almost nobody made it":"Defensible — but costly in the end"}
            </div>
            <Body style={{ marginBottom:0 }}>{explanations[chosen]}</Body>
          </Card>
          <Card amber style={{ marginTop:"12px" }}>
            <div style={{ fontFamily:FD, fontWeight:700, color:AMBER, marginBottom:"8px" }}>What actually happened</div>
            <Body style={{ marginBottom:0 }}>The S&P 500 bottomed on March 23 — just 12 days after this scenario. By August it had fully recovered. By December it was <strong style={{ color:GREEN }}>up 18% for the year</strong>. The investor who stayed invested earned exceptional returns. The investor who waited for clarity missed most of them.</Body>
          </Card>
          <Card gold style={{ marginTop:"12px" }}>
            <div style={{ color:GOLD, fontWeight:700, fontFamily:FD, marginBottom:"8px" }}>The Lesson</div>
            <Body style={{ marginBottom:0 }}>This scenario has no easy answer — because in the moment, there was none. The case for staying invested is not that crashes always recover quickly. It is that <strong style={{ color:TP }}>market timing requires being right twice</strong> — exit and re-entry — and the data shows most investors get at least one wrong. The strategy that does not require perfect timing is the one that has historically won.</Body>
          </Card>
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"24px" }}><Btn onClick={onNext}>Take the Quiz <ChevronRight size={14}/></Btn></div>
        </>
      )}
    </Page>
  );
};

// QUIZ
const Quiz = ({ onFinish }) => {
  const qs = [
    {
      q:"If more people want to sell a stock than buy it, what happens to the price?",
      opts:["The price rises — sellers drive up competition","The price falls — sellers must lower their price to find buyers","The price stays the same — supply and demand balance out","The exchange temporarily halts trading"],
      correct:1,
      exp:"Supply and demand governs every price movement. When sellers outnumber buyers, sellers must lower their price to attract buyers — pushing the price down. When buyers outnumber sellers, buyers compete prices upward. Every price movement in market history follows this rule."
    },
    {
      q:"A company reports record profits, but its stock falls 8% the next day. What most likely explains this?",
      opts:["The market made an error — prices always follow profits","The profits were strong but fell short of what analysts had predicted","The company must have hidden bad news in the report","Market manipulation by large institutional investors"],
      correct:1,
      exp:"Stock prices reflect expectations, not just results. When actual performance falls short of what the market had already priced in — even if objectively strong — the price adjusts downward. This is the expectations gap."
    },
    {
      q:"True or False: If the market drops 20%, you have permanently lost that money.",
      opts:["True — a 20% drop means those gains are gone forever","False — paper losses only become real losses if you sell, and markets have historically recovered","True — unless you bought at the very bottom","False — but only if you hold index funds, not individual stocks"],
      correct:1,
      exp:"A paper loss only becomes a real loss when you sell. Investors who held through every major crash in history — including 2008 and the 2020 COVID crash — eventually recovered and went on to new highs. The exception is 1929, which took 25 years due to extraordinary policy failures."
    },
  ];
  const [cur, setCur] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const tally = useRef(0);
  const q = qs[cur];
  const opts = q.opts.map((o,i)=>({ id:String.fromCharCode(97+i), label:o }));
  const correctId = String.fromCharCode(97+q.correct);
  const isCorrect = chosen===correctId;
  const handleSubmit = () => { setSubmitted(true); if(isCorrect) tally.current+=1; };
  const handleNext = () => {
    if (cur<qs.length-1) { setCur(c=>c+1); setChosen(null); setSubmitted(false); }
    else onFinish(tally.current);
  };
  return (
    <Page>
      <SL>Knowledge Check</SL>
      <H1>Module 3 Quiz</H1>
      <div style={{ display:"flex", gap:"7px", marginBottom:"28px" }}>
        {qs.map((_,i)=><div key={i} style={{ height:"3px", flex:1, borderRadius:"2px", background:i<cur?GOLD:i===cur?"rgba(212,160,23,0.18)":SURF2 }}/>)}
      </div>
      <div style={{ fontFamily:FM, fontSize:"10px", color:TM, marginBottom:"14px", letterSpacing:"0.1em" }}>QUESTION {cur+1} OF {qs.length}</div>
      <Card><H2 style={{ fontSize:"17px", marginBottom:0 }}>{q.q}</H2></Card>
      {opts.map(o=><OBtn key={o.id} opt={o} chosen={chosen} correct={correctId} revealed={submitted} onClick={()=>!submitted&&setChosen(o.id)}/>)}
      {chosen&&!submitted&&<div style={{ textAlign:"center", marginTop:"14px" }}><Btn onClick={handleSubmit}>Submit Answer</Btn></div>}
      {submitted&&(
        <>
          <Card style={{ borderColor:isCorrect?BORDERHI:"rgba(217,119,6,0.3)", background:isCorrect?"rgba(212,160,23,0.08)":"rgba(217,119,6,0.1)", marginTop:"16px" }}>
            <div style={{ color:isCorrect?GOLD:AMBER, fontFamily:FD, fontWeight:700, marginBottom:"8px", fontSize:"16px" }}>{isCorrect?"Exactly right":"Not quite — here is the nuance"}</div>
            <Body style={{ marginBottom:0 }}>{q.exp}</Body>
          </Card>
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"16px" }}>
            <Btn onClick={handleNext}>{cur<qs.length-1?"Next Question":"See Results"} <ChevronRight size={14}/></Btn>
          </div>
        </>
      )}
    </Page>
  );
};

// RESULTS
const Results = ({ score, total, onRestart, onMap }) => {
  const pct = Math.round((score/total)*100);
  const vocab = ["stock_exchange","liquidity","bull_market","bear_market","correction","sp500","dow","nasdaq","benchmark","sentiment","expectations","crash"];
  return (
    <Page>
      <div style={{ textAlign:"center", paddingTop:"24px", marginBottom:"40px" }}>
        <div style={{ width:"72px", height:"72px", borderRadius:"50%", background:"rgba(212,160,23,0.08)", border:"1px solid "+BORDERHI, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:"32px" }}>
          {pct===100?"🏆":pct>=66?"🎯":"📚"}
        </div>
        <SL>Module 3 Complete</SL>
        <H1 style={{ textAlign:"center" }}>{pct===100?"Outstanding":"Well done"}.</H1>
        <Lead>You got <strong style={{ color:TP }}>{score} out of {total}</strong> questions right. The madhouse now makes sense.</Lead>
      </div>
      <Card gold>
        <H2 style={{ fontSize:"18px", marginBottom:"18px" }}>Vocabulary earned in this module</H2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
          {vocab.map(id=>{ const v=VOCAB[id]; if(!v) return null; return (
            <div key={id} style={{ display:"flex", gap:"8px", alignItems:"flex-start" }}>
              <CheckCircle size={13} color={GOLD} style={{ flexShrink:0, marginTop:"2px" }}/>
              <div>
                <span style={{ fontFamily:FB, fontWeight:700, color:GOLD, fontSize:"13px" }}>{v.term}</span>
                <Body style={{ margin:0, fontSize:"11px", color:TM, lineHeight:1.4 }}>{v.def}</Body>
              </div>
            </div>
          ); })}
        </div>
      </Card>
      <Card>
        <H2 style={{ fontSize:"17px" }}>Coming up in Module 4</H2>
        <Body style={{ marginBottom:0, color:TM }}>You now know what to invest in and how the market works. Next — how do you actually build a portfolio? How much of each asset should you own, and how do you know when to change it?</Body>
      </Card>
      <div style={{ display:"flex", justifyContent:"center", marginTop:"32px" }}>
        <Btn onClick={onMap} style={{marginRight:8}}>← Module Map</Btn><Btn onClick={onRestart} outline><RotateCcw size={14}/> Restart Module</Btn>
      </div>
    </Page>
  );
};

// APP
export default function Module3() {
  const navigate = useNavigate();
  const { completeModule } = useUser();
  const [screen, setScreen] = useState("opening");
  const [score, setScore] = useState(0);
  const go = s => { setScreen(s); window.scrollTo(0,0); };
  const STEPS = ["s1","s2","s3","s4","s5","s6","s7","sc1","sc2","sc3","quiz","results"];
  const LABELS = { s1:"Section 1 of 7",s2:"Section 2 of 7",s3:"Section 3 of 7",s4:"Section 4 of 7",s5:"Section 5 of 7",s6:"Section 6 of 7",s7:"Section 7 of 7",sc1:"Scenario 1 of 3",sc2:"Scenario 2 of 3",sc3:"Scenario 3 of 3",quiz:"Quiz",results:"Results" };
  const progress = screen==="opening" ? 0 : ((STEPS.indexOf(screen)+1)/STEPS.length)*100;
  const screens = {
    opening:<Opening onBegin={()=>go("s1")}/>,
    s1:<S1 onNext={()=>go("s2")}/>, s2:<S2 onNext={()=>go("s3")}/>, s3:<S3 onNext={()=>go("s4")}/>,
    s4:<S4 onNext={()=>go("s5")}/>, s5:<S5 onNext={()=>go("s6")}/>, s6:<S6 onNext={()=>go("s7")}/>,
    s7:<S7 onNext={()=>go("sc1")}/>,
    sc1:<SC1 onNext={()=>go("sc2")}/>, sc2:<SC2 onNext={()=>go("sc3")}/>, sc3:<SC3 onNext={()=>go("quiz")}/>,
    quiz:<Quiz onFinish={s=>{ setScore(s); completeModule("3"); go("results"); }}/>,
    results:<Results score={score} total={3} onRestart={()=>go("opening")} onMap={()=>{ completeModule("3"); navigate("/"); }}/>,
  };
  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:FB, color:TB }}>
      {screen!=="opening" && (
        <header style={{ background:"rgba(0,0,0,0.96)", borderBottom:"1px solid "+BORDER, padding:"13px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", color:GOLD, fontFamily:FD, fontSize:"16px", fontWeight:700 }}>
            <TrendingUp size={16} color={GOLD}/> Investment Club
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            {LABELS[screen] && <span style={{ fontFamily:FM, fontSize:"10px", color:TM, letterSpacing:"0.08em" }}>{LABELS[screen]}</span>}
            <div style={{ background:"rgba(212,160,23,0.08)", border:"1px solid "+BORDERHI, borderRadius:"20px", padding:"3px 12px", fontFamily:FM, fontSize:"10px", color:GOLD }}>MODULE 3</div>
          </div>
        </header>
      )}
      {screen!=="opening" && (
        <div style={{ height:"2px", background:SURF2 }}>
          <div style={{ height:"100%", background:GOLD, width:progress+"%", transition:"width 0.4s ease" }}/>
        </div>
      )}
      {screens[screen]}
    </div>
  );
}

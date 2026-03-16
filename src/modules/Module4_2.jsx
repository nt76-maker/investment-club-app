import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { ChevronRight, TrendingUp, RotateCcw, AlertCircle, Play, SkipForward, Lock } from "lucide-react";

// ── COLOR SYSTEM ─────────────────────────────────────────────────
// RULE: TM (#7A7060) is for metadata labels and chart axis text ONLY.
// Any sentence-length readable text MUST use TB (#C8C0B0) or TP (#F5F0E8).
// TD must never be used for text — decorative SVG only.
const GOLD="#D4A017", AMBER="#D97706", SLATE="#94A3B8", GREEN="#22C55E", RED="#EF4444", BLUE="#3B82F6", PURPLE="#8B5CF6";
const BG="#000", SURF="#0D0D0D", SURF2="#141414", BORDER="rgba(212,160,23,0.15)", BORDERHI="rgba(212,160,23,0.4)";
const TP="#F5F0E8", TB="#C8C0B0", TM="#7A7060";
const FD="'Playfair Display','Georgia',serif", FB="'Georgia','Times New Roman',serif", FM="'Courier New',monospace";
const START=15000;

const CONTROL = { usStocks:40, intlStocks:15, bonds:30, reits:10, cash:5 };
const PROFILE_DEFAULTS = {
  anchor:     { usStocks:15, intlStocks:5,  bonds:55, reits:5,  cash:20 },
  navigator:  { usStocks:35, intlStocks:10, bonds:35, reits:10, cash:10 },
  sailor:     { usStocks:50, intlStocks:15, bonds:20, reits:10, cash:5  },
  captain:    { usStocks:60, intlStocks:20, bonds:10, reits:8,  cash:2  },
  adventurer: { usStocks:70, intlStocks:20, bonds:5,  reits:3,  cash:2  },
};
const PMETA = {
  anchor:     { e:"⚓", c:SLATE  },
  navigator:  { e:"🧭", c:AMBER  },
  sailor:     { e:"⛵", c:GOLD   },
  captain:    { e:"🚢", c:GREEN  },
  adventurer: { e:"🛥️", c:RED   },
};

const ASSETS = [
  { key:"usStocks",   label:"US Stocks",      short:"US",    color:BLUE,   desc:"Large American companies" },
  { key:"intlStocks", label:"International",  short:"Intl",  color:PURPLE, desc:"Non-US global markets" },
  { key:"bonds",      label:"Bonds",          short:"Bonds", color:GOLD,   desc:"Government & corporate debt" },
  { key:"reits",      label:"Real Estate",    short:"REIT",  color:AMBER,  desc:"Property investment trusts" },
  { key:"cash",       label:"Cash",           short:"Cash",  color:SLATE,  desc:"Savings & money market" },
];

const SCENARIOS = [
  {
    id:"black_monday", title:"Black Monday", period:"Oct – Dec 1987",
    emoji:"📉", color:RED, num:1,
    intro:"It is October 19, 1987. The Dow Jones falls 22.6% in a single day — the largest one-day percentage drop in market history. By month-end, global markets have cratered. You are fully invested.",
    lesson:"Single-day shocks are terrifying but historically brief. Bonds and cash barely moved during Black Monday — they are the ballast that keeps the ship upright. Equity-heavy portfolios take the full force of the wave.",
    profileLesson:"The Anchor and Navigator profiles barely register this event. The Captain and Adventurer portfolios absorb a severe hit. The Control Portfolio's 35% in bonds and cash cushions the blow significantly — illustrating exactly why diversification exists.",
    headlines:[
      { at:0.15, text:"Wall Street suffers worst day in history — Dow plunges 508 points" },
      { at:0.42, text:"Global markets in freefall — London, Tokyo, Hong Kong all crashing" },
      { at:0.68, text:"Fed pledges unlimited liquidity — panic begins to stabilise" },
      { at:0.88, text:"Markets recover sharply — analysts call it a technical correction" },
    ],
    series:{
      usStocks:   [100,96,88,76,72,70,71,74,79,84,90,95,98,100],
      intlStocks: [100,97,90,79,75,73,74,76,80,85,89,93,97,100],
      bonds:      [100,100,101,101,102,102,102,103,103,103,103,102,103,103],
      reits:      [100,98,93,86,83,82,82,84,87,90,93,95,97,99],
      cash:       [100,100,100,101,101,101,101,101,101,102,102,102,102,102],
    },
    returns:{ usStocks:-0.237, intlStocks:-0.215, bonds:0.028, reits:-0.142, cash:0.016 },
  },
  {
    id:"dotcom", title:"The Dot-com Collapse", period:"Mar 2000 – Oct 2002",
    emoji:"💻", color:AMBER, num:2,
    intro:"It is March 2000. The Nasdaq has just peaked at 5,048 — up 400% in five years. Technology stocks have defied all valuation logic. Then, quietly at first, the selling begins.",
    lesson:"Sector concentration is the fastest route to permanent capital impairment. The S&P 500 fell 49%. The Nasdaq fell 78%. But bonds and real estate had their best years in decades — a diversified portfolio not only survived, it grew.",
    profileLesson:"Adventurer and Captain profiles with heavy equity exposure are devastated. Anchor and Navigator profiles — counterintuitively — end this period positive. The Control Portfolio's bond and REIT allocation turns a disaster into a manageable event.",
    headlines:[
      { at:0.10, text:"Nasdaq hits all-time high of 5,048 — the new economy has no ceiling" },
      { at:0.32, text:"Dot-com darlings collapse — investors flee tech stocks" },
      { at:0.58, text:"Nasdaq down 50% — analysts warn the worst may not be over" },
      { at:0.80, text:"Markets find floor — value investors begin cautious re-entry" },
    ],
    series:{
      usStocks:   [100,108,115,110,100,88,76,65,57,52,50,49,50,51],
      intlStocks: [100,106,112,106,96,85,74,64,58,54,52,50,55,56],
      bonds:      [100,102,105,109,113,117,121,124,127,129,130,131,131,131],
      reits:      [100,103,107,111,114,117,120,124,128,132,135,137,138,139],
      cash:       [100,101,102,103,104,105,106,107,108,108,109,109,110,110],
    },
    returns:{ usStocks:-0.491, intlStocks:-0.438, bonds:0.312, reits:0.385, cash:0.098 },
  },
  {
    id:"lost_decade", title:"The Lost Decade", period:"Jan 2004 – Dec 2010",
    emoji:"🏠", color:PURPLE, num:3,
    intro:"It is 2004. Housing prices are climbing everywhere. Real estate never goes down has become conventional wisdom. Banks are lending freely. Everyone feels wealthy on paper. The seeds of catastrophe are already planted.",
    lesson:"The housing boom masked systemic risk building for years. When it unwound in 2008 it took nearly everything with it — except bonds. Real estate, widely seen as safe, was the epicenter. This period rewards patience and penalises concentration.",
    profileLesson:"Portfolios overweight in real estate or US equities suffered the full force of 2008. The full 2004-2010 period still ended negatively for equity-heavy allocations. The Control Portfolio's bond weighting provides the recovery runway that pure equity portfolios never had.",
    headlines:[
      { at:0.12, text:"Housing market booming — prices up 15% nationwide for third straight year" },
      { at:0.38, text:"Subprime mortgage defaults rising — banks dismiss concerns as isolated" },
      { at:0.55, text:"Bear Stearns collapses — Wall Street in shock" },
      { at:0.78, text:"Government bailouts stabilise system — slow, painful recovery begins" },
    ],
    series:{
      usStocks:   [100,108,115,120,124,126,118,100,80,68,72,80,88,95],
      intlStocks: [100,110,120,128,134,138,126,105,82,70,74,83,92,94],
      bonds:      [100,102,104,106,107,108,112,118,122,125,126,127,127,128],
      reits:      [100,110,122,135,148,158,142,110,72,55,60,70,80,88],
      cash:       [100,102,104,106,108,110,111,111,111,112,112,113,113,114],
    },
    returns:{ usStocks:-0.098, intlStocks:-0.065, bonds:0.287, reits:-0.312, cash:0.142 },
  },
  {
    id:"financial_crisis", title:"The Financial Crisis", period:"Sep 2008 – Mar 2009",
    emoji:"🏦", color:RED, num:4,
    intro:"It is September 2008. Lehman Brothers has filed for bankruptcy — the largest in US history. Credit markets are frozen. This is not a bear market. This is a systemic failure. Every portfolio on earth is about to be tested.",
    lesson:"Systemic crises are categorically different from ordinary bear markets. Correlations between risky assets converge — almost everything falls together. Bonds and cash are not just ballast here. They are the lifeboat. This is the moment the Control Portfolio was built for.",
    profileLesson:"The Adventurer loses more than half their value in six months. The Anchor barely moves. The difference is not intelligence — it is allocation. The Control Portfolio's 35% in bonds and cash keeps it from capsizing and positions it for the recovery that follows.",
    headlines:[
      { at:0.12, text:"Lehman Brothers files for bankruptcy — $639 billion in assets" },
      { at:0.32, text:"Markets in freefall — Dow drops 777 points in a single session" },
      { at:0.55, text:"Fed and Treasury announce $700 billion emergency bailout" },
      { at:0.82, text:"Markets find bottom — March 2009 — cautious recovery begins" },
    ],
    series:{
      usStocks:   [100,90,78,64,52,44,40,38,36,37,38,40,44,50],
      intlStocks: [100,88,75,61,50,43,39,37,35,36,37,40,44,47],
      bonds:      [100,102,104,106,107,107,106,106,106,106,107,107,107,106],
      reits:      [100,85,68,50,37,28,24,22,20,21,23,26,29,32],
      cash:       [100,100,101,101,101,101,101,101,101,102,102,102,102,102],
    },
    returns:{ usStocks:-0.565, intlStocks:-0.534, bonds:0.058, reits:-0.681, cash:0.021 },
  },
  {
    id:"covid", title:"COVID Crash and Recovery", period:"Feb – Dec 2020",
    emoji:"🦠", color:GREEN, num:5,
    intro:"It is February 20, 2020. A respiratory virus is spreading globally. Markets have barely reacted. Then in 33 days the S&P 500 falls 34% — the fastest decline of that magnitude in history. And then something extraordinary happens.",
    lesson:"The COVID crash is the purest test of investor temperament in modern history. The crash was historic. The recovery was equally historic. Every portfolio that stayed invested ended 2020 positive. Every portfolio that sold in March locked in a permanent loss.",
    profileLesson:"This is the scenario where allocation matters least and temperament matters most. All profiles that held recovered and ended positive. The lesson is not about diversification — it is about staying in the boat when the storm is at its worst.",
    headlines:[
      { at:0.12, text:"WHO declares COVID-19 a global pandemic — markets in shock" },
      { at:0.30, text:"S&P 500 down 34% in 33 days — fastest crash in history" },
      { at:0.48, text:"Fed cuts rates to zero — Congress passes $2 trillion stimulus" },
      { at:0.75, text:"Markets recover all losses — S&P hits new all-time high" },
    ],
    series:{
      usStocks:   [100,98,94,86,74,66,70,76,84,92,100,108,114,118],
      intlStocks: [100,98,93,84,73,68,71,75,80,86,92,97,102,108],
      bonds:      [100,101,103,106,107,107,107,106,106,106,107,107,108,108],
      reits:      [100,97,91,80,65,57,59,63,68,73,79,84,89,95],
      cash:       [100,100,100,100,100,100,100,100,100,101,101,101,101,101],
    },
    returns:{ usStocks:0.184, intlStocks:0.077, bonds:0.076, reits:-0.052, cash:0.005 },
  },
];

const calcReturn = (alloc, returns) =>
  ASSETS.reduce((sum,a) => sum+(alloc[a.key]/100)*returns[a.key], 0);

const buildPortfolioSeries = (alloc, series) => {
  const len = series.usStocks.length;
  return Array.from({ length:len }, (_,i) =>
    ASSETS.reduce((sum,a) => sum+(alloc[a.key]/100)*series[a.key][i], 0)
  );
};

const fmt$ = v => "$"+Math.round(Math.abs(v)).toLocaleString();
const fmtPct = v => (v>=0?"+":"")+(v*100).toFixed(1)+"%";
const totalAlloc = a => ASSETS.reduce((s,x)=>s+a[x.key],0);

// ── PRIMITIVES ────────────────────────────────────────────────────
const Card = ({ children, style={}, gold=false, amber=false, green=false, red=false, blue=false }) => {
  const bg = gold?"rgba(212,160,23,0.08)":amber?"rgba(217,119,6,0.1)":green?"rgba(34,197,94,0.08)":red?"rgba(239,68,68,0.08)":blue?"rgba(59,130,246,0.08)":SURF;
  const br = gold?BORDERHI:amber?"rgba(217,119,6,0.25)":green?"rgba(34,197,94,0.25)":red?"rgba(239,68,68,0.25)":blue?"rgba(59,130,246,0.3)":BORDER;
  return <div style={{ background:bg, border:"1px solid "+br, borderRadius:"14px", padding:"22px", marginBottom:"18px", ...style }}>{children}</div>;
};
const SL = ({ children, c=GOLD }) => <div style={{ color:c, fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase", fontFamily:FM, marginBottom:"10px" }}>{children}</div>;
const H1 = ({ children, style={} }) => <h1 style={{ fontFamily:FD, fontSize:"clamp(22px,4vw,34px)", fontWeight:700, color:TP, lineHeight:1.15, marginBottom:"14px", ...style }}>{children}</h1>;
const H2 = ({ children, style={} }) => <h2 style={{ fontFamily:FD, fontSize:"clamp(15px,2.5vw,20px)", fontWeight:700, color:TP, lineHeight:1.2, marginBottom:"10px", ...style }}>{children}</h2>;
const Body = ({ children, style={} }) => <p style={{ fontFamily:FB, fontSize:"15px", lineHeight:1.85, color:TB, marginBottom:"14px", ...style }}>{children}</p>;
const Btn = ({ children, onClick, outline=false, small=false, disabled=false, color=GOLD, style={} }) => (
  <button onClick={onClick} disabled={disabled} style={{ background:disabled?"#111":outline?"transparent":color, color:disabled?TM:outline?color:"#000", border:"1px solid "+(disabled?BORDER:color), borderRadius:"8px", padding:small?"7px 14px":outline?"10px 20px":"12px 24px", fontSize:small?"12px":"14px", fontWeight:700, cursor:disabled?"not-allowed":"pointer", display:"inline-flex", alignItems:"center", gap:"7px", fontFamily:FB, opacity:disabled?0.45:1, ...style }}>{children}</button>
);
const Page = ({ children }) => <div style={{ maxWidth:"800px", margin:"0 auto", padding:"28px 20px 80px" }}>{children}</div>;
const AppHeader = ({ label }) => (
  <header style={{ background:"rgba(0,0,0,0.96)", borderBottom:"1px solid "+BORDER, padding:"13px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
    <div style={{ display:"flex", alignItems:"center", gap:"8px", color:GOLD, fontFamily:FD, fontSize:"16px", fontWeight:700 }}>
      <TrendingUp size={16} color={GOLD}/> Investment Club
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
      {label && <span style={{ fontFamily:FM, fontSize:"10px", color:TM }}>{label}</span>}
      <div style={{ background:"rgba(212,160,23,0.08)", border:"1px solid "+BORDERHI, borderRadius:"20px", padding:"3px 12px", fontFamily:FM, fontSize:"10px", color:GOLD }}>MODULE 4.2</div>
    </div>
  </header>
);

// ── DOLLAR ALLOCATOR ─────────────────────────────────────────────
// Dollar inputs for 4 asset classes. Cash = whatever is left unallocated.
// Internally alloc stays %-based for all math — conversion happens here only.
const INPUT_ASSETS = [
  { key:"usStocks",   label:"US Stocks",     color:BLUE,   desc:"Large American companies. Highest long-term growth, highest volatility." },
  { key:"intlStocks", label:"International", color:PURPLE, desc:"Non-US developed and emerging markets. Geographic diversification." },
  { key:"bonds",      label:"Bonds",         color:GOLD,   desc:"Government & corporate debt. Stabilises portfolio in crashes." },
  { key:"reits",      label:"Real Estate",   color:AMBER,  desc:"Property investment trusts. Income-generating real estate exposure." },
];

const dollarsToPct = (dollars) => {
  const cash = Math.max(0, START - Object.values(dollars).reduce((a,b)=>a+b,0));
  return {
    usStocks:   Math.round((dollars.usStocks/START)*100),
    intlStocks: Math.round((dollars.intlStocks/START)*100),
    bonds:      Math.round((dollars.bonds/START)*100),
    reits:      Math.round((dollars.reits/START)*100),
    cash:       Math.round((cash/START)*100),
  };
};

const pctToDollars = (pct) => ({
  usStocks:   Math.round((pct.usStocks/100)*START),
  intlStocks: Math.round((pct.intlStocks/100)*START),
  bonds:      Math.round((pct.bonds/100)*START),
  reits:      Math.round((pct.reits/100)*START),
});

const Allocator = ({ alloc, onChange }) => {
  const [dollars, setDollars] = useState(() => pctToDollars(alloc));
  // Sync dollars when profile loader changes alloc externally
  useEffect(() => {
    setDollars(pctToDollars(alloc));
  }, [alloc.usStocks, alloc.intlStocks, alloc.bonds, alloc.reits]);

  const invested = Object.values(dollars).reduce((a,b)=>a+b,0);
  const cashLeft = START - invested;
  const overAllocated = cashLeft < 0;
  const pct = dollarsToPct(dollars);

  const handleCommit = (key, raw) => {
    const val = parseInt(raw.replace(/[^0-9]/g,""),10)||0;
    const otherTotal = Object.entries(dollars).filter(([k])=>k!==key).reduce((a,[,v])=>a+v,0);
    const capped = Math.min(val, START - otherTotal);
    const committed = Math.max(0, capped);
    const next = { ...dollars, [key]: committed };
    setDollars(next);
    onChange(dollarsToPct(next));
  };

  return (
    <div>
      {/* POOL */}
      <div style={{ textAlign:"center", padding:"20px 16px 16px", background:overAllocated?"rgba(239,68,68,0.08)":cashLeft===0?"rgba(34,197,94,0.08)":"rgba(212,160,23,0.06)", border:"1px solid "+(overAllocated?"rgba(239,68,68,0.35)":cashLeft===0?"rgba(34,197,94,0.3)":BORDERHI), borderRadius:"14px", marginBottom:"20px" }}>
        <div style={{ fontFamily:FM, fontSize:"10px", color:TM, letterSpacing:"0.12em", marginBottom:"8px" }}>AVAILABLE TO ALLOCATE</div>
        <div style={{ fontFamily:FD, fontSize:"clamp(36px,6vw,52px)", fontWeight:700, color:overAllocated?RED:cashLeft===0?GREEN:GOLD, lineHeight:1 }}>
          ${Math.abs(cashLeft).toLocaleString()}
        </div>
        <div style={{ fontFamily:FB, fontSize:"13px", color:TB, marginTop:"8px" }}>
          {overAllocated
            ? "Over-allocated by $"+Math.abs(cashLeft).toLocaleString()+" — reduce one or more fields"
            : cashLeft===0
            ? "Fully invested — all $"+START.toLocaleString()+" allocated"
            : "Any unallocated funds are held as cash in your portfolio"}
        </div>
        {cashLeft>0 && !overAllocated && (
          <div style={{ fontFamily:FM, fontSize:"11px", color:SLATE, marginTop:"6px" }}>
            Cash position: ${cashLeft.toLocaleString()} ({pct.cash}% of portfolio)
          </div>
        )}
      </div>

      {/* INPUT FIELDS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"12px" }}>
        {INPUT_ASSETS.map(a=>(
          <DollarField
            key={a.key}
            asset={a}
            value={dollars[a.key]}
            pct={pct[a.key]}
            onCommit={val=>handleCommit(a.key,val)}
          />
        ))}
      </div>

      {overAllocated && (
        <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"10px", padding:"12px 16px", marginTop:"14px", display:"flex", gap:"8px", alignItems:"center" }}>
          <AlertCircle size={14} color={RED} style={{ flexShrink:0 }}/>
          <Body style={{ margin:0, fontSize:"13px" }}>You have over-allocated your funds. Reduce one or more fields before running the simulation. The Run button will remain locked.</Body>
        </div>
      )}
    </div>
  );
};

// ── DOLLAR FIELD ─────────────────────────────────────────────────
// Owns its own raw string — never interferes while user is typing.
// Only commits the parsed/capped value to parent on blur.
const DollarField = ({ asset, value, pct, onCommit }) => {
  const [raw, setRaw] = useState(value>0?String(value):"");
  const [isFocused, setIsFocused] = useState(false);

  // When parent value changes (e.g. profile loaded), sync raw if not focused
  useEffect(()=>{
    if(!isFocused) setRaw(value>0?String(value):"");
  },[value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    // Show plain number without commas while editing
    setRaw(value>0?String(value):"");
  };

  const handleChange = e => {
    // Only allow digits while typing — no auto-correction
    const digits = e.target.value.replace(/[^0-9]/g,"");
    setRaw(digits);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onCommit(raw);
  };

  const displayValue = isFocused ? raw : (value>0?value.toLocaleString():"");

  return (
    <div style={{ background:SURF, border:"1px solid "+(value>0?asset.color+"50":isFocused?BORDERHI:BORDER), borderRadius:"12px", padding:"16px 14px", transition:"border-color 0.2s" }}>
      <div style={{ fontFamily:FM, fontSize:"9px", color:asset.color, letterSpacing:"0.1em", marginBottom:"6px" }}>{asset.label.toUpperCase()}</div>
      <div style={{ fontFamily:FB, fontSize:"11px", color:TB, marginBottom:"12px", lineHeight:1.4, minHeight:"30px" }}>{asset.desc}</div>
      <div style={{ position:"relative", marginBottom:"8px" }}>
        <span style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", fontFamily:FD, fontSize:"16px", color:value>0?asset.color:TM, fontWeight:700, pointerEvents:"none" }}>$</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          placeholder="0"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          style={{ width:"100%", background:SURF2, border:"1px solid "+(isFocused?asset.color+"80":BORDER), borderRadius:"8px", padding:"10px 10px 10px 28px", fontFamily:FD, fontSize:"16px", fontWeight:700, color:value>0?asset.color:TB, outline:"none", boxSizing:"border-box" }}
        />
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontFamily:FM, fontSize:"10px", color:TM }}>of portfolio</div>
        <div style={{ fontFamily:FD, fontSize:"18px", fontWeight:700, color:value>0?asset.color:TM }}>{pct}%</div>
      </div>
    </div>
  );
};

// ── DUAL CHART (persistent — stays visible after animation) ───────
const DualChart = ({ scenario, userAlloc, onDone, autoSkip, forceShow }) => {
  const [visIdx, setVisIdx] = useState(forceShow ? scenario.series.usStocks.length : 1);
  const [hlIdx, setHlIdx] = useState(forceShow ? scenario.headlines.length-1 : -1);
  const [animDone, setAnimDone] = useState(forceShow);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const DURATION = 6000;
  const userSeries = buildPortfolioSeries(userAlloc, scenario.series);
  const ctrlSeries = buildPortfolioSeries(CONTROL, scenario.series);
  const N = userSeries.length;

  useEffect(()=>{
    if(forceShow||autoSkip){ setVisIdx(N); setHlIdx(scenario.headlines.length-1); setAnimDone(true); if(onDone) onDone(); return; }
    const tick = ts => {
      if(!startRef.current) startRef.current=ts;
      const p = Math.min((ts-startRef.current)/DURATION,1);
      const vi = Math.max(2,Math.ceil(p*N));
      setVisIdx(vi);
      let hi=-1;
      scenario.headlines.forEach((h,i)=>{ if(p>=h.at) hi=i; });
      setHlIdx(hi);
      if(p<1) rafRef.current=requestAnimationFrame(tick);
      else { setAnimDone(true); if(onDone) onDone(); }
    };
    rafRef.current=requestAnimationFrame(tick);
    return ()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  },[autoSkip,forceShow]);

  const W=600, H=200, pX=36, pY=16;
  const allVals=[...userSeries,...ctrlSeries];
  const mn=Math.min(...allVals)-2, mx=Math.max(...allVals)+2, rng=mx-mn;
  const px = i => pX+(i/(N-1))*(W-pX*2);
  const py = v => pY+((mx-v)/rng)*(H-pY*2);
  const vis = Math.min(visIdx,N);
  const uPath = userSeries.slice(0,vis).map((_,i)=>px(i)+","+py(userSeries[i])).join(" ");
  const cPath = ctrlSeries.slice(0,vis).map((_,i)=>px(i)+","+py(ctrlSeries[i])).join(" ");
  const hl = hlIdx>=0 ? scenario.headlines[hlIdx] : null;
  const userFinal = userSeries[vis-1];
  const ctrlFinal = ctrlSeries[vis-1];

  return (
    <div>
      <div style={{ minHeight:"44px", marginBottom:"10px" }}>
        {hl && (
          <div style={{ background:"rgba(212,160,23,0.1)", border:"1px solid "+BORDERHI, borderRadius:"8px", padding:"9px 14px", fontFamily:FD, fontStyle:"italic", fontSize:"13px", color:TP, lineHeight:1.5 }}>
            📰 {hl.text}
          </div>
        )}
      </div>
      <div style={{ background:SURF2, borderRadius:"10px", padding:"14px 12px 8px" }}>
        <div style={{ display:"flex", gap:"18px", marginBottom:"10px", flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <div style={{ width:"18px", height:"3px", background:GOLD, borderRadius:"2px" }}/>
            <span style={{ fontFamily:FM, fontSize:"9px", color:GOLD, letterSpacing:"0.08em" }}>YOUR PORTFOLIO</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <div style={{ width:"18px", borderTop:"2px dashed "+BLUE }}/>
            <span style={{ fontFamily:FM, fontSize:"9px", color:BLUE, letterSpacing:"0.08em" }}>CONTROL PORTFOLIO</span>
          </div>
        </div>
        <svg viewBox={"0 0 "+W+" "+H} style={{ width:"100%", height:H }} preserveAspectRatio="none">
          <line x1={pX} y1={py(100)} x2={W-pX} y2={py(100)} stroke={BORDER} strokeWidth="1" strokeDasharray="3 3"/>
          {vis>1 && <polyline points={cPath} fill="none" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" strokeDasharray="7 4" opacity="0.85"/>}
          {vis>1 && <polyline points={uPath} fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinejoin="round"/>}
          {vis>1 && <circle cx={px(vis-1)} cy={py(userFinal)} r="4" fill={GOLD} stroke="none"/>}
          {vis>1 && <circle cx={px(vis-1)} cy={py(ctrlFinal)} r="3" fill={BLUE} stroke="none"/>}
          <text x={pX} y={py(100)-4} textAnchor="start" fill={TM} fontSize="8" fontFamily={FM}>100</text>
        </svg>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"4px", paddingLeft:pX, paddingRight:pX }}>
          <span style={{ fontFamily:FM, fontSize:"8px", color:TM }}>Start</span>
          <span style={{ fontFamily:FM, fontSize:"8px", color:TM }}>{scenario.period}</span>
          <span style={{ fontFamily:FM, fontSize:"8px", color:TM }}>End</span>
        </div>
      </div>
      {/* LIVE / FINAL READINGS */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"10px" }}>
        <div style={{ display:"flex", gap:"20px" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:FM, fontSize:"8px", color:GOLD, marginBottom:"2px" }}>YOUR PORTFOLIO</div>
            <div style={{ fontFamily:FD, fontWeight:700, color:userFinal>=100?GREEN:RED, fontSize:"18px" }}>{fmtPct((userFinal/100)-1)}</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:FM, fontSize:"8px", color:BLUE, marginBottom:"2px" }}>CONTROL</div>
            <div style={{ fontFamily:FD, fontWeight:700, color:ctrlFinal>=100?GREEN:RED, fontSize:"18px" }}>{fmtPct((ctrlFinal/100)-1)}</div>
          </div>
        </div>
        {!animDone && (
          <div style={{ height:"4px", flex:1, background:SURF, borderRadius:"2px", margin:"0 14px" }}>
            <div style={{ height:"100%", width:((vis/N)*100)+"%", background:scenario.color, borderRadius:"2px", transition:"width 0.1s" }}/>
          </div>
        )}
      </div>
    </div>
  );
};

// ── SOFT GATE ─────────────────────────────────────────────────────
const SoftGate = ({ onContinue }) => (
  <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
    <div style={{ maxWidth:"560px", textAlign:"center" }}>
      <div style={{ fontSize:"52px", marginBottom:"20px" }}>🧭</div>
      <SL>Before You Simulate</SL>
      <H1>Haven't taken the investor profile quiz?</H1>
      <Body>Module 4.1 builds your personal investor profile and preloads this simulator with your natural allocation. Complete it first for the most meaningful experience.</Body>
      <Body>If you prefer to dive straight in, select any profile below to load its allocation, or build your own from scratch. When these modules are hosted together, your profile will load here automatically.</Body>
      <div style={{ background:"rgba(217,119,6,0.08)", border:"1px solid rgba(217,119,6,0.2)", borderRadius:"10px", padding:"12px 16px", margin:"20px 0", display:"flex", gap:"10px", textAlign:"left" }}>
        <AlertCircle size={14} color={AMBER} style={{ flexShrink:0, marginTop:"2px" }}/>
        <Body style={{ margin:0, fontSize:"13px" }}>Profile integration between 4.1 and 4.2 will be automatic when these modules are combined into the full hosted course.</Body>
      </div>
      <Btn onClick={onContinue} style={{ fontSize:"15px", padding:"13px 30px" }}>
        Start the Simulator <ChevronRight size={15}/>
      </Btn>
    </div>
  </div>
);

// ── PROFILE BTN ───────────────────────────────────────────────────
const ProfileBtn = ({ pkey, profile, onChange, setProfile }) => {
  const m = PMETA[pkey];
  const v = PROFILE_DEFAULTS[pkey];
  return (
    <button onClick={()=>{ onChange({...v}); setProfile(pkey); }}
      style={{ background:profile===pkey?m.c+"18":SURF2, border:"1px solid "+(profile===pkey?m.c+"60":BORDER), borderRadius:"8px", padding:"8px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" }}>
      <span style={{ fontSize:"14px" }}>{m.e}</span>
      <span style={{ fontFamily:FM, fontSize:"9px", color:profile===pkey?m.c:TB, letterSpacing:"0.06em", textTransform:"capitalize" }}>{pkey}</span>
    </button>
  );
};

// ── SCENARIO QUEUE ITEM ───────────────────────────────────────────
const ScenarioQueueItem = ({ s, res, done, active, locked, total, onRun }) => (
  <button onClick={()=>!locked&&total===100&&onRun()} disabled={locked||total!==100}
    style={{ background:done?s.color+"0D":active?"rgba(212,160,23,0.06)":SURF, border:"1px solid "+(done?s.color+"35":active?BORDERHI:BORDER), borderRadius:"12px", padding:"14px 18px", textAlign:"left", cursor:locked||total!==100?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:"14px", opacity:locked?0.4:1, width:"100%" }}>
    <div style={{ fontSize:"26px", flexShrink:0 }}>{locked?<Lock size={20} color={TM}/>:s.emoji}</div>
    <div style={{ flex:1 }}>
      <div style={{ fontFamily:FM, fontSize:"9px", color:done?s.color:active?GOLD:TM, letterSpacing:"0.08em", marginBottom:"3px" }}>
        {done?"COMPLETE":active?"UP NEXT":"LOCKED"}
      </div>
      <div style={{ fontFamily:FD, fontWeight:700, color:done?s.color:active?TP:TM, fontSize:"15px", marginBottom:"2px" }}>{s.title}</div>
      <div style={{ fontFamily:FM, fontSize:"10px", color:TM }}>{s.period}</div>
    </div>
    {done && res && (
      <div style={{ textAlign:"right", flexShrink:0 }}>
        <div style={{ fontFamily:FM, fontSize:"8px", color:TM, marginBottom:"3px" }}>YOUR RETURN</div>
        <div style={{ fontFamily:FD, fontWeight:700, color:res.userRet>=0?GREEN:RED, fontSize:"16px" }}>{fmtPct(res.userRet)}</div>
        <div style={{ fontFamily:FM, fontSize:"8px", color:res.userRet>res.ctrlRet?GOLD:BLUE, marginTop:"2px" }}>{res.userRet>res.ctrlRet?"Beat control":"Control won"}</div>
      </div>
    )}
    {active && total===100 && <ChevronRight size={18} color={GOLD}/>}
  </button>
);

// ── BUILDER ───────────────────────────────────────────────────────
const Builder = ({ alloc, onChange, profile, setProfile, onRun, results, currentIdx }) => {
  const invested = ASSETS.filter(a=>a.key!=="cash").reduce((s,a)=>s+alloc[a.key],0);
  const total = Math.min(100, invested + alloc.cash); // always ≤100 in dollar model
  const canRun = invested > 0; // must have at least something invested
  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <AppHeader label={currentIdx<5?"Scenario "+(currentIdx+1)+" of 5 up next":"All scenarios complete"}/>
      <Page>
        <SL>Module 4.2 — The Simulator</SL>
        <H1>{currentIdx===0?"Build Your Portfolio":"Reallocate Before the Next Scenario"}</H1>
        <Card blue>
          <div style={{ display:"flex", gap:"10px" }}>
            <AlertCircle size={15} color={BLUE} style={{ flexShrink:0, marginTop:"2px" }}/>
            <Body style={{ margin:0, fontSize:"13px" }}>
              <strong style={{ color:BLUE }}>Education and entertainment only.</strong> Returns are based on historical data and approximate asset class performance. Past performance does not predict future results. This is not financial advice.
            </Body>
          </div>
        </Card>
        {/* PROFILE LOADER */}
        <Card>
          <H2 style={{ fontSize:"15px" }}>Load a Profile Allocation</H2>
          <Body style={{ fontSize:"13px", marginBottom:"14px" }}>Select your profile from Module 4.1 to preload your natural allocation — or build your own with the controls below.</Body>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {Object.keys(PROFILE_DEFAULTS).map(k=>(
              <ProfileBtn key={k} pkey={k} profile={profile} onChange={onChange} setProfile={setProfile}/>
            ))}
          </div>
        </Card>
        {/* ALLOCATOR */}
        <Card>
          <Allocator alloc={alloc} onChange={onChange}/>
        </Card>
        {/* CONTROL PORTFOLIO */}
        <Card>
          <H2 style={{ fontSize:"15px" }}>The Control Portfolio</H2>
          <Body style={{ fontSize:"13px", marginBottom:"14px" }}>The Control is a professionally diversified benchmark built to demonstrate the power of broad diversification. It runs alongside your portfolio unchanged through every scenario. Use it to gauge how much risk you are accepting relative to a well-balanced baseline.</Body>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"8px" }}>
            {ASSETS.map(a=>(
              <div key={a.key} style={{ textAlign:"center", background:SURF2, borderRadius:"8px", padding:"10px 4px" }}>
                <div style={{ fontFamily:FM, fontSize:"8px", color:a.color, marginBottom:"4px", letterSpacing:"0.05em" }}>{a.short}</div>
                <div style={{ fontFamily:FD, fontWeight:700, color:a.color, fontSize:"18px" }}>{CONTROL[a.key]}%</div>
              </div>
            ))}
          </div>
        </Card>
        {/* SCENARIO QUEUE */}
        <H2 style={{ fontSize:"16px", marginBottom:"6px" }}>Five Historical Scenarios</H2>
        <Body style={{ fontSize:"13px", marginBottom:"16px" }}>Each scenario starts with <strong style={{ color:TP }}>${START.toLocaleString()}</strong>. Complete them in order — you can reallocate between each one.</Body>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"28px" }}>
          {SCENARIOS.map((s,i)=>(
            <ScenarioQueueItem key={s.id} s={s} res={results[i]} done={i<currentIdx} active={i===currentIdx} locked={i>currentIdx} total={canRun?100:0} onRun={()=>onRun(i)}/>
          ))}
        </div>
        {currentIdx>=5 && (
          <div style={{ textAlign:"center" }}>
            <Btn onClick={()=>onRun(-1)}>View Full Summary <ChevronRight size={14}/></Btn>
          </div>
        )}
      </Page>
    </div>
  );
};

// ── SCENARIO FLOW ─────────────────────────────────────────────────
const ScenarioFlow = ({ scenario, userAlloc, onFinish }) => {
  const [phase, setPhase] = useState("intro");
  const [skipped, setSkipped] = useState(false);
  const [chartDone, setChartDone] = useState(false);
  const userRet = calcReturn(userAlloc, scenario.returns);
  const ctrlRet = calcReturn(CONTROL, scenario.returns);
  const userEnd = START*(1+userRet);
  const ctrlEnd = START*(1+ctrlRet);
  const userWins = userRet>ctrlRet;

  const handleSkip = () => { setSkipped(true); setChartDone(true); setTimeout(()=>setPhase("result"),200); };

  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <AppHeader label={"Scenario "+scenario.num+" of 5 — "+scenario.title}/>
      <Page>
        {phase==="intro" && (
          <>
            <div style={{ display:"flex", gap:"14px", alignItems:"center", marginBottom:"16px" }}>
              <div style={{ fontSize:"40px" }}>{scenario.emoji}</div>
              <div>
                <SL c={scenario.color}>Scenario {scenario.num} of 5 · {scenario.period}</SL>
                <H1 style={{ marginBottom:0 }}>{scenario.title}</H1>
              </div>
            </div>
            <Card style={{ borderColor:scenario.color+"50", background:scenario.color+"0A" }}>
              <Body style={{ fontSize:"16px", fontStyle:"italic", marginBottom:0, color:TP }}>{scenario.intro}</Body>
            </Card>
            <Card>
              <H2 style={{ fontSize:"15px" }}>Your portfolio enters with ${START.toLocaleString()}</H2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"8px" }}>
                {ASSETS.map(a=>(
                  <div key={a.key} style={{ background:SURF2, borderRadius:"8px", padding:"10px 4px", textAlign:"center" }}>
                    <div style={{ fontFamily:FM, fontSize:"8px", color:a.color, marginBottom:"4px" }}>{a.short}</div>
                    <div style={{ fontFamily:FD, fontWeight:700, color:a.color, fontSize:"17px" }}>{userAlloc[a.key]}%</div>
                  </div>
                ))}
              </div>
            </Card>
            <div style={{ display:"flex", justifyContent:"center", marginTop:"8px" }}>
              <Btn onClick={()=>setPhase("running")} style={{ fontSize:"15px", padding:"13px 30px" }}>
                <Play size={15}/> Run This Scenario
              </Btn>
            </div>
          </>
        )}

        {phase==="running" && (
          <>
            <SL c={scenario.color}>Scenario {scenario.num} of 5 · {scenario.period}</SL>
            <H1>{scenario.title}</H1>
            <Card>
              <DualChart scenario={scenario} userAlloc={userAlloc} autoSkip={skipped} forceShow={false}
                onDone={()=>{ setChartDone(true); setTimeout(()=>setPhase("result"),900); }}/>
              {!chartDone && (
                <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"12px" }}>
                  <Btn small outline onClick={handleSkip}><SkipForward size={12}/> Skip</Btn>
                </div>
              )}
            </Card>
          </>
        )}

        {phase==="result" && (
          <>
            <SL c={scenario.color}>Scenario {scenario.num} Results · {scenario.period}</SL>
            <H1>{scenario.title}</H1>
            {/* PERSISTENT CHART — always shown on results */}
            <Card>
              <H2 style={{ fontSize:"14px", marginBottom:"12px" }}>Full Scenario Chart</H2>
              <DualChart scenario={scenario} userAlloc={userAlloc} autoSkip={false} forceShow={true} onDone={null}/>
            </Card>
            {/* OUTCOME */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"18px" }}>
              <div style={{ background:userRet>=0?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)", border:"1px solid "+(userRet>=0?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"), borderRadius:"14px", padding:"20px", textAlign:"center" }}>
                <div style={{ fontFamily:FM, fontSize:"9px", color:GOLD, marginBottom:"8px", letterSpacing:"0.1em" }}>YOUR PORTFOLIO</div>
                <div style={{ fontFamily:FD, fontSize:"38px", fontWeight:700, color:userRet>=0?GREEN:RED }}>{fmtPct(userRet)}</div>
                <div style={{ fontFamily:FM, fontSize:"11px", color:TB, marginTop:"6px" }}>${START.toLocaleString()} → {fmt$(userEnd)}</div>
                <div style={{ fontFamily:FM, fontSize:"12px", color:userRet>=0?GREEN:RED, marginTop:"4px", fontWeight:700 }}>{userRet>=0?"+":""}{fmt$(userEnd-START)} {userRet>=0?"gained":"lost"}</div>
              </div>
              <div style={{ background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.3)", borderRadius:"14px", padding:"20px", textAlign:"center" }}>
                <div style={{ fontFamily:FM, fontSize:"9px", color:BLUE, marginBottom:"8px", letterSpacing:"0.1em" }}>CONTROL PORTFOLIO</div>
                <div style={{ fontFamily:FD, fontSize:"38px", fontWeight:700, color:ctrlRet>=0?GREEN:RED }}>{fmtPct(ctrlRet)}</div>
                <div style={{ fontFamily:FM, fontSize:"11px", color:TB, marginTop:"6px" }}>${START.toLocaleString()} → {fmt$(ctrlEnd)}</div>
                <div style={{ fontFamily:FM, fontSize:"12px", color:ctrlRet>=0?GREEN:RED, marginTop:"4px", fontWeight:700 }}>{ctrlRet>=0?"+":""}{fmt$(ctrlEnd-START)} {ctrlRet>=0?"gained":"lost"}</div>
              </div>
            </div>
            {/* VERDICT */}
            <Card gold>
              <div style={{ display:"flex", gap:"12px" }}>
                <div style={{ fontSize:"28px", flexShrink:0 }}>{userWins?"🏆":"📊"}</div>
                <div>
                  <H2 style={{ fontSize:"16px", color:userWins?GOLD:BLUE }}>{userWins?"Your portfolio outperformed the Control":"The Control Portfolio outperformed you"}</H2>
                  <Body style={{ marginBottom:0 }}>{userWins?"Your allocation had an edge in this scenario. One win is a data point — the pattern across all five tells the real story.":"The Control Portfolio's diversification gave it an advantage here. Adjust your allocation before the next scenario and see if you can close the gap."}</Body>
                </div>
              </div>
            </Card>
            {/* ASSET BREAKDOWN */}
            <Card>
              <H2 style={{ fontSize:"15px" }}>What each asset class did</H2>
              {ASSETS.map(a=>{
                const r = scenario.returns[a.key];
                return (
                  <div key={a.key} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
                    <div style={{ fontFamily:FB, fontSize:"13px", color:TB, width:"108px", flexShrink:0 }}>{a.label}</div>
                    <div style={{ flex:1, height:"6px", background:SURF2, borderRadius:"3px" }}>
                      <div style={{ height:"100%", width:Math.max(2,Math.abs(r)*100)+"%", maxWidth:"100%", background:r>=0?a.color:RED, borderRadius:"3px", opacity:0.75 }}/>
                    </div>
                    <div style={{ fontFamily:FM, fontSize:"12px", fontWeight:700, color:r>=0?GREEN:RED, width:"52px", textAlign:"right", flexShrink:0 }}>{fmtPct(r)}</div>
                    <div style={{ fontFamily:FM, fontSize:"10px", color:TM, width:"34px", textAlign:"right", flexShrink:0 }}>{userAlloc[a.key]}%</div>
                  </div>
                );
              })}
            </Card>
            {/* LESSON */}
            <Card amber>
              <div style={{ fontFamily:FM, fontSize:"9px", color:AMBER, letterSpacing:"0.1em", marginBottom:"10px" }}>THE LESSON</div>
              <Body style={{ marginBottom:"10px" }}>{scenario.lesson}</Body>
              <Body style={{ margin:0, fontSize:"13px" }}>{scenario.profileLesson}</Body>
            </Card>
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"8px" }}>
              <Btn onClick={()=>onFinish({ userRet, ctrlRet, userEnd, ctrlEnd })} style={{ fontSize:"14px" }}>
                {scenario.num<5?"Reallocate & Continue":"See Final Summary"} <ChevronRight size={14}/>
              </Btn>
            </div>
          </>
        )}
      </Page>
    </div>
  );
};

// ── SUMMARY ROW ───────────────────────────────────────────────────
const SummaryRow = ({ s, r }) => {
  if(!r) return (
    <tr>
      <td style={{ fontFamily:FB, fontSize:"13px", color:TP, padding:"10px 14px 10px 0", borderBottom:"1px solid "+BORDER }}>{s.emoji} {s.title}</td>
      <td colSpan={5} style={{ fontFamily:FM, fontSize:"11px", color:TM, padding:"10px 0", borderBottom:"1px solid "+BORDER, fontStyle:"italic" }}>Not completed</td>
    </tr>
  );
  const uw = r.userRet>r.ctrlRet;
  return (
    <tr>
      <td style={{ fontFamily:FB, fontSize:"13px", color:TP, padding:"10px 14px 10px 0", borderBottom:"1px solid "+BORDER, whiteSpace:"nowrap" }}>{s.emoji} {s.title}</td>
      <td style={{ fontFamily:FM, fontSize:"13px", fontWeight:700, color:r.userRet>=0?GREEN:RED, padding:"10px 14px 10px 0", borderBottom:"1px solid "+BORDER }}>{fmtPct(r.userRet)}</td>
      <td style={{ fontFamily:FM, fontSize:"12px", color:TB, padding:"10px 14px 10px 0", borderBottom:"1px solid "+BORDER }}>{fmt$(r.userEnd)}</td>
      <td style={{ fontFamily:FM, fontSize:"13px", fontWeight:700, color:r.ctrlRet>=0?GREEN:RED, padding:"10px 14px 10px 0", borderBottom:"1px solid "+BORDER }}>{fmtPct(r.ctrlRet)}</td>
      <td style={{ fontFamily:FM, fontSize:"12px", color:TB, padding:"10px 14px 10px 0", borderBottom:"1px solid "+BORDER }}>{fmt$(r.ctrlEnd)}</td>
      <td style={{ fontFamily:FM, fontSize:"12px", fontWeight:700, color:uw?GOLD:BLUE, padding:"10px 0", borderBottom:"1px solid "+BORDER }}>{uw?"You ✦":"Control"}</td>
    </tr>
  );
};

// ── SUMMARY ───────────────────────────────────────────────────────
const Summary = ({ results, onRestart, onMap }) => {
  const done = results.filter(Boolean);
  const userWins = done.filter(r=>r.userRet>r.ctrlRet).length;
  const ctrlWins = done.length-userWins;
  const avgU = done.reduce((a,r)=>a+r.userRet,0)/(done.length||1);
  const avgC = done.reduce((a,r)=>a+r.ctrlRet,0)/(done.length||1);
  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <AppHeader label="Final Summary"/>
      <Page>
        <SL>All 5 Scenarios Complete</SL>
        <H1>Your Results vs The Control</H1>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"24px" }}>
          <div style={{ background:"rgba(212,160,23,0.08)", border:"1px solid "+BORDERHI, borderRadius:"14px", padding:"22px", textAlign:"center" }}>
            <div style={{ fontFamily:FM, fontSize:"9px", color:GOLD, marginBottom:"8px", letterSpacing:"0.1em" }}>YOUR WINS</div>
            <div style={{ fontFamily:FD, fontSize:"52px", fontWeight:700, color:GOLD }}>{userWins}</div>
            <div style={{ fontFamily:FM, fontSize:"10px", color:TM }}>of 5 scenarios</div>
            <div style={{ fontFamily:FD, fontSize:"20px", color:avgU>=0?GREEN:RED, marginTop:"10px" }}>Avg {fmtPct(avgU)}</div>
          </div>
          <div style={{ background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.3)", borderRadius:"14px", padding:"22px", textAlign:"center" }}>
            <div style={{ fontFamily:FM, fontSize:"9px", color:BLUE, marginBottom:"8px", letterSpacing:"0.1em" }}>CONTROL WINS</div>
            <div style={{ fontFamily:FD, fontSize:"52px", fontWeight:700, color:BLUE }}>{ctrlWins}</div>
            <div style={{ fontFamily:FM, fontSize:"10px", color:TM }}>of 5 scenarios</div>
            <div style={{ fontFamily:FD, fontSize:"20px", color:avgC>=0?GREEN:RED, marginTop:"10px" }}>Avg {fmtPct(avgC)}</div>
          </div>
        </div>
        <Card>
          <H2 style={{ fontSize:"16px", marginBottom:"16px" }}>Scenario by Scenario</H2>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  {["Scenario","Your Return","End Value","Control Return","Control End","Winner"].map(h=>(
                    <th key={h} style={{ fontFamily:FM, fontSize:"9px", color:TM, letterSpacing:"0.07em", textAlign:"left", paddingBottom:"10px", paddingRight:"14px", borderBottom:"1px solid "+BORDER, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCENARIOS.map((s,i)=>(
                  <SummaryRow key={s.id} s={s} r={results[i]}/>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card amber>
          <div style={{ display:"flex", gap:"12px" }}>
            <div style={{ fontSize:"24px", flexShrink:0 }}>🌊</div>
            <div>
              <H2 style={{ fontSize:"16px" }}>What your results reveal</H2>
              <Body>The Control Portfolio was not designed to win every scenario. It was designed to survive all of them. If it consistently outperformed you, your allocation is carrying more risk than the returns justify.</Body>
              <Body style={{ marginBottom:0 }}>The right portfolio is not the one that performs best on paper — it is the one you can hold without panicking when the storm arrives. Try a different allocation and run through the scenarios again.</Body>
            </div>
          </div>
        </Card>
        <div style={{ display:"flex", gap:"10px", justifyContent:"center", marginTop:"16px", flexWrap:"wrap" }}>
          <Btn onClick={onMap} style={{marginBottom:8}}>← Module Map</Btn>
          <Btn onClick={onRestart} outline><RotateCcw size={14}/> Try a Different Allocation</Btn>
        </div>
      </Page>
    </div>
  );
};

// ── APP ────────────────────────────────────────────────────────────
export default function Module4_2() {
  const navigate = useNavigate();
  const { completeModule } = useUser();
  const [screen, setScreen] = useState("gate");
  const [profile, setProfile] = useState(null);
  const [alloc, setAlloc] = useState({ ...PROFILE_DEFAULTS.sailor });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState([null,null,null,null,null]);
  const go = s => { setScreen(s); window.scrollTo(0,0); };

  const handleRun = idx => {
    if(idx===-1){ go("summary"); return; }
    go("scenario");
  };

  const handleScenarioFinish = result => {
    const nr = [...results];
    nr[currentIdx] = result;
    setResults(nr);
    const next = currentIdx+1;
    setCurrentIdx(next);
    if(next>=5) { completeModule("4.2"); go("summary"); }
    else go("builder");
  };

  const handleRestart = () => {
    setResults([null,null,null,null,null]);
    setCurrentIdx(0);
    setProfile(null);
    setAlloc({ ...PROFILE_DEFAULTS.sailor });
    go("builder");
  };

  if(screen==="gate") return <SoftGate onContinue={()=>go("builder")}/>;
  if(screen==="builder") return (
    <Builder alloc={alloc} onChange={setAlloc} profile={profile} setProfile={setProfile}
      onRun={handleRun} results={results} currentIdx={currentIdx}/>
  );
  if(screen==="scenario") return (
    <ScenarioFlow scenario={SCENARIOS[currentIdx]} userAlloc={alloc} onFinish={handleScenarioFinish}/>
  );
  if(screen==="summary") return (
    <Summary results={results} onRestart={handleRestart} onMap={()=>navigate("/")}/>
  );
  return null;
}

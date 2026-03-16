import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ChevronRight, TrendingUp, Clock, BookOpen, CheckCircle, RotateCcw, Home } from "lucide-react";

const C = { bg:"#000",surface:"#0D0D0D",surface2:"#141414",border:"rgba(212,160,23,0.15)",borderHi:"rgba(212,160,23,0.4)",gold:"#D4A017",goldFaint:"rgba(212,160,23,0.08)",goldGlow:"rgba(212,160,23,0.18)",textPrime:"#F5F0E8",textBody:"#C8C0B0",textMuted:"#7A7060",textDim:"#4A4438",amber:"#D97706",amberFaint:"rgba(217,119,6,0.1)",slate:"#94A3B8",slateFaint:"rgba(148,163,184,0.1)" };
const FD = "'Playfair Display','Georgia',serif", FB = "'Georgia','Times New Roman',serif", FM = "'Courier New',monospace";

const VOCAB = {
  inflation:        { term:"Inflation",            def:"The gradual rise in prices over time, reducing what your money can buy." },
  purchasing_power: { term:"Purchasing Power",     def:"How much goods and services your money can actually buy." },
  asset:            { term:"Asset",                def:"Anything of value you own that has the potential to generate a return." },
  equity:           { term:"Equity",               def:"Ownership. When you buy a stock, you buy equity — a share of ownership." },
  debt_instrument:  { term:"Debt Instrument",      def:"A financial tool representing money borrowed and repaid. Bonds are debt instruments." },
  liquidity:        { term:"Liquidity",            def:"How quickly you can convert an investment to cash without losing value." },
  bond:             { term:"Bond",                 def:"A loan you make to a government or company. They pay interest, then return the principal." },
  fixed_income:     { term:"Fixed Income",         def:"Investments that pay a predictable, regular income — bonds are the primary example." },
  stock:            { term:"Stock",                def:"A share of ownership in a company. If the company grows, your share grows with it." },
  dividend:         { term:"Dividend",             def:"A portion of a company's profits paid out to shareholders, usually quarterly." },
  volatility:       { term:"Volatility",           def:"How much an investment's value swings up and down over time." },
  mutual_fund:      { term:"Mutual Fund",          def:"A pool of money from many investors, managed by a professional." },
  expense_ratio:    { term:"Expense Ratio",        def:"The annual fee charged to manage a fund, as a percentage of your investment." },
  index_fund:       { term:"Index Fund",           def:"A fund that tracks a market index like the S&P 500, buying all its stocks automatically." },
  etf:              { term:"ETF",                  def:"Exchange-Traded Fund — an index fund that trades on a stock exchange like a regular stock." },
  passive_investing:{ term:"Passive Investing",    def:"Matching market returns by owning index funds, rather than trying to beat the market." },
};

const VT = ({ id, children }) => {
  const [show, setShow] = useState(false);
  const v = VOCAB[id]; if (!v) return <span>{children}</span>;
  return (
    <span style={{ position:"relative", display:"inline" }}>
      <span onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)} onTouchStart={()=>setShow(s=>!s)}
        style={{ fontWeight:700, borderBottom:`2px solid ${C.gold}`, color:C.gold, cursor:"help" }}>{children}</span>
      {show && <span style={{ position:"absolute", bottom:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)", background:"#1A1400", border:`1px solid ${C.gold}`, borderRadius:"8px", padding:"10px 14px", width:"220px", zIndex:999, boxShadow:"0 8px 32px rgba(0,0,0,0.8)", pointerEvents:"none", display:"block" }}>
        <span style={{ display:"block", color:C.gold, fontWeight:700, fontSize:"10px", marginBottom:"5px", letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:FM }}>{v.term}</span>
        <span style={{ color:C.textBody, fontSize:"12px", lineHeight:"1.6", fontFamily:FB }}>{v.def}</span>
      </span>}
    </span>
  );
};

const Card = ({ children, style={}, gold=false, amber=false, slate=false }) => (
  <div style={{ background:gold?C.goldFaint:amber?C.amberFaint:slate?C.slateFaint:C.surface, border:`1px solid ${gold?C.borderHi:amber?"rgba(217,119,6,0.25)":slate?"rgba(148,163,184,0.2)":C.border}`, borderRadius:"14px", padding:"24px", marginBottom:"20px", ...style }}>{children}</div>
);
const SL = ({ children }) => <div style={{ color:C.gold, fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase", fontFamily:FM, marginBottom:"12px" }}>{children}</div>;
const H1 = ({ children, style={} }) => <h1 style={{ fontFamily:FD, fontSize:"clamp(24px,5vw,40px)", fontWeight:700, color:C.textPrime, lineHeight:1.15, marginBottom:"18px", ...style }}>{children}</h1>;
const H2 = ({ children, style={} }) => <h2 style={{ fontFamily:FD, fontSize:"clamp(16px,3vw,22px)", fontWeight:700, color:C.textPrime, lineHeight:1.2, marginBottom:"12px", ...style }}>{children}</h2>;
const Body = ({ children, style={} }) => <p style={{ fontFamily:FB, fontSize:"15px", lineHeight:1.85, color:C.textBody, marginBottom:"16px", ...style }}>{children}</p>;
const Lead = ({ children }) => <p style={{ fontFamily:FB, fontSize:"17px", lineHeight:1.75, color:C.textBody, marginBottom:"28px" }}>{children}</p>;
const Btn = ({ children, onClick, outline=false, small=false, style={} }) => (
  <button onClick={onClick} style={{ background:outline?"transparent":C.gold, color:outline?C.gold:"#000", border:`1px solid ${C.gold}`, borderRadius:"8px", padding:small?"7px 14px":outline?"10px 20px":"12px 24px", fontSize:small?"12px":"14px", fontWeight:700, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"7px", fontFamily:FB, ...style }}>{children}</button>
);
const Page = ({ children }) => <div style={{ maxWidth:"780px", margin:"0 auto", padding:"32px 20px 80px" }}>{children}</div>;
const ReadingGate = ({ onReady, label="Continue" }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setReady(true), 5000); return ()=>clearTimeout(t); }, []);
  return <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"28px" }}>{ready ? <Btn onClick={onReady}>{label} <ChevronRight size={14}/></Btn> : <div style={{ color:C.textDim, fontSize:"12px", display:"flex", alignItems:"center", gap:"7px", fontFamily:FM }}><Clock size={12}/> reading…</div>}</div>;
};
const CQ = ({ name, emoji, color, children }) => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"14px 16px", display:"flex", gap:"10px", marginBottom:"8px" }}>
    <div style={{ fontSize:"20px" }}>{emoji}</div>
    <div><div style={{ color, fontFamily:FD, fontWeight:700, fontSize:"13px", marginBottom:"5px" }}>{name}</div>
    <Body style={{ fontStyle:"italic", margin:0, fontSize:"13px" }}>{children}</Body></div>
  </div>
);
const TT = { contentStyle:{ background:"#1A1400", border:`1px solid ${C.gold}`, borderRadius:"8px", color:C.textBody, fontFamily:FB, fontSize:"12px" }, labelStyle:{ color:C.gold, fontWeight:700 } };
const StatGrid = ({ stats }) => (
  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:"10px", marginBottom:"20px" }}>
    {stats.map(s => <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"14px", textAlign:"center" }}>
      <div style={{ fontSize:"22px", marginBottom:"6px" }}>{s.icon}</div>
      <div style={{ fontFamily:FM, fontSize:"9px", color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"5px" }}>{s.label}</div>
      <div style={{ fontFamily:FD, fontSize:"14px", color:s.color, fontWeight:700 }}>{s.value}</div>
    </div>)}
  </div>
);
const OBtn = ({ opt, chosen, correct, revealed, onClick }) => {
  const ic = chosen===opt.id, ir = opt.id===correct;
  return <button onClick={onClick} style={{ width:"100%", background:revealed?(ir?"rgba(212,160,23,0.12)":ic?C.amberFaint:C.surface):(ic?"rgba(212,160,23,0.1)":C.surface), border:`1px solid ${revealed?(ir?C.borderHi:ic?"rgba(217,119,6,0.4)":C.border):(ic?C.borderHi:C.border)}`, borderRadius:"10px", padding:"14px 16px", textAlign:"left", color:C.textBody, fontSize:"14px", cursor:revealed?"default":"pointer", display:"flex", alignItems:"flex-start", gap:"10px", marginBottom:"8px", fontFamily:FB, lineHeight:1.6 }}>
    <span style={{ width:"24px", height:"24px", borderRadius:"50%", flexShrink:0, marginTop:"1px", background:revealed&&ir?C.gold:ic?C.goldGlow:C.surface2, border:`1px solid ${ic||(revealed&&ir)?C.gold:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:revealed&&ir?"#000":C.textBody, fontSize:"11px", fontWeight:700, fontFamily:FM }}>
      {revealed&&ir?<CheckCircle size={12}/>:opt.id.toUpperCase()}
    </span>{opt.label}</button>;
};

// ── OPENING ──────────────────────────────────
const Opening = ({ onBegin }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { if (phase<5){ const t=setTimeout(()=>setPhase(p=>p+1), phase===0?600:2000); return ()=>clearTimeout(t); } }, [phase]);
  const reveal = (p, content, style={}) => <div style={{ opacity:phase>p?1:0, transform:phase>p?"translateY(0)":"translateY(14px)", transition:"opacity 0.9s, transform 0.9s", ...style }}>{content}</div>;
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center", backgroundImage:"radial-gradient(ellipse at 50% 0%, rgba(212,160,23,0.05) 0%, transparent 65%)" }}>
      {reveal(0, <div style={{ fontFamily:FM, fontSize:"10px", letterSpacing:"0.2em", color:C.textMuted, textTransform:"uppercase", marginBottom:"40px" }}>Investment Club · Module 2</div>)}
      {reveal(1, <div style={{ fontFamily:FM, fontSize:"clamp(28px,6vw,52px)", color:C.gold, letterSpacing:"0.1em", marginBottom:"28px" }}>3200 BC.</div>)}
      {reveal(2, <p style={{ fontFamily:FB, fontSize:"clamp(15px,2vw,19px)", color:C.textBody, lineHeight:1.8, maxWidth:"560px", margin:"0 auto 22px" }}>In the ancient city of Uruk, in what is now Iraq, human beings pressed a reed stylus into soft clay and made marks for the very first time. This was cuneiform — the world's earliest known writing system.</p>)}
      {reveal(3, <p style={{ fontFamily:FD, fontSize:"clamp(17px,2.5vw,23px)", color:C.textPrime, lineHeight:1.7, maxWidth:"600px", margin:"0 auto 36px", fontStyle:"italic" }}>And what were they writing? Financial records. Ledgers. Ownership. Transactions. The earliest written words in human history were not poetry or prayer — they were accounting tablets tracking who owned what.</p>)}
      {phase>3 && <div style={{ opacity:1 }}>
        <div style={{ width:"1px", height:"40px", background:`linear-gradient(to bottom,${C.gold},transparent)`, margin:"0 auto 24px" }}/>
        <p style={{ fontFamily:FD, fontSize:"clamp(16px,2vw,19px)", color:C.textMuted, maxWidth:"500px", margin:"0 auto 12px", lineHeight:1.7 }}>And just like writing itself, it evolved over five thousand years around one central question:</p>
        <div style={{ fontFamily:FD, fontSize:"clamp(20px,4vw,36px)", color:C.gold, fontStyle:"italic", marginBottom:"40px" }}>How do we manage risk?</div>
        <Btn onClick={onBegin} style={{ fontSize:"15px", padding:"13px 30px" }}>Begin Module 2 <ChevronRight size={15}/></Btn>
      </div>}
    </div>
  );
};

// ── SECTION 1: OWNERSHIP ─────────────────────
const S1 = ({ onNext }) => (
  <Page>
    <SL>Section 1 of 7</SL><H1>What Is Ownership?</H1>
    <Lead>Five thousand years of financial history comes down to two fundamental relationships with your money. Every investment you will ever make is one of these — or a blend of both.</Lead>
    <Card>
      <H2>Two things. That is all investing is.</H2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", margin:"16px 0 20px" }}>
        <div style={{ background:C.goldFaint, border:`1px solid ${C.borderHi}`, borderRadius:"12px", padding:"20px", textAlign:"center" }}>
          <div style={{ fontSize:"28px", marginBottom:"10px" }}>🏛️</div>
          <div style={{ fontFamily:FD, fontWeight:700, color:C.gold, fontSize:"18px", marginBottom:"8px" }}>Own</div>
          <Body style={{ fontSize:"13px", marginBottom:0 }}>You buy a piece of something. Its value rises and falls with that thing's fortunes. Higher reward potential — and higher risk.</Body>
        </div>
        <div style={{ background:C.slateFaint, border:"1px solid rgba(148,163,184,0.2)", borderRadius:"12px", padding:"20px", textAlign:"center" }}>
          <div style={{ fontSize:"28px", marginBottom:"10px" }}>🤝</div>
          <div style={{ fontFamily:FD, fontWeight:700, color:C.slate, fontSize:"18px", marginBottom:"8px" }}>Lend</div>
          <Body style={{ fontSize:"13px", marginBottom:0 }}>You loan money to someone. They pay you interest and return what you lent. More predictable — but with a ceiling on reward.</Body>
        </div>
      </div>
      <Body style={{ marginBottom:0 }}>That single distinction — <VT id="equity">own</VT> vs. <VT id="debt_instrument">lend</VT> — is the framework for every <VT id="asset">asset</VT> we will cover. Keep it in mind as each one is introduced.</Body>
    </Card>
    <ReadingGate onReady={onNext} label="Next: Cash &amp; Savings"/>
  </Page>
);

// ── SECTION 2: CASH ───────────────────────────
const S2 = ({ onNext }) => (
  <Page>
    <SL>Section 2 of 7</SL><H1>Cash &amp; Savings</H1>
    <Lead>The oldest risk management tool humans ever invented — and the one most people still rely on entirely. It works. But as we saw in Module 1, it carries a hidden cost.</Lead>
    <Card>
      <H2>The oldest answer to risk</H2>
      <Body>Before banks, bonds, or stock markets, people stored grain, gold, and cattle as a buffer against uncertain times. Cash is the modern version of that instinct — the baseline from which everything else evolved.</Body>
      <Body style={{ marginBottom:0 }}>The formal savings account emerged in the early 19th century, created to give working people a safe place to store money and earn modest interest. The goal was pure protection, not growth.</Body>
    </Card>
    <StatGrid stats={[{label:"Risk Level",value:"Very Low",icon:"🛡️",color:C.gold},{label:"Return",value:"Very Low",icon:"📉",color:C.textMuted},{label:"Liquidity",value:"Highest",icon:"💧",color:C.gold,id:"liquidity"},{label:"Type",value:"Storage",icon:"🏦",color:C.textMuted}]}/>
    <Card amber>
      <div style={{ display:"flex", gap:"12px" }}>
        <div style={{ fontSize:"20px", flexShrink:0 }}>⚠️</div>
        <div><div style={{ fontFamily:FD, fontWeight:700, color:C.amber, marginBottom:"8px" }}>The hidden cost — revisited</div>
        <Body style={{ marginBottom:0 }}><VT id="inflation">Inflation</VT> erodes <VT id="purchasing_power">purchasing power</VT> every year. <VT id="liquidity">Liquidity</VT> is cash's great strength, but it comes at the cost of growth. For short-term needs, cash is essential. For long-term wealth building, it is a losing proposition on its own.</Body></div>
      </div>
    </Card>
    <CQ name="Clyde" emoji="🤝" color={C.amber}>This is where I have been living. I thought I was being responsible. I am starting to understand why that is only part of the story.</CQ>
    <ReadingGate onReady={onNext} label="Next: Bonds"/>
  </Page>
);

// ── SECTION 3: BONDS ─────────────────────────
const S3 = ({ onNext }) => {
  const bondData = Array.from({length:10},(_,i)=>({year:`Yr ${i+1}`,interest:500,principal:i===9?10000:0}));
  return (
    <Page>
      <SL>Section 3 of 7</SL><H1>Bonds</H1>
      <Lead>When kingdoms needed to fund wars and merchants needed capital for expeditions, they could not do it alone. So they made a deal — and the bond was born.</Lead>
      <Card>
        <div style={{ display:"flex", gap:"12px" }}>
          <div style={{ fontSize:"26px", flexShrink:0 }}>🏰</div>
          <div><H2>Renaissance Italy, ~1400s</H2>
          <Body>The city-states of Florence, Venice, and Genoa were among the first to issue formal government debt. They needed to finance wars — more than any single merchant could provide. So they offered a deal: lend us money, and we will pay you back with interest.</Body>
          <Body style={{ marginBottom:0 }}>That deal is still exactly how a <VT id="bond">bond</VT> works today — whether issued by the US government or a corporation like Apple.</Body></div>
        </div>
      </Card>
      <Card gold>
        <H2 style={{ fontSize:"18px" }}>How a bond works — $10,000 at 5% for 10 years</H2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={bondData} margin={{top:4,right:4,bottom:4,left:4}}>
            <XAxis dataKey="year" stroke={C.textDim} tick={{fontSize:9,fill:C.textMuted,fontFamily:FM}}/>
            <YAxis stroke={C.textDim} tick={{fontSize:9,fill:C.textMuted,fontFamily:FM}} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`}/>
            <Tooltip {...TT} formatter={(v,n)=>[`$${v.toLocaleString()}`,n]}/>
            <Bar dataKey="interest" fill={C.gold} name="Interest ($500/yr)" radius={[3,3,0,0]}/>
            <Bar dataKey="principal" fill={C.textMuted} name="Principal returned" radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <StatGrid stats={[{label:"Risk",value:"Low–Medium",icon:"🛡️",color:C.gold},{label:"Return Type",value:"Fixed Interest",icon:"📋",color:C.gold},{label:"You Are",value:"Lender",icon:"🤝",color:C.slate},{label:"Best For",value:"Stability",icon:"⚖️",color:C.textMuted}]}/>
      <Card><Body style={{ marginBottom:0 }}><VT id="fixed_income">Fixed income</VT> means predictability — you know exactly what you will earn. But that ceiling on reward is the price of safety. When a company does extraordinarily well, bond holders do not share in the upside. That limitation drove the next evolution.</Body></Card>
      <CQ name="Pete" emoji="🎯" color={C.gold}>Bonds are not exciting. That is exactly the point. They are the steady hand — I hold them so part of my portfolio does not swing wildly.</CQ>
      <ReadingGate onReady={onNext} label="Next: Stocks"/>
    </Page>
  );
};

// ── SECTION 4: STOCKS ────────────────────────
const S4 = ({ onNext }) => {
  const data = [{year:"2015",v:100},{year:"2016",v:112},{year:"2017",v:145},{year:"2018",v:138},{year:"2019",v:195},{year:"2020",v:213},{year:"2021",v:298},{year:"2022",v:241},{year:"2023",v:310}];
  return (
    <Page>
      <SL>Section 4 of 7</SL><H1>Stocks</H1>
      <Lead>What happens when a venture is so large and risky that no single investor can fund it alone? You divide ownership into pieces — and sell them to the world.</Lead>
      <Card>
        <div style={{ display:"flex", gap:"12px" }}>
          <div style={{ fontSize:"26px", flexShrink:0 }}>🚢</div>
          <div><H2>Amsterdam, 1602</H2>
          <Body>The Dutch East India Company needed enormous fleets to trade spice routes to Asia. No single merchant could bear the risk alone. So they did something revolutionary — they divided ownership into <VT id="stock">shares</VT> and sold them to the public.</Body>
          <Body style={{ marginBottom:0 }}>Anyone could buy a piece. If the ships returned with spices, everyone profited. If they sank, everyone shared the loss. This was the world's first publicly traded stock — and the first stock exchange opened in Amsterdam shortly after to trade them.</Body></div>
        </div>
      </Card>
      <Card gold>
        <H2 style={{ fontSize:"18px" }}>$100 invested — what growth looks like</H2>
        <Body style={{ fontSize:"13px", color:C.textMuted, marginBottom:"14px" }}><VT id="volatility">Volatility</VT> is the price of admission for higher returns. Note the dips — and where the line ends up.</Body>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{top:4,right:4,bottom:4,left:4}}>
            <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.3}/><stop offset="95%" stopColor={C.gold} stopOpacity={0.02}/></linearGradient></defs>
            <XAxis dataKey="year" stroke={C.textDim} tick={{fontSize:9,fill:C.textMuted,fontFamily:FM}}/>
            <YAxis stroke={C.textDim} tick={{fontSize:9,fill:C.textMuted,fontFamily:FM}} tickFormatter={v=>`$${v}`}/>
            <Tooltip {...TT} formatter={v=>[`$${v}`,"Portfolio Value"]}/>
            <Area type="monotone" dataKey="v" stroke={C.gold} strokeWidth={2.5} fill="url(#sg)" dot={{fill:C.gold,r:2,strokeWidth:0}}/>
          </AreaChart>
        </ResponsiveContainer>
        <Body style={{ fontSize:"11px", color:C.textDim, textAlign:"center", margin:"8px 0 0", fontFamily:FM }}>Illustrative only. Not based on any specific stock.</Body>
      </Card>
      <StatGrid stats={[{label:"Risk",value:"Medium–High",icon:"📊",color:C.amber},{label:"Return",value:"Growth + Dividends",icon:"🌱",color:C.gold},{label:"You Are",value:"Owner",icon:"🏛️",color:C.gold},{label:"Best For",value:"Long-term growth",icon:"⏳",color:C.gold}]}/>
      <CQ name="Clyde" emoji="🤝" color={C.amber}>The idea of owning part of a company makes sense to me. But what if I pick the wrong one?</CQ>
      <CQ name="Betty" emoji="😌" color={C.slate}>That is exactly the question I asked. And the answer led me somewhere very specific.</CQ>
      <CQ name="Pete" emoji="🎯" color={C.gold}>I own individual stocks — but only companies I have genuinely researched. It takes real work and real patience.</CQ>
      <ReadingGate onReady={onNext} label="Next: Mutual Funds"/>
    </Page>
  );
};

// ── SECTION 5: MUTUAL FUNDS ──────────────────
const S5 = ({ onNext }) => (
  <Page>
    <SL>Section 5 of 7</SL><H1>Mutual Funds</H1>
    <Lead>Individual stock picking proved too complex and too risky for most investors. So a new solution emerged — pool everyone's money together, and hire an expert to manage it.</Lead>
    <Card>
      <div style={{ display:"flex", gap:"12px" }}>
        <div style={{ fontSize:"26px", flexShrink:0 }}>🇳🇱</div>
        <div><H2>Amsterdam, 1774</H2>
        <Body>A Dutch merchant named Adriaan van Ketwich created a fund called Eendragt Maakt Magt — "Unity Creates Strength." Small investors could combine their money to access a diversified portfolio none of them could afford individually.</Body>
        <Body style={{ marginBottom:0 }}>The concept was born from the same risk management instinct that drove every previous innovation. The <VT id="mutual_fund">mutual fund</VT> was the answer to the dangers of picking individual stocks.</Body></div>
      </div>
    </Card>
    <StatGrid stats={[{label:"Risk",value:"Low–Medium",icon:"🛡️",color:C.gold},{label:"Management",value:"Active (paid)",icon:"👔",color:C.amber},{label:"Diversification",value:"High",icon:"🗂️",color:C.gold},{label:"Typical Fee",value:"0.5%–1.5%/yr",icon:"💸",color:C.amber}]}/>
    <Card amber>
      <div style={{ display:"flex", gap:"12px" }}>
        <div style={{ fontSize:"20px", flexShrink:0 }}>⚠️</div>
        <div><div style={{ fontFamily:FD, fontWeight:700, color:C.amber, marginBottom:"8px" }}>The problem nobody talked about</div>
        <Body style={{ marginBottom:0 }}>Research eventually revealed something uncomfortable: most actively managed mutual funds underperform the market average over long periods — even after paying their managers handsomely. The <VT id="expense_ratio">fees</VT> were real. The outperformance often was not. This led to the next — and most important — evolution in investing.</Body></div>
      </div>
    </Card>
    <ReadingGate onReady={onNext} label="Next: ETFs &amp; Index Funds"/>
  </Page>
);

// ── SECTION 6: ETFs ───────────────────────────
const S6 = ({ onNext }) => {
  const [monthly, setMonthly] = useState(500);
  const [years, setYears] = useState(30);
  const calc = (fee) => { let b=0; for(let i=0;i<years;i++) b=(b+monthly*12)*(1+(0.07-fee)); return Math.round(b); };
  const hi=calc(0.012), lo=calc(0.0003), diff=lo-hi;
  const fmt = n => n>=1e6?`$${(n/1e6).toFixed(2)}M`:`$${(n/1000).toFixed(0)}K`;
  const chartData = Array.from({length:years+1},(_,i)=>{ let a=0,b=0; for(let j=0;j<i;j++){a=(a+monthly*12)*(1+0.07-0.012);b=(b+monthly*12)*(1+0.07-0.0003);} return {year:i,hi:Math.round(a),lo:Math.round(b)}; });
  return (
    <Page>
      <SL>Section 6 of 7</SL><H1>ETFs &amp; Index Funds</H1>
      <Lead>In 1975, John Bogle at Vanguard asked a simple question: if most fund managers cannot beat the market average anyway — why not just buy the whole market? The answer changed investing forever.</Lead>
      <Card>
        <div style={{ display:"flex", gap:"12px" }}>
          <div style={{ fontSize:"26px", flexShrink:0 }}>💡</div>
          <div><H2>The insight that broke the industry</H2>
          <Body>Bogle's data showed roughly 90% of actively managed funds underperformed a simple market index over 20 years. The managers were not adding value — but they were charging for it.</Body>
          <Body style={{ marginBottom:0 }}>His solution was radical in its simplicity: a fund that just bought every stock in an index — the S&P 500 — in proportion to its size. No manager. No stock picks. Just own the whole market for almost nothing. The first <VT id="index_fund">index fund</VT>.</Body></div>
        </div>
      </Card>
      <Card gold>
        <H2 style={{ fontSize:"18px", marginBottom:"18px" }}>The fee gap — see it yourself</H2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }}>
          {[{label:"Monthly investment",min:100,max:2000,step:100,val:monthly,set:setMonthly,display:`$${monthly}`},{label:"Years investing",min:10,max:40,step:5,val:years,set:setYears,display:`${years} yrs`}].map(({label,min,max,step,val,set,display})=>(
            <div key={label}>
              <label style={{ display:"block", color:C.textMuted, fontSize:"10px", marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.1em", fontFamily:FM }}>{label}</label>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(+e.target.value)} style={{ flex:1, accentColor:C.gold }}/>
                <span style={{ color:C.gold, fontFamily:FD, fontWeight:700, fontSize:"17px", minWidth:"58px", textAlign:"right" }}>{display}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
          <div style={{ background:C.amberFaint, border:"1px solid rgba(217,119,6,0.3)", borderRadius:"10px", padding:"16px", textAlign:"center" }}>
            <div style={{ fontFamily:FM, fontSize:"9px", color:C.textMuted, marginBottom:"6px", letterSpacing:"0.1em" }}>MUTUAL FUND (1.2%)</div>
            <div style={{ fontFamily:FD, color:C.amber, fontSize:"26px", fontWeight:700 }}>{fmt(hi)}</div>
          </div>
          <div style={{ background:"rgba(212,160,23,0.12)", border:`1px solid ${C.borderHi}`, borderRadius:"10px", padding:"16px", textAlign:"center" }}>
            <div style={{ fontFamily:FM, fontSize:"9px", color:C.textMuted, marginBottom:"6px", letterSpacing:"0.1em" }}>INDEX FUND (0.03%)</div>
            <div style={{ fontFamily:FD, color:C.gold, fontSize:"26px", fontWeight:700 }}>{fmt(lo)}</div>
          </div>
        </div>
        <div style={{ background:"#0A0A00", borderRadius:"10px", padding:"14px", textAlign:"center", marginBottom:"16px" }}>
          <div style={{ fontFamily:FM, fontSize:"10px", color:C.textMuted, marginBottom:"5px", letterSpacing:"0.1em" }}>THE FEE DIFFERENCE COSTS YOU</div>
          <div style={{ fontFamily:FD, fontSize:"32px", color:C.gold, fontWeight:700 }}>{fmt(diff)}</div>
          <div style={{ fontFamily:FM, fontSize:"10px", color:C.textMuted, marginTop:"4px" }}>over {years} years — stayed in the fund manager's pocket</div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{top:4,right:4,bottom:4,left:4}}>
            <XAxis dataKey="year" stroke={C.textDim} tick={{fontSize:9,fill:C.textMuted,fontFamily:FM}}/>
            <YAxis stroke={C.textDim} tick={{fontSize:9,fill:C.textMuted,fontFamily:FM}} tickFormatter={v=>v>=1e6?`${(v/1e6).toFixed(1)}M`:`${(v/1000).toFixed(0)}K`}/>
            <Tooltip {...TT} formatter={(v,n)=>[fmt(v),n]} labelFormatter={l=>`Year ${l}`}/>
            <Line type="monotone" dataKey="lo" stroke={C.gold} strokeWidth={2.5} dot={false} name="Index Fund (0.03%)"/>
            <Line type="monotone" dataKey="hi" stroke={C.amber} strokeWidth={2} dot={false} name="Mutual Fund (1.2%)" strokeDasharray="5 3"/>
          </LineChart>
        </ResponsiveContainer>
        <Body style={{ fontSize:"11px", color:C.textDim, textAlign:"center", margin:"8px 0 0", fontFamily:FM }}>Assumes 7% gross annual return. Educational only.</Body>
      </Card>
      <CQ name="Betty" emoji="😌" color={C.slate}>This is exactly what I own. I stopped trying to be clever and just bought everything. Low fees, instant diversification, zero stress.</CQ>
      <ReadingGate onReady={onNext} label="Next: The Risk Spectrum"/>
    </Page>
  );
};

// ── SECTION 7: RISK SPECTRUM ─────────────────
const S7 = ({ onNext }) => {
  const [active, setActive] = useState(null);
  const assets = [
    {id:"cash",   label:"Cash",           emoji:"💵", col:C.textMuted, inv:"Prehistoric", purpose:"Maximum liquidity, zero growth",         tradeoff:"Inflation erodes purchasing power silently"},
    {id:"bonds",  label:"Bonds",          emoji:"📋", col:C.slate,     inv:"~1400s Italy",purpose:"Predictable income — fixed interest",     tradeoff:"No upside sharing — ceiling on returns"},
    {id:"mutual", label:"Mutual Funds",   emoji:"👔", col:C.amber,     inv:"1774, Amsterdam",purpose:"Diversified ownership, professional mgmt",tradeoff:"Fees often outweigh the manager's value"},
    {id:"etf",    label:"ETFs / Index",   emoji:"🌐", col:C.gold,      inv:"1975–1993, USA",purpose:"Own the whole market cheaply",          tradeoff:"You match the market — never beat it"},
    {id:"stocks", label:"Stocks",         emoji:"📈", col:C.gold,      inv:"1602, Amsterdam",purpose:"Ownership in companies — max growth",   tradeoff:"High volatility — big swings possible"},
    {id:"crypto", label:"Crypto (?)",     emoji:"🔮", col:C.textDim,   inv:"2009+",        purpose:"Coming in a future module",             tradeoff:"No 50-year track record", locked:true},
  ];
  const sel = active ? assets.find(a=>a.id===active) : null;
  const portfolios = [
    {name:"Clyde",emoji:"🤝",color:C.amber, holdings:[{label:"Cash / Savings",pct:100,color:C.textMuted}]},
    {name:"Betty",emoji:"😌",color:C.slate, holdings:[{label:"ETFs",pct:90,color:C.gold},{label:"Bonds",pct:10,color:C.slate}]},
    {name:"Pete", emoji:"🎯",color:C.gold,  holdings:[{label:"Stocks",pct:60,color:C.gold},{label:"Bonds",pct:30,color:C.slate},{label:"Cash",pct:10,color:C.textMuted}]},
  ];
  return (
    <Page>
      <SL>Section 7 of 7</SL><H1>The Risk Spectrum</H1>
      <Lead>Every asset type sits somewhere between maximum safety and maximum reward. Understanding where — and why — is the foundation of every investment decision you will ever make.</Lead>
      <Card gold style={{ marginBottom:"28px" }}>
        <H2 style={{ fontSize:"18px", marginBottom:"6px" }}>Click any asset to explore it</H2>
        <div style={{ display:"flex", justifyContent:"space-between", margin:"12px 0 6px" }}>
          <span style={{ fontFamily:FM, fontSize:"9px", color:C.textMuted, letterSpacing:"0.1em" }}>LOWER RISK</span>
          <span style={{ fontFamily:FM, fontSize:"9px", color:C.textMuted, letterSpacing:"0.1em" }}>HIGHER RISK</span>
        </div>
        <div style={{ height:"5px", background:`linear-gradient(to right,${C.slate},${C.gold},${C.amber})`, borderRadius:"3px", marginBottom:"16px" }}/>
        <div style={{ display:"flex", gap:"7px", flexWrap:"nowrap", overflowX:"auto", paddingBottom:"4px", marginBottom:"16px" }}>
          {assets.map(a=>(
            <button key={a.id} onClick={()=>!a.locked&&setActive(active===a.id?null:a.id)} style={{ flexShrink:0, background:active===a.id?C.goldFaint:C.surface2, border:`1px solid ${active===a.id?C.borderHi:C.border}`, borderRadius:"10px", padding:"10px 8px", cursor:a.locked?"not-allowed":"pointer", textAlign:"center", opacity:a.locked?0.35:1, minWidth:"72px" }}>
              <div style={{ fontSize:"18px", marginBottom:"5px" }}>{a.emoji}</div>
              <div style={{ fontFamily:FM, fontSize:"9px", color:active===a.id?C.gold:C.textMuted }}>{a.label}</div>
            </button>
          ))}
        </div>
        {sel ? <div style={{ background:C.surface, border:`1px solid ${C.borderHi}`, borderRadius:"10px", padding:"18px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"12px" }}>
            <div><div style={{ fontSize:"24px", marginBottom:"4px" }}>{sel.emoji}</div>
              <div style={{ fontFamily:FD, fontSize:"18px", color:C.textPrime, fontWeight:700 }}>{sel.label}</div>
              <div style={{ fontFamily:FM, fontSize:"10px", color:C.gold, marginTop:"3px" }}>INVENTED: {sel.inv}</div>
            </div>
            <button onClick={()=>setActive(null)} style={{ background:"transparent", border:"none", color:C.textMuted, cursor:"pointer", fontSize:"18px" }}>✕</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            <div style={{ background:C.goldFaint, borderRadius:"8px", padding:"10px" }}>
              <div style={{ fontFamily:FM, fontSize:"9px", color:C.gold, marginBottom:"5px", letterSpacing:"0.1em" }}>PURPOSE</div>
              <Body style={{ fontSize:"12px", margin:0 }}>{sel.purpose}</Body>
            </div>
            <div style={{ background:C.amberFaint, borderRadius:"8px", padding:"10px" }}>
              <div style={{ fontFamily:FM, fontSize:"9px", color:C.amber, marginBottom:"5px", letterSpacing:"0.1em" }}>TRADE-OFF</div>
              <Body style={{ fontSize:"12px", margin:0 }}>{sel.tradeoff}</Body>
            </div>
          </div>
        </div> : <div style={{ textAlign:"center", color:C.textDim, fontFamily:FM, fontSize:"12px", padding:"16px 0" }}>Select an asset above to explore it</div>}
      </Card>
      <H2 style={{ fontSize:"19px" }}>The club's portfolios — revealed</H2>
      <Body>For the first time, here is exactly how Clyde, Betty, and Pete have their money allocated. Each reflects a different answer to the module's central question.</Body>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"14px", marginBottom:"24px" }}>
        {portfolios.map(p=>(
          <div key={p.name} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:"12px", padding:"20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"16px" }}>
              <div style={{ fontSize:"26px" }}>{p.emoji}</div>
              <div style={{ fontFamily:FD, fontWeight:700, color:C.textPrime, fontSize:"17px" }}>{p.name}</div>
            </div>
            {p.holdings.map(h=>(
              <div key={h.label} style={{ marginBottom:"10px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                  <span style={{ fontFamily:FB, fontSize:"12px", color:C.textBody }}>{h.label}</span>
                  <span style={{ fontFamily:FM, fontSize:"12px", color:h.color, fontWeight:700 }}>{h.pct}%</span>
                </div>
                <div style={{ height:"5px", background:C.surface2, borderRadius:"3px" }}>
                  <div style={{ height:"100%", width:`${h.pct}%`, background:h.color, borderRadius:"3px" }}/>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Card gold><Body style={{ marginBottom:0 }}>None of these portfolios is objectively right. Each is a different answer to: <strong style={{ color:C.textPrime }}>How do we manage risk?</strong> Clyde avoids it entirely. Betty neutralizes it through diversification. Pete accepts it strategically. All three are valid — for the right person, with the right goals and timeline.</Body></Card>
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"28px" }}><Btn onClick={onNext}>Start Scenarios <ChevronRight size={14}/></Btn></div>
    </Page>
  );
};

// ── SCENARIO 1 ────────────────────────────────
const SC1 = ({ onNext }) => {
  const [skin, setSkin] = useState("a");
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const skins = { a:{label:"30-year timeline",context:"retirement in 30 years",rec:"c"}, b:{label:"5-year timeline",context:"a house deposit in 5 years",rec:"b"} };
  const s = skins[skin];
  const opts = [{id:"a",label:"Put it all in a savings account — safety first"},{id:"b",label:"Split: $500 in bonds, $500 in cash savings"},{id:"c",label:"Invest it all in a low-cost index fund"},{id:"d",label:"Pick one exciting stock with good buzz"}];
  const outcomes = {
    a:{v:"Safe — but at a cost",t:"Cash is appropriate for very short-term needs. For a 30-year goal, inflation will quietly erode your purchasing power while the market grows without you."},
    b:{v:skin==="b"?"Smart thinking":"Too conservative for this timeline",t:skin==="b"?"For a 5-year timeline, preserving capital matters more than chasing growth. A bonds/cash mix limits downside risk — appropriate when you cannot afford a dip before you need the money.":"With 30 years ahead, you can absorb volatility — and you need growth that significantly outpaces inflation."},
    c:{v:skin==="a"?"Excellent thinking":"Too aggressive for this timeline",t:skin==="a"?"With 30 years of compound growth ahead, a low-cost index fund is one of the most powerful tools available. Low fees, instant diversification, and time on your side.":"With only 5 years, a market downturn close to your target date could significantly reduce what you have when you need it."},
    d:{v:"Risky for a first investment",t:"Picking individual stocks requires deep research and the ability to withstand significant volatility. Concentrating $1,000 in one stock creates unnecessary risk for a beginner."},
  };
  useEffect(()=>{setChosen(null);setRevealed(false);},[skin]);
  return (
    <Page>
      <SL>Scenario 1 of 3</SL>
      <div style={{ display:"flex", gap:"8px", marginBottom:"20px" }}>
        {Object.entries(skins).map(([k,v])=><Btn key={k} outline={skin!==k} small onClick={()=>setSkin(k)}>{v.label}</Btn>)}
      </div>
      <Card>
        <div style={{ fontFamily:FM, fontSize:"9px", color:C.gold, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:"12px" }}>The Situation</div>
        <H2>Your First $1,000</H2>
        <Body>You have just saved your first $1,000 to invest. Your goal is <strong style={{ color:C.textPrime }}>{s.context}</strong>. Where do you put it?</Body>
      </Card>
      {opts.map(o=><OBtn key={o.id} opt={o} chosen={chosen} correct={s.rec} revealed={revealed} onClick={()=>!revealed&&setChosen(o.id)}/>)}
      {chosen&&!revealed&&<div style={{ textAlign:"center", marginTop:"14px" }}><Btn onClick={()=>setRevealed(true)}>Reveal Outcome <ChevronRight size={14}/></Btn></div>}
      {revealed&&chosen&&<>
        <Card style={{ borderColor:chosen===s.rec?C.borderHi:"rgba(217,119,6,0.3)", background:chosen===s.rec?C.goldFaint:C.amberFaint, marginTop:"20px" }}>
          <div style={{ color:chosen===s.rec?C.gold:C.amber, fontFamily:FD, fontWeight:700, fontSize:"17px", marginBottom:"10px" }}>{outcomes[chosen].v}</div>
          <Body style={{ marginBottom:0 }}>{outcomes[chosen].t}</Body>
        </Card>
        <CQ name="Clyde" emoji="🤝" color={C.amber}>I would have put it all in savings. I am starting to see why that is not always the right call — especially with a long timeline.</CQ>
        <CQ name="Betty" emoji="😌" color={C.slate}>{skin==="a"?"Index fund, no question. Low fees, thirty years of compounding. Done.":"With 5 years? I would be more conservative. Protecting capital matters more than chasing growth."}</CQ>
        <CQ name="Pete" emoji="🎯" color={C.gold}>{skin==="a"?"Index fund for most of it. Time horizon is everything.":"Five years is not long enough to ride out a major downturn safely."}</CQ>
        <Card gold style={{ marginTop:"16px" }}>
          <div style={{ color:C.gold, fontWeight:700, fontFamily:FD, marginBottom:"8px" }}>The Lesson</div>
          <Body style={{ marginBottom:0 }}>The right investment depends entirely on your time horizon. The longer your timeline, the more risk you can absorb — and the more growth you need to outpace inflation meaningfully.</Body>
        </Card>
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"24px" }}><Btn onClick={onNext}>Scenario 2 <ChevronRight size={14}/></Btn></div>
      </>}
    </Page>
  );
};

// ── SCENARIO 2 ────────────────────────────────
const SC2 = ({ onNext }) => {
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const data = [{year:"Yr 0",bond:10000,stock:10000},{year:"Yr 1",bond:10500,stock:11200},{year:"Yr 2",bond:11000,stock:13400},{year:"Yr 3",bond:11500,stock:11800},{year:"Yr 4",bond:12000,stock:14300},{year:"Yr 5",bond:12500,stock:15600}];
  const opts = [{id:"a",label:"Take the bond — 5% guaranteed is better than risking the stock"},{id:"b",label:"Take the stock — past 12% returns are too good to pass up"},{id:"c",label:"It depends entirely on my timeline and how much volatility I can handle"},{id:"d",label:"Split my investment between both"}];
  const explanations = {
    a:"The guaranteed 5% is genuinely appealing — especially for shorter timeframes. But over long periods, the stock's growth potential historically far outpaces fixed returns. The right choice depends on your timeline.",
    b:"Past performance is one of investing's most seductive — and dangerous — signals. A 12% average over 5 years tells you what happened, not what will happen. Markets can drop significantly.",
    c:"This is the most sophisticated answer — because it is true. There is no universally correct choice. The right answer depends on your time horizon, your ability to withstand volatility, and what the money is for.",
    d:"Splitting is a valid strategy — it is essentially what diversification means. The question is whether the ratio matches your actual goals and timeline."
  };
  return (
    <Page>
      <SL>Scenario 2 of 3</SL>
      <Card>
        <div style={{ fontFamily:FM, fontSize:"9px", color:C.gold, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:"12px" }}>The Situation</div>
        <H2>Bond vs. Stock</H2>
        <Body>A well-known company offers two options for your $10,000. Option A: a bond paying 5% guaranteed for 5 years. Option B: their stock, which has averaged 12% annually over the past 5 years — but with no guarantees.</Body>
        <ResponsiveContainer width="100%" height={170}>
          <LineChart data={data} margin={{top:4,right:4,bottom:4,left:4}}>
            <XAxis dataKey="year" stroke={C.textDim} tick={{fontSize:9,fill:C.textMuted,fontFamily:FM}}/>
            <YAxis stroke={C.textDim} tick={{fontSize:9,fill:C.textMuted,fontFamily:FM}} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`}/>
            <Tooltip {...TT} formatter={(v,n)=>[`$${v.toLocaleString()}`,n]}/>
            <Line type="monotone" dataKey="bond" stroke={C.slate} strokeWidth={2} dot={false} name="Bond (5% fixed)" strokeDasharray="5 3"/>
            <Line type="monotone" dataKey="stock" stroke={C.gold} strokeWidth={2.5} dot={{fill:C.gold,r:2,strokeWidth:0}} name="Stock (variable)"/>
          </LineChart>
        </ResponsiveContainer>
      </Card>
      {opts.map(o=><OBtn key={o.id} opt={o} chosen={chosen} correct="c" revealed={revealed} onClick={()=>!revealed&&setChosen(o.id)}/>)}
      {chosen&&!revealed&&<div style={{ textAlign:"center", marginTop:"14px" }}><Btn onClick={()=>setRevealed(true)}>Reveal Outcome <ChevronRight size={14}/></Btn></div>}
      {revealed&&chosen&&<>
        <Card style={{ borderColor:chosen==="c"?C.borderHi:"rgba(217,119,6,0.3)", background:chosen==="c"?C.goldFaint:C.amberFaint, marginTop:"20px" }}>
          <div style={{ color:chosen==="c"?C.gold:C.amber, fontFamily:FD, fontWeight:700, fontSize:"17px", marginBottom:"10px" }}>{chosen==="c"?"Exactly right":"Close — here is the full picture"}</div>
          <Body style={{ marginBottom:0 }}>{explanations[chosen]}</Body>
        </Card>
        <Card gold style={{ marginTop:"12px" }}>
          <div style={{ color:C.gold, fontWeight:700, fontFamily:FD, marginBottom:"8px" }}>The Lesson</div>
          <Body style={{ marginBottom:0 }}>There is no universally better investment — only investments that are better or worse for a specific person with specific goals in a specific timeframe. <VT id="volatility">Volatility</VT> is not inherently bad — it is the trade-off for higher long-term returns.</Body>
        </Card>
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"24px" }}><Btn onClick={onNext}>Scenario 3 <ChevronRight size={14}/></Btn></div>
      </>}
    </Page>
  );
};

// ── SCENARIO 3 ────────────────────────────────
const SC3 = ({ onNext }) => {
  const [chosen, setChosen] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const calc = (fee) => { let b=0; for(let i=0;i<30;i++) b=(b+500*12)*(1+0.07-fee); return Math.round(b); };
  const mutual=calc(0.012), index=calc(0.0003), diff=index-mutual;
  const fmt = n => n>=1e6?`$${(n/1e6).toFixed(2)}M`:`$${(n/1000).toFixed(0)}K`;
  const opts = [{id:"a",label:"About the same — both earned 7% after all"},{id:"b",label:`The index fund investor has roughly ${fmt(diff)} more`},{id:"c",label:"The mutual fund investor has more — professional management wins"},{id:"d",label:"The difference is maybe $5,000–$10,000 — fees matter but not dramatically"}];
  return (
    <Page>
      <SL>Scenario 3 of 3</SL>
      <Card>
        <div style={{ fontFamily:FM, fontSize:"9px", color:C.gold, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:"12px" }}>The Situation</div>
        <H2>The Fee Revelation</H2>
        <Body>Two investors. Same age, same income, same discipline. Both invest <strong style={{ color:C.textPrime }}>$500/month for 30 years</strong> at a <strong style={{ color:C.textPrime }}>7% gross annual return</strong>. Investor A uses a mutual fund charging 1.2%/yr. Investor B uses an index fund charging 0.03%/yr.</Body>
      </Card>
      {opts.map(o=><OBtn key={o.id} opt={o} chosen={chosen} correct="b" revealed={revealed} onClick={()=>!revealed&&setChosen(o.id)}/>)}
      {chosen&&!revealed&&<div style={{ textAlign:"center", marginTop:"14px" }}><Btn onClick={()=>setRevealed(true)}>Reveal Outcome <ChevronRight size={14}/></Btn></div>}
      {revealed&&chosen&&<>
        <Card style={{ borderColor:chosen==="b"?C.borderHi:"rgba(217,119,6,0.3)", background:chosen==="b"?C.goldFaint:C.amberFaint, marginTop:"20px" }}>
          <div style={{ color:chosen==="b"?C.gold:C.amber, fontFamily:FD, fontWeight:700, fontSize:"17px", marginBottom:"10px" }}>{chosen==="b"?"Exactly right — and jaw-dropping, is it not?":"The actual difference is even more striking"}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", margin:"14px 0" }}>
            <div style={{ textAlign:"center", background:C.surface2, borderRadius:"10px", padding:"14px" }}>
              <div style={{ fontFamily:FM, fontSize:"9px", color:C.textMuted, marginBottom:"6px" }}>MUTUAL FUND</div>
              <div style={{ fontFamily:FD, fontSize:"26px", color:C.amber, fontWeight:700 }}>{fmt(mutual)}</div>
            </div>
            <div style={{ textAlign:"center", background:C.goldFaint, borderRadius:"10px", padding:"14px" }}>
              <div style={{ fontFamily:FM, fontSize:"9px", color:C.textMuted, marginBottom:"6px" }}>INDEX FUND</div>
              <div style={{ fontFamily:FD, fontSize:"26px", color:C.gold, fontWeight:700 }}>{fmt(index)}</div>
            </div>
          </div>
          <div style={{ background:"#0A0A00", borderRadius:"8px", padding:"12px", textAlign:"center", marginBottom:"12px" }}>
            <div style={{ fontFamily:FM, fontSize:"9px", color:C.textMuted, marginBottom:"5px", letterSpacing:"0.1em" }}>THE FEE GAP</div>
            <div style={{ fontFamily:FD, fontSize:"30px", color:C.gold, fontWeight:700 }}>{fmt(diff)}</div>
            <div style={{ fontFamily:FM, fontSize:"10px", color:C.textMuted, marginTop:"4px" }}>stayed in the fund manager's pocket</div>
          </div>
          <Body style={{ marginBottom:0 }}>Same investor. Same discipline. Same gross return. The only difference was 1.17% in annual fees — compounded over 30 years.</Body>
        </Card>
        <CQ name="Betty" emoji="😌" color={C.slate}>This is the number that made me switch to index funds. Not the performance. The fees. Once I saw this, the decision made itself.</CQ>
        <Card gold style={{ marginTop:"12px" }}>
          <div style={{ color:C.gold, fontWeight:700, fontFamily:FD, marginBottom:"8px" }}>The Lesson</div>
          <Body style={{ marginBottom:0 }}>The <VT id="expense_ratio">expense ratio</VT> is one of the few things in investing you can control completely. You cannot control market returns. But you can minimize fees — and over decades, that single decision compounds into an enormous difference.</Body>
        </Card>
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"24px" }}><Btn onClick={onNext}>Take the Quiz <ChevronRight size={14}/></Btn></div>
      </>}
    </Page>
  );
};

// ── QUIZ ──────────────────────────────────────
const Quiz = ({ onFinish }) => {
  const qs = [
    { q:"What is the key difference between buying a stock and buying a bond?", opts:["Stocks are safer than bonds","A stock makes you an owner; a bond makes you a lender","Bonds always pay more over time","Stocks are only for large companies"], correct:1, exp:"When you buy a stock you acquire equity — ownership in a company. When you buy a bond you are lending money in exchange for fixed interest payments. Owner vs. lender is the foundational distinction of this module." },
    { q:"True or False: Most actively managed mutual funds outperform a simple index fund over a 20-year period.", opts:["True — professional managers have superior research access","False — data consistently shows most active managers underperform the market average","True — but only for large-cap funds","False — but index funds also underperform the market"], correct:1, exp:"Roughly 80–90% of actively managed funds underperform their benchmark index over 20-year periods, largely due to fees and the difficulty of consistently predicting market movements." },
    { q:"An investor needs their money in 3 years for a house purchase. Which is most appropriate?", opts:["100% in growth stocks — more time means more risk tolerance","A mix of bonds and cash — capital preservation matters most with a short timeline","An index fund — low fees make it right for any timeline","Crypto — high potential returns could help them reach their goal faster"], correct:1, exp:"With only 3 years, the investor cannot afford a significant market downturn right before they need the money. Capital preservation — not growth — is the priority. Stocks and index funds are better suited for timelines of 10+ years." },
  ];
  const [cur, setCur] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const tally = useRef(0);
  const q = qs[cur];
  const opts = q.opts.map((o,i)=>({id:String.fromCharCode(97+i),label:o}));
  const correctId = String.fromCharCode(97+q.correct);
  const isCorrect = chosen===correctId;
  const handleSubmit = () => { setSubmitted(true); if(isCorrect) tally.current += 1; };
  const handleNext = () => {
    if(cur<qs.length-1){ setCur(c=>c+1); setChosen(null); setSubmitted(false); }
    else onFinish(tally.current);
  };
  return (
    <Page>
      <SL>Knowledge Check</SL><H1>Module 2 Quiz</H1>
      <div style={{ display:"flex", gap:"7px", marginBottom:"28px" }}>
        {qs.map((_,i)=><div key={i} style={{ height:"3px", flex:1, borderRadius:"2px", background:i<cur?C.gold:i===cur?C.goldGlow:C.surface2 }}/>)}
      </div>
      <div style={{ fontFamily:FM, fontSize:"10px", color:C.textMuted, marginBottom:"14px", letterSpacing:"0.1em" }}>QUESTION {cur+1} OF {qs.length}</div>
      <Card><H2 style={{ fontSize:"17px", marginBottom:0 }}>{q.q}</H2></Card>
      {opts.map(o=><OBtn key={o.id} opt={o} chosen={chosen} correct={correctId} revealed={submitted} onClick={()=>!submitted&&setChosen(o.id)}/>)}
      {chosen&&!submitted&&<div style={{ textAlign:"center", marginTop:"14px" }}><Btn onClick={handleSubmit}>Submit Answer</Btn></div>}
      {submitted&&<>
        <Card style={{ borderColor:isCorrect?C.borderHi:"rgba(217,119,6,0.3)", background:isCorrect?C.goldFaint:C.amberFaint, marginTop:"16px" }}>
          <div style={{ color:isCorrect?C.gold:C.amber, fontFamily:FD, fontWeight:700, marginBottom:"8px", fontSize:"16px" }}>{isCorrect?"Exactly right":"Not quite — here is the nuance"}</div>
          <Body style={{ marginBottom:0 }}>{q.exp}</Body>
        </Card>
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"16px" }}>
          <Btn onClick={handleNext}>{cur<qs.length-1?"Next Question":"See Results"} <ChevronRight size={14}/></Btn>
        </div>
      </>}
    </Page>
  );
};

// ── RESULTS ───────────────────────────────────
const Results = ({ score, total, userName, onRestart, onMap }) => {
  const pct = Math.round((score/total)*100);
  const vocab = ["asset","equity","debt_instrument","liquidity","bond","fixed_income","stock","dividend","volatility","mutual_fund","expense_ratio","index_fund","etf","passive_investing"];
  return (
    <Page>
      <div style={{ textAlign:"center", paddingTop:"24px", marginBottom:"40px" }}>
        <div style={{ width:"72px", height:"72px", borderRadius:"50%", background:C.goldFaint, border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:"32px" }}>{pct===100?"🏆":pct>=66?"🎯":"📚"}</div>
        <SL>Module 2 Complete</SL>
        <H1 style={{ textAlign:"center" }}>{pct===100?"Outstanding, ":pct>=66?"Well done, ":"Good work, "}<span style={{ color:C.gold }}>{userName}</span>.</H1>
        <Lead>You got <strong style={{ color:C.textPrime }}>{score} out of {total}</strong> questions right. You now speak the language of the building blocks.</Lead>
      </div>
      <Card gold>
        <H2 style={{ fontSize:"18px", marginBottom:"18px" }}>Vocabulary earned in this module</H2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
          {vocab.map(id=>{ const v=VOCAB[id]; if(!v) return null; return (
            <div key={id} style={{ display:"flex", gap:"8px", alignItems:"flex-start" }}>
              <CheckCircle size={13} color={C.gold} style={{ flexShrink:0, marginTop:"2px" }}/>
              <div><span style={{ fontFamily:FB, fontWeight:700, color:C.gold, fontSize:"13px" }}>{v.term}</span>
              <Body style={{ margin:0, fontSize:"11px", color:C.textMuted, lineHeight:1.4 }}>{v.def}</Body></div>
            </div>
          ); })}
        </div>
      </Card>
      <Card>
        <H2 style={{ fontSize:"17px" }}>Coming up in Module 3</H2>
        <Body style={{ marginBottom:0, color:C.textMuted }}>You now know what to invest in. Next — how does the place where all this buying and selling happens actually work? Why do prices change every single day? What is a bull market, and what is a bear market?</Body>
      </Card>
      <Card amber>
        <H2 style={{ fontSize:"16px", color:C.amber }}>Coming in a future module</H2>
        <Body style={{ marginBottom:0 }}>Cryptocurrency and other emerging asset classes will get their own dedicated module — with the depth and nuance they deserve.</Body>
      </Card>
      <div style={{ display:"flex", gap:"10px", justifyContent:"center", marginTop:"32px", flexWrap:"wrap" }}>
        <Btn onClick={onMap}><Home size={14}/> Module Map</Btn>
        <Btn outline onClick={onRestart}><RotateCcw size={14}/> Restart</Btn>
      </div>
    </Page>
  );
};

// ── APP ───────────────────────────────────────
export default function Module2() {
  const navigate = useNavigate();
  const { completeModule } = useUser();
  const [screen, setScreen] = useState("opening");
  const [score, setScore] = useState(0);
  const userName = "Investor";
  const go = s => { setScreen(s); window.scrollTo(0,0); };
  const LABELS = { s1:"Section 1 of 7",s2:"Section 2 of 7",s3:"Section 3 of 7",s4:"Section 4 of 7",s5:"Section 5 of 7",s6:"Section 6 of 7",s7:"Section 7 of 7",sc1:"Scenario 1 of 3",sc2:"Scenario 2 of 3",sc3:"Scenario 3 of 3",quiz:"Quiz",results:"Results" };
  const STEPS = ["s1","s2","s3","s4","s5","s6","s7","sc1","sc2","sc3","quiz","results"];
  const progress = screen==="opening"?0:((STEPS.indexOf(screen)+1)/STEPS.length)*100;
  const screens = {
    opening:<Opening onBegin={()=>go("s1")}/>,
    s1:<S1 onNext={()=>go("s2")}/>, s2:<S2 onNext={()=>go("s3")}/>, s3:<S3 onNext={()=>go("s4")}/>,
    s4:<S4 onNext={()=>go("s5")}/>, s5:<S5 onNext={()=>go("s6")}/>, s6:<S6 onNext={()=>go("s7")}/>,
    s7:<S7 onNext={()=>go("sc1")}/>,
    sc1:<SC1 onNext={()=>go("sc2")}/>, sc2:<SC2 onNext={()=>go("sc3")}/>, sc3:<SC3 onNext={()=>go("quiz")}/>,
    quiz:<Quiz onFinish={s=>{setScore(s);completeModule("2");go("results")}}/>,
    results:<Results score={score} total={3} userName={userName} onRestart={()=>go("opening")} onMap={()=>{ completeModule("2"); navigate("/"); }}/>,
  };
  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:FB, color:C.textBody }}>
      {screen!=="opening"&&<header style={{ background:"rgba(0,0,0,0.96)", borderBottom:`1px solid ${C.border}`, padding:"13px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(10px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", color:C.gold, fontFamily:FD, fontSize:"16px", fontWeight:700 }}><TrendingUp size={16} color={C.gold}/> Investment Club</div>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          {LABELS[screen]&&<span style={{ fontFamily:FM, fontSize:"10px", color:C.textMuted, letterSpacing:"0.08em" }}>{LABELS[screen]}</span>}
          <div style={{ background:C.goldFaint, border:`1px solid ${C.borderHi}`, borderRadius:"20px", padding:"3px 12px", fontFamily:FM, fontSize:"10px", color:C.gold }}>MODULE 2</div>
        </div>
      </header>}
      {screen!=="opening"&&<div style={{ height:"2px", background:C.surface2 }}><div style={{ height:"100%", background:C.gold, width:`${progress}%`, transition:"width 0.4s ease", boxShadow:`0 0 8px ${C.gold}` }}/></div>}
      {screens[screen]}
    </div>
  );
}

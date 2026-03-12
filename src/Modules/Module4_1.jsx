import { useState, useEffect, useRef } from "react";
import { ChevronRight, TrendingUp, Wind, RotateCcw, AlertCircle } from "lucide-react";

const GOLD="#D4A017", AMBER="#D97706", SLATE="#94A3B8", GREEN="#22C55E", RED="#EF4444", BLUE="#3B82F6";
const BG="#000", SURF="#0D0D0D", SURF2="#141414", BORDER="rgba(212,160,23,0.15)", BORDERHI="rgba(212,160,23,0.4)";
const TP="#F5F0E8", TB="#C8C0B0", TM="#7A7060", TD="#4A4438";
const FD="'Playfair Display','Georgia',serif", FB="'Georgia','Times New Roman',serif", FM="'Courier New',monospace";

// ── PROFILE DATA ─────────────────────────────────────────────────
const PROFILES = {
  anchor: {
    id:"anchor", label:"The Anchor", emoji:"⚓", color:"#94A3B8", score:[0,16],
    tagline:"Stability above all else. You hold firm when the waters rise.",
    description:"You are not here to get rich quick — you are here to not get poor slowly. Capital preservation is your north star. You would rather earn 4% reliably than risk 20% volatility for a chance at 12%. That is not timidity. That is a clearly defined relationship with risk, and it is entirely valid.",
    strengths:["Never panic sells during downturns","Sleeps well regardless of market conditions","Protects principal through turbulent markets","Makes rational decisions unclouded by greed"],
    watchouts:["Inflation can quietly erode purchasing power","May miss significant long-term growth opportunities","Can over-concentrate in bonds and cash at low rates","Tends to underestimate personal time horizon"],
    naturalAlloc:{ usStocks:15, intlStocks:5, bonds:55, reits:5, cash:20 },
    boatDesc:"A heavy, wide-hulled vessel. Near impossible to capsize. Won't win any races — but it will reach port every time."
  },
  navigator: {
    id:"navigator", label:"The Navigator", emoji:"🧭", color:"#D97706", score:[17,26],
    tagline:"Steady course, eyes on the horizon. Growth matters, but so does sleep.",
    description:"You want your money to grow meaningfully over time, but you are not willing to white-knuckle it through 40% drawdowns to get there. You have a longer time horizon than you sometimes admit to yourself. You understand the logic of risk and reward — you just want to calibrate it carefully.",
    strengths:["Good balance between growth and protection","Responds thoughtfully rather than reactively to news","Understands diversification intuitively","Consistent long-term compounder"],
    watchouts:["Can be indecisive when markets are volatile","Sometimes holds too much cash out of caution","May shift allocations too frequently during uncertainty","Underweights equities in prolonged low-rate environments"],
    naturalAlloc:{ usStocks:35, intlStocks:10, bonds:35, reits:10, cash:10 },
    boatDesc:"A well-built sloop. Handles rough seas with dignity. Not the fastest vessel, but expertly crewed and reliably seaworthy."
  },
  sailor: {
    id:"sailor", label:"The Sailor", emoji:"⛵", color:"#D4A017", score:[27,36],
    tagline:"Comfortable with waves. The horizon is your destination.",
    description:"You understand that volatility is not the enemy — it is the price of admission for long-term growth. You have experienced market drops before and did not make decisions you regret. Your time horizon is genuinely long, and you have the temperament to match. You are the profile most financial research is written for.",
    strengths:["Stays invested through market cycles","Benefits fully from long-term equity compounding","Not rattled by normal market volatility","Good instincts about rebalancing opportunities"],
    watchouts:["Can underestimate tail risk in concentrated positions","Sometimes conflates volatility tolerance with risk tolerance","May neglect bonds entirely in growth phases","Overconfidence can creep in after long bull markets"],
    naturalAlloc:{ usStocks:50, intlStocks:15, bonds:20, reits:10, cash:5 },
    boatDesc:"A capable offshore cruiser. Built for open water. Handles storms without drama. You know where you are going and you have provisioned accordingly."
  },
  captain: {
    id:"captain", label:"The Captain", emoji:"🚢", color:"#22C55E", score:[37,46],
    tagline:"Growth is the mission. You know the risks and you have chosen them.",
    description:"You have a long time horizon, genuine tolerance for volatility, and a clear-eyed understanding that higher returns require accepting higher drawdowns. When markets fall, your first instinct is opportunity, not fear. You have probably already done more reading about investing than most people you know.",
    strengths:["Maximum exposure to long-term equity growth","Buys confidently during market downturns","Understands the math of compounding deeply","Does not confuse short-term volatility with permanent loss"],
    watchouts:["Bear markets are longer and harder than they look from a bull","Concentration risk is the silent portfolio killer","Sequence-of-returns risk matters more as retirement approaches","Can mistake conviction for certainty — they are not the same"],
    naturalAlloc:{ usStocks:60, intlStocks:20, bonds:10, reits:8, cash:2 },
    boatDesc:"A fast, high-performance vessel. Flies in good weather. Requires an experienced hand in rough seas. Not for the faint-hearted — but extraordinary when the conditions are right."
  },
  adventurer: {
    id:"adventurer", label:"The Adventurer", emoji:"🛥️", color:"#EF4444", score:[47,60],
    tagline:"Maximum sail. You are here for the journey and the returns.",
    description:"You are drawn to the frontier. Concentrated bets, emerging markets, high-growth sectors — the conventional portfolio feels too tame. You understand intellectually that this approach can end badly, and you accept that as part of the contract. Your time horizon is very long or your risk capital is genuinely discretionary — either way, you have chosen your boat.",
    strengths:["Highest theoretical long-term upside","Comfortable with asymmetric bets","Often ahead of market trends and themes","Genuine intellectual engagement with markets"],
    watchouts:["Volatility at this level is psychologically brutal — even for those who think they are ready","A single concentrated position can permanently impair capital","Behavioral risk is the biggest threat — conviction must not become stubbornness","This profile requires either a very long horizon or capital you can genuinely afford to lose"],
    naturalAlloc:{ usStocks:70, intlStocks:20, bonds:5, reits:3, cash:2 },
    boatDesc:"A racing yacht in open ocean. Thrilling, fast, and demanding. One bad storm without proper preparation can end the voyage. Experienced crew required."
  }
};

const PROFILE_ORDER = ["anchor","navigator","sailor","captain","adventurer"];

// ── QUESTIONS ────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id:1,
    text:"You receive an unexpected $10,000. Your first instinct is:",
    sub:"Be honest — not what you think you should do, what you would actually do.",
    opts:[
      { text:"Put it somewhere safe. A high-yield savings account or CDs.", points:1 },
      { text:"Split it — some safe, some invested cautiously.", points:2 },
      { text:"Invest most of it in a diversified index fund.", points:3 },
      { text:"Put the bulk into stocks I believe in, keep a little cash.", points:4 },
      { text:"Find the highest-conviction opportunity available and go in.", points:5 },
    ]
  },
  {
    id:2,
    text:"Your portfolio drops 25% in three months. You:",
    sub:"This has happened to every investor alive. What is your real response?",
    opts:[
      { text:"Sell enough to move back to mostly cash. Preservation first.", points:1 },
      { text:"Feel anxious but hold. Remind myself it is temporary.", points:2 },
      { text:"Hold everything. Review my thesis. Make no emotional decisions.", points:3 },
      { text:"Hold and look for opportunities to add to my strongest positions.", points:4 },
      { text:"This is what I have been waiting for. Buy more aggressively.", points:5 },
    ]
  },
  {
    id:3,
    text:"What does a good night's sleep mean to you in terms of your portfolio?",
    sub:"There is no wrong answer here — self-knowledge is the point.",
    opts:[
      { text:"Knowing my principal is protected no matter what happens.", points:1 },
      { text:"Knowing I have enough in safe assets to cover any emergency.", points:2 },
      { text:"Knowing my long-term plan is sound, even if today was rough.", points:3 },
      { text:"I sleep fine regardless — I trust my research and my timeline.", points:4 },
      { text:"Market volatility does not affect my sleep. It is part of the game.", points:5 },
    ]
  },
  {
    id:4,
    text:"A stock you own drops 35% on bad news — but the business itself looks intact. You:",
    sub:"The headline says catastrophe. Your thesis says hold. What wins?",
    opts:[
      { text:"Sell. A 35% drop means something is wrong regardless of the thesis.", points:1 },
      { text:"Trim the position. Reduce risk while I research what happened.", points:2 },
      { text:"Hold. My original thesis has not changed. I wait for clarity.", points:3 },
      { text:"Hold and research thoroughly. Likely add if the thesis holds up.", points:4 },
      { text:"This is probably a buying opportunity. Add to the position.", points:5 },
    ]
  },
  {
    id:5,
    text:"Which of these best describes your investing time horizon?",
    sub:"Be realistic — not optimistic. When might you genuinely need this money?",
    opts:[
      { text:"Within 3 years. This money has a near-term purpose.", points:1 },
      { text:"3-7 years. Medium term. I want growth but need flexibility.", points:2 },
      { text:"7-15 years. Long enough to ride out most downturns.", points:3 },
      { text:"15-25 years. Retirement or a very long-term goal.", points:4 },
      { text:"25+ years. Or I am investing capital I genuinely do not need.", points:5 },
    ]
  },
  {
    id:6,
    text:"A friend tells you about a high-conviction investment — up 300% in two years, strong fundamentals. You:",
    sub:"Your gut reaction before you have done any research.",
    opts:[
      { text:"No interest. Past performance means nothing. Probably a trap.", points:1 },
      { text:"Curious but cautious. Maybe a tiny position after serious research.", points:2 },
      { text:"Interested. Would research thoroughly and consider a modest position.", points:3 },
      { text:"Very interested. This is how outsized returns happen.", points:4 },
      { text:"I want in. High conviction opportunities are rare — you act on them.", points:5 },
    ]
  },
  {
    id:7,
    text:"The market has been in a bear market for 14 months — down 30%. You:",
    sub:"14 months is a long time to endure sustained losses.",
    opts:[
      { text:"Have already moved to safety. I cannot watch this anymore.", points:1 },
      { text:"Am holding but have significantly reduced my equity exposure.", points:2 },
      { text:"Am fully invested per my plan. Uncomfortable but not panicking.", points:3 },
      { text:"Have been buying steadily throughout. Bear markets are a gift.", points:4 },
      { text:"Have been buying aggressively. I have been adding to everything.", points:5 },
    ]
  },
  {
    id:8,
    text:"You have two investment options. Which do you choose?",
    sub:"Neither is wrong — they reflect different relationships with risk.",
    opts:[
      { text:"Option A: 90% chance of gaining $1,000. 10% chance of losing $200.", points:1 },
      { text:"Option B: 70% chance of gaining $3,000. 30% chance of losing $1,000.", points:2 },
      { text:"Option C: 55% chance of gaining $6,000. 45% chance of losing $2,500.", points:3 },
      { text:"Option D: 45% chance of gaining $12,000. 55% chance of losing $4,000.", points:4 },
      { text:"Option E: 30% chance of gaining $25,000. 70% chance of losing $6,000.", points:5 },
    ]
  },
  {
    id:9,
    text:"Which statement feels most true about investment losses?",
    sub:"Your honest philosophical relationship with losing money.",
    opts:[
      { text:"Any loss of principal is a failure to be avoided at nearly any cost.", points:1 },
      { text:"Losses are painful and I work hard to minimize them.", points:2 },
      { text:"Losses are part of investing. Temporary ones do not worry me much.", points:3 },
      { text:"Losses are information. They help me refine my thinking.", points:4 },
      { text:"Losses are the tuition you pay for the returns that follow.", points:5 },
    ]
  },
  {
    id:10,
    text:"If your portfolio significantly outperformed the market this year, your primary feeling would be:",
    sub:"This question reveals as much as the loss questions.",
    opts:[
      { text:"Relief — but also worry about what comes next. This cannot last.", points:1 },
      { text:"Pleased — but I would probably reduce risk to protect the gains.", points:2 },
      { text:"Happy — but I would stay the course. One year means nothing long-term.", points:3 },
      { text:"Energized — I would analyze what worked and lean into it further.", points:4 },
      { text:"Hungry for more. Good performance tells me my conviction was right.", points:5 },
    ]
  },
];

// ── PRIMITIVES ────────────────────────────────────────────────────
const Card = ({ children, style={}, gold=false, amber=false, green=false, red=false, blue=false }) => {
  const bg = gold?"rgba(212,160,23,0.08)":amber?"rgba(217,119,6,0.1)":green?"rgba(34,197,94,0.08)":red?"rgba(239,68,68,0.08)":blue?"rgba(59,130,246,0.08)":SURF;
  const br = gold?BORDERHI:amber?"rgba(217,119,6,0.25)":green?"rgba(34,197,94,0.25)":red?"rgba(239,68,68,0.25)":blue?"rgba(59,130,246,0.25)":BORDER;
  return <div style={{ background:bg, border:"1px solid "+br, borderRadius:"14px", padding:"24px", marginBottom:"20px", ...style }}>{children}</div>;
};
const SL = ({ children }) => <div style={{ color:GOLD, fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase", fontFamily:FM, marginBottom:"12px" }}>{children}</div>;
const H1 = ({ children, style={} }) => <h1 style={{ fontFamily:FD, fontSize:"clamp(24px,5vw,40px)", fontWeight:700, color:TP, lineHeight:1.15, marginBottom:"18px", ...style }}>{children}</h1>;
const H2 = ({ children, style={} }) => <h2 style={{ fontFamily:FD, fontSize:"clamp(16px,3vw,22px)", fontWeight:700, color:TP, lineHeight:1.2, marginBottom:"12px", ...style }}>{children}</h2>;
const Body = ({ children, style={} }) => <p style={{ fontFamily:FB, fontSize:"15px", lineHeight:1.85, color:TB, marginBottom:"16px", ...style }}>{children}</p>;
const Lead = ({ children }) => <p style={{ fontFamily:FB, fontSize:"17px", lineHeight:1.75, color:TB, marginBottom:"28px" }}>{children}</p>;
const Btn = ({ children, onClick, outline=false, style={} }) => (
  <button onClick={onClick} style={{ background:outline?"transparent":GOLD, color:outline?GOLD:"#000", border:"1px solid "+GOLD, borderRadius:"8px", padding:outline?"10px 20px":"12px 24px", fontSize:"14px", fontWeight:700, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"7px", fontFamily:FB, ...style }}>{children}</button>
);
const Page = ({ children }) => <div style={{ maxWidth:"780px", margin:"0 auto", padding:"32px 20px 80px" }}>{children}</div>;

const getProfile = score => {
  for (const key of PROFILE_ORDER) {
    const p = PROFILES[key];
    if (score >= p.score[0] && score <= p.score[1]) return p;
  }
  return PROFILES.sailor;
};

// ── OPENING ───────────────────────────────────────────────────────
const Opening = ({ onBegin }) => {
  const [phase, setPhase] = useState(0);
  useEffect(()=>{
    if(phase<4){ const t=setTimeout(()=>setPhase(p=>p+1), phase===0?500:1800); return ()=>clearTimeout(t); }
  },[phase]);
  const boats = [
    { emoji:"⚓", label:"The Anchor",     color:SLATE },
    { emoji:"🧭", label:"The Navigator",  color:AMBER },
    { emoji:"⛵", label:"The Sailor",     color:GOLD },
    { emoji:"🚢", label:"The Captain",    color:GREEN },
    { emoji:"🛥️", label:"The Adventurer", color:RED },
  ];
  return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center", backgroundImage:"radial-gradient(ellipse at 50% 20%, rgba(59,130,246,0.06) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(212,160,23,0.05) 0%, transparent 60%)", overflow:"hidden" }}>
      <div style={{ opacity:phase>0?1:0, transition:"opacity 1s", fontFamily:FM, fontSize:"10px", letterSpacing:"0.2em", color:TM, textTransform:"uppercase", marginBottom:"40px" }}>Investment Club · Module 4.1</div>
      <div style={{ maxWidth:"660px" }}>
        <div style={{ opacity:phase>1?1:0, transform:phase>1?"translateY(0)":"translateY(16px)", transition:"opacity 0.9s, transform 0.9s", marginBottom:"24px" }}>
          <div style={{ fontFamily:FD, fontSize:"clamp(13px,1.8vw,16px)", color:TB, lineHeight:1.8, marginBottom:"20px" }}>
            Every investor who has ever lived has faced the same ocean — the same tides, the same storms, the same periods of glassy calm. What separates them is not luck or intelligence.
          </div>
          <div style={{ fontFamily:FD, fontSize:"clamp(22px,4vw,38px)", color:TP, fontStyle:"italic", lineHeight:1.3, marginBottom:"20px" }}>
            It is knowing what kind of boat you are sailing.
          </div>
          <div style={{ fontFamily:FB, fontSize:"clamp(14px,2vw,17px)", color:TB, lineHeight:1.8 }}>
            A racing yacht and a cargo vessel can sail the same waters. One will win in calm seas. The other will survive a hurricane. Neither is wrong — they were built for different voyages.
          </div>
        </div>
        {phase>2 && (
          <div>
            <div style={{ display:"flex", justifyContent:"center", gap:"12px", flexWrap:"wrap", margin:"32px 0" }}>
              {boats.map((b,i)=>(
                <div key={b.label} style={{ opacity:0, animation:"fadeUp 0.5s ease forwards", animationDelay:(i*120)+"ms", background:SURF, border:"1px solid "+BORDER, borderRadius:"12px", padding:"14px 16px", textAlign:"center", minWidth:"90px" }}>
                  <div style={{ fontSize:"24px", marginBottom:"6px" }}>{b.emoji}</div>
                  <div style={{ fontFamily:FM, fontSize:"9px", color:b.color, letterSpacing:"0.1em" }}>{b.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily:FB, fontSize:"clamp(13px,1.8vw,15px)", color:TB, lineHeight:1.8, marginBottom:"8px" }}>
              Ten questions. No right answers. Complete honesty will serve you better than what you think you should say.
            </div>
            <div style={{ fontFamily:FM, fontSize:"13px", color:TB, marginBottom:"36px", lineHeight:1.7, padding:"12px 16px", background:SURF, border:"1px solid "+BORDER, borderRadius:"8px", textAlign:"left" }}>
              <span style={{ color:AMBER }}>⚠ </span>This module is for <strong style={{ color:TB }}>education and entertainment only</strong> — not financial advice. Your profile is a starting point for self-reflection, not a prescription. Every investor's situation is unique. Please consult a qualified financial advisor before making investment decisions.
            </div>
            <Btn onClick={onBegin} style={{ fontSize:"15px", padding:"14px 32px" }}>
              Find My Profile <ChevronRight size={15}/>
            </Btn>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

// ── QUIZ ──────────────────────────────────────────────────────────
const QuizScreen = ({ onComplete }) => {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [chosen, setChosen] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const totalScore = useRef(0);
  const q = QUESTIONS[cur];
  const progress = ((cur) / QUESTIONS.length) * 100;

  const handleChoice = (points, idx) => {
    if (transitioning) return;
    setChosen(idx);
    setTransitioning(true);
    totalScore.current += points;
    setTimeout(()=>{
      if (cur < QUESTIONS.length - 1) {
        setCur(c=>c+1);
        setChosen(null);
        setTransitioning(false);
      } else {
        onComplete(totalScore.current);
      }
    }, 600);
  };

  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <header style={{ background:"rgba(0,0,0,0.96)", borderBottom:"1px solid "+BORDER, padding:"13px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", color:GOLD, fontFamily:FD, fontSize:"16px", fontWeight:700 }}>
          <Wind size={16} color={GOLD}/> Know Yourself
        </div>
        <div style={{ fontFamily:FM, fontSize:"10px", color:TM }}>Question {cur+1} of {QUESTIONS.length}</div>
      </header>
      <div style={{ height:"3px", background:SURF2 }}>
        <div style={{ height:"100%", background:GOLD, width:progress+"%", transition:"width 0.4s ease", boxShadow:"0 0 8px "+GOLD }}/>
      </div>
      <Page>
        <div style={{ marginBottom:"32px" }}>
          <div style={{ fontFamily:FM, fontSize:"10px", color:TM, letterSpacing:"0.12em", marginBottom:"16px" }}>QUESTION {cur+1} OF {QUESTIONS.length}</div>
          <div style={{ fontFamily:FD, fontSize:"clamp(18px,3vw,26px)", color:TP, lineHeight:1.4, marginBottom:"10px", fontWeight:700 }}>{q.text}</div>
          <div style={{ fontFamily:FB, fontStyle:"italic", fontSize:"14px", color:TB, lineHeight:1.6 }}>{q.sub}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {q.opts.map((opt,i)=>(
            <button key={i} onClick={()=>handleChoice(opt.points, i)} disabled={transitioning}
              style={{ background:chosen===i?"rgba(212,160,23,0.12)":SURF, border:"1px solid "+(chosen===i?BORDERHI:BORDER), borderRadius:"12px", padding:"16px 20px", textAlign:"left", color:chosen===i?TP:TB, fontSize:"15px", cursor:transitioning?"default":"pointer", fontFamily:FB, lineHeight:1.6, display:"flex", alignItems:"center", gap:"14px" }}>
              <span style={{ width:"28px", height:"28px", borderRadius:"50%", flexShrink:0, background:chosen===i?GOLD:SURF2, border:"1px solid "+(chosen===i?GOLD:BORDER), display:"flex", alignItems:"center", justifyContent:"center", color:chosen===i?"#000":TM, fontSize:"11px", fontWeight:700, fontFamily:FM }}>
                {String.fromCharCode(65+i)}
              </span>
              {opt.text}
            </button>
          ))}
        </div>
        <div style={{ marginTop:"32px", display:"flex", gap:"6px" }}>
          {QUESTIONS.map((_,i)=>(
            <div key={i} style={{ height:"3px", flex:1, borderRadius:"2px", background:i<cur?GOLD:i===cur?"rgba(212,160,23,0.3)":SURF2 }}/>
          ))}
        </div>
      </Page>
    </div>
  );
};

// ── REVEAL ANIMATION ──────────────────────────────────────────────
const ProfileReveal = ({ profile, onContinue }) => {
  const [phase, setPhase] = useState(0);
  useEffect(()=>{
    const delays = [400, 1200, 2200, 3400];
    const timers = delays.map((d,i)=>setTimeout(()=>setPhase(i+1), d));
    return ()=>timers.forEach(clearTimeout);
  },[]);

  return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center", backgroundImage:"radial-gradient(ellipse at 50% 50%, "+profile.color+"18 0%, transparent 65%)" }}>
      <div style={{ opacity:phase>0?1:0, transition:"opacity 0.8s", fontFamily:FM, fontSize:"10px", letterSpacing:"0.2em", color:TM, textTransform:"uppercase", marginBottom:"24px" }}>Your Investor Profile</div>
      <div style={{ opacity:phase>1?1:0, transform:phase>1?"scale(1)":"scale(0.7)", transition:"opacity 0.7s, transform 0.7s", fontSize:"72px", marginBottom:"20px" }}>{profile.emoji}</div>
      <div style={{ opacity:phase>2?1:0, transform:phase>2?"translateY(0)":"translateY(20px)", transition:"opacity 0.8s, transform 0.8s" }}>
        <div style={{ fontFamily:FD, fontSize:"clamp(28px,5vw,48px)", fontWeight:700, color:profile.color, marginBottom:"12px" }}>{profile.label}</div>
        <div style={{ fontFamily:FD, fontStyle:"italic", fontSize:"clamp(15px,2.5vw,20px)", color:TB, maxWidth:"520px", lineHeight:1.6, marginBottom:"32px" }}>{profile.tagline}</div>
      </div>
      {phase>3 && (
        <Btn onClick={onContinue} style={{ fontSize:"15px", padding:"13px 30px" }}>
          See My Full Profile <ChevronRight size={15}/>
        </Btn>
      )}
    </div>
  );
};

// ── PROFILE ROW (extracted to avoid block-body map) ─────────────
const ProfileRow = ({ pkey, profile }) => {
  const p = PROFILES[pkey];
  const isYou = pkey===profile.id;
  const bg = isYou ? p.color+"10" : SURF2;
  const bd = isYou ? p.color+"40" : BORDER;
  const tc = isYou ? TB : TM;
  return (
    <div style={{ background:bg, border:"1px solid "+bd, borderRadius:"10px", padding:"14px 16px", display:"flex", gap:"12px", alignItems:"flex-start", marginBottom:"8px" }}>
      <div style={{ fontSize:"22px", flexShrink:0 }}>{p.emoji}</div>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
          <span style={{ fontFamily:FD, fontWeight:700, color:p.color, fontSize:"15px" }}>{p.label}</span>
          {isYou && <span style={{ fontFamily:FM, fontSize:"8px", background:p.color, color:"#000", borderRadius:"4px", padding:"2px 6px", letterSpacing:"0.08em" }}>YOU</span>}
        </div>
        <Body style={{ margin:0, fontSize:"12px", color:tc }}>{p.tagline}</Body>
      </div>
      <div style={{ textAlign:"right", flexShrink:0 }}>
        <div style={{ fontFamily:FM, fontSize:"9px", color:TM, marginBottom:"3px" }}>US STOCKS</div>
        <div style={{ fontFamily:FD, fontWeight:700, color:p.color, fontSize:"16px" }}>{p.naturalAlloc.usStocks}%</div>
      </div>
    </div>
  );
};

// ── PROFILE DETAIL ────────────────────────────────────────────────
const ProfileDetail = ({ profile, score, onNext, onRestart }) => {
  const idx = PROFILE_ORDER.indexOf(profile.id);
  const alloc = profile.naturalAlloc;
  const allocEntries = [
    { key:"usStocks",   label:"US Stocks",      color:"#3B82F6" },
    { key:"intlStocks", label:"Intl Stocks",    color:"#8B5CF6" },
    { key:"bonds",      label:"Bonds",          color:GOLD },
    { key:"reits",      label:"Real Estate",    color:AMBER },
    { key:"cash",       label:"Cash",           color:SLATE },
  ];

  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <header style={{ background:"rgba(0,0,0,0.96)", borderBottom:"1px solid "+BORDER, padding:"13px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", color:GOLD, fontFamily:FD, fontSize:"16px", fontWeight:700 }}>
          <TrendingUp size={16} color={GOLD}/> Investment Club
        </div>
        <div style={{ background:"rgba(212,160,23,0.08)", border:"1px solid "+BORDERHI, borderRadius:"20px", padding:"3px 12px", fontFamily:FM, fontSize:"10px", color:GOLD }}>MODULE 4.1</div>
      </header>
      <Page>
        {/* PROFILE HEADER */}
        <div style={{ textAlign:"center", marginBottom:"36px", padding:"32px 24px", background:SURF, border:"1px solid "+BORDER, borderRadius:"20px", backgroundImage:"radial-gradient(ellipse at 50% 0%, "+profile.color+"12 0%, transparent 60%)" }}>
          <div style={{ fontSize:"52px", marginBottom:"12px" }}>{profile.emoji}</div>
          <SL>Your Investor Profile</SL>
          <H1 style={{ textAlign:"center", color:profile.color, marginBottom:"10px" }}>{profile.label}</H1>
          <div style={{ fontFamily:FD, fontStyle:"italic", fontSize:"18px", color:TB, marginBottom:"20px" }}>{profile.tagline}</div>
          {/* SPECTRUM BAR */}
          <div style={{ margin:"0 auto", maxWidth:"480px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
              {PROFILE_ORDER.map((k,i)=>(
                <div key={k} style={{ textAlign:"center", flex:1 }}>
                  <div style={{ fontSize:i===idx?"20px":"14px", transition:"font-size 0.3s", marginBottom:"4px" }}>{PROFILES[k].emoji}</div>
                  <div style={{ fontFamily:FM, fontSize:"7px", color:i===idx?PROFILES[k].color:TM, letterSpacing:"0.05em" }}>{PROFILES[k].label.split(" ")[1]}</div>
                </div>
              ))}
            </div>
            <div style={{ height:"6px", background:SURF2, borderRadius:"3px", position:"relative" }}>
              <div style={{ position:"absolute", left:0, top:0, height:"100%", borderRadius:"3px", background:"linear-gradient(to right, "+SLATE+", "+AMBER+", "+GOLD+", "+GREEN+", "+RED+")", width:"100%", opacity:0.3 }}/>
              <div style={{ position:"absolute", top:"50%", transform:"translate(-50%,-50%)", left:((idx/(PROFILE_ORDER.length-1))*100)+"%", width:"16px", height:"16px", borderRadius:"50%", background:profile.color, border:"2px solid #000", transition:"left 0.5s" }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:"6px" }}>
              <span style={{ fontFamily:FM, fontSize:"9px", color:TM }}>Lower Risk</span>
              <span style={{ fontFamily:FM, fontSize:"9px", color:TM }}>Higher Risk</span>
            </div>
          </div>
        </div>

        {/* SCORE */}
        <Card gold>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
            <div>
              <div style={{ fontFamily:FM, fontSize:"10px", color:TM, marginBottom:"6px", letterSpacing:"0.1em" }}>YOUR RISK SCORE</div>
              <div style={{ fontFamily:FD, fontSize:"42px", fontWeight:700, color:profile.color }}>{score}<span style={{ fontSize:"18px", color:TM }}>/50</span></div>
            </div>
            <Body style={{ margin:0, maxWidth:"420px" }}>{profile.description}</Body>
          </div>
        </Card>

        {/* BOAT DESCRIPTION */}
        <Card style={{ borderColor:profile.color+"40", background:profile.color+"0A" }}>
          <div style={{ display:"flex", gap:"14px", alignItems:"flex-start" }}>
            <div style={{ fontSize:"32px", flexShrink:0 }}>{profile.emoji}</div>
            <div>
              <div style={{ fontFamily:FM, fontSize:"9px", color:profile.color, letterSpacing:"0.12em", marginBottom:"8px" }}>YOUR VESSEL</div>
              <Body style={{ margin:0, fontStyle:"italic" }}>{profile.boatDesc}</Body>
            </div>
          </div>
        </Card>

        {/* STRENGTHS & WATCHOUTS */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"20px" }}>
          <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:"14px", padding:"20px" }}>
            <div style={{ fontFamily:FM, fontSize:"9px", color:GREEN, letterSpacing:"0.12em", marginBottom:"14px" }}>NATURAL STRENGTHS</div>
            {profile.strengths.map((s,i)=>(
              <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"10px" }}>
                <span style={{ color:GREEN, flexShrink:0, marginTop:"3px" }}>✦</span>
                <Body style={{ margin:0, fontSize:"13px", lineHeight:1.6 }}>{s}</Body>
              </div>
            ))}
          </div>
          <div style={{ background:"rgba(217,119,6,0.08)", border:"1px solid rgba(217,119,6,0.2)", borderRadius:"14px", padding:"20px" }}>
            <div style={{ fontFamily:FM, fontSize:"9px", color:AMBER, letterSpacing:"0.12em", marginBottom:"14px" }}>WATCH OUT FOR</div>
            {profile.watchouts.map((w,i)=>(
              <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"10px" }}>
                <span style={{ color:AMBER, flexShrink:0, marginTop:"3px" }}>▲</span>
                <Body style={{ margin:0, fontSize:"13px", lineHeight:1.6 }}>{w}</Body>
              </div>
            ))}
          </div>
        </div>

        {/* NATURAL ALLOCATION */}
        <Card>
          <H2 style={{ fontSize:"18px" }}>Your Natural Allocation</H2>
          <Body style={{ color:TB, fontSize:"13px" }}>Based on your profile, here is the kind of allocation that typically suits investors like you. This is a starting point for conversation — not a prescription.</Body>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"16px" }}>
            {allocEntries.map(a=>(
              <div key={a.key}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                  <span style={{ fontFamily:FB, fontSize:"13px", color:TB }}>{a.label}</span>
                  <span style={{ fontFamily:FM, fontSize:"13px", color:a.color, fontWeight:700 }}>{alloc[a.key]}%</span>
                </div>
                <div style={{ height:"8px", background:SURF2, borderRadius:"4px" }}>
                  <div style={{ height:"100%", width:alloc[a.key]+"%", background:a.color, borderRadius:"4px", transition:"width 0.8s ease" }}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:BG, borderRadius:"10px", padding:"14px 16px", border:"1px solid "+BORDER }}>
            <div style={{ fontFamily:FM, fontSize:"9px", color:TM, marginBottom:"6px", letterSpacing:"0.1em" }}>REMEMBER</div>
            <Body style={{ margin:0, fontSize:"13px", color:TB }}>Investment strategies are as varied as the people who use them. Your profile describes a natural inclination — not a ceiling. Many experienced investors combine elements from multiple profiles as their knowledge and circumstances evolve.</Body>
          </div>
        </Card>

        {/* THE TIDES SECTION */}
        <Card amber>
          <div style={{ display:"flex", gap:"12px" }}>
            <div style={{ fontSize:"24px", flexShrink:0 }}>🌊</div>
            <div>
              <H2 style={{ fontSize:"17px" }}>All tides rise all boats — but not equally</H2>
              <Body>A rising market lifts every portfolio. A falling market tests every one. The same tide that capsizes an overloaded racing yacht barely rocks a well-ballasted cargo vessel.</Body>
              <Body style={{ marginBottom:0 }}>Understanding which boat you are sailing is not about limiting yourself. It is about being honest about what you can handle — financially and psychologically — so you do not make decisions in a storm that you will regret in calm water. That self-knowledge is what separates experienced investors from beginners, regardless of how much money either has.</Body>
            </div>
          </div>
        </Card>

        {/* PROFILES COMPARISON */}
        <Card>
          <H2 style={{ fontSize:"17px" }}>Where you sit among all five profiles</H2>
          <Body style={{ color:TB, fontSize:"13px", marginBottom:"16px" }}>There is no better or worse profile — only the right one for your situation. Here is the full spectrum for context.</Body>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {PROFILE_ORDER.map(k=>(
            <ProfileRow key={k} pkey={k} profile={profile}/>
          ))}
          </div>
        </Card>

        {/* DISCLAIMER */}
        <div style={{ background:"rgba(217,119,6,0.06)", border:"1px solid rgba(217,119,6,0.2)", borderRadius:"12px", padding:"16px 20px", marginBottom:"32px", display:"flex", gap:"10px" }}>
          <AlertCircle size={16} color={AMBER} style={{ flexShrink:0, marginTop:"2px" }}/>
          <Body style={{ margin:0, fontSize:"13px", color:TB, lineHeight:1.7 }}>
            <strong style={{ color:AMBER }}>Educational purposes only.</strong> This profile assessment is designed to help you reflect on your relationship with risk — not to provide financial advice. Your optimal allocation depends on many factors including your income, debts, dependents, tax situation, and specific financial goals. Please consult a qualified financial advisor before making investment decisions.
          </Body>
        </div>

        {/* CTA */}
        <div style={{ textAlign:"center", padding:"32px 0" }}>
          <Btn outline onClick={onRestart} style={{ marginBottom:"28px" }}>
            <RotateCcw size={14}/> Retake the Quiz
          </Btn>
          <div style={{ fontFamily:FD, fontSize:"22px", color:TP, marginBottom:"10px" }}>Ready to test your profile against history?</div>
          <div style={{ fontFamily:FB, fontSize:"15px", color:TB, marginBottom:"28px" }}>Module 4.2 puts your natural allocation through five of the most significant market events of the last century. How does your boat handle the tides?</div>
          <Btn onClick={onNext} style={{ fontSize:"15px", padding:"14px 32px" }}>
            Launch the Simulator <ChevronRight size={15}/>
          </Btn>
        </div>
      </Page>
    </div>
  );
};

// ── APP ────────────────────────────────────────────────────────────
export default function Module4_1() {
  const [screen, setScreen] = useState("opening");
  const [score, setScore] = useState(0);
  const [profile, setProfile] = useState(null);

  const handleQuizComplete = s => {
    const p = getProfile(s);
    setScore(s);
    setProfile(p);
    setScreen("reveal");
    window.scrollTo(0,0);
  };

  const handleRevealDone = () => {
    setScreen("profile");
    window.scrollTo(0,0);
  };

  const handleRestart = () => {
    setScore(0);
    setProfile(null);
    setScreen("opening");
    window.scrollTo(0,0);
  };

  if (screen==="opening") return <Opening onBegin={()=>{ setScreen("quiz"); window.scrollTo(0,0); }}/>;
  if (screen==="quiz") return <QuizScreen onComplete={handleQuizComplete}/>;
  if (screen==="reveal") return <ProfileReveal profile={profile} onContinue={handleRevealDone}/>;
  if (screen==="profile") return (
    <ProfileDetail
      profile={profile}
      score={score}
      onNext={()=>alert("Module 4.2 — The Simulator — coming next!")}
      onRestart={handleRestart}
    />
  );
  return null;
}

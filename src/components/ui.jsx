import { useState } from "react";
import {
  GOLD, GREEN, RED, BLUE, PURPLE, AMBER,
  BG, SURF, SURF2, BORDER, BORDERHI,
  TP, TB, TM, FD, FB, FM, SLATE
} from "../theme";

export const Card = ({ children, style={}, gold=false, green=false, red=false, blue=false, purple=false }) => {
  const accent = gold ? GOLD : green ? GREEN : red ? RED : blue ? BLUE : purple ? PURPLE : null;
  return (
    <div style={{
      background: SURF,
      border: "1px solid " + (accent ? accent + "40" : BORDER),
      borderRadius: 12, padding: "20px 22px", marginBottom: 16,
      boxShadow: accent ? "0 0 20px " + accent + "10" : "none",
      ...style
    }}>{children}</div>
  );
};

export const SL = ({ children, c=GOLD }) => (
  <div style={{
    fontFamily: FM, fontSize: 10, letterSpacing: "0.15em",
    textTransform: "uppercase", color: c, marginBottom: 6
  }}>{children}</div>
);

export const H1 = ({ children, style={} }) => (
  <h1 style={{
    fontFamily: FD, fontSize: "clamp(22px,4vw,34px)", color: TP,
    margin: "0 0 12px", lineHeight: 1.25, ...style
  }}>{children}</h1>
);

export const H2 = ({ children, style={} }) => (
  <h2 style={{
    fontFamily: FD, fontSize: "clamp(15px,2.5vw,20px)", color: TP,
    margin: "0 0 8px", lineHeight: 1.3, ...style
  }}>{children}</h2>
);

export const Body = ({ children, style={} }) => (
  <p style={{
    fontFamily: FB, fontSize: 15, color: TB,
    lineHeight: 1.75, margin: "0 0 12px", ...style
  }}>{children}</p>
);

export const Btn = ({ children, onClick, outline=false, small=false, disabled=false, color=GOLD, style={} }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: outline ? "transparent" : color,
    color: outline ? color : BG,
    border: "1.5px solid " + color,
    borderRadius: 8, padding: small ? "8px 16px" : "12px 24px",
    fontFamily: FM, fontSize: small ? 11 : 13, letterSpacing: "0.08em",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    fontWeight: 600, transition: "all 0.2s", ...style
  }}>{children}</button>
);

export const Page = ({ children }) => (
  <div style={{
    background: BG, minHeight: "100vh",
    padding: "28px 20px 80px", maxWidth: 800, margin: "0 auto"
  }}>{children}</div>
);

export const VT = ({ id, children }) => {
  const [open, setOpen] = useState(false);
  const defs = {
    "inflation": "The gradual rise in prices over time that erodes the purchasing power of money.",
    "compound interest": "Earning interest on your interest. Your returns generate their own returns, creating a snowball effect.",
    "purchasing power": "What your money can actually buy. Inflation shrinks purchasing power over time.",
    "opportunity cost": "The value of what you give up by choosing one option over another.",
    "stock": "A share of ownership in a company.",
    "bond": "A loan you make to a government or company. They pay you back with interest.",
    "ETF": "A basket of many stocks or bonds packaged into one investment you can buy like a stock.",
    "index fund": "A fund that tracks a market index like the S&P 500.",
    "diversification": "Spreading money across many different investments so one bad one doesn't sink everything.",
    "dividend": "A portion of a company's profits paid directly to shareholders.",
    "expense ratio": "The annual fee a fund charges, expressed as a percentage of your investment.",
    "asset allocation": "How you divide your money between different types of investments.",
    "bull market": "A period when stock prices are rising — generally 20%+ from a recent low.",
    "bear market": "A period when stock prices are falling — generally 20%+ from a recent high.",
    "market index": "A measure of a group of stocks used to represent overall market performance.",
    "volatility": "How much and how quickly prices move up and down.",
    "liquidity": "How easily you can convert an investment to cash.",
    "market correction": "A drop of 10-20% from a recent market peak.",
    "portfolio": "Your complete collection of investments across all accounts.",
    "rebalancing": "Periodically adjusting your portfolio back to your target allocation.",
    "risk tolerance": "How much investment loss you can stomach without making panic decisions.",
    "time horizon": "How long before you will need your money.",
    "brokerage": "A company that acts as your middleman to buy and sell investments on your behalf.",
    "bid-ask spread": "The tiny gap between what buyers will pay and what sellers want.",
    "market order": "An instruction to buy or sell immediately at whatever the current price is.",
    "limit order": "An instruction to buy or sell ONLY at a specific price or better.",
    "dollar-cost averaging": "Investing a fixed amount on a regular schedule regardless of price.",
    "average cost basis": "The average price you paid per share across all your purchases.",
    "lump sum": "Investing all your money at once rather than spreading it out over time.",
    "compound growth": "Earning returns on your returns. The gains snowball over time.",
    "qualitative analysis": "Evaluating a company based on non-numerical factors like brand and management.",
    "quantitative analysis": "Evaluating a company using financial numbers and ratios.",
    "moat": "A sustainable competitive advantage that protects a company from competitors.",
    "market cap": "The total market value of a company. Share price times total shares outstanding.",
    "revenue": "The total money a company brings in before any costs are deducted.",
    "profit": "What is left after a company pays all its costs.",
    "EPS": "Earnings Per Share. A company's total profit divided by its number of shares.",
    "P/E ratio": "Price-to-Earnings ratio. Share price divided by EPS.",
    "valuation": "How much the market thinks a company is worth.",
  };
  const def = defs[id];
  if (!def) return (
    <span style={{ borderBottom: "1px dashed " + GOLD, color: TP, cursor: "help" }}>{children}</span>
  );
  return (
    <span style={{ position: "relative", display: "inline" }}>
      <span onClick={() => setOpen(!open)} style={{ borderBottom: "1px dashed " + GOLD, color: TP, cursor: "pointer" }}>{children}</span>
      {open && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: 0,
          background: SURF2, border: "1px solid " + BORDERHI, borderRadius: 8,
          padding: "10px 14px", fontSize: 13, color: TB, fontFamily: FB,
          width: 260, zIndex: 99, lineHeight: 1.6, display: "block",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
        }}>{def}</span>
      )}
    </span>
  );
};
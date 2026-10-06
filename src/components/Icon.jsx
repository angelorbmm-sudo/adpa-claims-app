import React from "react";

const paths = {
  dashboard: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  claim: "M8 3h8l4 4v14H4V3h4 M14 3v5h6 M8 12h8 M8 16h6",
  tasks: "M9 6h12 M9 12h12 M9 18h12 M3 6l1 1 2-2 M3 12l1 1 2-2 M3 18l1 1 2-2",
  money: "M12 3v18 M17 7c-1-3-10-3-10 1 0 4 10 2 10 6s-9 5-10 1",
  shield: "M12 3l8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6z M8 12l3 3 5-6",
  folder: "M3 6h7l2 3h9v12H3z M3 6V3h7l2 3h9v3",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  close: "M6 6l12 12 M18 6L6 18",
  plus: "M12 5v14 M5 12h14",
  arrow: "M5 12h14 M14 7l5 5-5 5",
};
export default function Icon({name="claim",className=""}) {
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.claim}/></svg>;
}

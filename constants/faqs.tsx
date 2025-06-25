import React from "react";

import { Text } from "@/components/ui/text";
import { Faq } from "@/lib/types";

const faqs: Faq[] = [
  {
    question: 'What is SOLID?',
    answer: <>SOLID is a full-stack DeFi protocol that lets users <Text className="font-bold">earn, spend, and save</Text> directly from their self-custodial wallet. At its core is SoUSD, a yield-bearing, gasless, cross-chain stablecoin.</>,
  },
  {
    question: 'How does SOLID work?',
    answer: 'When you mint SoUSD, your funds are deployed into vaults that optimize yield across audited DeFi protocols. All strategies are on-chain, whitelisted, and monitored in real time.\nYou earn automatically. No staking. No signatures. No gas.',
  },
  {
    question: 'What makes SOLID different?',
    answer: 'SOLID combines self-custody with a seemless UX. You get real yield, full control, cross-chain support, and card payments — all in one experience. No more gas fees. No more complexity. Just DeFi that works.',
  },
  {
    question: 'What is SoUSD?',
    answer: 'SoUSD is a stablecoin that earns yield from day one. It\'s gasless, non-custodial, and automatically grows your balance with curated yield strategies — without staking or lockups.',
  },
  {
    question: 'Where does the yield come from?',
    answer: <>Yield comes from <Text className="font-bold">BoringVaults</Text>, a set of curated DeFi strategies deployed across multiple chains. These vaults allocate capital into secure, audited protocols with strong track records, such as lending markets and liquid staking. Strategies are selected based on risk, uptime, and performance — ensuring your SoUSD earns optimized, risk-adjusted yield without you lifting a finger.</>,
  },
];

export default faqs;

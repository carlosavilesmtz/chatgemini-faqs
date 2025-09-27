import React from 'react';
import type { UsageStats } from '../types';

interface TokenUsageProps {
  stats: UsageStats;
}

const TokenUsage: React.FC<TokenUsageProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    }).format(amount);
  };

  return (
    <div className="text-xs text-slate-400 flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mb-2 px-4">
      <span className="text-center">
        <strong>Último:</strong> {stats.lastExchangeTokens.toLocaleString('es-MX')} tokens ({formatCurrency(stats.lastExchangeCost)})
      </span>
      <span className="hidden sm:block border-l border-slate-600 h-4"></span>
      <span className="text-center">
        <strong>Total Sesión:</strong> {stats.totalSessionTokens.toLocaleString('es-MX')} tokens ({formatCurrency(stats.totalSessionCost)})
      </span>
    </div>
  );
};

export default TokenUsage;

import React, { useMemo } from 'react';
import { Calendar, Target, TrendingDown } from 'lucide-react';
import { getTotalExpenses } from '../utils/transactions';

const BudgetPlanning = ({ 
  transactions, 
  billStartDate, 
  setBillStartDate, 
  billEndDate, 
  setBillEndDate, 
  budgetGoal, 
  setBudgetGoal 
}) => {

  const totalSpent = useMemo(() => getTotalExpenses(transactions), [transactions]);

  const budgetCalculations = useMemo(() => {
    if (!billEndDate || !budgetGoal) return null;

    const today = new Date();
    const endDate = new Date(billEndDate);
    
    // Calcula dias restantes até o fechamento
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    const budgetValue = parseFloat(budgetGoal);
    
    if (isNaN(budgetValue) || budgetValue <= 0) return null;

    // Calcula quanto falta gastar
    const remainingBudget = budgetValue - totalSpent;
    
    // Calcula gasto diário máximo permitido
    const dailyLimit = daysRemaining > 0 ? remainingBudget / daysRemaining : 0;

    return {
      daysRemaining: Math.max(0, daysRemaining),
      budgetValue,
      remainingBudget,
      dailyLimit,
      totalSpent,
      percentageUsed: (totalSpent / budgetValue) * 100,
      isOverBudget: totalSpent > budgetValue
    };
  }, [billEndDate, budgetGoal, totalSpent]);

  const getDailyLimitColor = (dailyLimit) => {
    if (dailyLimit < 0) return 'text-red-600';
    if (dailyLimit < 50) return 'text-orange-600';
    return 'text-green-600';
  };

  const getRemainingBudgetColor = (remaining, isBudgetSet) => {
    if (!isBudgetSet) return 'text-gray-600';
    if (remaining < 0) return 'text-red-600';
    if (remaining < 100) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Planejamento de Fatura</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Data de Início da Fatura
            </label>
            <input
              type="date"
              value={billStartDate}
              onChange={(e) => setBillStartDate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Data de Fechamento da Fatura
            </label>
            <input
              type="date"
              value={billEndDate}
              onChange={(e) => setBillEndDate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-2" />
              Meta de Gasto (R$)
            </label>
            <input
              type="number"
              value={budgetGoal}
              onChange={(e) => setBudgetGoal(e.target.value)}
              placeholder="Ex: 3000.00"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {budgetCalculations && (
          <div className="space-y-6">
            {/* Budget Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm mb-1">Meta de Gasto</p>
                <p className="text-2xl font-bold text-blue-600">R$ {budgetCalculations.budgetValue.toFixed(2)}</p>
              </div>

              <div className={`bg-white rounded-lg p-4 border-l-4 ${budgetCalculations.isOverBudget ? 'border-red-500' : 'border-green-500'}`}>
                <p className="text-gray-600 text-sm mb-1">Gasto Atual</p>
                <p className={`text-2xl font-bold ${budgetCalculations.isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  R$ {budgetCalculations.totalSpent.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{budgetCalculations.percentageUsed.toFixed(1)}% da meta</p>
              </div>

              <div className={`bg-white rounded-lg p-4 border-l-4 ${budgetCalculations.remainingBudget < 0 ? 'border-red-500' : 'border-green-500'}`}>
                <p className="text-gray-600 text-sm mb-1">Orçamento Restante</p>
                <p className={`text-2xl font-bold ${getRemainingBudgetColor(budgetCalculations.remainingBudget, true)}`}>
                  R$ {budgetCalculations.remainingBudget.toFixed(2)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-gray-600 text-sm mb-1">Dias Restantes</p>
                <p className="text-2xl font-bold text-purple-600">{budgetCalculations.daysRemaining}</p>
              </div>
            </div>

            {/* Daily Spending Limit - Main Focus */}
            <div className={`rounded-xl p-8 text-center ${budgetCalculations.dailyLimit >= 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300' : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300'}`}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <TrendingDown className="w-6 h-6 text-gray-700" />
                <h3 className="text-xl font-bold text-gray-800">Gasto Diário Permitido</h3>
              </div>
              <p className={`text-5xl font-bold mb-2 ${getDailyLimitColor(budgetCalculations.dailyLimit)}`}>
                R$ {Math.max(0, budgetCalculations.dailyLimit).toFixed(2)}
              </p>
              <p className="text-gray-600 text-sm">
                {budgetCalculations.dailyLimit >= 0 
                  ? `Você pode gastar até R$ ${budgetCalculations.dailyLimit.toFixed(2)} por dia até ${billEndDate}`
                  : `⚠️ Você já ultrapassou o orçamento em R$ ${Math.abs(budgetCalculations.remainingBudget).toFixed(2)}`
                }
              </p>
            </div>

            {/* Budget Status Indicator */}
            {budgetCalculations && (
              <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Status do Orçamento</h3>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-gray-700">Progresso de Gasto</p>
                    <p className="text-sm font-bold text-gray-800">{budgetCalculations.percentageUsed.toFixed(1)}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        budgetCalculations.percentageUsed >= 100 ? 'bg-red-500' :
                        budgetCalculations.percentageUsed >= 80 ? 'bg-orange-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(budgetCalculations.percentageUsed, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Message */}
                <div className="p-4 rounded-lg bg-gray-50">
                  {budgetCalculations.isOverBudget ? (
                    <p className="text-red-700 font-semibold">
                      🚨 Você já ultrapassou seu orçamento! Está R$ {Math.abs(budgetCalculations.remainingBudget).toFixed(2)} acima da meta.
                    </p>
                  ) : budgetCalculations.percentageUsed >= 80 ? (
                    <p className="text-orange-700 font-semibold">
                      ⚠️ Você está usando {budgetCalculations.percentageUsed.toFixed(1)}% de seu orçamento. Cuidado para não ultrapassar!
                    </p>
                  ) : (
                    <p className="text-green-700 font-semibold">
                      ✅ Você está no caminho certo! Possui R$ {budgetCalculations.remainingBudget.toFixed(2)} de orçamento restante.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {budgetCalculations && budgetCalculations.daysRemaining > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Dica:</span> Mantendo um gasto diário de <span className="font-bold text-blue-600">R$ {budgetCalculations.dailyLimit.toFixed(2)}</span> você chegará ao fechamento dentro de sua meta.
                </p>
              </div>
            )}
          </div>
        )}

        {!budgetGoal && (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-600">Insira a meta de gasto para visualizar o planejamento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPlanning;

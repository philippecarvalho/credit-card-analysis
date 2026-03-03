import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, UtensilsCrossed, ChevronDown, ChevronUp } from 'lucide-react';
import {
  calculateCategoryTotals,
  groupTransactionsByMainCategory,
  groupTransactionsByFoodSubcategory,
  calculateFoodSubcategoryTotals,
  getInstallmentPurchases,
  getTotalExpenses,
  getTotalReturns,
  getTotalFood,
} from '../utils/transactions';

const ExpenseAnalysis = ({ transactions }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedFoodSub, setExpandedFoodSub] = useState(null);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16', '#a855f7', '#f43f5e'];
  const foodColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  // Dados calculados
  const categoryTotals = useMemo(() => calculateCategoryTotals(transactions), [transactions]);
  const transactionsByCategory = useMemo(() => groupTransactionsByMainCategory(transactions), [transactions]);
  const transactionsByFoodSub = useMemo(() => groupTransactionsByFoodSubcategory(transactions), [transactions]);
  const foodSubcategories = useMemo(() => calculateFoodSubcategoryTotals(transactions), [transactions]);
  const installmentPurchases = useMemo(() => getInstallmentPurchases(transactions), [transactions]);
  
  // Totalizadores
  const totalExpenses = useMemo(() => getTotalExpenses(transactions), [transactions]);
  const totalFood = useMemo(() => getTotalFood(transactions), [transactions]);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-xs md:text-sm mb-1">Total de Gastos</p>
              <p className="text-2xl md:text-3xl font-bold">R$ {totalExpenses.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 md:w-12 md:h-12 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs md:text-sm mb-1">Compras Parceladas</p>
              <p className="text-2xl md:text-3xl font-bold">{installmentPurchases.length}</p>
            </div>
            <Calendar className="w-8 h-8 md:w-12 md:h-12 opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-gray-50 rounded-xl p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Gastos por Categoria</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryTotals} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                {categoryTotals.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Ranking de Categorias</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryTotals}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{fontSize: 11}} />
              <YAxis tick={{fontSize: 11}} />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {foodSubcategories.length > 0 && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 md:p-6 border-2 border-red-200">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <UtensilsCrossed className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            <h2 className="text-lg md:text-2xl font-bold text-gray-800">Detalhamento: Alimentação</h2>
          </div>
          <div className="bg-white rounded-lg p-3 md:p-4 mb-4 md:mb-6">
            <div className="flex justify-between items-center gap-2">
              <span className="text-sm md:text-lg font-semibold text-gray-700">Total em Alimentação</span>
              <div className="text-right">
                <p className="text-xl md:text-3xl font-bold text-red-600">R$ {totalFood.toFixed(2)}</p>
                <p className="text-xs md:text-sm text-gray-500">{((totalFood / totalExpenses) * 100).toFixed(1)}% dos gastos totais</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="bg-white rounded-lg p-3 md:p-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Distribuição por Tipo</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={foodSubcategories} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} outerRadius={60} dataKey="value">
                    {foodSubcategories.map((entry, index) => <Cell key={`cell-${index}`} fill={foodColors[index % foodColors.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg p-3 md:p-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Valores por Subcategoria</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={foodSubcategories} layout="vertical">
                  <XAxis type="number" tick={{fontSize: 11}} />
                  <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10}} />
                  <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Análise Detalhada</h3>
            {foodSubcategories.map((cat, idx) => {
              const isOpen = expandedFoodSub === cat.name;
              const items = transactionsByFoodSub[cat.name] || [];
              return (
                <div key={idx} className="bg-white rounded-lg border-l-4 overflow-hidden" style={{ borderColor: foodColors[idx % foodColors.length] }}>
                  <button onClick={() => setExpandedFoodSub(isOpen ? null : cat.name)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: foodColors[idx % foodColors.length] }}></div>
                      <span className="font-semibold text-gray-700">{cat.name}</span>
                      <span className="text-sm text-gray-400">{items.length} {items.length === 1 ? 'transação' : 'transações'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-800">R$ {cat.value.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{((cat.value / totalFood) * 100).toFixed(1)}% da alimentação</p>
                      </div>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50">
                      {items.map((t, i) => (
                        <div key={i} className="flex items-center justify-between px-6 py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium text-gray-700 text-sm">{t.title}</p>
                            <p className="text-xs text-gray-400">{t.date}</p>
                          </div>
                          <p className="font-semibold text-gray-800">R$ {t.amount.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Todas as Categorias</h2>
        <div className="space-y-3">
          {categoryTotals.map((cat, idx) => {
            const isOpen = expandedCategory === cat.name;
            const items = transactionsByCategory[cat.name] || [];
            return (
              <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <button onClick={() => setExpandedCategory(isOpen ? null : cat.name)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                    <span className="font-semibold text-gray-700">{cat.name}</span>
                    <span className="text-sm text-gray-400">{items.length} {items.length === 1 ? 'transação' : 'transações'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800">R$ {cat.value.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{((cat.value / totalExpenses) * 100).toFixed(1)}% do total</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100">
                    {items.map((t, i) => (
                      <div key={i} className="flex items-center justify-between px-6 py-3 border-b border-gray-100 last:border-0 bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-700 text-sm">{t.title}</p>
                          <p className="text-xs text-gray-400">{t.date}</p>
                        </div>
                        <p className="font-semibold text-gray-800">R$ {t.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {installmentPurchases.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⚠️ Compras Parceladas - Compromissos Futuros</h2>
          <p className="text-gray-600 mb-6">Estas são compras que você dividiu em várias parcelas. As parcelas restantes continuarão aparecendo nas próximas faturas.</p>
          <div className="space-y-4">
            {installmentPurchases.map((purchase, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{purchase.name}</h3>
                  <span className="text-lg font-bold text-orange-600">R$ {purchase.estimatedTotal.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Parcelas pagas nesta fatura: {purchase.installments.length}</p>
                  <p>Valor pago até agora: R$ {purchase.totalPaid.toFixed(2)}</p>
                  {purchase.installments[0]?.installmentInfo && (
                    <p className="text-orange-600 font-medium mt-1">
                      Faltam aproximadamente {purchase.installments[0].installmentInfo.total - purchase.installments[0].installmentInfo.current} parcelas
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseAnalysis;

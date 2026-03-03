import React, { useState, useMemo } from 'react';
import { CreditCard, Upload } from 'lucide-react';
import { parseCSV, applyAISuggestedCategories } from './utils/transactions';
import { suggestNewCategories } from './utils/aiCategoryAnalyzer';
import ExpenseAnalysis from './components/ExpenseAnalysis';
import BudgetPlanning from './components/BudgetPlanning';

const App = () => {
  const [csvData, setCsvData] = useState(`date,title,amount`);
  const [showUploadInstructions, setShowUploadInstructions] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis');
  const [billStartDate, setBillStartDate] = useState('');
  const [billEndDate, setBillEndDate] = useState('');
  const [budgetGoal, setBudgetGoal] = useState('');
  const [transactionsWithAI, setTransactionsWithAI] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const transactions = useMemo(() => parseCSV(csvData), [csvData]);
  
  // Usar transações com IA se disponível, caso contrário usar transações base
  const finalTransactions = transactionsWithAI.length > 0 ? transactionsWithAI : transactions;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvContent = e.target.result;
        setCsvData(csvContent);
        setShowUploadInstructions(false);
        setIsLoadingCategories(true);
        
        // Parse transações iniciais
        const parsedTransactions = parseCSV(csvContent);
        if (parsedTransactions.length > 0) {
          // Consultar IA em background para sugerir novas categorias
          try {
            const result = await suggestNewCategories(parsedTransactions);
            
            // Se houver sugestões, aplicá-las automaticamente
            if (result.suggestions && result.suggestions.length > 0) {
              const enhancedTransactions = applyAISuggestedCategories(parsedTransactions, result.suggestions);
              setTransactionsWithAI(enhancedTransactions);
              console.log(`✅ ${result.suggestions.length} nova(s) categoria(s) adicionada(s) automaticamente`);
            } else {
              // Sem sugestões, usar base
              setTransactionsWithAI(parsedTransactions);
              console.log('ℹ️ Categorias base utilizadas');
            }
          } catch (error) {
            // Se a IA falhar, apenas usar as categorias base (sem quebrar a aplicação)
            setTransactionsWithAI(parsedTransactions);
            console.log('ℹ️ Usando categorias base (IA indisponível)');
          } finally {
            // Aguardar um pequeno delay para garantir que a UI atualize suavemente
            setTimeout(() => setIsLoadingCategories(false), 500);
          }
        } else {
          setIsLoadingCategories(false);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Upload Instructions Banner */}
        {showUploadInstructions && (
          <div className="bg-blue-600 text-white rounded-2xl shadow-xl p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex items-start gap-3 md:gap-4">
              <Upload className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-3">Como usar este analisador</h2>
                <div className="space-y-2 text-blue-50 text-sm md:text-base">
                  <p><strong>1.</strong> Exporte sua fatura do cartão em formato CSV com as colunas: date, title, amount</p>
                  <p><strong>2.</strong> Use o botão abaixo para carregar seu arquivo CSV</p>
                  <p><strong>3.</strong> O analisador vai categorizar automaticamente seus gastos e ajudar no planejamento</p>
                  <p className="text-xs md:text-sm mt-4">Dica: Os dados estão seguros - tudo é processado localmente no seu navegador, nada é enviado para servidores externos.</p>
                </div>
                <label className="mt-4 inline-block">
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                  <span className="bg-white text-blue-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold cursor-pointer hover:bg-blue-50 transition inline-block text-sm md:text-base">Carregar Meu CSV</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 pb-4 md:pb-6 border-b-2 border-gray-200">
            <div className="flex items-center gap-2 md:gap-3">
              <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">Análise da Fatura do Cartão</h1>
            </div>
            {!showUploadInstructions && (
              <label>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition inline-flex items-center gap-2 text-sm">
                  <Upload className="w-4 h-4" /> Carregar
                </span>
              </label>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 md:gap-2 mb-6 md:mb-8 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('analysis')}
              disabled={isLoadingCategories}
              className={`px-3 md:px-6 py-2 md:py-3 font-semibold transition border-b-2 whitespace-nowrap ${
                isLoadingCategories ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                activeTab === 'analysis'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              Análise de Gastos
            </button>
            <button
              onClick={() => setActiveTab('planning')}
              disabled={isLoadingCategories}
              className={`px-3 md:px-6 py-2 md:py-3 font-semibold transition border-b-2 whitespace-nowrap ${
                isLoadingCategories ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                activeTab === 'planning'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              Planejar Fatura
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {isLoadingCategories ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Analisando e categorizando suas transações...</p>
                <p className="text-gray-400 text-sm mt-2">Isso pode levar alguns segundos</p>
              </div>
            ) : (
              <>
                {activeTab === 'analysis' && (
                  <ExpenseAnalysis transactions={finalTransactions} />
                )}
                {activeTab === 'planning' && (
                  <BudgetPlanning 
                    transactions={finalTransactions}
                    billStartDate={billStartDate}
                    setBillStartDate={setBillStartDate}
                    billEndDate={billEndDate}
                    setBillEndDate={setBillEndDate}
                    budgetGoal={budgetGoal}
                    setBudgetGoal={setBudgetGoal}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

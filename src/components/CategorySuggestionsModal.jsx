import React from 'react';
import { X, Lightbulb, AlertCircle } from 'lucide-react';

export const CategorySuggesionsModal = ({ 
  isOpen, 
  onClose, 
  suggestions, 
  message, 
  isLoading, 
  error 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lightbulb className="text-yellow-500" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Sugestões de Novas Categorias</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Analisando transações com IA...</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg border border-red-200">
              <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-red-800">Erro na análise</p>
                <p className="text-red-700 text-sm">{message}</p>
                <p className="text-red-600 text-xs mt-2">Certifique-se de que a variável de ambiente VITE_GOOGLE_GENERATIVE_AI_KEY está configurada em .env</p>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <p className="text-gray-600 mb-6">{message}</p>

              {suggestions && suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.map((suggestion, idx) => (
                    <div key={idx} className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                      <div className="flex items-start gap-3">
                        <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-indigo-900 text-lg">{suggestion.mainCategory}</h3>
                          
                          {suggestion.subCategories && suggestion.subCategories.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-semibold text-indigo-800 mb-1">Subcategorias:</p>
                              <div className="flex flex-wrap gap-1">
                                {suggestion.subCategories.map((sub, sidx) => (
                                  <span 
                                    key={sidx}
                                    className="bg-white text-indigo-700 px-3 py-1 rounded-full text-xs font-medium border border-indigo-300"
                                  >
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {suggestion.reason && (
                            <p className="mt-3 text-sm text-indigo-800">
                              <span className="font-semibold">Por que:</span> {suggestion.reason}
                            </p>
                          )}

                          {suggestion.examples && suggestion.examples.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-semibold text-indigo-800 mb-1">Exemplos:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {suggestion.examples.map((example, eidx) => (
                                  <li key={eidx} className="text-sm text-indigo-700">{example}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">💡 Dica:</span> Para usar essas novas categorias, adicione as regras de detecção na função <code className="bg-blue-100 px-2 py-1 rounded">categorizeTransaction</code> em <code className="bg-blue-100 px-2 py-1 rounded">utils/transactions.js</code>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">✨ Ótimo! As categorias atuais parecem ser suficientes.</p>
                  <p className="text-sm">Nenhuma nova categoria foi sugerida.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

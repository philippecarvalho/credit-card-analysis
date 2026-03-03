import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENERATIVE_AI_KEY);

export const suggestNewCategories = async (transactions) => {
  try {
    // Check if API key is configured
    if (!import.meta.env.VITE_GOOGLE_GENERATIVE_AI_KEY) {
      return {
        suggestions: [],
        message: 'Chave da API Google Generative AI não configurada',
        error: true
      };
    }

    // Filter transactions that are categorized as "Outros" (uncategorized)
    const uncategorized = transactions.filter(t => t.mainCategory === 'Outros');
    
    if (uncategorized.length === 0) {
      return { suggestions: [], message: 'Todas as transações foram categorizadas com sucesso!' };
    }

    // Get unique uncategorized titles (to avoid repetition)
    const uniqueTitles = [...new Set(uncategorized.map(t => t.title))].slice(0, 20);

    const prompt = `Analise as seguintes transações de cartão de crédito e sugira novas categorias que não constam na lista atual.

CATEGORIAS ATUAIS:
- Alimentação (Delivery, Restaurantes, Supermercado, Cafés e Padarias, Lanches e Sobremesas)
- Viagem
- Transporte
- Saúde
- Academia/Fitness
- Vestuário
- Lazer
- Streaming
- Serviços
- Compras Online
- IOF

TRANSAÇÕES SEM CATEGORIZAR:
${uniqueTitles.map((title, i) => `${i + 1}. ${title}`).join('\n')}

Por favor:
1. Analise essas transações
2. Sugira NOVAS categorias que fariam sentido (que não estão na lista atual)
3. Para cada sugestão, explique brevemente por que seria útil
4. Sugira também subcategorias

Responda em JSON com este formato (e APENAS o JSON, sem explicações adicionais):
{
  "suggestions": [
    {
      "mainCategory": "Nome da Categoria",
      "subCategories": ["Subcategoria 1", "Subcategoria 2"],
      "reason": "Explicação breve",
      "examples": ["exemplo 1", "exemplo 2"]
    }
  ]
}

Se não houver novas categorias a sugerir, retorne {"suggestions": []}.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { 
        suggestions: [], 
        message: 'Não consegui processar a resposta da IA',
        raw: responseText 
      };
    }

    const parsedResult = JSON.parse(jsonMatch[0]);
    return {
      suggestions: parsedResult.suggestions || [],
      message: parsedResult.suggestions && parsedResult.suggestions.length > 0 
        ? `Encontrei ${parsedResult.suggestions.length} nova(s) categoria(s)!`
        : 'As categorias atuais parecem ser suficientes.',
    };
  } catch (error) {
    console.error('Erro ao analisar categorias com IA:', error);
    return {
      suggestions: [],
      message: `Erro ao conectar com a IA: ${error.message}`,
      error: true
    };
  }
};

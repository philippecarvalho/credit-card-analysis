export const categorizeTransaction = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('ifood') || titleLower.includes('ifd*')) return { main: 'Alimentação', sub: 'Delivery (iFood)' };
  if (titleLower.includes('pizza') || titleLower.includes('restaur') || titleLower.includes('cucina') || titleLower.includes('taqueria') || titleLower.includes('china') || titleLower.includes('lanche') || titleLower.includes('burger') || titleLower.includes('bar') || titleLower.includes('assado') || titleLower.includes('cozinha') || titleLower.includes('gourmet') || titleLower.includes('emporio') || titleLower.includes('acai') || titleLower.includes('açaí')) return { main: 'Alimentação', sub: 'Restaurantes' };
  if (titleLower.includes('mercado') || titleLower.includes('supermercado') || titleLower.includes('mart') || titleLower.includes('market') || titleLower.includes('angeloni')) return { main: 'Alimentação', sub: 'Supermercado' };
  if (titleLower.includes('cafe') || titleLower.includes('cafeteria') || titleLower.includes('padaria') || titleLower.includes('bakery')) return { main: 'Alimentação', sub: 'Cafés e Padarias' };
  if (titleLower.includes('sorvete') || titleLower.includes('doce') || titleLower.includes('sobremesa')) return { main: 'Alimentação', sub: 'Lanches e Sobremesas' };
  if (titleLower.includes('latam') || titleLower.includes('gol') || titleLower.includes('azul') || titleLower.includes('hotel') || titleLower.includes('pousada') || titleLower.includes('ryanair') || titleLower.includes('booking') || titleLower.includes('eurostar')) return { main: 'Viagem', sub: 'Viagem' };
  if (titleLower.includes('uber') || titleLower.includes('99') || titleLower.includes('taxi')) return { main: 'Transporte', sub: 'Transporte' };
  if (titleLower.includes('farmacia') || titleLower.includes('drogaria') || titleLower.includes('hospital') || titleLower.includes('clinica')) return { main: 'Saúde', sub: 'Saúde' };
  if (titleLower.includes('academia') || titleLower.includes('fitness') || titleLower.includes('run fitness') || titleLower.includes('crossfit') || titleLower.includes('gym')) return { main: 'Academia/Fitness', sub: 'Academia/Fitness' };
  if (titleLower.includes('loja') || titleLower.includes('roupa') || titleLower.includes('calca') || titleLower.includes('camisa') || titleLower.includes('tenis') || titleLower.includes('sapato') || titleLower.includes('adidas') || titleLower.includes('nike') || titleLower.includes('payu *')) return { main: 'Vestuário', sub: 'Vestuário' };
  if (titleLower.includes('cinema') || titleLower.includes('show') || titleLower.includes('ingresso') || titleLower.includes('teatro') || titleLower.includes('houseofhits') || titleLower.includes('tattoo') || titleLower.includes('tatuagem')) return { main: 'Lazer', sub: 'Lazer' };
  if (titleLower.includes('streaming') || titleLower.includes('netflix') || titleLower.includes('spotify') || titleLower.includes('crunchyroll') || titleLower.includes('disney') || titleLower.includes('hbo') || titleLower.includes('prime video') || titleLower.includes('ebw*') || titleLower.includes('dm *')) return { main: 'Streaming', sub: 'Streaming' };
  if (titleLower.includes('lavanderia') || titleLower.includes('consultoria') || titleLower.includes('diarista')) return { main: 'Serviços', sub: 'Serviços' };
  if (titleLower.includes('amazon') || titleLower.includes('mercadolivre') || titleLower.includes('americanas') || titleLower.includes('magazineluiza')) return { main: 'Compras Online', sub: 'Compras Online' };
  if (titleLower.includes('iof')) return { main: 'IOF', sub: 'IOF' };
  if (titleLower.includes('pagamento recebido') || titleLower.includes('estorno')) return { main: 'Créditos/Estornos', sub: 'Créditos/Estornos' };
  return { main: 'Outros', sub: 'Outros' };
};

export const isInstallment = (title) => /parcela \d+\/\d+/i.test(title);

export const getInstallmentInfo = (title) => {
  const match = title.match(/parcela (\d+)\/(\d+)/i);
  return match ? { current: parseInt(match[1]), total: parseInt(match[2]) } : null;
};

export const parseCSV = (csvData) => {
  try {
    const lines = csvData.trim().split('\n').slice(1);
    return lines
      .map(line => {
        const parts = line.split(',');
        const date = parts[0];
        const amount = parseFloat(parts[parts.length - 1]);
        const title = parts.slice(1, parts.length - 1).join(',');
        const categories = categorizeTransaction(title);
        return { date, title, amount, mainCategory: categories.main, subCategory: categories.sub, isInstallment: isInstallment(title), installmentInfo: getInstallmentInfo(title) };
      })
      .filter(transaction => !transaction.title.toLowerCase().includes('pagamento recebido'));
  } catch (error) {
    return [];
  }
};

// ==================== DATA ANALYSIS HELPERS ====================

export const getPositiveTransactions = (transactions) => {
  return transactions.filter(t => t.amount > 0);
};

export const getNegativeTransactions = (transactions) => {
  return transactions.filter(t => t.amount < 0);
};

export const calculateCategoryTotals = (transactions) => {
  const totals = {};
  getPositiveTransactions(transactions).forEach(t => {
    totals[t.mainCategory] = (totals[t.mainCategory] || 0) + t.amount;
  });
  return Object.entries(totals)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);
};

export const groupTransactionsByMainCategory = (transactions) => {
  const grouped = {};
  getPositiveTransactions(transactions).forEach(t => {
    if (!grouped[t.mainCategory]) grouped[t.mainCategory] = [];
    grouped[t.mainCategory].push(t);
  });
  return grouped;
};

export const groupTransactionsByFoodSubcategory = (transactions) => {
  const grouped = {};
  getPositiveTransactions(transactions)
    .filter(t => t.mainCategory === 'Alimentação')
    .forEach(t => {
      if (!grouped[t.subCategory]) grouped[t.subCategory] = [];
      grouped[t.subCategory].push(t);
    });
  return grouped;
};

export const calculateFoodSubcategoryTotals = (transactions) => {
  const totals = {};
  getPositiveTransactions(transactions)
    .filter(t => t.mainCategory === 'Alimentação')
    .forEach(t => {
      totals[t.subCategory] = (totals[t.subCategory] || 0) + t.amount;
    });
  return Object.entries(totals)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);
};

export const getInstallmentPurchases = (transactions) => {
  const purchases = {};
  getPositiveTransactions(transactions)
    .filter(t => t.isInstallment)
    .forEach(t => {
      const baseName = t.title.replace(/ - Parcela \d+\/\d+/i, '').replace(/ Parcela \d+\/\d+/i, '');
      if (!purchases[baseName]) {
        purchases[baseName] = { name: baseName, installments: [], totalPaid: 0, estimatedTotal: 0 };
      }
      purchases[baseName].installments.push(t);
      purchases[baseName].totalPaid += t.amount;
      if (t.installmentInfo) {
        purchases[baseName].estimatedTotal = t.amount * t.installmentInfo.total;
      }
    });
  return Object.values(purchases);
};

export const getTotalExpenses = (transactions) => {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
};

export const getTotalReturns = (transactions) => {
  return Math.abs(getNegativeTransactions(transactions).reduce((sum, t) => sum + t.amount, 0));
};

export const getTotalFood = (transactions) => {
  return calculateFoodSubcategoryTotals(transactions).reduce((sum, cat) => sum + cat.value, 0);
};

// ==================== IA CATEGORY APPLICATION ====================

export const applyAISuggestedCategories = (transactions, suggestedCategories) => {
  if (!suggestedCategories || suggestedCategories.length === 0) {
    return transactions;
  }

  // Criar um mapa de keywords → categorias sugeridas
  const aiCategoryMap = [];
  suggestedCategories.forEach(suggestion => {
    aiCategoryMap.push({
      main: suggestion.mainCategory,
      sub: suggestion.subCategories?.[0] || suggestion.mainCategory,
      keywords: suggestion.examples || []
    });
  });

  // Re-categorizar transações que estão em "Outros"
  return transactions.map(transaction => {
    if (transaction.mainCategory === 'Outros') {
      const titleLower = transaction.title.toLowerCase();
      
      // Procurar nos exemplos da IA
      for (const aiCategory of aiCategoryMap) {
        for (const keyword of aiCategory.keywords) {
          if (titleLower.includes(keyword.toLowerCase())) {
            return {
              ...transaction,
              mainCategory: aiCategory.main,
              subCategory: aiCategory.sub
            };
          }
        }
      }
    }
    return transaction;
  });
};
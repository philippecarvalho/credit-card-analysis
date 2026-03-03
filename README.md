# 💳 Credit Card Analysis

Uma aplicação React para analisar e gerenciar suas despesas de cartão de crédito com categorização automática via IA.

## 🎯 Features

- 📊 **Análise de Gastos** - Visualize seus gastos por categoria com gráficos interativos
- 🤖 **Categorização com IA** - Google Gemini analisa automaticamente transações não categorizadas
- 🎯 **Planejamento de Orçamento** - Calcule limite diário de gasto baseado em seu orçamento
- 📈 **Subcategorias Detalhadas** - Análise profunda especialmente para alimentação
- 📦 **Compras Parceladas** - Rastreie compras em parcelas

## 🚀 Deploy no DigitalOcean

### Pré-requisitos

- Conta GitHub com este repositório
- Conta DigitalOcean (tier gratuito)
- Google Generative AI API Key (gratuita em [ai.google.dev](https://ai.google.dev))

### Passos para Deploy

1. **Conectar repositório na DigitalOcean App Platform**
   - Acesse [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Clique em "Create App"
   - Selecione GitHub e autorize
   - Escolha este repositório

2. **Configurar variáveis de ambiente**
   - Na aba "Environment", adicione:
     ```
     VITE_GOOGLE_GENERATIVE_AI_KEY=sua_chave_aqui
     ```

3. **Deployar**
   - O app será buildado automaticamente (`npm run build`)
   - Arquivos estáticos da pasta `dist/` serão servidos
   - Deploy leva ~2-3 minutos

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Buildar para produção
npm run build

# Preview da build
npm run preview
```

## 📝 Como usar

1. **Exportar CSV do seu banco**
   - Formato esperado: `date,title,amount`
   - Exemplo:
     ```
     2024-03-01,IFOOD,50.00
     2024-03-02,Mercado X,120.50
     ```

2. **Carregar no app**
   - A IA analisará automaticamente
   - Categorias baseadas em palavras-chave
   - Dados já aparecem categorizados

3. **Analisar e planejar**
   - Veja breakdown por categoria
   - Ajuste orçamento na aba "Planejar Fatura"
   - Calcule limite diário de gasto

## 🔧 Configuração Local da IA

Se quiser testar localmente com IA:

```bash
# Criar arquivo .env
VITE_GOOGLE_GENERATIVE_AI_KEY=sua_chave_aqui

# Iniciar dev
npm run dev
```

## 📊 Stack

- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Gráficos
- **Google Generative AI** - Categorização com IA

## 📜 Licença

MIT

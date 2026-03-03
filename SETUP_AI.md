# 🤖 Configuração da IA para Sugestão de Categorias

## Como funciona

Agora o app analisa automaticamente seu CSV quando é carregado e usa o Gemini (IA do Google) para sugerir **novas categorias** que possam fazer mais sentido para suas transações.

## Passos para ativar

### 1️⃣ Crie uma conta no Google AI Studio (Gratuita!)

1. Acesse [ai.google.dev](https://ai.google.dev)
2. Clique em "Get an API key" ou "Create API key"
3. Escolha "Create a new API key in Google Cloud"
4. Você será redirecionado para Google Cloud Console

### 2️⃣ Gere uma API Key

1. No Google Cloud Console, vá até "Credentials"
2. Clique em "Create Credentials" → "API Key"
3. Uma chave será gerada
4. Copie a chave

### 3️⃣ Configure a variável de ambiente

1. Abra o arquivo `.env` na raiz do projeto
2. Cole sua chave:
   ```
   VITE_GOOGLE_GENERATIVE_AI_KEY=sua_chave_aqui
   ```
3. **Salve o arquivo**

### 4️⃣ Reinicie o servidor (se estiver rodando)

```bash
npm run dev
```

## O que acontece agora

✅ Quando você carrega um CSV:
1. O app categoriza as transações automaticamente
2. Identifica transações sem categoria (marcadas como "Outros")
3. Envia essas transações para o Gemini analisar
4. Mostra um modal com sugestões de **novas categorias**
5. Você pode revisar e decidir se quer usá-las

## Importante

⚠️ **Segurança**: 
- Seus dados são enviados para a API do Google apenas para análise
- As transações não são armazenadas
- Você pode usar a API diretamente no navegador

💡 **Custo**:
- Conta gratuita: **Ilimitada** até 60 requisições por minuto!
- Sem limite de requisições diárias
- Perfeito para uso pessoal e desenvolvimento
- Você pode monitorar o uso no [Google Cloud Console](https://console.cloud.google.com)

## Próximos passos (depois de usar as sugestões)

Se quiser usar as novas categorias sugeridas:

1. Abra `src/utils/transactions.js`
2. Na função `categorizeTransaction()`, adicione novas regras:
   ```javascript
   if (titleLower.includes('sua_keyword')) 
     return { main: 'Nova Categoria', sub: 'Subcategoria' };
   ```
3. Recarregue o app
4. As próximas importações usarão as novas categorias

---

**Dúvidas sobre a API do Google?** Consulte a [documentação oficial](https://ai.google.dev/docs)

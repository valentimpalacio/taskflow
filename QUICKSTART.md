# 🚀 Quick Start - TaskFlow com Suporte Multilíngue

## Início Rápido (5 minutos)

### 1. Instalação

```bash
git clone https://github.com/valentimpalacio/projeto-typescript.git
cd projeto-typescript
npm install
```

### 2. Configuração de Banco de Dados

```bash
npx prisma generate
npx prisma db push
```

### 3. Executar Aplicação

```bash
npm run dev
```

### 4. Acessar em Idiomas

- 🇧🇷 **Português**: [http://localhost:3000/pt](http://localhost:3000/pt)
- 🇺🇸 **English**: [http://localhost:3000/en](http://localhost:3000/en)
- 🇪🇸 **Español**: [http://localhost:3000/es](http://localhost:3000/es)

## Login Demo

```
Email: demo@taskflow.com
Senha: demo123456
```

Execute `npm run seed` para criar dados de demo (opcional).

## 🌐 Trocar de Idioma

Clique nos botões **PT | EN | ES** no cabeçalho superior direito da página.

## 📁 Arquivos Principais de i18n

```
src/i18n/
├── config.ts                 # Configuração
├── messages/
│   ├── pt.json              # Português
│   ├── en.json              # Inglês
│   └── es.json              # Espanhol
└── request.ts               # Request config
```

## 🔧 Adicionar Nova Tradução

### Passo 1: Editar JSON

Em `src/i18n/messages/pt.json`:
```json
{
  "meuNamespace": {
    "minha_chave": "Meu texto em português"
  }
}
```

### Passo 2: Usar no Componente

```tsx
const t = useTranslations('meuNamespace');
return <p>{t('minha_chave')}</p>;
```

## 📦 Build

```bash
npm run build      # Compilar para produção
npm run start      # Iniciar servidor de produção
npm run lint       # Verificar code style
npm test           # Rodar testes
```

## 💡 Dicas Importantes

✅ **Sempre use** `useTranslations` para textos visíveis  
✅ **Use namespaces** para organizar traduções por seção  
✅ **Adicione em todos** os 3 idiomas simultaneamente  
✅ **Teste a compilação** com `npm run build`  

## 🎯 Estrutura de URLs

```
/              → Redireciona para /pt (padrão)
/pt            → Dashboard em Português
/en            → Dashboard em Inglês
/es            → Dashboard em Espanhol
/en/auth/signin → Sign in em Inglês
/pt/profile    → Perfil em Português
/api/*         → Rotas de API (sem idioma)
```

## 🆘 Ajuda

- 📖 Veja [LANGUAGES.md](LANGUAGES.md) para documentação completa
- 🐛 Veja [README.md](README.md) para troubleshooting
- 💬 Abra uma issue no GitHub para dúvidas

---

**Pronto para começar?** 🎉 Execute `npm run dev` e explore!

# 🌍 Suporte Multilíngue - TaskFlow

## Visão Geral

O TaskFlow agora suporta **três idiomas**: Português, Inglês e Espanhol, com suporte total a internacionalização (i18n) usando a biblioteca `next-intl`.

## 🗣️ Idiomas Suportados

| Idioma | Código | URL | Status |
|--------|--------|-----|--------|
| Português | `pt` | `http://localhost:3000/pt` | ✅ Padrão |
| English | `en` | `http://localhost:3000/en` | ✅ Suportado |
| Español | `es` | `http://localhost:3000/es` | ✅ Suportado |

## 🚀 Como Usar

### Alternar Idiomas

1. **Via Seletor no Header**: Clique nos botões `PT`, `EN` ou `ES` no canto superior direito da página
2. **Via URL**: Navegue diretamente para o idioma desejado:
   - Português: `/pt`
   - Inglês: `/en`
   - Espanhol: `/es`

### Acesso Padrão

Ao acessar `http://localhost:3000` sem especificar um idioma, você será automaticamente redirecionado para o português (idioma padrão).

## 📁 Estrutura de Arquivos

### Organização do i18n

```
src/
├── i18n/
│   ├── config.ts              # Configuração de idiomas
│   ├── messages/              # Arquivos de tradução
│   │   ├── pt.json           # Português (16 KB)
│   │   ├── en.json           # Inglês
│   │   └── es.json           # Espanhol
│   └── request.ts            # Configuração de request
├── app/
│   ├── [locale]/             # Dynamic segment para idioma
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── auth/
│   │   └── profile/
│   └── api/                   # Rotas de API (sem i18n)
└── middleware.ts             # Middleware de roteamento de idioma
```

### Rotas Organizadas por Idioma

```
Português:  /pt           (Padrão)
Português:  /pt/auth/signin
Português:  /pt/profile

Inglês:     /en
Inglês:     /en/auth/signin
Inglês:     /en/profile

Espanhol:   /es
Espanhol:   /es/auth/signin
Espanhol:   /es/profile

APIs:       /api/*        (Sem prefixo de idioma)
```

## 💻 Desenvolvimento

### Usando Traduções em Componentes

Para usar as traduções em seus componentes, importe o hook `useTranslations` do `next-intl`:

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('dashboard');
  
  return (
    <div>
      <h1>{t('newProject')}</h1>
      <button>{t('create')}</button>
    </div>
  );
}
```

### Namespaces Disponíveis

Os textos são organizados em namespaces para melhor organização:

- **`header`**: Textos do cabeçalho (título, logout, etc.)
- **`auth`**: Autenticação (login, signup, validações)
- **`dashboard`**: Painel principal (projetos, tarefas)
- **`stats`**: Cartões de estatísticas
- **`common`**: Textos comuns (botões, mensagens)

### Adicionando Novas Traduções

1. **Adicione a chave em todos os arquivos de idioma** (`pt.json`, `en.json`, `es.json`):

```json
{
  "dashboard": {
    "newFeature": "Nova Funcionalidade",
    "description": "Descrição do recurso"
  }
}
```

2. **Use no componente**:

```tsx
const t = useTranslations('dashboard');
return <div>{t('newFeature')}</div>;
```

## 🔄 Fluxo de Requisição

```
GET /en/dashboard
    ↓
Middleware (next-intl)
    ↓
Detecta locale = 'en'
    ↓
Carrega src/i18n/messages/en.json
    ↓
Renderiza componente com traduções em inglês
```

## 📊 Estatísticas de Tradução

| Namespace | Palavras-chave | Status |
|-----------|----------------|--------|
| header | 5 | ✅ Completo |
| auth | 11 | ✅ Completo |
| dashboard | 21 | ✅ Completo |
| stats | 4 | ✅ Completo |
| common | 10 | ✅ Completo |
| **Total** | **51** | **✅ Completo** |

## 🛠️ Componentes Atualizados

Os seguintes componentes foram atualizados para usar `next-intl`:

- ✅ `Header.tsx` - Cabeçalho com seletor de idioma
- ✅ `Dashboard.tsx` - Painel principal
- ✅ `ProjectForm.tsx` - Formulário de projetos
- ✅ `TaskForm.tsx` - Formulário de tarefas
- ✅ `StatsCards.tsx` - Cartões de estatísticas
- ✅ `LanguageSwitcher.tsx` - Novo: Seletor de idiomas

## 📦 Dependências

```json
{
  "next-intl": "^3.x.x"
}
```

## 🎯 Próximas Etapas (Sugerido)

- [ ] Adicionar mais idiomas (francês, alemão, japonês)
- [ ] Traduzir mensagens de erro do Prisma
- [ ] Implementar mudança de idioma com persistência em banco de dados
- [ ] Adicionar seletor de idioma nas páginas de autenticação
- [ ] Traduzir emails e notificações

## 🐛 Troubleshooting

### Problema: Idioma não muda ao clicar no seletor

**Solução**: Certifique-se de que:
1. Você está clicando nos botões `PT`, `EN` ou `ES` no header
2. O middleware está funcionando corretamente
3. Limpe o cache do navegador (Ctrl+Shift+Del)

### Problema: Tradução em branco

**Solução**: 
1. Verifique se a chave existe em `src/i18n/messages/{locale}.json`
2. Verifique a ortografia exata da chave
3. Certifique-se de que está usando o namespace correto

### Problema: Compilação falha

**Solução**:
1. Rode `npm run build` para testar compilação
2. Verifique se há erros de TypeScript
3. Limpe `.next` com `rm -rf .next`

## 📚 Referências

- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Internationalization Best Practices](https://www.w3.org/International/questions/qa-what-is-i18n)

## 📝 Notas

- O idioma padrão é **Português (PT)**
- As traduções são carregadas no servidor (SSR)
- O seletor de idioma usa `Link` do Next.js para navegação sem reload completo
- As URLs mantêm a estrutura de histórico do navegador

---

**Última Atualização**: Abril 2026  
**Versão**: 1.0.0 (com suporte multilíngue)

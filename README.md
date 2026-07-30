# Template Frontend - Arquitetura Corporativa 🚀

Este projeto é um boilerplate corporativo de alta performance construído com **React**, **TypeScript** e **Vite**. O objetivo é servir como uma fundação robusta, escalável e visualmente impressionante para futuros projetos.

## 🛠 Tecnologias Escolhidas

- **Core**: React 18, TypeScript, Vite
- **Estilização**: Tailwind CSS v4 (@tailwindcss/vite)
- **Roteamento**: React Router v6
- **Gerenciamento de Estado/Assincronicidade**: React Query (@tanstack/react-query), Axios
- **Formulários**: React Hook Form, Zod
- **Gráficos**: Recharts
- **UI Components**: Lucide React (ícones), React Select
- **Qualidade de Código**: Husky (Pre-commit hooks)

## 📁 Arquitetura de Pastas

A estrutura modulariza as responsabilidades para facilitar manutenção e escalabilidade:

```
src/
 ├── components/    # Componentes genéricos e reutilizáveis (UI)
 ├── contexts/      # Contextos da aplicação (Ex: Autenticação, Tema)
 ├── layouts/       # Estruturas de página (Ex: Sidebar + Header)
 ├── pages/         # Telas da aplicação (Ex: Login, Dashboard)
 ├── routes/        # Configuração de roteamento público e privado
 └── services/      # Integração com APIs e serviços externos
```

## 🚀 Como Iniciar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicialize o Husky (caso não tenha rodado no pós-instalação):
   ```bash
   npx husky init
   ```
3. Rode o projeto em ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🔄 Gerenciamento de Dados Assíncronos: React Query vs Tradicional

O **React Query** (agora TanStack Query) foi adotado como padrão arquitetural para lidar com o estado assíncrono (server state). 

### ❌ O Jeito Tradicional (useEffect + useState)

Historicamente, o fetch de dados no React envolvia muito boilerplate e falta de resiliência:

```tsx
function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        setLoading(true);
        const response = await api.get('/summary');
        if (isMounted) setData(response.data);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    fetchData();
    
    return () => { isMounted = false; }; // Cleanup para evitar memory leaks
  }, []); // Sem suporte nativo a cache ou refetch automático

  if (loading) return <Loading />;
  if (error) return <Error />;
  return <Chart data={data} />;
}
```

### ✅ O Padrão Corporativo: React Query (useQuery)

Com o React Query, abstraímos toda a complexidade, ganhamos **cache automático**, **retry em falhas**, e **deduplicação** de requisições:

```tsx
function Dashboard() {
  // O React Query cuida de tudo: loading, erro, cache e retry
  const { data, isLoading, isError } = useQuery({
    queryKey: ['summary'], // Chave de cache
    queryFn: () => api.get('/summary').then(res => res.data)
  });

  if (isLoading) return <Loading />;
  if (isError) return <Error />;
  return <Chart data={data} />;
}
```

**Principais Benefícios:**
1. **Cache Impecável**: Múltiplos componentes chamando `useQuery(['summary'])` resultarão em **apenas uma requisição** para a API.
2. **Refetching Automático**: Atualiza os dados quando o usuário volta para a aba do navegador.
3. **Resiliência**: Em caso de falha de rede, ele faz retentativas automaticamente antes de disparar o erro.
4. **Mutations**: Com o `useMutation`, você possui integração facilitada para POST/PUT/DELETE, podendo invalidar o cache (`invalidateQueries`) em seguida, forçando uma nova renderização com os dados frescos sem precisar gerenciar estado local manualmente.

---


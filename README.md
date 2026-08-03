<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# 🥚 Augovos App

## 🔗 Links Úteis
💡 [Aceder a **App** em Produção](https://venda-de-ovos-63448.web.app)

Aplicação web desenvolvida para automatizar e gerir o fluxo de reservas e vendas de ovos, permitindo o controlo financeiro anual de forma prática e acessível (instalável no telemóvel como PWA).


## 🚀 Funcionalidades

* **Autenticação de Utilizadores:** Sistema de login seguro gerido via Firebase Auth.
* **Gestão de Reservas:** Registo de pedidos por cliente, quantidade (caixas de 12, 15, 30 unidades) e estado do pagamento.
* **Calculadora Integradada:** Simulador de preços dinâmico para apoio ao vendedor.
* **Base de Dados em Tempo Real:** Armazenamento seguro no Cloud Firestore.
* **Instalação PWA:** Suporte para instalação direta no ecrã inicial do smartphone através de um banner nativo.
* **Sincronização:** Exportação/espelhamento dos dados para controlo analítico mensal e anual.

## 🛠️ Tecnologias Utilizadas

* **Front-end:** React.js (com Vite)
* **Estilização:** Tailwind CSS (Interface moderna, fluida e totalmente responsiva)
* **Back-end & Database:** Firebase (Firestore, Authentication) e Blaze (Sincronização com Folha de Cálculo)

## 🧠 Notas de Desenvolvimento

Este projeto foi idealizado por mim para resolver um problema real de logística familiar. A lógica de negócio, a arquitetura da base de dados (NoSQL), contando com o apoio de ferramentas de Inteligência Artificial (Gemini) para a otimização de blocos de código, resolução de erros de sintaxe em React e aceleração do processo de aprendizagem das tecnologias utilizadas.
## 💻 Como Executar e Atualizar o Projeto

### 🔧 Desenvolvimento Local (Para Avaliação)
Se desejar clonar este repositório e executar o projeto localmente no seu computador, siga estes passos na consola:

1. Instalar as dependências do projeto (recria a pasta node_modules):
```bash
npm install
   ```
2. Iniciar o servidor de testes local:
  ```bash
  npm run dev
```

🚀 Publicação / Deployment (Uso Pessoal)
Comandos utilizados por mim para compilar:

1. Gerar a versão de produção otimizada:
 ```bash
 npm run build
 ```
 2. Publicar no Firebase:
  ```bash
  firebase deploy
  ```
>>>>>>> fd2359d8faaab339c95143b6fdb441a45fc15ce6

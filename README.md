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

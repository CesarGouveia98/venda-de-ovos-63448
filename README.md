# 🥚 Augovos App — Production Management & Reservation PWA

[![Live Demo](https://img.shields.io/badge/Live_Demo-Augovos-orange?style=for-the-badge&logo=firebase)](https://venda-de-ovos-63448.web.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React_%7C_Vite_%7C_Tailwind_%7C_Firebase-blue?style=for-the-badge)](#-tecnologias-e-competências-demonstradas--technical-stack)

---

## 🇵🇹 Português

### 📄 Sobre o Projeto
O **Augovos** é uma solução Web & Progressive Web App (PWA) completa, desenvolvida para resolver um problema real de logística familiar na distribuição e venda de ovos. A plataforma automatiza o ciclo completo de pedidos, gestão de stock em tempo real, reservas de clientes e acompanhamento financeiro acumulado.

---

### 🎓 Competências Técnicas

* **Desenvolvimento Web Moderno (Front-End):**
  * Criação de SPA (Single Page Application) reativa com **React.js 19** e **Vite**.
  * Construção de interface responsiva e intuitiva (*Mobile-First*) com **Tailwind CSS v4**.
  * Gestão de estado complexo, modais e cálculos dinâmicos de preço/embalagem em tempo real.

* **Bases de Dados & Cloud Backend (NoSQL):**
  * Modelação de dados NoSQL com **Google Cloud Firestore**.
  * Implementação de listeners em tempo real (`onSnapshot`) para sincronização instantânea de stock e reservas entre cliente e vendedor.

* **Segurança & Autenticação:**
  * Gestão de controlo de acessos (RBAC - Role-Based Access Control) via **Firebase Authentication**.
  * Separação estrita de permissões e interfaces entre Cliente e Administrador/Vendedor.

* **Engenharia de Software & PWA:**
  * Configuração de **Service Workers** e Web App Manifest para funcionalidade instalável em dispositivos móveis.
  * Ciclo completo de desenvolvimento (*DevOps/Deployment*): compilação otimizada, linting (`ESLint`) e alojamento via **Firebase Hosting**.

---

### 🚀 Funcionalidades Principais

* 🔐 **Autenticação & Perfis:** Registo, login e recuperação de palavra-passe com permissões especiais para o perfil de vendedor.
* 📦 **Gestão Dinâmica de Stock:** Atualização de recolha diária e deduçao automática de ovos comprometidos/reservados.
* 📊 **Painel Financeiro & Entregas:** Vista semanal de entregas e indicadores acumulados (Semana, Mês e Ano em €).
* 🧮 **Simulador de Preços & Embalagens:** Algoritmo dinâmico para otimização de caixas (12, 15 e 30 unidades) e cálculo de preços.
* 📱 **Experiência PWA:** Instalação direta no smartphone através de banner nativo sem necessidade de app store.

---

### 🛠️ Como Executar Localmente

```bash
# 1. Clonar o repositório e instalar dependências
npm install

# 2. Executar servidor de desenvolvimento
npm run dev

# 3. Gerar build de produção
npm run build
```

---

## 🇬🇧 English
### 📄 Project Overview
Augovos is a full-stack Progressive Web App (PWA) designed to streamline local egg production, sales logistics, and inventory management. It automates customer reservations, real-time stock deduction, and financial reporting through an intuitive, mobile-first interface.

### 💡 Core Technical Highlights

* **Modern Front-End Architecture:** 
  * Built using **React 19**, **Vite**, and **Tailwind CSS**, featuring reactive UI state management, real-time price calculators, and seamless modal workflows.
* **NoSQL Database & Real-Time Sync:** 
  * Powered by **Firebase Firestore**, leveraging real-time listeners (`onSnapshot`) to reflect live inventory updates across buyer and seller views.
* **Authentication & RBAC:** 
  * Integrated **Firebase Auth** with role-based access controls to separate customer ordering capabilities from seller administrative features.
* **Progressive Web App (PWA):** 
  * Service worker integration and Web Manifest setup enabling native-like mobile installation and offline caching support.
* **Software Engineering & DevOps:** 
  * Full development lifecycle featuring optimized production build pipelines via **Vite**, code linting with **ESLint**, and deployment via **Firebase Hosting**.

---

### 🚀 Key Features

* 🔐 **Authentication & Profiles:** Registration, login, and password recovery with special permissions for the seller profile.
* 📦 **Dynamic Stock Management:** Daily collection updates and automatic deduction of committed/reserved eggs.
* 📊 **Financial & Deliveries Dashboard:** Weekly delivery view and accumulated metrics (Week, Month, and Year in €).
* 🧮 **Price & Packaging Simulator:** Dynamic algorithm for box optimization (12, 15, and 30 units) and price calculation.
* 📱 **PWA Experience:** Direct installation on smartphones via native banner without requiring an app store.

----

### 🛠️ How to Run Locally

```bash
# 1. Clone repository and install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Generate production build
npm run build
```
# Memento Mobile

> Um ecossistema minimalista e inteligente no seu bolso para rastreamento de hábitos, gestão de tarefas e anotações diárias. Projetado para quem busca consistência sem o ruído visual de aplicativos complexos e com foco total em privacidade.

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Stack](https://img.shields.io/badge/Stack-React%20Native%20%7C%20Expo%20%7C%20SQLite-black)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline-success)

## ✨ A Filosofia

- **100% Offline e Privado:** Seus dados nunca saem do seu celular. Não há servidores, nuvens ou rastreadores ocultos.
- **Hábitos Justos:** O sistema não te pune por imprevistos. A consistência é medida de forma realística.
- **Micro e Macro:** Foque no que importa hoje (Micro) e visualize sua consistência histórica com o mapa de calor anual (Macro).
- **Sem Poluição:** Banco de dados local otimizado que salva apenas o essencial, mantendo o aplicativo leve e rápido.

## 🚀 Principais Funcionalidades

### 🎯 Hábitos (Habit Tracker)
- **Flexibilidade de Metas:** Registre hábitos qualitativos (ex: "Ler") ou quantitativos (ex: "2.5 Litros").
- **Organização por Turnos:** Separe seus hábitos por Manhã, Tarde ou Noite para manter a rotina limpa.
- **Visão Macro (Dashboard):** Mapa de calor interativo exibindo seu progresso ao longo do tempo.

### ✅ Tarefas Diárias (Task Manager)
- Interface direta ao ponto para gerenciar o seu dia.
- Limpeza inteligente de tarefas concluídas com apenas um clique.

### 📝 Notas Diárias (Journal)
- Diário integrado para registrar pensamentos e como foi o seu dia.
- Salvamento automático otimizado.

### ⚙️ Controle Total
- **Backup e Restauração:** Exporte todos os seus dados para um arquivo json.
- **Multilíngue:** Suporte nativo para Português e Inglês (i18n).
- **Dark Mode Nativo:** Interface desenhada para conforto visual noturno.

## 🛠️ Tecnologias

Todo o ecossistema foi construído com ferramentas modernas para garantir fluidez e confiabilidade:

- **React Native & Expo:** Framework robusto para desenvolvimento mobile cross-platform.
- **Zustand:** Gerenciamento de estado global leve e otimista.
- **Expo SQLite:** Banco de dados local ultrarrápido rodando direto no dispositivo.
- **React i18next:** Motor de internacionalização (Traduções dinâmicas).
- **Lucide Icons:** Iconografia limpa e consistente.

## 📦 Como Rodar Localmente

Ao contrário da versão para PC, o Memento Mobile não exige um backend rodando em paralelo. Tudo o que você precisa é do Node.js instalado e do aplicativo **Expo Go** no seu celular físico.

**1. Clone o repositório e acesse a pasta**
```bash
git clone https://github.com/seu-usuario/memento-mobile.git
cd memento-mobile
```

**2. Instale as dependências**
```bash
npm install
```

**3. Inicie o servidor do Expo**
```bash
npx expo start
```

**4. Teste no seu celular**
- Baixe o aplicativo **Expo Go** (disponível na App Store ou Google Play).
- Abra a câmera do seu celular e escaneie o **QR Code** que apareceu no seu terminal.
- O aplicativo será compilado e abrirá instantaneamente na sua tela!
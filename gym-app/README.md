# GymTrainer AI

App mobile para geração e acompanhamento de treinos de academia, com inteligência artificial integrada.

## Funcionalidades

- **Geração de Treinos via IA**: Selecione o foco do dia (Peito+Tríceps, Costas+Bíceps, Push/Pull/Legs, etc.) e a IA gera um treino completo com exercícios, séries, repetições e tempos de descanso personalizados.
- **Timer de Descanso**: Cronômetro entre séries com vibração ao finalizar, botões para ajustar (+15s/-15s) e opção de pular.
- **Controle de Séries**: Registre reps executadas e carga (kg) para cada série de cada exercício.
- **Armazenamento Local**: Todos os dados ficam salvos localmente via SQLite — treinos, exercícios, séries e cargas.
- **Avaliação de Performance**: Dashboard com volume total, distribuição por grupo muscular, gráfico de evolução e histórico detalhado.

## Tech Stack

- **React Native** com **Expo** (SDK 56)
- **TypeScript**
- **expo-sqlite** para persistência local
- **React Navigation** v7 (Stack + Bottom Tabs)
- **Expo Vector Icons** (Ionicons)

## Executando

```bash
cd gym-app
npm install
npx expo start
```

Depois escaneie o QR code com o Expo Go (celular) ou pressione `a` para abrir no emulador Android.

## Estrutura do Projeto

```
src/
├── ai/               # Motor de geração de treinos
├── components/       # Componentes reutilizáveis (RestTimer, SetRow, ExerciseCard)
├── database/         # SQLite setup e repositório de dados
├── navigation/       # Configuração de navegação (Stack + Tabs)
├── screens/          # Telas do app
│   ├── HomeScreen          # Lista de treinos + botão para gerar
│   ├── GenerateWorkoutScreen   # Seleção de foco + geração via IA
│   ├── ActiveWorkoutScreen     # Execução do treino com timer
│   ├── WorkoutDetailScreen     # Detalhes de treino concluído
│   └── PerformanceScreen       # Dashboard de performance
├── theme/            # Cores, espaçamentos, tipografia
└── types/            # TypeScript types
```

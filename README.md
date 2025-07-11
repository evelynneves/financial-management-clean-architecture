# Financial Management Mobile 📱

Este é um aplicativo mobile de gerenciamento financeiro construído com [Expo](https://expo.dev), [React Native](https://reactnative.dev) e [Firebase](https://firebase.google.com/).

> ⚠️ Este projeto foi desenvolvido com foco exclusivo em dispositivos móveis (Android e iOS). Algumas funcionalidades, podem não funcionar corretamente na versão web.

## 🚀 Começando

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar o app
```bash
npm start
```

Ou use os atalhos:
- `npm run android`: abre no Android Studio ou dispositivo Android conectado
- `npm run ios`: abre no simulador iOS (macOS)

## 🔐 Configuração do Firebase
Para rodar o projeto, você precisa criar um arquivo `.env` na raiz do projeto com as credenciais do Firebase. O conteúdo do arquivo deve seguir o seguinte formato:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

> ℹ️ **Nota:** o arquivo `.env` com os dados de configuração foi enviado juntamente com os links úteis do projeto. Caso não tenha recebido, entre em contato com a autora.


## 📱 Testar no celular

### Opção 1: Usando o **Expo Go** (modo mais fácil)

1. Baixe o app [Expo Go](https://expo.dev/go) na Play Store ou App Store.
2. Execute o comando abaixo para gerar o QR Code:
```bash
npm start
```
3. Escaneie o QR Code com a câmera do seu celular.
   - Android: o app Expo Go abrirá diretamente
   - iOS: abra com Safari se não funcionar direto

### Opção 2: Usando um emulador Android
- Android: abra o Android Studio, inicie um emulador e rode:
  ```bash
  npm run android
  ```

## 👤 Usuário de Teste

> Para facilitar a validação, você pode usar o seguinte usuário de teste já cadastrado:

- **Email:** `aluno@demo.com`  
- **Senha:** `123456`

**Esse usuário já possui permissões para acessar e testar as funcionalidades do app, como adicionar, editar e visualizar transações financeiras.**

## 🛠 Scripts disponíveis
- `npm start`: Inicia o projeto com o menu interativo do Expo
- `npm run android`: Abre o app em um emulador Android
- `npm run ios`: Abre o app em um simulador iOS
- `npm run lint`: Roda o linter
- `npm run reset-project`: Reseta o projeto removendo o conteúdo da pasta `app` e copiando os exemplos da pasta `app-example`

## 🔍 Tecnologias utilizadas
- **React Native** 0.79.2
- **Expo Router** ~5.0.6
- **Firebase** (auth, firestore, storage)
- **TypeScript** ~5.8
- **react-native-chart-kit** para gráficos
- **expo-document-picker** para upload de comprovantes

## 📚 Aprenda mais
- [Documentação do Expo](https://docs.expo.dev/)
- [Tutorial Expo](https://docs.expo.dev/tutorial/introduction/)

## 👥 Comunidade
- [Expo no GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)

---

> Projeto desenvolvido com foco em controle de transações financeiras, investimentos, resgates e geração de extratos.

---

**© 2025 - Financial Management Mobile**

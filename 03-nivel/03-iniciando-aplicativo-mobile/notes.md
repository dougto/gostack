# Iniciando o aplicativo mobile

Para criar projeto com template typescript, rodar: `npx react-native init appgobarber --template typescript`.

## Como adicionar fontes personalizadas

Salvar os arquivos de fonte na pasta `./assets/fonts`, criar um arquivo `./react-native.config.js` com o seguinte conteúdo:

```js
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
};
```

Por fim, rodar o comando `yarn react-native link`.

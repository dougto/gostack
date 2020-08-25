# React Native

## Sobre

Arquitetura: JS -> Metro Bundler (gera o bundle) -> Bundle -> Bridge (ponte de comunicação entre JS e código nativo) -> Códigos nativos

Elementos não tem estilização própria.

## Como configurar

https://react-native.rocketseat.dev/

## Criando um novo app

Basta usar o comando `react-native init app`.

## Executando app

Em um terminal executar `yarn start`.

Em outro terminal executar `yarn run react-native run-ios/android` ou `yarn ios/android`. É possível usar a tag `--simulator` para selecionar um aparelho. Ex: `yarn ios/android --simulator="iPhone XS Max"`.

## Acessando endereço local

Utilizando dispositivos físicos, é necessário usar o IP do computador.

Utilizando IOS com emulador, basta acessar `http://localhost`.

Utilizando Android com emulador, é possível configurar o localhost com adb reverse usando o comando `adb reverse tcp:3333 tco:3333`. Também o emulador do Android Studio usa o IP `10.0.2.2`.

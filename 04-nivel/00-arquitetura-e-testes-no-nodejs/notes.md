# Arquitetura e testes no nodejs

## Estrutura de software

Domínio: área de conhecimento daquele módulo/arquivo

DDD: Domain Driven Design. É uma metodologia

## Testes

TDD: Test Driven Development. É uma metodologia onde os testes são escritos antes da aplicação.

## Injeção de dependencias

Passos:

1. instalar `tsyringe`.

2. Criar container para registrar singletons.

3. Injetar singletons nas classes necessárias.

4. Importar arquivo de registro no início da aplicação.

5. Onde for usar o service com dependências injetadas, instanciar usando `resolve`.

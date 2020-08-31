# Iniciando back end do app

## Estratégias de abstração de banco de dados

1. Usar drive do banco. Nessa abordagem escrevemos as queries diretamente.

2. Usar query builder. Abstração para não precisar escrever queries do zero.

3. ORM (object relational mapping). Abstração que mapeia banco de dados em objetos no javascript.

## Docker

É usado para criação de containers. Containers são instâncias de imagens. Existem todos tipos de imagens para utilidade pública.

Guia para instalar docker: https://www.notion.so/Instalando-Docker-6290d9994b0b4555a153576a1d97bee2

Comando para checar se uma porta será sendo usada: `lsof -i :5432`.

Comando para iniciar um container a partir de uma imagem (seleceionada pela flag -d): `docker run --name nome-do-container -e variavel-de-ambiente=valor -p PORT:PORT -d imagem`. No bootcamp usamos `docker run --name gostack_desafio06 -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres` para criar um container do banco postgres.

Comando para mostrar containers ativos: `docker ps`. Para mostrar todos containers: `docker ps -a`.

Para ver logs de um container: `docker logs container-id`.

Para iniciar um container inativo: `docker start container-id`.

Para desligar um container: `docker stop container-id`.

## Código fonte

O código fonte desse módulo está na pasta `00-primeiro-projeto-com-nodejs`.

## Comandos de migration

Criar uma migration com typeorm: `yarn typeorm migration:create -n nome-migration`.

Executar migrations: `yarn typeorm migration:run`.

Reverter migration: `yarn typeorm migration:revert`.

Ver migrations executadas: `yarn typeorm migration:show`.

PS: Apenas altere uma migration caso não tenha sido comitada ainda.

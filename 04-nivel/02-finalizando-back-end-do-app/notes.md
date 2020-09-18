# Finalizando back-end do app

## Utilizando MongoDB

Para iniciar um container:

`docker run --name go-stack-mongodb -p 27017:27017 -d -t mongo`

É necessário instalar o pacote `mongodb`.

## Configurando SES

Para enviar e-mails é necessário um domínio próprio e uma conta na AWS.

No console do SES, seguir passos:

1. Configurar domínio.
2. Esperar ficar verified.
3. Configurar Endereço de e-mail (tem que pagar e utilizar algum de vários serviços)

## Amazon S3

É um CDN (Content Delivery Network).

## Cache

Redis é uma boa opção de banco para cache.

Comando para iniciar um container redis:

`docker run --name go-stack-redis -p 6379:6379 -d -t redis:alpine`

## Ataques brute force

Uma boa ferramenta que pode proteger contra ataques brute force é o `rate-limiter-flexible`.

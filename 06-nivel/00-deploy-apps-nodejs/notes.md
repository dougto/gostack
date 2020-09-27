# Deploy app nodejs

## Deploy sem escalonamento horizontal

A digital ocean é uma boa opção para esse tipo de servidor. Na digital ocean cada máquina é chamada droplet.

## Nginx

Ferramenta usada para fazer proxy e load balancing. Primeiramente, é necessário abrir a porta da máquina com o comando `sudo ufw allow 80`. Na pasta `/etc/nginx/sites-available` será possível editar os proxys na máquina. Será necessário criar um novo arquivo nessa pasta e mudar os valores de location. Na internet é possível encontrar exemplos para cada provider. Na pasta `/etc/nginx/sites-enabled` será necessário criar um link simbólico. Para fazer isso, executar comando `ln -s /etc/nginx/sites-available/gobarber gobarber` na pasta `../sites-enabled`. Depois, remover default.

Com o comando `nginx -t` podemos checar se a conexão está ok. Estando tudo certo, só executar `service nginx reload` e `service nginx restart`.

## Estabilidade em containers e servers

Caso o servidor reinicie, podemos usar o comando `docker update --restart=unless-stopped container-id` para que os containers sempre reiniciem automaticamente. Para servidores node, podemos usar o PM2. Após instalar esse programa, basta executar `pm2 start ../file --name process-name` com o arquivo de entrada do servidor. Depois, rodar `pm2 startup systemd` e executar o comando que ele informar. Assim, o server vai continuar rodando mesmo depois de falhas na máquina.

## Domínio e SSL

Para configurar SSL, é necessário configurar o domínio para apontar para o IP da máquina do server. Após o domínio estar configurado com o IP, é preciso colocar ele no campo `server_name` no arquivo `../sites-available` do Nginx. Após a mudança, é necessário executar `service nginx restart`.

Após o domínio estar configurado, podemos configurar o SSL usando o certbot. Para usar o certbot, basta entrar no site deles e rodar os comandos instruídos. Não esquecer de abrir a porta HTTPS: `sudo ufw allow 443`.

## CI/CD

Com github actions, primeiramente é necessário configurar alguns secrets, como uma SSH para o host, o endereço de destino, etc. No repo, acessar o menu de actions e setar workflow do zero.

# Delivery api.

Está e uma simples api de delivery, a construção foi feira em JavaScrypt, tendo como dependência o  express, body-parser,jest e supertest.
A aplicação está dockerizada

## Arquitetura e como foi feito.

Para construção da api foi desenvolvido inicialmente uma aplicação em node js de forma simplificada e com a utilização do mínimo de dependências externas possíveis para optimização do projeto. Foi escolhido também utilizar o armazenamento dos dados em memoria e posteriormente salvar no arquivo json. Para os testes automatizados foi utilizado o supertest e por fim a aplicação foi dockerizada com a criação de um arquivo [dockerfile](dockerfile) e [docker-compose](docker-compose.yml).
A arquitetura foi desenvolvida de forma simplificada de forma a facilitar o entendimento é avaliação da solução apresentada.

## Funções possiveis.

A api possui 6 endpoints implementados.

| numero |Tipo de requisição esperada| rota | exemplo de formato | descrição|
| --- | --- | --- | --- | -- |
| 1 | POST | \create | { "cliente": "Luis Marques", "produto": "Pizza de Calabresa", "valor": 10.0 } | A rota efetua a criação de um novo pedido. |
| 2 | PUT | \update | { "id":502,"cliente": "Luis Marquinhos", "produto": "Pizza de Frango /c catupiry", "valor": 30.0 } ou somente dado a ser alterado | A rota efetua a atualização de informações de um  pedido. |
| 3 | PUT |\update_state | { "id":502 } ou{ "id":502,"estado","CANCELED" } |faz o avanço do estado do pedido, de recived para confirmed e etc. Por essa rota e possível tbm fazer o cancelamento do pedido,não e possivel pular o estado de um pedido(se ele está como recived obrigatoriamente ele vai passar para confirmed e assim suscetivamente,o envio do valor estado diferente de CANCELED, será ignorado ) |
| 4 | GET |\search | { "id":502 } ou { "id":502,"cliente","Luis Marques" } |Faz a consulta de uma unico pedido(seja pelo numero do id ou retornando um pedido do cliente informado). |
 |5 | GET | \searchall |{ "cliente","Luis Marques" } |Retorna todos os pedidos registrados no nome do cliente.|
|6 | DELETE |\delete |{ "id","502" } |Deleta o registro do pedido do sistema. |


## Como rodar a aplicação

Para rodar a aplicação utilizando o docker, faça a verificação se o docker e o docker-compose estão corretamente instalados, utilizando o comando abaixo no terminal: 

    docker --version && docker-compose --version

a saida esperada e algo como :

    Docker version 20.10.17, build 100c701
    Docker Compose version v2.6.1

após essa confirmação utilize o comando:

    sudo docker-compose up --build

aguarde até a confirmação de que o servidor está rodando pelo console, é a aplicação estará rodando no endereço http://localhost:8000.

## Utilizando NPM.

E possível também realizar a execução da aplicação pelo npm, caso não possua o docker instalado. verifique a instalação do npm utilizando o comando:

    npm --version

após a confirmação da instalação, é necessário realizar a instalação das dependências do projeto, para isso execute o comando:

    npm install

feita a devida instalação pode-se executar os testes unitários utilizando também o npm. através do comando:

    npm test

A para iniciar a api utilize o comando:

    npm start

após a confirmação de inicialização da api utilizando o console, a api estará sendo executada no endereço http://localhost:8000
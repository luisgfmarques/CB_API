const supertest = require('supertest');
const app = require('./app');
const request = supertest(app);
var fs = require('fs');

const oldjson = JSON.parse(fs.readFileSync('./src/pedidos.json', 'utf8'));

const ordercreate = {
    "cliente": "Luis Marques",
    "produto": "Pizza de Calabresa",
    "valor": 10.0,
}
const orderupdate = {
    "id": oldjson.nextId,
    "cliente": "Luis Marques",
    "produto": "Pizza de Calabresa",
    "valor": 30.0,
    "entregue": false,
    "estado": "RECIVED",
}

describe('Unit test in delivery-api', () => {
    
    afterAll(() => {
        fs.writeFileSync('./src/pedidos.json', JSON.stringify(oldjson), 'utf8');
    });

    it('Deve criar uma nova ordem', async () => {
        const response = await request.post('/create').send(ordercreate);
        expect(response.status).toBe(201);
        expect(response.body.id).toBe(oldjson.nextId);
        expect(response.body.cliente).toBe(ordercreate.cliente);
        expect(response.body.produto).toBe(ordercreate.produto);
        expect(response.body.valor).toBe(ordercreate.valor);
    });
    it('Deve Procurar o registo do pedido pelo ID', async () => {
        const responde = await request.get('/search').send({ id: oldjson.nextId });
        expect(responde.status).toBe(200);
        expect(responde.body.cliente).toBe(ordercreate.cliente);
        expect(responde.body.produto).toBe(ordercreate.produto);
    });
    it('Deve Procurar algum pedido pelo nome do cliente', async () => {
        const responde = await request.get('/search').send({ cliente: ordercreate.cliente });
        expect(responde.status).toBe(200);
        expect(responde.body.cliente).toBe(ordercreate.cliente);
        expect(responde.body.produto).toBe(ordercreate.produto);
    });
    it('Deve atualizar o registo do pedido pelo ID', async () => {
        const response = await request.put('/update').send(orderupdate);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(orderupdate.id);
        expect(response.body.cliente).toBe(orderupdate.cliente);
        expect(response.body.produto).toBe(orderupdate.produto);
        expect(response.body.valor).toBe(orderupdate.valor);
        expect(response.body.estado).toBe(orderupdate.estado);
    });
    it('Deve remover o registo do pedido pelo ID', async () => {
        const response = await request.delete('/delete').send({ id: orderupdate.id });
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(orderupdate.id);
        expect(response.body.cliente).toBe(orderupdate.cliente);
    });
    it('erro na busca de um pedido inexistente', async () => {
        const response = await request.get('/search').send({ id: oldjson.nextId });
        expect(response.status).toBe(404);
    });
    it('Deve falhar em atualizar pedido com id negativo', async () => {
        const response = await request.put('/update').send({id:-2});
        expect(response.status).toBe(400);
    });
    it('Erro em atualizar estado de pedido com id negativo', async () => {
        const response = await request.put('/update_state').send([{ id: -2 }]);
        expect(response.status).toBe(400);
    });
    it('Erro em atualizar estado de pedido já entregue', async () => {
        const response = await request.put('/update_state').send([{ id: 2 }]);
        expect(response.status).toBe(400);
    });
    it('Erro em criar pedido com dados null', async () => {
        const response = await request.post('/create').send({ "fulado": "cliente" });
        expect(response.status).toBe(500);
    });
});

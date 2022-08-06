const States = ["RECIVED", "CONFIRMED", "DISPATCHED", "DELIVERED", "CANCELED"]
// ---------------- 0    ---------    1  ----------       2  --------       3  -------       4

var json = require('./pedidos.json');
var fs = require('fs');

module.exports = {
    create_order(req, res) {
        try {
            const { cliente, produto, valor, estado, timestamp } = req.body;
            var order = null
            if (cliente != null && produto != null && valor != null) {
                order = {
                    id: json.nextId,
                    cliente,
                    produto,
                    valor,
                    entregue: (estado == "DELIVERED") ? true : false,
                    estado: estado || "RECIVED",
                    timestamp: timestamp || new Date().toISOString(),
                }
                json.nextId++;
                json.pedidos.push(order);
                fs.writeFileSync('./src/pedidos.json', JSON.stringify(json));
            }
            return res.status(201).send(json.pedidos[order.id - 1]);
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    update(req, res) {
        try {
            const { id, cliente, produto, valor, timestamp } = req.body;
            var oldorder = json.pedidos[id - 1];
            var order = null
            if (!oldorder) {
                return res.status(400).send("Pedido inexistente");
            }
            if (!([States[3], States[4]].includes(oldorder.estado))) {
                order = {
                    id : id,
                    cliente: cliente || oldorder.cliente,
                    produto : produto || oldorder.produto,
                    valor : valor || oldorder.valor,
                    estado: oldorder.estado,
                    entregue: oldorder.entregue,
                    timestamp : timestamp || oldorder.timestamp,
                }
                json.pedidos[id - 1] = order;
                fs.writeFileSync('./src/pedidos.json', JSON.stringify(json));
                return res.status(200).send(json.pedidos[id - 1]);
            }
            else
                return res.status(400).send("Pedido já entregue ou cancelado");
        }
        catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    update_state(req, res) {
        try {
            const { id,estado } = req.body;
            var oldorder = json.pedidos[id - 1];
            if (!oldorder) {
                return res.status(400).send("Pedido inexistente");
            }
            if (estado == "CANCELED") {
                oldorder.estado = "CANCELED"
                return res.status(200).send(json.pedidos[id - 1]);
            }
            if (![States[3], States[4]].includes(oldorder.estado)) {
                const order = {
                    id: id ,
                    cliente: oldorder.cliente,
                    produto:  oldorder.produto,
                    valor: oldorder.valor,
                    estado: States[States.indexOf(oldorder.estado) + 1],
                    entregue: (States[oldorder.estado + 1] == "DELIVERED") ? true : false,
                    timestamp: oldorder.timestamp,
                }
                json.pedidos[id - 1] = order;
                fs.writeFileSync('./src/pedidos.json', JSON.stringify(json));
                return res.status(200).send(json.pedidos[id - 1]);
            }
            else
                return res.status(400).send("Pedido já entregue ou cancelado");
        }
        catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    simple_search(req, res) {
        try {
            const { id, cliente } = req.body;
            var returned = (json.pedidos.find(pedidos => pedidos != null ? [pedidos.id, pedidos.cliente].includes(id) || [pedidos.id, pedidos.cliente].includes(cliente) : false));
            if(returned != null)
                return res.status(200).send(returned);
            return res.status(404).send("Id ou cliente não encontrado");
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    serch_all_client_order(req, res) {
        try {
            const { cliente } = req.body;
            var orders = [];
            json.pedidos.forEach(pedidos => {
                if (pedidos != null) {
                    if (pedidos.cliente == cliente) {
                        orders.push(pedidos);
                    }
                }
            });
            if ((orders.length) > 0)
                return res.status(200).send(orders)
            return res.status(404).send("Cliente não encontrado");
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }

    },
    exclude(req, res) {
        try {
            const { id } = req.body;
            removed = json.pedidos[id - 1];
            if (removed) {
                json.pedidos[id - 1] = null;
                fs.writeFileSync('./src/pedidos.json', JSON.stringify(json));
                return res.status(200).send(removed);
            }
            else {
                return res.status(400).send("Pedido inexistente");
            }
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    }
}

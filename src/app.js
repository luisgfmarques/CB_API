const express = require("express");
const app = express();
const model = require('./modules');


app.use(express.json());
app.post("/create", model.create_order);
app.put("/update", model.update);
app.put('/update_state', model.update_state);
app.get("/search", model.simple_search);
app.get("/searchall", model.serch_all_client_order);
app.delete("/delete", model.exclude);


module.exports = app;
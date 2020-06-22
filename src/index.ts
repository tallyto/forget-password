import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import routes from "./routes";

const app = express();
createConnection()
  .then(() => console.log("Tudo certo"))
  .catch((error) => console.log("Erro ao conectar o banco de dados: " + error));
app.use(bodyParser.json());
app.use(routes);

app.listen(3333, () =>
  console.log("Servidor rodando em http://localhost:3333")
);

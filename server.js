import express from 'express';
import chalk from 'chalk';

import CorsMiddleware from './app/Http/Middlewares/CorsMiddleware.js';

import "./bootstrap/app.js"
import routes from "./routes/routes.js";
import initRelations from "./config/sequelize_relations.js";

/** Iniciar roteador */
const app = express();

/* Cors */
app.use(CorsMiddleware);

/** Inicializar rotas  */
app.use("/", routes);

initRelations();

const nodePort = process.env.NODE_PORT ?? 3000;

/** Escolher as portas baseado se foi inicializado com ou sem nginx */
const webPort = process.env.IS_CONTAINER ? 8080 : nodePort;

app.listen(nodePort, () => {
    console.log(chalk.green(`Servidor: http://localhost:${webPort}`));
    console.log(chalk.yellow(`Apis Swagger: http://localhost:${webPort}/docs`));
});
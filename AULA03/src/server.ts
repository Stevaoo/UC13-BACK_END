/*import express, { Application } from "express";
import { AppDataSource } from "./config/data-source";
import { error } from "console";

const app: Application = express();
const PORT: number = Number(process.env.PORT || 3000);

AppDataSource.initialize().then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
        console.log('Server running on http://localhost:${PORT}')
    })
}).catch((error) => {
    console.log('Datebase connrction has failed', error);  
})
*/
import express, { Application } from "express";
import { AppDataSource } from "./config/data-source";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";

const app: Application = express();
const PORT: number = Number(process.env.PORT || "3000");

app.use(express.json());

// Utilizando as rotas na aplicação
app.use("/api", userRoutes);
app.use("/api", postRoutes);

// Inicializando conexão com o banco de dados
AppDataSource.initialize().then(() => {
    console.log("Database connected successfully!");
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Error connecting to database.", error);
});
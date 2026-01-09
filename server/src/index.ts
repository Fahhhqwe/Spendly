import "dotenv/config";
import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 4080;

app.get('/', (req, res) => {
    res.send('Spendly is running');
})

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
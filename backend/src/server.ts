 import express  from "express";
 import {loadEnv}  from "./env";
 import cors from "cors";
import { askStructured } from "./ask-core";

 const app = express();
 loadEnv();
 app.use(express.json());
 app.use(cors({
    origin: ['http://localhost:5173'],
    methods:['POST','GET','OPTIONS','DELETE'],
    allowedHeaders : ['Content-Type', 'Authorization'],
    credentials: false
 }))

 app.post("/ask", async (req: any, res: any) => {
    console.log("POST /ask received");
    console.log("Request body:", req.body);

    try {
        const { query } = req.body ?? {};

        if (typeof query !== "string" || !query.trim()) {
            return res.status(400).json({
                error: "Field 'query' is required"
            });
        }

        console.log("Calling askStructured...");

        const out = await askStructured(query);

        console.log("LLM response:", out);

        return res.status(200).json(out);

    } catch (err: unknown) {
        console.error("ASK API ERROR:", err);

        return res.status(500).json({
            error: err instanceof Error ? err.message : String(err)
        });
    }
});

 const PORT = process.env.PORT;

 app.listen(PORT,()=>{
    console.log(`api is listening to port ${PORT}`);
 });
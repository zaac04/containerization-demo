import express, { Request, Response } from "express";

import { ShortenUrlBody } from "./types/types";
import { redis } from "./redis/conn";
import { nanoid } from "nanoid";
import cors from "cors";

const app = express();
app.use(express.json());

const corsOptions = {
    origin: "*", // Allow requests only from these origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies, if your application uses them
    optionsSuccessStatus: 204, 
    // headers: 'Content-Type, Authorization, Content-Length, X-Requested-With',
};

app.use(cors(corsOptions))


const port = process.env.PORT || 3000;


redis.on("connect", () => console.log("Connected to Redis"));
redis.on("error", (err) => console.error("Redis Error:", err));


app.post("/shorten", (req: Request<ShortenUrlBody>, res: Response) => {
    const body = req.body
    if (!body?.url) {
        res.json({ url: "URL is required" });
        return
    }
    const redirect_endpoint = process.env.REDIRECT_SVC || "http://localhost:3001"
    const shortId = nanoid(4);
    redis.set(shortId,body.url)
    const cleanUrl = new URL(shortId, redirect_endpoint).toString();
    res.json({ url: cleanUrl });
});


app.get("/links", async (req: Request<ShortenUrlBody>, res: Response) => {
    const redirect_endpoint = process.env.REDIRECT_SVC || "http://localhost:3001"
    const values:string[]=[] 
    try {
        const keys = await redis.keys("*");
        console.log("Keys in Redis:", keys);
        keys.map((key,index)=>{
            const cleanUrl = new URL(key, redirect_endpoint).toString();
            values.push(cleanUrl)
        })
    } catch (error) {
        res.json("Error fetching keys");
    } 
    res.json({ urls: values });
});



app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});



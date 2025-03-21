import express, { Request, Response } from "express";

import { ShortenUrlBody } from "./types/types";
import { redis } from "./redis/conn";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());


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


app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});



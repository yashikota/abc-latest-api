import { getLatestAbc } from "./scraper.ts";
import { serve } from "https://deno.land/std@0.154.0/http/server.ts";
const PORT = 8080;

const handler = async (req: Request) => {
    const latestAbc: any = await getLatestAbc();

    if (req.method === "GET") {
        return new Response(
            JSON.stringify({
                start: latestAbc[0],
                title: latestAbc[1],
                url: latestAbc[2],
                score: latestAbc[3],
            }),
            {
                headers: {
                    "content-type": "application/json",
                },
            },
        );
    } else {
        return new Response("Not Found", {
            status: 404,
        });
    }
};

await serve(handler, { port: PORT });

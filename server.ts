import { serve } from "https://deno.land/std@0.154.0/http/server.ts";
const PORT = 8080;

const handler = async (req: Request) => {
    const url =
        "https://kenkoooo.com/atcoder/resources/contests.json";
    const json = await fetch(url).then((res) => res.json());
    const latestAbc = json.filter((contest: any) => contest.id.startsWith("abc"))
        .sort((a: any, b: any) => b.start_epoch_second - a.start_epoch_second)[0]
    const start = new Date(latestAbc.start_epoch_second * 1000)

    if (req.method === "GET") {
        return new Response(
            JSON.stringify({
                title: latestAbc.title,
                start: start.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
                url: `https://atcoder.jp/contests/${latestAbc.id}`,
            }),
            {
                headers: {
                    "content-type": "application/json",
                },
            }
        );
    } else {
        return new Response("Not Found", {
            status: 404,
        });
    }
};

await serve(handler, { port: PORT });

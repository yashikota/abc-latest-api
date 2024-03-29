import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";

export const getLatestAbc = async () => {
    const url = "https://atcoder.jp";

    try {
        const res = await fetch(url + "/?lang=ja");
        const html = await res.text();
        const doc: any = new DOMParser().parseFromString(html, "text/html");

        // DOMを取得
        const times = doc.querySelectorAll(".m-list_contest_info .time");
        const titles = doc.querySelectorAll(".m-list_contest_ttl");
        const links = doc.querySelectorAll(".m-list_contest_ttl a");

        // timesの表記が「2022-12-17 21:00:00+0900」のようになっているので、JSTに変換
        for (let i = 0; i < times.length; i++) {
            const time = times[i].textContent.replace("開始", "");
            const date = new Date(time);
            const weekday = date.toLocaleString("ja-JP", {
                timeZone: "Asia/Tokyo",
                weekday: "short",
            });
            const jst = date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
            times[i].textContent = jst.split(" ")[0] + "(" + weekday + ") " + jst.split(" ")[1];
        }

        // 2次元配列として格納
        const contestsList = [];
        for (let i = 0; i < times.length; i++) {
            const time = times[i].textContent.replace(/[\n\t\r]/g, "");
            const title = titles[i].textContent.replace(/[\n\t\r]/g, "");
            const link = url + links[i].getAttribute("href");
            contestsList.push([time, title, link]);
        }

        // Beginnerが含まれるコンテストのみを抽出し、開催時刻が最新のものだけを取得
        const latestAbc = (contestsList.filter((contest) =>
            contest[1].includes("Beginner")
        ))[0];

        // 配点を取得
        const contestScore = [];
        const contestUrl = latestAbc[2];

        // DOMを取得
        const contestRes = await fetch(contestUrl);
        const contestHtml = await contestRes.text();
        const contestDoc: any = new DOMParser().parseFromString(contestHtml, "text/html");

        // 点数のテーブルを取得
        const table = contestDoc.querySelectorAll(".table.table-responsible.table-striped.table-bordered")[0];
        const trs = table.querySelectorAll("tbody tr");

        // 点数を格納
        for (let i = 0; i < trs.length; i++) {
            const task = trs[i].querySelectorAll("td")[0];
            const score = trs[i].querySelectorAll("td")[1];
            contestScore.push([task.textContent, score.textContent]);
        }
        latestAbc.push(contestScore);

        return latestAbc;
    } catch (error) {
        console.log(error);
    }
};

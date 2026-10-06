const http = require("http");

const port = process.env.PORT || 3000;
const greeting = process.env.GREETING || "(GREETING not set)";
const school = process.env.SCHOOL || "ABC";

const routes = {
  "/health": () => "ok",
  "/info": () => `GREETING=${greeting}\nPORT=${port}\n`,
  "/time": () => new Date().toISOString(),
  "/ping": () => "pong",
  "/employee": () => ({ id: 1, name: "Nguyen Van A", position: "Nhân viên mới", school }),
  "/echo": (req) => `${req.method} ${req.url}\n${JSON.stringify(req.headers, null, 2)}`,
  // log-level test routes: each emits one line at its level
  "/log/info": () => (console.log("INFO test log"), "logged info"),
  "/log/warn": () => (console.warn("WARN test log"), "logged warn"),
  "/log/error": () => (console.error("ERROR test log"), "logged error"),
  "/error": () => { throw new Error("test crash"); },
  "/slow": () => new Promise((r) => setTimeout(() => r("slow done"), 3000)),
};

http
  .createServer(async (req, res) => {
    const path = req.url.split("?")[0];
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    try {
      const h = routes[path];
      if (h) {
        const out = await h(req);
        if (typeof out === "object") res.setHeader("Content-Type", "application/json; charset=utf-8");
        return res.end(typeof out === "object" ? JSON.stringify(out) : out);
      }
      if (path !== "/") { res.statusCode = 404; return res.end("not found\n"); }
      res.end(`Hello from k3s-deploy-platform!\nGREETING=${greeting}\nPORT=${port}\n`);
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.end("error\n");
    }
  })
  .listen(port, () => console.log(`listening on :${port}`));

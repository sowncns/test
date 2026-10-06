const http = require("http");

const port = process.env.PORT || 3000;
const greeting = process.env.GREETING || "(GREETING not set)";

http
  .createServer((req, res) => {
    if (req.url === "/health") return res.end("ok");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(`Hello from k3s-deploy-platform!\nGREETING=${greeting}\nPORT=${port}\n`);
  })
  .listen(port, () => console.log(`listening on :${port}`));

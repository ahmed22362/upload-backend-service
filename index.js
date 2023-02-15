const http = require("http")
const fs = require("fs")

const httpServer = http.createServer()
httpServer.on("listening", () => console.log("Listening..."))
httpServer.on("request", (req, res) => {
  if (req.method === "OPTIONS") {
    // Preflight request
    sendJSONResponse(res, 200, {})
  }
  if (req.url === "/") {
    res.end(fs.readFileSync("index.html"))
    return
  }
  //idempotency
  if (req.url === "/upload") {
    const fileName = req.headers["file-name"]
    req.on("data", (chunk) => {
      fs.appendFileSync(fileName, chunk)
    })
    res.end("uploaded!")
  }
})
httpServer.listen(2000)

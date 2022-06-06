const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message" /><button type="submit">Submit</button></form></body>'
    );
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedData = Buffer.concat(body).toString();
      const message = parsedData.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = "302";
        res.setHeader("Loation", "/");
        return res.end();
      });
    });
  }
  res.setHeader("content-Type", "text/html");
  res.write("New Page For Home!");
  res.end();
};

module.exports = requestHandler;

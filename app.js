const path = require("path");
const express = require("express");
const expressStaticGzip = require("express-static-gzip");
const basicAuth = require("express-basic-auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  basicAuth({
    challenge: true,
    users: { training: "sasha-vika" },
  })
);

// Static file declaration
app.use("/", expressStaticGzip(path.join(__dirname, "build")));

// Start server
app.listen(port, () => {
  console.log(`RUNNING UI ON PORT: ${port}`);
});

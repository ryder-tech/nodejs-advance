const app = require("./src/app");
const port = 3005;

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});

process.on("SIGINT", () => {
  console.log("Hey administrator! the server is interrupt");
  process.exit(0);
});

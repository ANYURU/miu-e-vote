require("dotenv").config();
const express = require("express");
const path = require("path");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const port = process.env.PORT;

const config = {
  supabaseUrl,
  supabaseKey,
};

const app = express();

// app.use("/static", express.static(path.resolve("frontend", "static"), {extensions: ["js"]}));
app.use(
  "/static",
  express.static(path.resolve(__dirname, "frontend", "static"))
);

app.get("/*", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
        <script>
            const config = ${JSON.stringify(config)}
        </script>
        <title>MIU e-vote</title>
        <link rel="stylesheet" href="/static/css/index.css">
        <link rel="shortcut icon" href="/static/assets/images/miu-logo.png" />
    </head>
    <body class="bg-white">
        <div id="app"></div>
        <script type="module" src="/static/js/index.js"></script>
    </body>
    </html>
    `);
});

app.listen(port, "0.0.0.0", () => {
  console.log("Server is running...");
});

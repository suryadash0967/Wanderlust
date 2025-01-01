const express = require("express");
const app = express();
const port = 8080;

app.listen(port, () => console.log(`listening on port ${port}`));

app.get("/getcookies", (req, res) => {
    res.cookie("name", "value");
    res.cookie("greet", "hello");
    res.send("sent you some cookies");
})


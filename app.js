const express = require("express");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const port = 5050;
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");


app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.listen(port, () => console.log(`listening on port ${port}`));

app.get("/", (req, res) => {
    res.redirect("/listings");
})

const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    console.error("Error detected:", err);
    let { status = 500, message} = err; 
    res.status(status).render("error.ejs", {err});
})

// importing modules
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

// set up app
app.use(bodyParser.urlencoded({extended: true})); //bodyParser setup
app.use(express.static("public"));

//DB section
mongoose.connect('mongodb://localhost:27017/wikiDB');// connect to DB.

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("article", articleSchema);

//RESTful API http verbs:
//Articles:
app.get("/articles", (req, res) => {
    Article.find((err, docs) => {
        if (!err){
            res.send(docs);
        } else {
            res.send(err);
        }
    });
});

app.post("/articles", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const article = new Article({
        title: title,
        content: content
    });
    article.save((err) => {
        if (!err) {
            res.send("DB updated successfully");
        } else {
            res.send(err);
        }
    });
});

app.delete("/articles", (req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send("Deletion completed.");
        } else {
            res.send(err);
        }
    });
});

//specific articles:
app.get("/articles/:articleTitle", (req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, docs) => {
        if (docs) {
            res.send(docs);
        } else {
            res.send("Not found in data base");
        }
    });
});

app.patch("/articles/:articleTitle", (req, res) => {
    Article.updateOne({title: req.params.articleTitle},{title: req.body.title, content: req.body.content}, (err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            res.send(err);
        }
    });
});

app.put("/articles/:articleTitle", (req, res) => {
    Article.replaceOne({title: req.params.articleTitle},{title: req.body.title, content: req.body.content}, (err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            res.send(err);
        }
    });
});

app.delete("/articles/:articleTitle", (req, res) => {
    Article.findOneAndDelete({title: req.params.articleTitle}, (err, docs) => {
        if (!err) {
            res.send("Deleted the document.\n" + docs);
        } else {
            res.send(err);
        }
    });
});





app.listen("3000", () => {
    console.log("Server is live on port 3000.");
});



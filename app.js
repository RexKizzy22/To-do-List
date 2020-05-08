const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date");

const items = ["Buy Food", "Cook Food", "Eat food"];
const workItems = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", (req, res) => {

  const currentDay = date.getDate();
  res.render("list", {
    listTitle: currentDay,
    newListItems: items
  });

});

app.post("/", (req, res) => {
  let item = req.body.newItem;

  if (req.body.list === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else if (req.body.list === "About") {
    res.redirect("/about");
  } else {
    items.push(item);
    res.redirect("/");
  }

});

app.get("/work", (req, res) => {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});


app.get("/about", (req, res) => {
  res.render("about", {
    listTitle: "About",
    newListItems: workItems
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

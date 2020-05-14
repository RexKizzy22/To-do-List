const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const workItems = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-kizito:Test123@cluster0-mg6qp.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const customSchema = new mongoose.Schema({
  name: String,
  customList: [itemsSchema]
});

const CustomItem = mongoose.model("CustomItem", customSchema);

const itemOne = new Item({
  name: "Welcome to your Todolist!"
});


const itemTwo = new Item({
  name: "Hit the + button to add new items!"
});

const itemThree = new Item({
  name: "<-- To delete old items!"
});

const defaultItems = [itemOne, itemTwo, itemThree];

app.get("/", (req, res) => {

  Item.find({}, (err, items) => {
    if (items.length === 0) {
      Item.insertMany(defaultItems, err => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully created all documents");
        }
      });
      res.redirect("/");
    } else {
        res.render("list", {
          listTitle: "Today",
          newListItems: items
        });
    }
  });

});


app.get("/about", (req, res) => {
  res.render("about", {
    listTitle: "About",
    newListItems: workItems
  });
});

app.get("/:newList", (req, res) => {
  const newList = _.capitalize(req.params.newList);

  CustomItem.findOne({name: newList}, (err, foundItem) => {
    if (!err) {
      if (!foundItem)  {
        const customListItem = new CustomItem({
          name: newList,
          customList: defaultItems
        });
        customListItem.save();
        res.redirect("/" + newList);
      } else {
        res.render("list", {listTitle: foundItem.name, newListItems: foundItem.customList});
      }
    }
  });
});

app.post("/", (req, res) => {
  const newItem = req.body.newItem;
  const listItem = req.body.list;

  const itemName = new Item({
    name: newItem
  });

  if (listItem === "Today") {
    itemName.save();
    res.redirect("/");
  } else {
    CustomItem.findOne({name: listItem}, (err, foundList) => {
      foundList.customList.push(itemName);
      foundList.save();
      res.redirect("/" + listItem);
    });

  }

});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const customListName = req.body.customListName;

  if (customListName === "Today") {
    Item.findByIdAndRemove({_id: checkedItemId}, err => {
      if (!err) {
        console.log("Successfully deleted the checked item");
      }
    });
    res.redirect("/");
  } else {
    CustomItem.findOneAndUpdate({name: customListName}, {$pull: {customList: {_id: checkedItemId}}}, err => {
      if (!err) {
        console.log("Successfully deleted list item");
      }
      res.redirect("/" + customListName);
    });
  }


});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server has started running successfully");
});

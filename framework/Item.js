const ItemTypes = require("./ItemTypes");

function Item() {
  this.type=ItemTypes.MC;
  this.answers=new Array();
}

module.exports = Item;

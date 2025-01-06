const mongoose = require("mongoose");
let initData = require("./data");
const Listing = require("../model/listing")

main()
    .then(() => console.log("connected to db"));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

let initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((listing) => ({...listing, owner: "6776767289bb74d0672d760a"}));
    await Listing.insertMany(initData.data);
    console.log("database working");
}

initDB();
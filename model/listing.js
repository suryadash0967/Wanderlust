const mongoose = require("mongoose");
const Review = require("./review.js")

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fthearchitectsdiary.com%2Fmundra-villa-in-bilaspur-a-contemporary-villa-design-artha%2F&psig=AOvVaw0fjXqV8Li3TVkwB6C8CIJw&ust=1731853197940000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLilgYqG4YkDFQAAAAAdAAAAABAP",
        set: (v) => v === "" ? "https://imgs.search.brave.com/nt2VAQOrSEw2jMiYxAJlWm4uUSBfE4lw_91GIhtpJQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0LzIwLzczLzky/LzM2MF9GXzQyMDcz/OTI1OV9ZUWtVMHlN/TkdTOEJabXNzRkRr/RXBIcmdKQVUwa3hZ/OS5qcGc" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
})


listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing.reviews.length) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
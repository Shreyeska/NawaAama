const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
// schema
const blogSchema = new Schema({
    id: {
        type: Number,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author_id: {
        type: Types.ObjectId,
        required: true,
    },
    image: {
        type: String,
    },
});
// collection port
const collection = mongoose.model("blogs", blogSchema);
module.exports = collection;








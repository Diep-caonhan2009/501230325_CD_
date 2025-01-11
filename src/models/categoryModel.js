import mongoose from "mongoose";
const {Schema} = mongoose;

const categorySchema = new Schema({
    code: String,
    name: String,
    image: String,
},{
    versionKey: false,
    collection: "categories"
})

const CategoryModel = mongoose.model("category", categorySchema)
export default CategoryModel
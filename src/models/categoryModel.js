import mongoose from "mongoose";
const {Schema} = mongoose;

const categorySchema = new Schema({
    code:{
        type:String,
        required: [true, "bắt buộc phải nhập mã loại sản phẩm"],
        minlength:[5,"mã sản phẩm có dài từ 5 đến 10 kí tự"],
        maxlength:[10,"mã sản phẩm có dài bé hơn 10 kí tự"],
    },
    name: {
        
        required:[true, "bắt buộc phải nhập tên loại sản phẩm"],
        type: String,
    },
    image: {
        required:[true, "bắt buộc phải nhập link hình ảnh loại sản phẩm"],
        type: String,
        
    },
    searchString: {
        required:[true, "bắt buộc phải nhập chuỗi tìm kiếm loại sản phẩm"],
        type: String,
    },
    createAT: Date,
    updateAT: Date,
    deleteAt:Date
},{
    versionKey: false,
    collection: "categories"
})
const CategoryModel = mongoose.model("category", categorySchema)
export default CategoryModel
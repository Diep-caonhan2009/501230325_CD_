import CategoryModel from "../models/categoryModel.js";
import { ObjectId } from "mongodb";
import {removeVietnameseAccents} from "../comon/index.js"
const sortObjects =[
  {code: "name_ASC", name: "tên giảm dần"},
  {code: "name_DESC", name: "tên tăng dần"},
  {code: "code_ASC", name: "mã giảm dần"},
  {code: "code_DESC", name: "mã tăng dần"},
]
export async function listCategory(req, res) {
  const search = req.query?.search
  const pageSize = !!req.query?.pageSize ? parseInt(req.query.pageSize) : 5
  const page = !!req.query?.page ? parseInt(req.query.page) : 1
  const skip = (page-1) *pageSize
  let sort = req.query.sort ? req.query.sort : null;
  // console.log({pageSize, skip});
  
  let filters={
    deleteAT: null
  }
  if (search && search.length>0) {
    filters.searchString = {$regex: removeVietnameseAccents(search), $options: 'i'}
  }
  if(!sort){
    sort = {createAT: -1}
  }
  try {
    const countcategories = await CategoryModel.countDocuments(filters);
    const categories = await CategoryModel.find(filters).skip(skip).limit(pageSize).sort(sort)
    // res.json(categories)
    res.render("pages/categories/list", {
      title: "Categories",
      categories: categories,
      countPagination: Math.ceil(countcategories / pageSize),
      pageSize,
      page,
      sort,
      sortObjects
    });
  } catch (error) {
    console.log(error);
    res.send("hien tai khong co san pham nao!");
  }
}

export async function renderPageCreateCategory(req, res) {
  res.render("pages/categories/form", {
    title: "Create Categories",
    mode: "create",
    category:{},
    err:{},
  });
}

export async function createCategory(req, res) {
  const data = req.body;
  try {
    const category = await CategoryModel.findOne({ code: data.code, deleteAt: null });
    if (category) {
      throw ("code");
    }
    await CategoryModel.create({
      ...data,
      createAT: new Date(),
    });
    res.redirect("/categories");
  } catch (error) {
    console.log("error", error);
    let err = {};
    if (error === "code") {
      err.code = "mã sản phẩm này đã tồn tại";
    }
    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach(key => {
        err[key] = error.errors[key].message;
      });
    }
    res.render("pages/categories/form", {
      title: "Create Categories",
      mode: "create",
      category: { ...data },
      err
    });
  }
}

export async function renderPageUpdateCategory(req, res) {
  try {
    const {id} = req.params;
    const category = await CategoryModel.findOne({_id: new ObjectId(id), deleteAT: null});
    if(category){
        res.render("pages/categories/form", {
            title: "Create Categories",
            mode: "Update",
            category: category,
            err:{},
          });
    }else{
        res.send("Hiện không có sản phẩm nào phù hợp");
    }
  } catch (error) {
    res.send("trang web này không tồn tại");
  }

}

export async function UpdateCategory(req, res) {
  const {  ...data } = req.body;
  const {id} = req.params;
  try {
    const category = await CategoryModel.findOne({code:data.code, deleteAT: null});
    if (category) {
      throw( "code");
    }
    await CategoryModel.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        ...data,
        updateAT: new Date(),
      }
    );
    res.redirect("/categories");
  } catch (error) {
    console.log("error",error);
    let err = {};
    if (error === "code") {
      err.code = "mã sản phẩm này đã tồn tại";
    }
    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach(key => {
        err[key] = error.errors[key].message;
      });
    }
    res.render("pages/categories/form", {
      title: "update Categories",
      mode: "update",
      category: { ...data, _id: id },
      err
    });
  }
}

export async function renderPageDeleteCategory(req, res) {
  try {
    const {id} = req.params;
    const category = await CategoryModel.findOne({_id: new ObjectId(id), deleteAT: null});
    if(category){
        res.render("pages/categories/form", {
            title: "Delete Categories",
            mode: "Delete",
            category: category,
            err:{},
          });
    }else{
        res.send("Hiện không có sản phẩm nào phù hợp");
    }
  } catch (error) {
      console.log(error);
      res.send("trang này không tồn tại");
  }
}

export async function deleteCategory(req, res) {
  const { id } = req.body;
  try {
    await CategoryModel.deleteOne({
      _id: new ObjectId(id),
    },
    {
      deleteAT: new Date(),
    }
  );
  res.redirect("/categories");
} catch (error) {
  console.log(error);
  res.send("xóa sản phẩm không thành công!");
}
}

import CategoryModel from "../models/categoryModel.js";
import { ObjectId } from "mongodb";
import {removeVietnameseAccents} from "../comon/index.js"
export async function listCategory(req, res) {
  const search = req.query?.search
  const pageSize = !!req.query?.pageSize ? parseInt(req.query.pageSize) : 5
  const page = !!req.query?.page ? parseInt(req.query.page) : 1
  const skip = (page-1) *pageSize
  console.log({pageSize, skip});
  
  let filters={
    deleteAT: null
  }
  if (search && search.length>0) {
    filters.searchString = {$regex: removeVietnameseAccents(search), $options: 'i'}
  }
  try {
    const countcategories = await CategoryModel.countDocuments(filters);
    const categories = await CategoryModel.find(filters).skip(skip).limit(pageSize);
    // res.json(categories)
    res.render("pages/categories/list", {
      title: "Categories",
      categories: categories,
      countPagination: Math.ceil(countcategories / pageSize),
      pageSize,
      page,
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
    category:{}
  });
}

export async function createCategory(req, res) {
  const data = req.body;
  try {
    await CategoryModel.create({
      ...data,
      createAT: new Date(),
    });
    res.redirect("/categories");
  } catch (error) {
    console.log(error);
    res.send("tạo sản phẩm không thành công!");
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
            category: category
          });
    }else{
        res.send("Hiện không có sản phẩm nào phù hợp");
    }
  } catch (error) {
    res.send("trang web này không tồn tại");
  }

}

export async function UpdateCategory(req, res) {
  const { id, ...data } = req.body;
  try {
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
    console.log(error);
    res.send("cập nhật sản phẩm không thành công!");
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
            category: category
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
const {id } = req.body;
try {
  await CategoryModel.deleteOne(
    {
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

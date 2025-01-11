import express from "express";
import { listCategory } from "../controllers/categoryController.js";
const router = express.Router();

router.get("/",listCategory)
router.get("/create",function(req,res){
    res.send("create category")
})
export default router;
import express from "express";
import { listCategory,  createCategory, renderPageCreateCategory } from "../controllers/categoryController.js";
const router = express.Router();

router.get("/",listCategory)
router.get("/create", renderPageCreateCategory)
router.post("/create", createCategory)

export default router;

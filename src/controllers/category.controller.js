import Category from "../models/category.model.js"

import { BadUserRequestError, NotFoundError } from "../errors/error.js"


export default class CategoryController {
    static async createCategory (req, res) {
        const { name } = req.body;
        const existingCategory = await Category.findOne({name});
        if(existingCategory) throw new BadUserRequestError('Category exists already');
        const category = await Category.create(req.body)
        res.status(201).json({
        status: "Success",
        data: category,
      })
    }
    
    static async getAllCategories (req, res) {
      const categories = await Category.find()
      if(categories.length < 1) throw new NotFoundError('No category available');
      res.status(200).json({
      status: "Success",
      message: `${categories.length} categories available`,
      data: categories,
      })
    }
    
    static async searchCategory (req, res) {
      const id = req.query;
      const category = await Category.find(id)
      if(!category) throw new NotFoundError('Category not available');
      res.status(200).json({
      status: "Success",
      data: category,
      })
    }
}
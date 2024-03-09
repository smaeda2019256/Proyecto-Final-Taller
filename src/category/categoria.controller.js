import { response, request } from 'express';
import Category from './categoria.model.js';
import Product from '../products/producto.model.js';

export const postCategory = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();
    const newCategory = await Category.findOne({name});

    if (newCategory) {
        return res.status(400).json({
            msg: `The Category ${newCategory.name}, already EXISTS`
        });
    }

    const data = {
        name,
        user: req.user._id
    }

    const category = new Category(data);
    await category.save();

    res.status(200).json({
        msg: 'Category CREATED successfully',
        category
    })

}

export const getCategories = async (req = request, res = response) => {
    const query = { estado: true };
    const listCategories = await Promise.all([
        Category.countDocuments(query),
        Category.find(query).populate('user', 'name')
    ]);

    res.json({
        msg: 'List - CATEGORIES',
        listCategories
    });

}


export const getCategoryById = async (req = request, res = response) => {
  const { id } = req.params;
  const categoryById = await Category.findById(id).populate('user', 'name');

  res.status(201).json( categoryById );

}

export const putCategory = async (req = request, res = response) => {

    const {id} = req.params;
    const {estado, user, ...resto } = req.body;

    resto.name = resto.name.toUpperCase();
    resto.user = req.user._id;

    const categoryUpd = await Category.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json({
        msg: 'Category UPDATED successfully',
        categoryUpd
    })
}

export const deleteCategory = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const categoryToDelete = await Category.findById(id);

        if (!categoryToDelete) {
            return res.status(404).json({
                msg: 'Category not found'
            });
        }
        const defaultCategory = await Category.findOne({ name: 'CATEGORY DEFAULT' }); 

        if (!defaultCategory) {
            return res.status(500).json({
                msg: 'Default category not found'
            });
        }

        await Product.updateMany({ category: categoryToDelete._id }, { category: defaultCategory._id });

        const categoryDel = await Category.findByIdAndDelete(id);

        res.status(200).json({
            msg: 'Category REMOVED successfully',
            categoryDel
        });
    } catch (error) {
        console.error('Error deleting category', error);
        res.status(500).json({
            error: 'Error in server'
        });
    }
}
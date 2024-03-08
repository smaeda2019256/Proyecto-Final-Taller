import { response, request } from 'express';
import Category from './categoria.model.js';

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

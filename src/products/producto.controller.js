import { response, request } from 'express';
import Producto from './producto.model.js';
import Sale from '../sale/sale.model.js';

export const getProducts = async (req = request, res = response) => {
    const query = { estado: true };

    const listaProducts = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
           .populate('user', 'email')
           .populate('category', 'name')
    ]);
    
    res.json({
        msg: 'List - ACTIVE PRODUCTS',
        listaProducts
    });

}

export const getSoldOutProducts = async (req = request, res = response) => {
    try {
        const query = {
            estado: true,
            stock: 0
        };

        const soldOutProducts = await Producto.find(query)
            .populate('user', 'email')
            .populate('category', 'name');

        res.json({
            msg: 'List - SOLD OUT PRODUCTS',
            soldOutProducts
        });
    } catch (error) {
        console.error('Error getting sold out products', error);
        res.status(500).json({
            error: 'Error in server'
        });
    }
}

export const getBestSellingProducts = async (req = request, res = response) => {
    try {
        const bestSellingProducts = await Sale.aggregate([
            {
                $group: {
                    _id: '$product',
                    totalSales: { $sum: '$cantidad' },
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: '$_id',
                    productName: { $arrayElemAt: ['$productInfo.name', 0] }, 
                    totalSales: 1
                }
            },
            {
                $sort: { totalSales: -1 } 
            }
        ]);

        // Convertir nombres de productos a minúsculas
        bestSellingProducts.forEach(product => {
            if (product.productName) {
                product.productName = product.productName.toLowerCase();
            }
        });

        res.json({
            msg: 'List - BEST SELLING PRODUCTS',
            bestSellingProducts
        });
    } catch (error) {
        console.error('Error getting best selling products', error);
        res.status(500).json({
            error: 'Error in server'
        });
    }
}





export const postProducts = async (req = request, res = response) => {
    const { estado, user, ...body } = req.body;
    const productDB = await Producto.findOne({ name: body.name });

    if (productDB) {
        return res.status(400).json({
            msg: `The Product ${ productDB.name }, already EXISTS in DataBase`
        });
    }

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user.id
    }

    const product = await Producto(data);
    await product.save();

    res.status(200).json({
        msg: 'Product CREATED successfully',
        product
    })
}

export const getProductById = async (req, res ) => {

    const { id } = req.params;
    const prouductById = await Producto.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');
 
    res.status(201).json( prouductById );
}

export const putProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, user, ...restoData } = req.body;

    if ( restoData.name ) {
        restoData.name = restoData.name.toUpperCase();
        restoData.user = req.user._id;
    }
    const productUpd = await Producto.findByIdAndUpdate(id, restoData, { new: true });

    res.status(201).json({
        msg: 'The Product was UPDATED correctly',
        productUpd
    })

}

export const deleteProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const productDel = await Producto.findByIdAndUpdate( id, { estado: false}, { new: true } );

   res.json({
        msg: 'The Product was correctly REMOVED',
        productDel
   })

}


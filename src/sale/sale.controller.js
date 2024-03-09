import Sale from '../sale/sale.model.js';
import Product from '../products/producto.model.js';
import User from '../users/user.model.js';

export const salePost = async(req, res) => {
    try {
        const usuario = req.user;

        if (usuario.rol !== 'CLIENTE_ROLE') {
            return res.status(403).json({
                error: 'ACCES DENIED'
            });
        }

        const {
            product,
            cantidad
        } = req.body;

        const foundProduct = await Product.findOne({
            name: product
        });

        if (!foundProduct) {
            return res.status(404).json({
                error: 'Product not found'
            });
        }

        if (foundProduct.stock < cantidad) {
            return res.status(400).json({
                error: 'STOCK not available'
            });
        }

        const totalCompra = foundProduct.precio * cantidad;

        const nuevaVenta = new Sale({
            product: foundProduct._id,
            user: usuario._id,
            cantidad
        });

        await nuevaVenta.save();

        foundProduct.stock -= cantidad;
        await foundProduct.save();

        const usuarioCompra = await User.findById(usuario._id);
        const correoUsuarioCompra = usuarioCompra.email;

        const ventaData = {
            _id: nuevaVenta._id,
            product: foundProduct.name,
            cantidad,
            total: totalCompra,
            estado: nuevaVenta.estado,
            email: correoUsuarioCompra,
        };

        res.status(200).json({
            venta: ventaData
        });
    } catch (error) {
        console.error('Error creating sale', error);
        res.status(500).json({
            error: 'Error in server'
        });
    }
};

export const getSale = async(req, res) => {
    try {
        const usuario = req.user;

        if (usuario.rol !== 'CLIENTE_ROLE') {
            return res.status(403).json({
                error: 'Access denied'
            });
        }

        const sales = await Sale.find({
            user: usuario.id
        }).populate('product').exec();

        if (sales.length === 0) {
            return res.status(404).json({
                error: 'no sales for this user'
            });
        }

        const user = await User.findById(usuario.id);

        const {
            product,
        } = req.body;

        const foundProduct = await Product.findOne({
            name: product,
        });

        const price = await Product.findOne({
            precio: product,
        });

        const ventasData = sales.map(venta => ({
            _id: venta._id,
            product: foundProduct,
            cantidad: venta.cantidad,
            total: venta.cantidad * price,
            estado: venta.estado,
            email: user.email,
        }));

        res.status(200).json({
            ventas: ventasData
        });
    } catch (error) {
        console.error('Error getting sales', error);
        res.status(500).json({
            error: 'Error in server'
        });
    }
};
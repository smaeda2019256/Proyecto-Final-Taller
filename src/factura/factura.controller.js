import Factura from './factura.model.js';
import User from '../users/user.model.js';
import Product from '../products/producto.model.js';
import Counter from './counter.model.js';

export const getFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find();

    if (!facturas || facturas.length === 0) {
      return res.status(404).json({ message: 'No invoices found' });
    }

    return res.status(200).json({
      message: 'LIST --- INVOICES',
      facturas
    });
  } catch (error) {
    console.error('Error in obtaining invoices:', error);
    return res.status(500).json({ error: 'Error in obtaining invoices:' });
  }
};




export const getFacturasUsuarioEspecifico = async (req, res) => {
  try {
    const { userId } = req.params;

    const usuario = await User.findById(userId);

    if (!usuario) {
      return res.status(404).json({ error: 'User not found' });
    }

    const facturas = await Factura.find({ user: userId });

    res.status(200).json({ facturas });
  } catch (error) {
    console.error('Error when obtaining invoices from the user:', error);
    res.status(500).json({ error: 'Error when obtaining invoices from the user' });
  }
}




export const postFactura = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const cartItems = user.cart;

      let total = 0;
      for (let i = 0; i < cartItems.length; i++) {
          const product = await Product.findById(cartItems[i].itemId);
          total += product.precio * cartItems[i].quantity;
      }

      const nextSequence = await Counter.findOneAndUpdate(
          { _id: 'facturaId' },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
      );
      const noFactura = nextSequence.seq;

      const nameUser = user.name;
      if (!nameUser) {
          return res.status(400).json({ error: 'The user name is required' });
      }

      const nuevaFactura = new Factura({
          noFactura,
          user: user._id,
          nameUser,
          fechaCompra: new Date(),
          cart: cartItems,
          total: total,
      });

      await nuevaFactura.save();

      res.status(201).json(nuevaFactura);
  } catch (error) {
      console.error('Error when creating the invoice:', error);
      res.status(500).json({ error: 'Error when creating the invoice' });
  }
};
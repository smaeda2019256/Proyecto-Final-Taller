import Factura from './factura.model.js';
import User from '../users/user.model.js';

export const getFacturas = async (req = request, res = response) => {
  const query = { user: req.user.id };

  const listaFacturas = await Promise.all([
    Factura.countDocuments(query),
    Factura.find(query)
      .populate('user', 'cart')
  ]);

  return res.json({
    msg: 'Lista de Facturas del Cliente',
    listaFacturas
  });

}


export const getFacturasUsuarioEspecifico = async (req, res) => {
  try {
    const { userId } = req.params;

    const usuario = await User.findById(userId);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const facturas = await Factura.find({ user: userId });

    res.status(200).json({ facturas });
  } catch (error) {
    console.error('Error al obtener las facturas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener las facturas del usuario' });
  }
}




const generarNumeroFactura = () => {
  return Math.floor(Math.random() * 1000000) + 1;
};

export const postFactura = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let totalQuantity = 0;
    let totalPrice = 0;

    const carrito = req.user.cart;

    for (let i = 0; i < carrito.length; i++) {
      totalQuantity += carrito[i].quantity;
      totalPrice += carrito[i].precio * carrito[i].quantity;
    }
  
    const nuevaFactura = new Factura({
      noFactura: generarNumeroFactura(),
      user: user._id,
      nameUser: user.name,
      fechaCompra: new Date(),
      cart: req.user.cart,
      total: totalPrice,
    });

    await nuevaFactura.save();

    res.status(201).json(nuevaFactura);
  } catch (error) {
    console.error('Error al crear la factura:', error);
    res.status(500).json({ error: 'Error al crear la factura' });
  }
};




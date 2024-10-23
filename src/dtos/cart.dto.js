export default class CartDAO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(item => ({
            productId: item.productId._id || item.productId,
            title: item.productId.title,
            price: item.productId.price,
            quantity: item.quantity,
        }));
    }
}
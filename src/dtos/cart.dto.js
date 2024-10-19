export default class CartDAO {
    constructor({ id, products }) {
        if (id) this.id = id;
        this.products = products || [];
    }
}
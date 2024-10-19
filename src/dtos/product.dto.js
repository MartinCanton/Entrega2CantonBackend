export default class ProductDTO {
    constructor({ id, title, description, price, thumbnails ,code, stock ,category, status }) {
        if (id) this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnails = thumbnails || [];
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.status = status !== undefined ? status: true;
    }
}
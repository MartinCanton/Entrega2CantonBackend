import mongoose from'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products'

const productSchema =  mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true, min: 0},
    thumbnails: {type: [String],
        default: []},
    code: {type: String, required: true},
    stock: {type: Number, required: true, min: 0},
    category: {type: String, required: true},
    status: {type: Boolean, required: true, default: true},
})

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema)

export default productModel


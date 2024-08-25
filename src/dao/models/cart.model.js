import mongoose from'mongoose'

const cartCollection = 'carts'

const cartSchema =  mongoose.Schema({
    products: {
            type:[
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products'
                        },
                        quantity: {
                            type: Number,
                            default: 1
                        }
                    }
                    ],
                    default: []
                }
            })


       
const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel
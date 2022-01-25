import mongoose, { Schema } from 'mongoose'
import { sortQ } from '../../utils'

const productSchema = new Schema({
  sellerId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  cost: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

productSchema.methods = {
  view (full) {
    const view = {
      id: this.id,
      name: this.name,
      amount: this.amount,
      cost: this.cost
    }

    return full ? {
      ...view,
      seller: this.sellerId.view(full),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } : view
  }
}

productSchema.statics = {
  index: function (page, limit, sort) {
    sort = sortQ(sort)
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)
    return this.countDocuments({})
      .then(count => this.find({}, {}, {
        skip: (page - 1) * limit,
        limit,
        sort
      })
        .then(products => ({
          rows: products.map(product => product.view()),
          count
        }))
      )
  }
}

const model = mongoose.model('Product', productSchema)
model.ensureIndexes()

export const schema = model.schema
export default model

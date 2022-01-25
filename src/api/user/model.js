import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import { sortQ } from '../../utils'
import { env } from '../../config'

const roles = ['seller', 'buyer', 'admin']

const userSchema = new Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: roles,
    required: true
  },
  name: {
    type: String,
    trim: true
  },
  deposit: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
})

userSchema.path('email').set(function (email) {
  if (!this.name) {
    this.name = email.replace(/^(.+)@.+$/, '$1')
  }

  return email
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  /* istanbul ignore next */
  const rounds = env === 'test' ? 1 : 9

  bcrypt.hash(this.password, rounds).then((hash) => {
    this.password = hash
    next()
  }).catch(next)
})

userSchema.methods = {
  view (full) {
    const view = {}
    let fields = ['id', 'name']

    if (full) {
      fields = [...fields, 'email', 'role', 'createdAt', 'updatedAt']
    }

    fields.forEach((field) => { view[field] = this[field] })

    return view
  },

  authenticate (password) {
    return bcrypt.compare(password, this.password).then((valid) => valid ? this : false)
  }
}

userSchema.statics = {
  roles,
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
        .then(users => ({
          rows: users.map(user => user.view()),
          count
        }))
      )
  }
}

const model = mongoose.model('User', userSchema)
model.ensureIndexes()

export const schema = model.schema
export default model

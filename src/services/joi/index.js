import Joi from 'joi'

export const validate = (schema) => {
  return async (req, res, next) => {
    const validations = ['query', 'body'].map((key) => {
      const { [key]: sc } = schema
      const { [key]: value } = req

      return sc ? sc.validateAsync(value, {
        abortEarly: true,
        allowUnknown: false,
        stripUnknown: false
      }) : Promise.resolve(true)
    })

    try {
      await Promise.all(validations)
      return next()
    } catch (error) {
      const message = error.details[0].message.replace(/['"]/g, '')
      return res.status(400).json({ msg: message })
    }
  }
}

export default Joi

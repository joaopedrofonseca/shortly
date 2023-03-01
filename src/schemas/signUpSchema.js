import Joi from "joi"

const signUpSchema =  Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().min(3).max(50).required(),
    password: Joi.string().min(6).max(20).required(),
    confirmPassword: Joi.ref('password')
})

export default signUpSchema
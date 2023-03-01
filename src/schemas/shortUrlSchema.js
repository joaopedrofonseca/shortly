import Joi from "joi";

const shortUrlSchema = Joi.object({
    url: Joi.string().required()
})

export default shortUrlSchema
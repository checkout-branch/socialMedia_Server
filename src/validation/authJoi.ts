import joi from 'joi'

const userAuthJoi = joi.object({
    userName:joi.string().min(3).max(20).required()
        .messages({
            'string.empty':'Username is required',
            'string.min':'Username should have atleast 3 characters',
            'string.max':"Username don't allow more than 20 characters",
            'any.required':'Username is required field'
        }),
    
    email:joi.string().email({
        minDomainSegments:2,
        tlds:{allow:['com','net','org']},
    })  .lowercase().required().trim()
        .messages({
            'String.email':'Please provide a valid email',
            'any.required':'Email is required field'
        }),
    
    password:joi.string().min(4).max(20).required()
        .pattern(new RegExp("^[a-zA-Z0-9]{4,20}$"))
        .messages({
            'String.pattern.base':'Password must contain alphanumeric characters',
            'String.min':'Password should have atleast 4 charactesr',
            'String.max':"Password don't allow more than 20 characters",
            'any.required':'Password is required field'
        }),
        name: joi.string().required(),
        gender: joi.string().required(),
        day: joi.number().required(),
        month: joi.string().required(),
        year: joi.number().required()
}).options({ allowUnknown: true });

export default userAuthJoi
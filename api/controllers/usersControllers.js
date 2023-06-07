import User from "../models/userModel.js"
import { generateToken } from "../utils/tokenManager.js"

export const registerUser = async (req, res) => {
    const { name, email,password, pic } = req.body
    try {
        
        const userExists = await User.findOne({email})
        if(userExists) return res.status(400).json('user already exists')

        const userDoc = new User({
            name,
            email,
            password,
            pic
        })

        const user = await userDoc.save()
        const { token } = generateToken(user._id)
        
        if(userDoc) return res.status(201).json({user, token})

        else throw new Error('falló en crear usuario')

    } catch (error) {
        console.log(error.message)
    }

}


export const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const userDoc = await User.findOne({ email })
        if(!userDoc) return res.status(404).json('no existe este usuario')
        const reqPassword = await userDoc.comparePassword(password)//devuelve una promesa, true o false
        if(!reqPassword) return res.status(400).json('contraseña incorrecta')
        const { token } = generateToken(userDoc._id)
        res.status(200).json({
            _id: userDoc._id,
            name: userDoc.name,
            email: userDoc.email,
            pic: userDoc.pic,
            token
        })
        
    } catch (error) {
        console.log(error.message)
    }
}


export const allUsers = async (req, res) => {
    const keyword = req.query?.search ? {//usamos operador ternario para que en caso que sea true, buscamos en la bd sino, no retorna nada
        $or: [
            {name: { $regex: req.query.search, $options: "i" }},
            {email: { $regex: req.query.search, $options: "i" }}
        ]
    } : {}
                                                //.select("-password") -> el metodo select funciona en este caso, para retornar todo el documento si eciste, excepto la contraseña
    const users = await User.find(keyword).find({_id: {$ne: req.uid}})//basandose en el campo id (que es unico), quiero que retorne todos los users excepto el user que esté loggeado (la cookie)
    res.send(users)
}




export const profile = async (req, res) => {
    
    try {
        const user = await User.findById(req.uid)
        if(!user) return res.status(404).json('perfil no encontrado')

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: req.token

        })


    } catch (error) {
        console.log(error.message)
    }
}
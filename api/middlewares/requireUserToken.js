import jwt from "jsonwebtoken";

const requireUserToken = (req, res, next) => {
    try {
    let token = req.headers?.authorization//si existe el authorization significa que hemos habilitado el bearer (solo se puede habilitar un modo de authorization)
    console.log(token)
    if(!token) return res.status(401).json('no bearer, no authorization')
    

    token = token.split(" ")[1]
    console.log(token)//el token anterior reflejaba 'invalid signature' porque era una cookie
    if (token) {
        
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        console.log(uid)
        req.uid = uid;
        req.token = token
        next();
    } else {
        res.status(401).json("no token");
    }

    
    } catch (error) {
        console.log(error.message);
    }
};

export default requireUserToken;
/*eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1aWQiOiI2Mzg2ZDE2ZjU2YmZjY2M1MmIzMjc0ZGEiLCJpYXQiOjE2NzAyMDkwNzEsImV4cCI6MTY3MDIwOTY3MX0.
w2wqjfEiDgGBSxMcprmZM-ss0-BIdtWGRA20mXGd7Hs */
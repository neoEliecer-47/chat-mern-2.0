import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
     /* isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },*/
}, {timestamps: true})

userSchema.pre("save", async function (next) {
    try {
        //this, hace referencia al userSchema
        if (!this.isModified("password")) return next(); //si la contraseña no ha sido modificada, retornamos next porque no necesitamos hashearla de nuevo

        const saltos = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, saltos);
        this.password = hash;

        return next();
    } catch (error) {
        console.log(error.message);
    }
});


userSchema.methods.comparePassword = async function (clientPassword) {
    return await bcrypt.compare(clientPassword, this.password); //esto retorna una promesa: verdadero o falso, no retorna la contraseña hasheada como tal
    //clientPassword es la contraseña igresada por un usuario que va a compararse con la contraseña del modelo del usuario, es decir la contraseña alojada y hasheada en BD
};

const User = model("user", userSchema)
export default User
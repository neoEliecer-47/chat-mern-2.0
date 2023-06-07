import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'//file sistem, modulo nativo de nodejs para manipular archivos en nuestro sistema



const __dirname = path.dirname(fileURLToPath(import.meta.url));
//const __dirname = ruta.split("controllers")
const __dir = __dirname.slice(0, -12)

export const photoUploaderByDevice = (req, res) => {
    try {
        
        const uploadedFiles = []
        
        
            const {path, originalname} = req.files[0];
            console.log(originalname)
            const extension = originalname.split(".")[1]
            const newPath = path + '.' + extension
    
            fs.renameSync(path, newPath)
            console.log(req.files)
            uploadedFiles.push(newPath.replace("uploads\\",""))
        
        res.json(uploadedFiles)
    
    } catch (error) {
        console.log(error)    
    }
}
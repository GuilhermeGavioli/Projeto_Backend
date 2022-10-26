import multer from 'multer'
import path from 'path'

export const uploadUser = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            console.log('iam running')
            cb(null, path.join(__dirname, 'file_system/user'))
        },
        filename: (req, file, cb) => {
            console.log('ypeg')
            cb(null, Date.now().toString() + "_" + file.originalname)  
        }
    }),
    limits: {
        fileSize: 1024 * 230
    },
    fileFilter: (req, file, cb) => {
        const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find(formatoAceito => formatoAceito == file.mimetype);

        

        if(extensaoImg){
            return cb(null, true);
        }

        return cb(null, false);
    }
}));

export const uploadProduct = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + file)
            console.log('iam running')
            cb(null, path.join(__dirname, 'file_system/product'))
        },
        filename: (req, file, cb) => {
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
            console.log('ypeg')
            cb(null, Date.now().toString() + "_" + file.originalname)  
        }
    }),
    limits: {
        fileSize: 1024 * 230
    },
    fileFilter: (req, file, cb) => {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find(formatoAceito => formatoAceito == file.mimetype);
        if(extensaoImg){
            return cb(null, true);
        }
        return cb(null, false);
    }
}));


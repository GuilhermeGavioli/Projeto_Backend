"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProduct = exports.uploadUser = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.uploadUser = ((0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            console.log('iam running');
            cb(null, path_1.default.join(__dirname, 'file_system/user'));
        },
        filename: (req, file, cb) => {
            console.log('ypeg');
            cb(null, Date.now().toString() + "_" + file.originalname);
        }
    }),
    limits: {
        fileSize: 1024 * 230
    },
    fileFilter: (req, file, cb) => {
        const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find(formatoAceito => formatoAceito == file.mimetype);
        if (extensaoImg) {
            return cb(null, true);
        }
        return cb(null, false);
    }
}));
exports.uploadProduct = ((0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path_1.default.join(__dirname, 'file_system/product'));
        },
        filename: (req, file, cb) => {
            console.log('ypeg');
            cb(null, Date.now().toString() + "_" + file.originalname);
        }
    }),
    limits: {
        fileSize: 1024 * 230
    },
    fileFilter: (req, file, cb) => {
        const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find(formatoAceito => formatoAceito == file.mimetype);
        if (extensaoImg) {
            return cb(null, true);
        }
        return cb(null, false);
    }
}));

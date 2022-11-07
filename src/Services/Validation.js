"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = exports.UserValidation = void 0;
const cadastrar_1 = __importDefault(require("../DTO/output/cadastrar"));
class UserValidation {
    constructor(name, email, password, confirmPassword, gender, address, birthDate, aboutMe, bio, user_image) {
        for (let i = 0; i < UserValidation.invalidCharactersJoin.length; i++) {
            if (name === null || name === void 0 ? void 0 : name.includes(UserValidation.invalidCharactersJoin[i]))
                throw new Error(`Nome contem caracter invalido: ${UserValidation.invalidCharactersJoin[i]}`);
            if (email === null || email === void 0 ? void 0 : email.includes(UserValidation.invalidCharactersJoin[i]))
                throw new Error(`Nome contem caracter invalido: ${UserValidation.invalidCharactersJoin[i]}`);
            if (password === null || password === void 0 ? void 0 : password.includes(UserValidation.invalidPasswordCharacters[i]))
                throw new Error(`Senha contem caracter invalido: ${UserValidation.invalidPasswordCharacters[i]}`);
            if (address === null || address === void 0 ? void 0 : address.includes(UserValidation.invalidPasswordCharacters[i]))
                throw new Error(`Endereço/cidade contem caracter invalido: ${UserValidation.invalidPasswordCharacters[i]}`);
            if (aboutMe === null || aboutMe === void 0 ? void 0 : aboutMe.includes(UserValidation.invalidPasswordCharacters[i]))
                throw new Error(`Descricao contem caracter invalido: ${UserValidation.invalidPasswordCharacters[i]}`);
            if (bio === null || bio === void 0 ? void 0 : bio.includes(UserValidation.invalidPasswordCharacters[i]))
                throw new Error(`Bio contem caracter invalido: ${UserValidation.invalidPasswordCharacters[i]}`);
        }
        this.name = (name === null || name === void 0 ? void 0 : name.toLowerCase()) || undefined;
        this.email = (email === null || email === void 0 ? void 0 : email.toLowerCase()) || undefined;
        this.password = (password === null || password === void 0 ? void 0 : password.toLowerCase()) || undefined;
        this.confirmPassword = (confirmPassword === null || confirmPassword === void 0 ? void 0 : confirmPassword.toLowerCase()) || undefined;
        this.gender = gender || undefined;
        this.address = (address === null || address === void 0 ? void 0 : address.toLowerCase()) || undefined;
        this.birthDate = (birthDate === null || birthDate === void 0 ? void 0 : birthDate.toString()) || undefined;
        this.aboutMe = (aboutMe === null || aboutMe === void 0 ? void 0 : aboutMe.toLowerCase()) || undefined;
        this.bio = (bio === null || bio === void 0 ? void 0 : bio.toLowerCase()) || undefined;
        this.user_image = (user_image === null || user_image === void 0 ? void 0 : user_image.toLowerCase()) || undefined;
    }
    validate() {
        const whichOnesToValidate = [];
        if (this.name)
            whichOnesToValidate.push("name");
        if (this.email)
            whichOnesToValidate.push("email");
        if (this.password)
            whichOnesToValidate.push("password");
        if (this.confirmPassword)
            whichOnesToValidate.push("confirmpassword");
        if (this.gender)
            whichOnesToValidate.push("gender");
        if (this.address)
            whichOnesToValidate.push("address");
        if (this.birthDate)
            whichOnesToValidate.push("birthDate");
        if (this.aboutMe)
            whichOnesToValidate.push("aboutMe");
        if (this.bio)
            whichOnesToValidate.push("bio");
        if ((whichOnesToValidate.includes('confirmpassword') && !whichOnesToValidate.includes('password')) ||
            (!whichOnesToValidate.includes('confirmpassword') && whichOnesToValidate.includes('password'))) {
            return new cadastrar_1.default("Campo senha e confirmar senha são obrigatórios.", 403, true);
        }
        for (let i = 0; i < whichOnesToValidate.length; i++) {
            if (whichOnesToValidate[i] == "name") {
                const isNameValid = this.validateName(this.name);
                if (!isNameValid)
                    return new cadastrar_1.default("Nome invalido", 403, true);
            }
            if (whichOnesToValidate[i] == "email") {
                const isEmailValid = this.validateEmail(this.email);
                if (!isEmailValid)
                    return new cadastrar_1.default("Email invalido", 403, true);
            }
            if (whichOnesToValidate[i] == "password") {
                const isPasswordValid = this.validatePassword(this.password);
                if (!isPasswordValid)
                    return new cadastrar_1.default("Senha invalida", 403, true);
            }
            if (whichOnesToValidate[i] == "confirmpassword") {
                const isPasswordValid = this.password === this.confirmPassword;
                if (!isPasswordValid)
                    return new cadastrar_1.default("Senhas devem ser iguais", 403, true);
            }
            if (whichOnesToValidate[i] == "gender") {
                const isGenderValid = this.validateGender(this.gender);
                if (!isGenderValid)
                    return new cadastrar_1.default("Genero inválido", 403, true);
            }
            if (whichOnesToValidate[i] == "address") {
                const isGenderValid = this.validateAddress(this.address);
                if (!isGenderValid)
                    return new cadastrar_1.default("Endereço/cidade inválido", 403, true);
            }
            if (whichOnesToValidate[i] == "birthDate") {
                const isBirthDateValid = this.validateBirthDate(this.birthDate);
                if (!isBirthDateValid)
                    return new cadastrar_1.default("Data de nascimento inválida", 403, true);
            }
            if (whichOnesToValidate[i] == "aboutMe") {
                const isAboutMeValid = this.validateAboutMe(this.aboutMe);
                if (!isAboutMeValid)
                    return new cadastrar_1.default("Campo Sobre mim é inválido", 403, true);
            }
            if (whichOnesToValidate[i] == "bio") {
                const isBioValid = this.validateBio(this.bio);
                if (!isBioValid)
                    return new cadastrar_1.default("Campo Bio inválida", 403, true);
            }
        }
        return new cadastrar_1.default("ok", 200, false);
    }
    validateName(name) {
        if (!name)
            return null;
        if (name.length < 4 || name.length > 100)
            return false;
        return true;
    }
    validateEmail(email) {
        if (!email)
            return null;
        if (!email.includes("@"))
            return false;
        if (!email.includes(".com"))
            return false;
        if (email.includes(" "))
            return false;
        if (email.length < 6 || email.length > 100)
            return false;
        return true;
    }
    validatePassword(password) {
        if (!password)
            return null;
        if (password.length < 5 || password.length > 25)
            return false;
        return true;
    }
    validateGender(gender) {
        if (!gender)
            return null;
        if (gender !== 0 && gender !== 1 && gender !== 2)
            return false;
        return true;
    }
    validateAddress(address) {
        if (!address)
            return null;
        if (address.length < 5)
            return false;
        return true;
    }
    validateBirthDate(birthDate) {
        if (!birthDate)
            return null;
        const date = new Date();
        const CURRENT_YEAR = date.getFullYear();
        console.log(CURRENT_YEAR);
        try {
            const year = Number(birthDate.substring(0, 4));
            const month = Number(birthDate.substring(5, 7));
            const day = Number(birthDate.substring(8, 10));
            console.log(year, day, month);
            if (birthDate.length < 8 || birthDate.length > 10 || year >= CURRENT_YEAR || year < 1910 || day > 31 || day < 0 || month > 12 || month < 0)
                return false;
            return true;
        }
        catch (err) {
            throw new Error();
        }
    }
    validateBio(bio) {
        if (!bio)
            return null;
        if (bio.length > 200)
            return false;
        return true;
    }
    validateAboutMe(AboutMe) {
        if (!AboutMe)
            return null;
        if (AboutMe.length > 600)
            return false;
        return true;
    }
}
exports.UserValidation = UserValidation;
UserValidation.invalidNameCharacters = [
    "/", "$", "&", "<", ">", "#", "%", "*", "+", "-", "!", "[", "]", "(", ")"
];
UserValidation.invalidPasswordCharacters = [
    "'", '"', "="
];
UserValidation.invalidCharactersJoin = UserValidation.invalidPasswordCharacters.concat(UserValidation.invalidNameCharacters);
class ProductValidation {
    validate() {
        return new cadastrar_1.default('ok', 200, false);
    }
}
exports.ProductValidation = ProductValidation;
//*touppercase vs tolowercase
// isemail / email length /
// passwords match // passwords length // password contains letters and numbers (and special characters)
// name length (>4)
// gender == male || gender == female
//
// data de nascimento
// passwords match
//gender == 1 || 2
//validate if date is in correct format
// yyyy-mm-dd
// 2020-10-10
// if (date.length > 9) //error
// if (date.toString().substring(0,3))
//nome //email //password, //genero
console.log(new UserValidation("guilherme", null, "151515", "2").validate());

"use strict";
exports.__esModule = true;
var cadastrar_1 = require("../DTO/output/cadastrar");
var UserValidation = /** @class */ (function () {
    function UserValidation(name, email, password, gender, address, birthDate, aboutMe, bio, user_image) {
        this.InvalideNameCharacters = [
            "/", "!", "#", "$", "%", "¨", "&", "*", "(", ")", "=", "+", "-", ".", "(", ")", "[", "]", ""
        ];
        this.validNameCharacters = [
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
        ];
        try {
            this.name = name === null || name === void 0 ? void 0 : name.toString().toLocaleLowerCase();
            this.email = email === null || email === void 0 ? void 0 : email.toString().toLocaleLowerCase();
            this.password = password === null || password === void 0 ? void 0 : password.toString().toLocaleLowerCase();
            this.gender = gender === null || gender === void 0 ? void 0 : gender.toString();
        }
        catch (err) {
            console.log("eeeeeeee" + err);
        }
    }
    UserValidation.prototype.validate = function () {
        var whichOnesToValidate = [];
        if (this.name)
            whichOnesToValidate.push("name");
        if (this.email)
            whichOnesToValidate.push("email");
        if (this.password)
            whichOnesToValidate.push("password");
        if (this.gender)
            whichOnesToValidate.push("gender");
        for (var i = 0; i < whichOnesToValidate.length; i++) {
            if (whichOnesToValidate[i].toString() == "name") {
                var isNameValid = this.validateName(this.name);
                if (!isNameValid)
                    return new cadastrar_1["default"]("Name is invalid", 403, true);
            }
            if (whichOnesToValidate[i].toString() == "email") {
                var isEmailValid = this.validateEmail(this.email);
                if (!isEmailValid)
                    return new cadastrar_1["default"]("Email is invalid", 403, true);
            }
            if (whichOnesToValidate[i].toString() == "password") {
                var isPasswordValid = this.validatePassword(this.password);
                if (!isPasswordValid)
                    return new cadastrar_1["default"]("Password is invalid", 403, true);
            }
            if (whichOnesToValidate[i].toString() == "gender") {
                var isGenderValid = this.validateGender(this.gender);
                if (!isGenderValid)
                    return new cadastrar_1["default"]("Gender field is must be one of the three types", 403, true);
            }
        }
        return new cadastrar_1["default"]("ok", 200, false);
    };
    UserValidation.prototype.validateName = function (name) {
        if (!name)
            return null;
        if (name.length < 4 || name.length > 100)
            return false;
        return true;
    };
    UserValidation.prototype.validateEmail = function (email) {
        if (!email)
            return null;
        if (email.length < 6 || email.length > 100)
            return false;
        return true;
    };
    UserValidation.prototype.validatePassword = function (password) {
        if (!password)
            return null;
        if (password.length < 5 || password.length > 25)
            return false;
        return true;
    };
    UserValidation.prototype.validateGender = function (gender) {
        if (!gender)
            return null;
        if (gender !== "0" && gender !== "1" && gender !== "2")
            return false;
        return true;
    };
    return UserValidation;
}());
// userid  VARCHAR(255) NOT NULL UNIQUE,
//     full_name VARCHAR(255) NOT NULL,
//     email VARCHAR(255) NOT NULL UNIQUE,
//     user_password VARCHAR(255) NOT NULL,
//     user_gender INT NOT NULL,
//     addr_state VARCHAR(255) NOT NULL,
//     birth_date DATE NOT NULL,
//     about_me VARCHAR(255),
//     bio VARCHAR(255),
//     user_image VARCHAR(255),
//     created_at DATE NOT NULL,
//     updated_at DATE,
//     PRIMARY KEY(userid),
//     -- FOREIGN KEY(addr_state) REFERENCES addressState(id),
//     FOREIGN KEY(user_gender) REFERENCES gender(g_id)
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
console.log(new UserValidation("guilherme", null, "151515", 2).validate());

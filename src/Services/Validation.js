"use strict";
exports.__esModule = true;
var UserValidation = /** @class */ (function () {
    function UserValidation(name, email, password, gender, address, birthDate, aboutMe, bio, user_image) {
        this.InvalideNameCharacters = [
            "/", "!", "#", "$", "%", "¨", "&", "*", "(", ")", "=", "+", "-", ".", "(", ")", "[", "]", ""
        ];
        this.validNameCharacters = [
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
        ];
        this.name = name === null || name === void 0 ? void 0 : name.toString().toLocaleLowerCase();
        this.email = email === null || email === void 0 ? void 0 : email.toString().toLocaleLowerCase();
        this.password = password === null || password === void 0 ? void 0 : password.toString().toLocaleLowerCase();
        this.gender = gender === null || gender === void 0 ? void 0 : gender.toString().toLocaleLowerCase();
    }
    UserValidation.prototype.validate = function () {
        var _this = this;
        var whichOnesToValidate = [];
        if (this.name)
            whichOnesToValidate.push("name");
        if (this.email)
            whichOnesToValidate.push("email");
        if (this.password)
            whichOnesToValidate.push("password");
        if (this.gender)
            whichOnesToValidate.push("gender");
        var areFieldsValids = whichOnesToValidate.map(function (item) {
            if (item == "name")
                return _this.validateName(_this.name);
            if (item == "email")
                return _this.validateName(_this.email);
            if (item == "password")
                return _this.validateName(_this.password);
        });
        areFieldsValids.map(function (boolField) {
            console.log(boolField);
        });
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
        if (email.length < 5 || email.length > 100)
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
new UserValidation("gu", null, "151515").validate();

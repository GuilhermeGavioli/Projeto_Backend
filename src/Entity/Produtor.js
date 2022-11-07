"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Produtor {
    constructor(id, name, email, password, gender, city, birthDate, aboutMe, bio, image) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.gender = gender;
        this.city = city;
        this.birthDate = birthDate;
        this.aboutMe = aboutMe;
        this.bio = bio;
        this.image = image;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getPassword() {
        return this.password;
    }
    getEmail() {
        return this.email;
    }
}
exports.default = Produtor;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
class MySql {
    constructor(host, user, database, password, port) {
        this.connect(host, user, database, password, port);
    }
    connect(host, user, database, password, port) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield promise_1.default.createConnection({
                host,
                user,
                database,
                password,
                port
            });
            console.log("Succesfully connected to database");
        });
    }
    findProductsFromUser(userid, number) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.connection.execute(`SELECT 
        product_id,
        product_name,
        product_image,
        product_description
        FROM product WHERE owner_id="${userid}"
        LIMIT ${number}, ${number + 8};`);
            if (!rows)
                return null;
            return rows;
        });
    }
    saveUser(produtor) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            yield this.connection.query(`INSERT INTO user (userid, full_name, email, user_password, user_gender, addr_state, birth_date, created_at) VALUES ("${produtor.id}", "${produtor.getName()}", "${produtor.getEmail()}", "${produtor.getPassword()}", "${produtor.gender}", "${produtor.city}", "${produtor.birthDate}", "${new Date(date).toISOString().split('T')[0]}")`);
        });
    }
    //used by the application
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [[rows]] = yield this.connection.execute(`SELECT * from user WHERE email="${email}";`);
            if (!rows)
                return null;
            return rows;
        });
    }
    // used by user ***
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [[rows]] = yield this.connection.execute(`SELECT * from user WHERE userid="${id}";`);
            if (!rows)
                return null;
            return rows;
        });
    }
    findProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [[rows]] = yield this.connection.execute(`SELECT * from product WHERE product_id="${id}";`);
            if (!rows)
                return null;
            return rows;
        });
    }
    //used by the application
    findProduct(id, owner_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [[rows]] = yield this.connection.execute(`SELECT * from product WHERE product_id="${id}" && owner_id="${owner_id}";`);
            if (!rows)
                return null;
            return rows;
        });
    }
    //used by the user
    deleteOneProduct(product_id, token_user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.query(`DELETE FROM product WHERE product_id="${product_id}" && owner_id="${token_user_id}";`);
        });
    }
    //used by the user;
    // breaks open closed principle // fix latter on //USERS
    findManyUsersByName(name, queryDescriptionAlso) {
        return __awaiter(this, void 0, void 0, function* () {
            if (queryDescriptionAlso) {
                const [rows] = yield this.connection.execute(`SELECT 
            userid,
            full_name,
            user_gender,
            addr_state,
            birth_date,
            about_me,
            bio,
            created_at,
            user_image
            FROM user WHERE full_name LIKE "%${name}%" || about_me LIKE "%${name}%" || bio LIKE "%${name}%";`);
                if (!rows)
                    return null;
                return rows;
            }
            else {
                const [rows] = yield this.connection.execute(`SELECT 
            userid,
            full_name,
            user_gender,
            addr_state,
            birth_date,
            about_me,
            bio,
            created_at,
            user_image
             FROM user WHERE full_name LIKE "%${name}%";`);
                if (!rows)
                    return null;
                return rows;
            }
        });
    }
    //used by no one for now :)
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.connection.execute('SELECT userid, full_name, user_gender, addr_state, birth_date, about_me, bio, user_image from user;');
            if (!rows)
                return null;
            return rows;
        });
    }
    //query all products from a USER ****TODO*****
    // query a user profile
    // used by user
    updateOneUser(email, produtor) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            if (produtor.image) {
                yield this.connection.query(`UPDATE user SET
            userid="${produtor.id}",
            full_name="${produtor.getName()}",
            user_password="${produtor.getPassword()}", 
            user_gender="${produtor.gender}",
            addr_state="${produtor.city}",
            birth_date="${produtor.birthDate}", 
            about_me="${produtor.aboutMe}", 
            bio="${produtor.bio}", 
            user_image="${produtor.image}",
            updated_at="${new Date(date).toISOString().split('T')[0]}" WHERE email="${email}";`);
                return;
            }
            yield this.connection.query(`UPDATE user SET
        userid="${produtor.id}",
        full_name="${produtor.getName()}",
        user_password="${produtor.getPassword()}", 
        user_gender="${produtor.gender}",
        addr_state="${produtor.city}",
        birth_date="${produtor.birthDate}", 
        about_me="${produtor.aboutMe}", 
        bio="${produtor.bio}", 
        updated_at="${new Date(date).toISOString().split('T')[0]}" WHERE email="${email}";`);
        });
    }
    saveProduct(produto) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(produto);
            const date = new Date();
            yield this.connection.query(`
        INSERT INTO product(product_id, product_name, product_image, product_description, is_organic, price, unity, tags, category, owner_id, created_at) VALUES ("${produto.p_id}",
        "${produto.p_name}",
         "${produto.p_image}",
          "${produto.p_description}", 
          "${produto.p_isOrganic}",
          "${produto.p_price}",
          "${produto.p_unity}",
          "${produto.p_tags}",
          "${produto.p_category}",
          "${produto.user_id}",
          "${new Date(date).toISOString().split('T')[0]}");
        `);
        });
    }
    deleteOneUser(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.query(`DELETE FROM user WHERE userid="${id}" && email="${email}";`);
        });
    }
    findManyProductsByName(name, queryDescriptionAlso, number) {
        return __awaiter(this, void 0, void 0, function* () {
            if (queryDescriptionAlso) {
                const [rows] = yield this.connection.execute(`SELECT 
            product_id,
            product_name,
            product_image,
            product_description
            FROM product WHERE product_name LIKE "%${name}%" || product_description LIKE "%${name}%" 
            LIMIT ${number}, ${number + 8};`);
                if (!rows)
                    return null;
                return rows;
            }
            else {
                const [rows] = yield this.connection.execute(`SELECT 
            product_id,
            product_name,
            product_image,
            product_description
            FROM product WHERE product_name LIKE "%${name}%"
            LIMIT ${number}, ${number + 8};`);
                if (!rows)
                    return null;
                return rows;
            }
        });
    }
}
exports.default = MySql;

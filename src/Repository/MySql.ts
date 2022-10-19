import Repository from "./Repository";
import Produtor from "../Entity/Produtor";
import Produto from "../Entity/Produto";

import GetOneOutputDTO from "../DTO/output/GetOneDTO";


import mysql from 'mysql2/promise';

export default class MySql implements Repository {
    private connection: mysql.Connection | any;
    
    constructor(host: string, user: string, database: string, password: string, port: number) {
        this.connect(host, user, database, password, port);
    }

    private async connect(host: string, user: string, database: string, password: string, port: number) {
        this.connection = await mysql.createConnection({
            host,
            user,
            database,
            password,
            port
        });
        console.log("Succesfully connected to database");
    }

    public async findProductsFromUser(userid: string): Promise<any | null> { 
        const [rows] = await this.connection.execute(`SELECT 
        product_id,
        product_name,
        product_image,
        product_description
        FROM product WHERE owner_id="${userid}";`);
        if (!rows) return null;
        return rows;
    }


    public async saveUser(produtor: Produtor): Promise<void> {
        const date = new Date();
        await this.connection.query(
        `INSERT INTO user (userid, full_name, email, user_password, user_gender, addr_state, birth_date, created_at) VALUES ("${produtor.id}", "${produtor.getName()}", "${produtor.getEmail()}", "${produtor.getPassword()}", "${produtor.gender}", "${produtor.city}", "${produtor.birthDate}", "${new Date(date).toISOString().split('T')[0]}")`);
    }

    //used by the application
    public async findUserByEmail(email: string): Promise<GetOneOutputDTO | null> {
        const [[rows]] = await this.connection.execute(`SELECT * from user WHERE email="${email}";`);
        if (!rows) return null;
        return rows;
    }

    //used by the application
    public async findProduct(id: string, owner_id: string): Promise<any | null> {
        const [[rows]] = await this.connection.execute(`SELECT * from product WHERE product_id="${id}" && owner_id="${owner_id}";`);
        if (!rows) return null;
        return rows;
    }

    //used by the user
    public async deleteOneProduct(product_id: string, token_user_id: string): Promise<void> {
        await this.connection.query(`DELETE FROM product WHERE product_id="${product_id}" && owner_id="${token_user_id}";`);
    }

    //used by the user;
    // breaks open closed principle // fix latter on //USERS
    public async findManyUsersByName(name: string, queryDescriptionAlso: boolean): Promise<GetOneOutputDTO[] | null> {
        if (queryDescriptionAlso) {
            const [rows] = await this.connection.execute(`SELECT 
            userid,
            full_name,
            user_gender,
            addr_state,
            birth_date,
            about_me,
            bio,
            user_image
            FROM user WHERE full_name LIKE "%${name}%" || about_me LIKE "%${name}%" || bio LIKE "%${name}%";`);
            if (!rows) return null;
            return rows;
        } else { 
            const [rows] = await this.connection.execute(`SELECT 
            userid,
            full_name,
            user_gender,
            addr_state,
            birth_date,
            about_me,
            bio,
            user_image
             FROM user WHERE full_name LIKE "%${name}%";`);
            if (!rows) return null;
            return rows;
        }
     }

    //used by no one for now :)
    public async getAllUsers(): Promise<GetOneOutputDTO[] | null> {
        const [rows] = await this.connection.execute('SELECT userid, full_name, user_gender, addr_state, birth_date, about_me, bio, user_image from user;');
        if (!rows) return null;
        return rows;
    }

    //query all products from a USER ****TODO*****
    // query a user profile

    // used by user
    public async updateOneUser(email: string, produtor: Produtor): Promise<void> {
        const date = new Date();
        await this.connection.query(`UPDATE user SET
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
    }


    public async saveProduct(produto: Produto): Promise<void> {
        const date = new Date();
        console.log(produto.owner_id)
        const [rows] = await this.connection.query(`INSERT INTO product(product_id, product_name, product_image, product_description, owner_id, created_at) VALUES ("${produto.product_id}", "${produto.product_name}", "${produto.image}", "${produto.description}", "${produto.owner_id}","${new Date(date).toISOString().split('T')[0]}");`)
        console.log(rows);
    }

    public async deleteOneUser(id: string, email: string): Promise<void> {
        await this.connection.query(`DELETE FROM user WHERE userid="${id}" && email="${email}";`);
    }

    // SOLVE: if db had 100.000 thousands of products
    // how to: limit max number to 20
    // users request +20 then +20 then +20 then +20; 
    public async findManyProductsByName(name: string, queryDescriptionAlso: boolean): Promise<GetOneOutputDTO[] | null> {
        if (queryDescriptionAlso) {
            const [rows] = await this.connection.execute(`SELECT 
            product_id,
            product_name,
            product_image,
            product_description
            FROM product WHERE product_name LIKE "%${name}%" || product_description LIKE "%${name}%";`);
            if (!rows) return null;
            return rows;
        } else { 
            const [rows] = await this.connection.execute(`SELECT 
            product_id,
            product_name,
            product_image,
            product_description
            FROM product WHERE product_name LIKE "%${name}%";`);
            if (!rows) return null;
            return rows;
        }
     }
}


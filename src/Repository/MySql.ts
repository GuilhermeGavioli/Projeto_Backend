import Repository from "./Repository";
import Produtor from "../Entity/Produtor";
import Produto from "../Entity/Produto";


import mysql from 'mysql2';

export default class MySql implements Repository {
    private connection: mysql.Connection;
    
     constructor(host: string, user: string, database: string, password: string, port: number) {
        this.connection = mysql.createConnection({
            host,
            user,
            database,
            password,
            port
        })
        console.log("Succesfully connected to database")
    }



    public async saveUser(produtor: Produtor): Promise<void> {
        const date = new Date();
        //name, email, password, gender, city, birthDate
    
        this.connection.query(
            `INSERT INTO user (userid, full_name, email, user_password, user_gender, addr_state, birth_date, created_at) VALUES ( 
                "${produtor.id}", "${produtor.getName()}", "${produtor.getEmail()}", "${produtor.getPassword()}", "${produtor.gender}", "${produtor.city}", "${produtor.birthDate}", "${new Date(date).toISOString().split('T')[0]}")`, (err, results, fields) => {
                if (err) console.log('ERRORR from insert '+ err)
                console.log(results);
        });
    }

    public async getOneUser(email: string): Promise<any | null> {
        this.connection.query(
            `SELECT userid, full_name, email, user_image from user WHERE email="${email}";`, (err, results, fields) => {
                if (err) console.log('ERRORR from select ' + err)
                
                // const stringConverted = JSON.stringify(results);
                // const objectConverted = JSON.parse(stringConverted)[0];
              
                const a = JSON.parse(JSON.stringify(results))[0]; 
                return a;
        });
 
    }

    public async getAllUsers(): Promise<Produtor[] | null> {
        return null;
    }

    public async updateOneUser(email: string, produtor: Produtor): Promise<void> {
        return;
    }

    public async saveProduct(produto: Produto): Promise<void> {
        const date = new Date();
        this.connection.query(
            `INSERT INTO product (product_id, product_name, product_image, product_description, owner_id, created_at) VALUES ("${produto.product_id}", "${produto.product_name}", "${produto.image}", "${produto.description}", "${new Date(date).toISOString().split('T')[0]}");`, function (err, results, fields) {
            if (err) console.log('ERRORRRR from insert '+ err)
            console.log(results);
        });
     
    }
}



import Repository from "./Repository";
import Produtor from "../Entity/Produtor";
import Produto from "../Entity/Produto";

import GetOneOutputDTO from "../DTO/output/GetOneDTO";



import mysql from 'mysql2/promise';
import InputCriarProdutoDTO from "../DTO/input/CriarProdutoDTO";
import { IdGenerator, UUIDLibrary } from "../Services/IdGenerator";

import { notifyUser } from "..";

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

    public async findProductsFromUser(userid: string, number?: number): Promise<any | null> { 
        const [rows] = await this.connection.execute(`SELECT 
        product_id,
        product_name,
        product_image,
        product_description
        FROM product WHERE owner_id="${userid}"
        LIMIT ${50};`);
        if (!rows) return null;
        return rows;
    }


    public async saveUser(produtor: Produtor): Promise<void> {
        const date = new Date();
        await this.connection.query(
        `INSERT INTO user (userid, full_name, email, user_password, user_gender, addr_state, birth_date, created_at) VALUES ("${produtor.id}", "${produtor.getName()}", "${produtor.getEmail()}", "${produtor.getPassword()}", "${produtor.gender}", "${produtor.city}", "${produtor.birthDate}", "${new Date(date).toISOString().split('T')[0]}")`);
        await notifyUser(produtor.id, `Bem-Vindo, ${produtor.getName()}, sua conta na GoGreen foi criada com sucesso. Voce pode alterar suas informaçoes em seu <a href='/MeuPerfil' style='color: rgb(126, 176, 28)'>Perfil</a>`);
    }

    //used by the application
    public async findUserByEmail(email: string): Promise<GetOneOutputDTO | null> {
        const [[rows]] = await this.connection.execute(`SELECT * from user WHERE email="${email}";`);
        if (!rows) return null;
        return rows;
    }

    // used by user ***
    public async findUserById(id: string): Promise<GetOneOutputDTO | null> {
        const [[rows]] = await this.connection.execute(`SELECT * from user WHERE userid="${id}";`);
        if (!rows) return null;
        return rows;
    }

    public async findProductById(id: string): Promise<any | null> {
        // const [[rows]] = await this.connection.execute(`SELECT * from product WHERE product_id="${id}";`);
        const [[rows]] = await this.connection.execute(`
        SELECT product.*, user.userid, user.full_name, user.user_image, user.created_at from product
        INNER JOIN user
        ON product.owner_id=user.userid WHERE product_id="${id}";`);


        const [[rows2]] = await this.connection.execute(`SELECT AVG(rating_stars) from ratting WHERE product_id="${id}";`);
        console.log('avg ' + JSON.stringify(JSON.stringify(rows2)));

        

        // const [[rows]] = await this.connection.execute(`
        // SELECT (
        //     SELECT AVG(rating_stars) 
        //     FROM rattings
        //     WHERE WHERE product_id="${id}"
        // ) AS ratting_avg,
        // (
        //     SELECT * 
        //     FROM product 
        //     WHERE product_id="${id}"
        // ) AS product_info;
        // `);
        const all = {
            product: rows,
            rating: rows2,
        }
        if (!rows) return null;
        return all;
        // return rows;

        
    }

    //used by application / pages
    public async findProductByCategory(category: string, amount: number): Promise<any | null> {
        const [rows] = await this.connection.execute(`SELECT * from product WHERE category="${category}" ORDER BY RAND() LIMIT ${amount};`);
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
            created_at,
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
            created_at,
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
    

    // ratting_id VARCHAR(255) NOT NULL UNIQUE,
    // product_id  VARCHAR(255) NOT NULL,
    // user_id VARCHAR(255) NOT NULL,
    // rating_stars FLOAT NOT NULL,
    // comment VARCHAR(255),
    public async findRatting(p_id: string, user_id: string): Promise<any> { 
        const [[rows]] = await this.connection.execute(`
        SELECT * FROM ratting WHERE product_id="${p_id}" AND user_id="${user_id}";`)
        return rows;
    }
 
    public async findRattings(p_id: string, pack: number): Promise<any> { 
        const [rows] = await this.connection.execute(`SELECT ratting.ratting_id, ratting.product_id, ratting.user_id, ratting.rating_stars, ratting.comment, ratting.created_at, user.full_name, user.user_image FROM ratting INNER JOIN user ON ratting.user_id = user.userid WHERE ratting.product_id="${p_id}" ORDER BY ratting.created_at LIMIT 2 OFFSET ${pack};`)
        return rows;
    }

    public async deleteRatting(token_id: string, r_id: string): Promise<void> { 
        await this.connection.execute(`DELETE FROM ratting WHERE ratting_id="${r_id}" AND user_id="${token_id}";`)
    }

    // ratting_id VARCHAR(255) NOT NULL UNIQUE,
    // product_id  VARCHAR(255) NOT NULL,
    // user_id VARCHAR(255) NOT NULL,
    // rating_stars FLOAT NOT NULL,
    // comment VARCHAR(255),
    // created_at DATE NOT NULL,
    // updated_at DATE,
    public async createRatting(p_id: string, user_id: string, critic: string): Promise<void> { 
        const date = new Date();
        const id = Math.random().toString();
        const rating_stars = 1.5;
        await this.connection.execute(`INSERT INTO ratting (
            ratting_id,
            product_id,
            user_id,
            rating_stars,
            comment,
            created_at
        ) VALUES
        ("${id}", "${p_id}", "${user_id}", "${rating_stars}", "${critic}", "${new Date(date).toISOString().split('T')[0]}");`)

        await this.connection.execute(`UPDATE product SET product.average = (
            SELECT AVG(ratting.rating_stars) FROM ratting WHERE ratting.product_id = product.product_id
        );`)
    }
    //query all products from a USER ****TODO*****
    // query a user profile

    // used by user
    public async updateOneUser(email: string, produtor: Produtor): Promise<void> {
        const date = new Date();
        if (produtor.image) {
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
            await notifyUser(produtor.id, `Bem-Vindo, ${produtor.getName()}, sua conta na GoGreen foi criada com sucesso. Voce pode alterar suas informaçoes em seu <a href='/MeuPerfil' style='color: rgb(126, 176, 28)'>Perfil</a>`);
            return;
        }
        await this.connection.query(`UPDATE user SET
        userid="${produtor.id}",
        full_name="${produtor.getName()}",
        user_password="${produtor.getPassword()}", 
        user_gender="${produtor.gender}",
        addr_state="${produtor.city}",
        birth_date="${produtor.birthDate}", 
        about_me="${produtor.aboutMe}", 
        bio="${produtor.bio}", 
        updated_at="${new Date(date).toISOString().split('T')[0]}" WHERE email="${email}";`);
        await notifyUser(produtor.id, `Seus dados foram alterados com sucesso`);
    }

    public async saveProduct(produto: Produto): Promise<void> {
        console.log(produto)
        const date = new Date();
        await this.connection.query(`
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
        `)
        await notifyUser(produto.user_id, `Seu Produto <a href='/produto/${produto.p_id}'>${produto.p_name}</a> foi publicado com sucesso`);
    }

    public async deleteOneUser(id: string, email: string): Promise<void> {
        await this.connection.query(`DELETE FROM user WHERE userid="${id}" && email="${email}";`);
    }

    public async findManyProductsByName(name: string, category: string, queryDescriptionAlso: boolean, pack: number): Promise<GetOneOutputDTO[] | null> {
        const [rows] = await this.connection.execute(`SELECT *, (
                select COUNT(*)
                FROM product WHERE product_name LIKE "%${name}%" 
            ) AS total
            FROM product
            WHERE product_name LIKE "%${name}%" 
            LIMIT  12 OFFSET ${(pack - 1) * 11};`);
            if (!rows) return null;
            return rows;
        }
        
    public async findManyProductsByCategory(category: string, pack: number): Promise<GetOneOutputDTO[] | null> {
        const [rows] = await this.connection.execute(`SELECT *, (
            select COUNT(*)
            FROM product WHERE category="${category}" 
        ) AS total
        FROM product
        WHERE category="${category}"
        LIMIT  12 OFFSET ${(pack - 1) * 11};`);
        if (!rows) return null;
        return rows;

     }

    



    public async findCertainAmountOfRandomProducts(amount: Number): Promise<GetOneOutputDTO[] | null> {
        const [rows] = await this.connection.execute(`SELECT * FROM product  
        ORDER BY RAND()
        LIMIT ${amount}`);
        if (!rows) return null;
        return rows;
    }


    public async findOneOnCart(user_id: string, product_id: string): Promise<any | null> {
        const [[rows]] = await this.connection.execute(`SELECT 1 FROM cart WHERE owner_id="${user_id}" AND product_id="${product_id}";`)
        if (!rows) return null;
        return rows;
     }


    public async saveOnCart(user_id: string, product_id: string): Promise<any> {
        await this.connection.execute(`INSERT INTO cart (owner_id, product_id)
        VALUES ("${user_id}", "${product_id}");`);
        const [[rows]] = await this.connection.execute(
            `SELECT cart_id FROM cart WHERE owner_id="${user_id}" AND product_id="${product_id}";`
        )
        return rows;
    }

    public async getCartItemsFromUser(user_id: string): Promise<void | null> {
        const [rows] = await this.connection.execute(`
        SELECT cart.*, product.product_id, product.product_name, product.price, product.product_image FROM cart
        INNER JOIN product
        ON cart.product_id = product.product_id
        WHERE cart.owner_id="${user_id}";`);
        if (!rows) return null;
        return rows;
    }


    public async saveLike(user_id: string, product_id: string): Promise<any> {
        console.log(user_id)
        console.log(product_id)
        await this.connection.execute(`INSERT INTO product_like (owner_id, product_id)
        VALUES ("${user_id}", "${product_id}");`);
    }

    public async findOneLike(user_id: string, product_id: string): Promise<any | null> {
        const [[rows]] = await this.connection.execute(`SELECT 1 FROM product_like WHERE owner_id="${user_id}" AND product_id="${product_id}";`)
        if (!rows) return null;
        return rows;
     }

    public async getLikesFromUser(user_id: string): Promise<void | null> {
        const [rows] = await this.connection.execute(`
        SELECT * FROM product_like
        WHERE owner_id="${user_id}";`);
        if (!rows) return null;
        return rows;
    }

    public async deleteLike(user_id: string, like_id: string): Promise<void> {
        await this.connection.execute(`DELETE FROM product_like WHERE owner_id="${user_id}" AND like_id="${like_id}";`);
    }

    public async deleteFromCart(user_id: string, cart_item_id: string): Promise<void> {
        await this.connection.execute(`DELETE FROM cart WHERE cart.owner_id="${user_id}" AND cart_id="${cart_item_id}";`);
    }
    


    public async sendRobotMessage(id: string, receiver: string, message_text: string): Promise<void> {
        var date = new Date();
        date.setHours(date.getHours() - 3)
        const dateFormated = date.toISOString().slice(0, 19).replace('T', ' ');
        await this.connection.query(
            `INSERT INTO robot_message VALUES (${id}, false, false, "${message_text}", "${receiver}", true, "${dateFormated}")`
            );
    }
    
    public async updateRobotMessage(message_id: string, receiver: string): Promise<void> { 
        await this.connection.query(`UPDATE robot_message SET has_been_read_by_receiver=true WHERE receiver="${receiver}" AND message_id="${message_id}"; `)
    }
        
    public async saveMessage(sender: string, message_text: string, receiver: string): Promise<void> {
        var date = new Date();
        date.setHours(date.getHours() - 3)
        const dateFormated = date.toISOString().slice(0, 19).replace('T', ' ');
        console.log(dateFormated)
        await this.connection.query(
            `INSERT INTO message VALUES (
            "${new UUIDLibrary().generate()}",
            false,
            false,
            false,
            false,
            "${message_text}", "${sender}", "${receiver}", "${dateFormated}");`);
    }

    public async getMessages(receiver: string): Promise<any> {
        // const [rows] = await this.connection.query(
        //     `SELECT 
        //     message_id,
        //     message_text,
        //     user_image,
        //     userid,
        //     full_name,
        //     sender,
        //     receiver,
        //     message.created_at,
        //     has_been_read_by_sender,
        //     has_been_read_by_receiver,
        //     has_been_deleted_by_sender,
        //     has_been_deleted_by_receiver
        //     FROM message INNER JOIN user ON message.receiver = user.userid
        //     WHERE (message.sender="${userId}" AND has_been_deleted_by_sender=false) OR (message.receiver="${userId}" AND has_been_deleted_by_receiver=false) ORDER BY message.created_at DESC;`);
        
            
        const [rows] = await this.connection.query(
                    `SELECT *
                    FROM
                    robot_message
                    WHERE receiver="${receiver}"
                    ORDER BY created_at DESC;
                    `);
        return rows
        
        //     const [rows] = await this.connection.query(
        //         `SELECT 
        //         message_id,
        //         message_text,
        //         user_image,
        //         userid,
        //         full_name,
        //         sender,
        //         receiver,
        //         message.created_at,
        //         has_been_read_by_sender,
        //         has_been_read_by_receiver,
        //         has_been_deleted_by_sender,
        //         has_been_deleted_by_receiver
        //         FROM
        //         message
        //         INNER JOIN user ON message.receiver = user.userid
        //         WHERE (message.sender="${userId}" AND has_been_deleted_by_sender=false) 
        //         OR (message.receiver="${userId}" AND has_been_deleted_by_receiver=false)
        //         ORDER BY message.created_at DESC;
        //         `);
        
        //         const [rows2] = await this.connection.query(`SELECT * from robot_message WHERE robot_message.receiver="${userId}" ORDER BY created_at DESC;`)
    
        
        // const all = {
        //     from_users: rows,
        //     from_system: rows2,
        // }
        // return all;
    }

    

    public async deleteMessages(userId: string, messages_ids: string[]): Promise<void> {        
        for (let i = 0; i < messages_ids.length; i++) { 
        await this.connection.query(
            `UPDATE message 
            SET has_been_deleted_by_sender=true
            WHERE message_id="${messages_ids[i]}" AND sender="${userId}";`
        )
            
        await this.connection.query(
            `UPDATE message 
            SET has_been_deleted_by_receiver=true
            WHERE message_id="${messages_ids[i]}" AND receiver="${userId}";`
            )
            
           
        }
    }
}


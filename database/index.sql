CREATE TABLE gender(
    g_id INT NOT NULL UNIQUE,
    gender VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY(g_id)
);

INSERT INTO gender VALUES (1, "masculino"), (2, "feminino"), (3, "outro"); 

CREATE TABLE user(
    userid  VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_gender INT NOT NULL,
    addr_state VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    about_me TEXT,
    bio VARCHAR(255),
    user_image VARCHAR(255),
    phone_number VARCHAR(25) UNIQUE,
    created_at DATE NOT NULL,
    updated_at DATE,
    PRIMARY KEY(userid),
    FOREIGN KEY(user_gender) REFERENCES gender(g_id)
);


CREATE TABLE product(
    product_id  VARCHAR(255) NOT NULL UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(255) NOT NULL,
    product_description TEXT NOT NULL,
    is_organic BOOLEAN NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    unity VARCHAR(255) NOT NULL, 
    tags VARCHAR(255) NOT NULL,
    average FLOAT,
    category VARCHAR(255) NOT NULL, 
    owner_id VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE,
    PRIMARY KEY(product_id),
    FOREIGN KEY (owner_id) REFERENCES user(userid) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE message(
    message_id VARCHAR(255) NOT NULL UNIQUE,
    has_been_read_by_sender BOOLEAN NOT NULL,
    has_been_read_by_receiver BOOLEAN NOT NULL,
    has_been_deleted_by_sender BOOLEAN NOT NULL,
    has_been_deleted_by_receiver BOOLEAN NOT NULL,
    message_text VARCHAR(255) NOT NULL,
    sender VARCHAR(255) NOT NULL,
    receiver VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY(message_id),
    FOREIGN KEY (sender) REFERENCES user(userid) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (receiver) REFERENCES user(userid) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE robot_message(
    message_id VARCHAR(255) NOT NULL UNIQUE,
    has_been_read_by_receiver BOOLEAN NOT NULL,
    has_been_deleted_by_receiver BOOLEAN NOT NULL,
    message_text VARCHAR(255) NOT NULL,
    receiver VARCHAR(255) NOT NULL,
    robot_message VARCHAR(255) NOT NULL DEFAULT true,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (receiver) REFERENCES user(userid) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE ratting(
    ratting_id VARCHAR(255) NOT NULL UNIQUE,
    product_id  VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    rating_stars FLOAT NOT NULL,
    comment VARCHAR(255),
    created_at DATE NOT NULL,
    updated_at DATE,
    FOREIGN KEY (user_id) REFERENCES user(userid) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(ratting_id)
);


CREATE TABLE cart(
    cart_id INT NOT NULL AUTO_INCREMENT,
    owner_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES user(userid) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(cart_id)
);

CREATE TABLE product_like(
    like_id INT NOT NULL AUTO_INCREMENT,
    owner_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES user(userid) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(like_id)
);


 INSERT INTO user (
    userid,
    full_name,
    email,
    user_password,
    user_gender,
    addr_state,
    birth_date, 
    about_me, bio, 
    user_image, 
    phone_number, 
    created_at
) VALUES(
"default_user_c1df4vfd94c",
"Ana Campos Valle",
"anacampos.valle@gmail.com",
"12345default",
2,
"Brasil, (MG) Minas Gerais, Belo horizonte, Bairro São Joaquim", 
"1995-05-05",
"Olá, sou a Ana Campos Valle, sou um usuário ficticio na plataforma criado em 07/11/2022 com o objetivo de testar as funcionalidades do sistema além de ajudar a prencher dados na base de dados e servir de modelo para que usuários reais possam interagir com a plataforma. Gosto de trabalhar nas plantaçoes ou na criação de animais, trabalho em minha própria fazenda que adquiri em 2003, nela emprego alguns funcionários, entre eles, criadores, engenheiros de alimentos, trabalhadores e alguns operadores de maquinas, possuo alguma experiencia no meio",
"Atualmente sou aposentado e moro em outro estado, entretanto visito minha fazenda uma ou duas vezes por semana a fim de trazer melhorias pra ela.",
"default_farmer_1.jpg",
"(31) 94488-8545",
 "2022-11-07"
 );


  INSERT INTO user (
    userid,
    full_name,
    email,
    user_password,
    user_gender,
    addr_state,
    birth_date, 
    about_me, bio, 
    user_image, 
    phone_number, 
    created_at
) VALUES(
"default_user_vf44fd94c",
"Caio Correia Mattos",
"caiomattos474@gmail.com",
"12345default",
1,
"Brasil, (MG) Minas Gerais, Belo horizonte, Bairro São Joaquim", 
"1988-01-08",
"Olá, me chamo Caio Correia Mattos, sou um usuário ficticio na plataforma criado em 07/11/2022 com o objetivo de testar as funcionalidades do sistema além de ajudar a prencher dados na base de dados e servir de modelo para que usuários reais possam interagir com a plataforma. Gosto de trabalhar nas plantaçoes ou na criação de animais, trabalho em minha própria fazenda que adquiri em 2003, nela emprego alguns funcionários, entre eles, criadores, engenheiros de alimentos, trabalhadores e alguns operadores de maquinas, possuo alguma experiencia no meio",
"Atualmente sou aposentado e moro em outro estado, entretanto visito minha fazenda uma ou duas vezes por semana a fim de trazer melhorias pra ela.",
"default_farmer_2.jpg",
"(31) 98488-2222",
 "2022-11-07"
 );

   INSERT INTO user (
    userid,
    full_name,
    email,
    user_password,
    user_gender,
    addr_state,
    birth_date, 
    about_me, bio, 
    user_image, 
    phone_number, 
    created_at
) VALUES(
"default_user_vf44fdyh94c",
"Diego Correia Mattos",
"diegoCorreia144mattos@gmail.com",
"12345default",
1,
"Brasil, (MG) Minas Gerais, Belo horizonte, Bairro São Joaquim", 
"1995-05-05",
"Olá, me chamo Diego Correia Mattos, sou um usuário ficticio na plataforma criado em 07/11/2022 com o objetivo de testar as funcionalidades do sistema além de ajudar a prencher dados na base de dados e servir de modelo para que usuários reais possam interagir com a plataforma. Gosto de trabalhar nas plantaçoes ou na criação de animais, trabalho em minha própria fazenda que adquiri em 2003, nela emprego alguns funcionários, entre eles, criadores, engenheiros de alimentos, trabalhadores e alguns operadores de maquinas, possuo alguma experiencia no meio",
"Atualmente sou aposentado e moro em outro estado, entretanto visito minha fazenda uma ou duas vezes por semana a fim de trazer melhorias pra ela.",
"default_farmer_3.jpg",
"(31) 98488-2221",
 "2022-11-07"
 );


 INSERT INTO user (
    userid,
    full_name,
    email,
    user_password,
    user_gender,
    addr_state,
    birth_date, 
    about_me, bio, 
    user_image, 
    phone_number, 
    created_at
) VALUES(
"default_user_4chdgbcs94c",
"Gilberto Goellner",
"gilbertoGoellner@gmail.com",
"12345default",
1,
"Brasil, (MG) Minas Gerais, Belo horizonte, Bairro Cidade Nova", 
"1975-09-25",
"Me chamo Gilberto Goellner, sou um usuário ficticio na plataforma criado em 02/11/2022 com o objetivo de testar as funcionalidades do sistema além de ajudar a prencher dados na base de dados e servir de modelo para que usuários reais possam interagir com a plataforma. Gosto de trabalhar nas plantaçoes ou na criação de animais, trabalho em minha própria fazenda que adquiri em 2003, nela emprego alguns funcionários, entre eles, criadores, engenheiros de alimentos, trabalhadores e alguns operadores de maquinas, possuo alguma experiencia no meio",
"Atualmente sou aposentado e moro em outro estado, entretanto visito minha fazenda uma ou duas vezes por semana a fim de trazer melhorias pra ela.",
"default_farmer_4.jpg",
"(31)94588-8585",
 "2022-11-7"
 );



INSERT INTO user (
    userid,
    full_name,
    email,
    user_password,
    user_gender,
    addr_state,
    birth_date, 
    about_me, bio, 
    user_image, 
    phone_number, 
    created_at
) VALUES(
"default_user_vf44defd94c",
"Bruno Yamoto Azevedo",
"bruno.yamoto@gmail.com",
"12345default",
1,
"Brasil, (MG) Minas Gerais, Belo horizonte, Bairro São Joaquim", 
"1992-07-21",
"Olá, me chamo Bruno Yamoto Azevedo, sou um usuário ficticio na plataforma criado em 07/11/2022 com o objetivo de testar as funcionalidades do sistema além de ajudar a prencher dados na base de dados e servir de modelo para que usuários reais possam interagir com a plataforma. Gosto de trabalhar nas plantaçoes ou na criação de animais, trabalho em minha própria fazenda que adquiri em 2003, nela emprego alguns funcionários, entre eles, criadores, engenheiros de alimentos, trabalhadores e alguns operadores de maquinas, possuo alguma experiencia no meio",
"Atualmente sou aposentado e moro em outro estado, entretanto visito minha fazenda uma ou duas vezes por semana a fim de trazer melhorias pra ela.",
"default_farmer_5.jpeg",
"(31) 91058-3215",
 "2022-11-07"
 );

INSERT INTO user (
    userid,
    full_name,
    email,
    user_password,
    user_gender,
    addr_state,
    birth_date, 
    about_me, bio, 
    user_image, 
    phone_number, 
    created_at
) VALUES(
"default_user_bh478yujj4",
"Lilia Cardoso do Santos",
"liliacardoso21.yamoto@gmail.com",
"12345default",
2,
"Brasil, (MG) Minas Gerais, Belo horizonte, Bairro São Joaquim", 
"1989-04-11",
"Olá, me chamo Lilia Cardoso, sou um usuário ficticio na plataforma criado em 07/11/2022 com o objetivo de testar as funcionalidades do sistema além de ajudar a prencher dados na base de dados e servir de modelo para que usuários reais possam interagir com a plataforma. Gosto de trabalhar nas plantaçoes ou na criação de animais, trabalho em minha própria fazenda que adquiri em 2003, nela emprego alguns funcionários, entre eles, criadores, engenheiros de alimentos, trabalhadores e alguns operadores de maquinas, possuo alguma experiencia no meio",
"Atualmente sou aposentado e moro em outro estado, entretanto visito minha fazenda uma ou duas vezes por semana a fim de trazer melhorias pra ela.",
"default_user_1.jpeg",
"(31) 97333-3315",
 "2022-11-07"
 );


 INSERT INTO user (
    userid,
    full_name,
    email,
    user_password,
    user_gender,
    addr_state,
    birth_date, 
    about_me, bio, 
    user_image, 
    phone_number, 
    created_at
) VALUES(
"default_user_cdc18yujj4",
"Rafael Ribeiro",
"rafaelribe1ro24@hotmail.com",
"12345default",
1,
"Brasil, (MG) Minas Gerais, Belo horizonte, Bairro São Joaquim", 
"1996-02-22",
"Olá, me chamo Lilia Cardoso, sou um usuário ficticio na plataforma criado em 07/11/2022 com o objetivo de testar as funcionalidades do sistema além de ajudar a prencher dados na base de dados e servir de modelo para que usuários reais possam interagir com a plataforma. Gosto de trabalhar nas plantaçoes ou na criação de animais, trabalho em minha própria fazenda que adquiri em 2003, nela emprego alguns funcionários, entre eles, criadores, engenheiros de alimentos, trabalhadores e alguns operadores de maquinas, possuo alguma experiencia no meio",
"Atualmente sou aposentado e moro em outro estado, entretanto visito minha fazenda uma ou duas vezes por semana a fim de trazer melhorias pra ela.",
"default_user_2.jpeg",
"(31) 99224-1515",
 "2022-11-07"
 );





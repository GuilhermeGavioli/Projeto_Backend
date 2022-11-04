CREATE TABLE gender(
    g_id INT NOT NULL UNIQUE,
    gender VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY(g_id)
);

INSERT INTO gender VALUES (1, "masculino"), (2, "feminino"), (3, "outro"); /*new*/

-- CREATE TABLE addressState(
--     id INT NOT NULL UNIQUE AUTO_INCREMENT,
--     state_name VARCHAR(255) NOT NULL UNIQUE,
--     state_initials VARCHAR(255) NOT NULL UNIQUE,
--     PRIMARY KEY(id)
-- );

-- INSERT INTO addressState(state_name, state_initials) VALUES ( "Acre", "AC" ), (  "Alagoas", "AL" ), ( "Amapá", "AP"), ( "Amazonas", "AM" ), ( "Bahia", "BA" ), ( "Ceará", "CE" ), 
-- ( "Distrito Federal", "DF" ), ( "Espírito Santo", "ES"), ( "Goiás", "GO"), ( "Maranhão", "MA" ), ( "Mato Grosso", "MT" ), 
-- ( "Mato Grosso do Sul", "MS" ), ( "Minas Gerais", "MG"), ( "Pará", "PA" ), ( "Paraíba", "PB" ), ( "Paraná", "PR" ), 
-- ( "Pernambuco", "PE"), ( "Piauí", "PI" ), ( "Rio de Janeiro", "RJ" ), ( "Rio Grande do Norte", "RN"), 
-- ( "Rio Grande do Sul", "RS" ), ( "Rondônia", "RO" ), ( "Roraima", "RR" ), ( "Santa Catarina", "SC" ), 
-- ( "São Paulo", "SP" ), ( "Sergipe", "SE" ), ( "Tocantins", "TO" );


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
    phone_number VARCHAR(25), /*new*/
    created_at DATE NOT NULL,
    updated_at DATE,
    PRIMARY KEY(userid),
    -- FOREIGN KEY(addr_state) REFERENCES addressState(id),
    FOREIGN KEY(user_gender) REFERENCES gender(g_id)
);


CREATE TABLE product(
    product_id  VARCHAR(255) NOT NULL UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(255) NOT NULL,
    product_description TEXT NOT NULL,
    is_organic BOOLEAN NOT NULL, /*new*/
    is_organic BOOLEAN NOT NULL, /*new*/
    is_organic BOOLEAN NOT NULL, /*new*/
    is_organic BOOLEAN NOT NULL, /*new*/
    is_organic BOOLEAN NOT NULL, /*new*/
    owner_id VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE,
    PRIMARY KEY(product_id),
    FOREIGN KEY (owner_id) REFERENCES user(userid)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);



INSERT INTO user (
    userid,
    full_name,
    email,
    user_password,
    user_gender,
    addr_state, birth_date, about_me, bio, user_image, phone_number, created_at) 
VALUES(
"ad48c994a94c8sca",
"Gilberto Goellner",
"gilbertoGoellner@gmail.com",
"12345default",
1,
"Brasil, (MG) Minas Gerais, Belo horizonte, Bairro Cidade Nova", 
"1975-09-25",
"Me chamo Gilberto Goellner, sou um usuário ficticio na plataforma criado em 02/11/2022 com o objetivo de testar as funcionalidades do sistema além de ajudar a prencher dados na base de dados e servir de modelo para que usuários reais possam interagir com a plataforma. Gosto de trabalhar nas plantaçoes ou na criação de animais, trabalho em minha própria fazenda que adquiri em 2003, nela emprego alguns funcionários, entre eles, criadores, engenheiros de alimentos, trabalhadores e alguns operadores de maquinas, possuo alguma experiencia no meio",
"Atualmente sou aposentado e moro em outro estado, entretanto visito minha fazenda uma ou duas vezes por semana a fim de trazer melhorias pra ela.",
"1667417010488_Farmer-standing-in-field.jpg",
"(31) 96488-8545",
 "2022-11-02"
 );


 INSERT INTO product (
product_id, product_name, product_image, product_description, is_organic, owner_id, created_at
 ) VALUES (
    "apdscad4c9", "Cenouras Orgânicas", "1666628311241_baixados.jpg", 
    "Item plantado em terras limpas. O solo em que foram platandas nao ultiliza nenhum tipo de substância química para controle de pragas, etc... Portanto, o produto trata-se de um produto confiável, natural e orgânico. Foram cultivados 16kg do mesmo, que por sua vez, foram recentemente colhidos.", true, "ad48c994a94c8sca", "2022-11-02"
 );

  INSERT INTO product (
product_id, product_name, product_image, product_description, is_organic, owner_id, created_at
 ) VALUES (
    "aacaca4hsbttac", "Cenouras Orgânicas", "1666628311241_baixados.jpg", 
    "Item plantado em terras limpas. O solo em que foram platandas nao ultiliza nenhum tipo de substância química para controle de pragas, etc... Portanto, o produto trata-se de um produto confiável, natural e orgânico. Foram cultivados 16kg do mesmo, que por sua vez, foram recentemente colhidos.", true, "ad48c994a94c8sca", "2022-11-02"
 );
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
    category VARCHAR(255) NOT NULL, 
    owner_id VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE,
    PRIMARY KEY(product_id),
    FOREIGN KEY (owner_id) REFERENCES user(userid) ON UPDATE CASCADE ON DELETE CASCADE
);






  
CREATE TABLE gender{
    g_id CHAR(1) NOT NULL,
    gender VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY(g_id)
}

INSERT INTO gender VALUES ("1", "masculino"), ("2", "feminino");

CREATE TABLE addr_state{
    id INT NOT NULL UNIQUE AUTO_INCREMENT,
    state_name VARCHAR(255) NOT NULL UNIQUE,
    addr_state CHAR(2) NOT NULL UNIQUE,
    PRIMARY KEY(id)
}

INSERT INTO addr_state(addr_state) VALUES 
( "Acre", "AC" ), (  "Alagoas", "AL" ), ( "Amapá, AP"), ( "Amazonas", "AM" ), ( "Bahia", "BA" ), ( "Ceará", "CE" ), 
( "Distrito Federal", "DF" ), ( "Espírito Santo", "ES"), ( "Goiás", "GO"), ( "Maranhão", "MA" ), ( "Mato Grosso", "MT" ), 
( "Mato Grosso do Sul", "MS" ), ( "Minas Gerais", "MG"), ( "Pará", "PA" ), ( "Paraíba", "PB" ), ( "Paraná", "PR" ), 
( "Pernambuco", "PE"), ( "Piauí", "PI" ), ( "Rio de Janeiro", "RJ" ), ( "Rio Grande do Norte", "RN"), 
( "Rio Grande do Sul", "RS" ), ( "Rondônia", "RO" ), ( "Roraima", "RR" ), ( "Santa Catarina", "SC" ), 
( "São Paulo", "SP" ), ( "Sergipe", "SE" ), ( "Tocantins", "TO" );


CREATE TABLE user (
    userid  VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    gender CHAR(1) NOT NULL,
    addr_state INT NOT NULL UNIQUE,
    created_at DATE NOT NULL,
    updated_at DATE,
    PRIMARY KEY(userid),
    FOREIGN KEY(addr_state) REFERENCES addr_state(id)
    FOREIGN KEY(gender) REFERENCES gender(g_id)
);

CREATE TABLE product (
    p_id  VARCHAR(255) NOT NULL UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    userid VARCHAR(255) NOT NULL UNIQUE,
    created_at DATE NOT NULL,
    updated_at DATE,
    PRIMARY KEY(p_id),
    FOREIGN KEY (userid) REFERENCES user(userid)
);
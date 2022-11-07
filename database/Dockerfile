# Derivando da imagem oficial do MySQL
FROM mysql:5.7
# Adicionando os scripts SQL para serem executados na criação do banco
# COPY ./index.sql /docker-entrypoint-initdb.d/
COPY ./index.sql /docker-entrypoint-initdb.d/
COPY ./products.sql /docker-entrypoint-initdb.d/
# COPY ./queries_users.sql /docker-entrypoint-initdb.d/
# COPY ./queries_products.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
FROM mysql:5.7
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=testdb 
COPY ./db.sql /docker-entrypoint-initdb.d/db.sql
EXPOSE 3306

# pull official base image
FROM postgres:11.4-alpine

# run create.sql on init
ADD create.sql /docker-entrypoint-initdb.d

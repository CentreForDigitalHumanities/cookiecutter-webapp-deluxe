create user {{cookiecutter.database_user}} with createdb password '{{cookiecutter.database_password}}';
create database {{cookiecutter.database_name}};
grant all on database {{cookiecutter.database_name}} to {{cookiecutter.database_user}};
GRANT ALL ON SCHEMA public to {{cookiecutter.database_user}};

CREATE user {{cookiecutter.database_user}} WITH createdb PASSWORD '{{cookiecutter.database_password}}';
CREATE DATABASE {{cookiecutter.database_name}};
GRANT ALL ON DATABASE {{cookiecutter.database_name}} TO {{cookiecutter.database_user}};
GRANT ALL ON SCHEMA public TO {{cookiecutter.database_user}};

ALTER DATABASE {{cookiecutter.database_name}} OWNER TO {{cookiecutter.database_user}};

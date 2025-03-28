-- CREATE DATABASE demo;

-- CREATE ROLE new_user WITH LOGIN PASSWORD 'your_password';  --replace with your_password

-- ALTER DATABASE demo OWNER to new_user; --replace new_user with your own username

CREATE TABLE employees (
    id int PRIMARY KEY,
    data JSONB
);

INSERT INTO employees VALUES(101,'{
        "name": "Queen",
        "salary": 1500
}');
INSERT INTO employees VALUES(101,'{
        "name": "King",
        "salary": 2500
}');
INSERT INTO employees VALUES(103,'{
        "name": "Joker",
        "salary": 3500
}');

SELECT * from employees;
-- CREATE DATABASE demo;

-- CREATE ROLE new_user WITH LOGIN PASSWORD 'your_password';  --replace with your_password

-- ALTER DATABASE demo OWNER to new_user; --replace new_user with your own username

create table employees(
  emp_id INT,
  first_name text,
  last_name text,
  email text,
  phone_number numeric,
  hire_date date,
  salary float,
  manager_id INT,
  department_id text
);


INSERT INTO employees VALUES(100,'RAM','S','ram@mail.com','1234','2023-01-01',1000,0,90);
INSERT INTO employees VALUES(101,'KING','K','king@mail.com','1234','2023-01-01',2000,100,90);
INSERT INTO employees VALUES(102,'JOKER','A','joker@mail.com','1234','2023-01-01',1500,101,90);
INSERT INTO employees VALUES(103,'DINESH','B','dinesh@mail.com','1234','2023-01-01',2500,100,90);
INSERT INTO employees VALUES(104,'KUMAR','P','kumar@mail.com','4567','2023-05-01',5100,102,90);
INSERT INTO employees VALUES(105,'VIG','S','vig@mail.com','1234','2023-01-01',1000,0,80);
INSERT INTO employees VALUES(106,'ROBERT','K','robert@mail.com','1234','2024-01-01',1000,100,80);
INSERT INTO employees VALUES(107,'VIJAY','A','vijay@mail.com','1234','2025-01-01',110,101,70);
INSERT INTO employees VALUES(108,'ARJUN','B','arjun@mail.com','1234','2022-01-01',2100,100,70);
INSERT INTO employees VALUES(109,'JOHN','P','john@mail.com','4567','2021-05-01',3100,102,70);

SELECT * from employees;
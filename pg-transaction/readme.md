
#### Objective
---
The objective of this project to demonstrate Postgres database transaction management in Node JS using pg-promise library

#### Key features:
---
1. Create transaction per request (Eg. An api request) 
2. Provide support for transaction savepoints under a request using child transactions
3. Ensure the any database operation for the same request uses the same transaction or associated child transaction for the same using in-memory caching
4. Maintain the list of parent/child transactions created for a request in cache and clear/remove the transaction from cache when a transaction is completed (COMMIT/ROLLBACK)

#### Demo explained:
---
##### Components
* main.js - To execute the demo
* db.js - Creates the database connection object and exports the same. This object will be used to create transactions, execute queries
* pg-access-base.js - Exposes a class with methods to create, manage, cache database transactions
* employess-db-accessor.js - A data accessor class for the employees table. This class extends pg-access-base

##### Execution flow:
1. main.js will be initialised with db and a request context. Request context should be unique per request
2. main.js transactionDemo() will open a transaction T1. 
3. Peform a get query using T1. 
4. open T2 which is a child of T1. 
5. Perform a get query using T2. 
6. Then open T3 which is the child of T2.
7. Perfrom get query using T3
8. Perfom update query using T3
8. Exit T3
10. Perfrom update query using T2
11. Exit T2
12. Perform update query using T1
13. Exit T1

#### Variations:
1. Throwing error in any of the transaction() will roll back the transaction and it's child transactions


#### Pre-requisites:
---
    Node JS - latest version 
    Postgres - latest version

#### Steps:
---
1. Install Node JS
2. Install Postgres on the local machine
3. Git clone the repo
4. Run ```yarn install```
5. Open terminal. Run ```psql --u postgres``` to login as postgres user
6. Create database ```CREATE DATABASE demo;```
7. Create role ```CREATE ROLE new_user WITH LOGIN PASSWORD 'your_password';  --replace with your_password```
8. Alter database owner to the newly created user ```ALTER DATABASE demo OWNER to new_user; --replace new_user with your own username```
9. Please note that you have to use the same username and password in the connection string in db.js file
10. Run demo.sql file or execute the commands in the file to create table and insert records
11. Verify that the database, roles tables and data is created
12. Run the main.js file using the command ```node main.js```




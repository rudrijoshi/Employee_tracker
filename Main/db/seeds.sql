INSERT INTO department(name) 
VALUES ("Tech"),
       ("HR"),
       ("Finance"),
       ("Audit"), 
       ("Fraud");
INSERT INTO role(title, salary, department_id) VALUES('President', 300000.00, 1),
                                                    ('Director', 350000.00, 2),
                                                    ('Senior Manager', 135000.00, 3),
                                                    ('Manager', 111100.00, 4),
                                                    ('Employee', 80000.00, 5);






INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("John", "Smith", 3, 1),
("Robert", "Taylor", 2, 2),
("Selena", "Gomez", 1, 3),
("Zendaya", "Potter", 4, 4),
("Fred", "Brown", 5, 5);
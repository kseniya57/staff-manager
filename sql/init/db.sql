/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS staff;
USE staff;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email varchar(128) NOT NULL,
    password varchar(256) NULL,
    firstName varchar(64) NOT NULL,
    middleName varchar(64) NULL,
    lastName varchar(64) NULL,
    phone varchar(32) NULL,
    card varchar(32) NULL, -- номер карты
    experience int(11) NOT NULL DEFAULT 0, -- опыт работы (месяцев)
    level int(11) NOT NULL DEFAULT 0, -- уровень профессионализма
    avatar varchar(128) NULL,
    country varchar(3) NOT NULL DEFAULT 'ru',
    city varchar(32) NOT NULL DEFAULT 'Санкт-Петербург',
    isRemote tinyint(1) NOT NULL DEFAULT 0,
    bio text NULL,
    joinedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(64) NOT NULL,
    UNIQUE KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS users_roles; -- все права, что есть у роль будут у пользователя
CREATE TABLE users_roles (
    userId int(11) NOT NULL,
    roleId int(11) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (userId, roleId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS rights;
CREATE TABLE rights (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(64) NOT NULL,
    description varchar(128) NULL,
    UNIQUE KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS roles_rights;
CREATE TABLE roles_rights (
    roleId int(11) NOT NULL,
    rightId int(11) NOT NULL,
    FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (rightId) REFERENCES rights(id) ON DELETE CASCADE,
    PRIMARY KEY (roleId, rightId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS users_rights; -- пользователь может иметь собственые (дополнительные) права
CREATE TABLE users_rights (
    userId int(11) NOT NULL,
    rightId int(11) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (rightId) REFERENCES rights(id) ON DELETE CASCADE,
    PRIMARY KEY (userId, rightId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS positions;
CREATE TABLE positions (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(128) NOT NULL,
    minSalary int(11) NOT NULL DEFAULT 0,
    maxSalary int(11) NOT NULL DEFAULT 0,
    description text NULL,
    UNIQUE KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS payrolls;
CREATE TABLE payrolls (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    wageId int(11) NOT NULL,
    amount float(11, 2) NOT NULL,
    type enum('whiteSalary', 'blackSalary', 'bonus'),
    createdBy int(11) NOT NULL,
    month tinyint(2) NOT NULL,
    year int(4) NOT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE if EXISTS social_networks;
CREATE TABLE social_networks (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(32) NOT NULL,
    link varchar(128) NULL,
    image varchar(128) NULL,
    UNIQUE KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS users_social_networks;
CREATE TABLE users_social_networks (
    networkId int(11) NOT NULL,
    userId int(11) NOT NULL,
    nickname varchar(64) NOT NULL,
    PRIMARY KEY (networkId, userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(64) NOT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS skills;
CREATE TABLE skills (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(64) NOT NULL,
    UNIQUE KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS users_skills;
CREATE TABLE users_skills (
    skillId int(11) NOT NULL,
    userId int(11) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skillId) REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (skillId, userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS comments; -- reviews
CREATE TABLE comments (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    content text NOT NULL,
    userId int(11) NOT NULL,
    createdBy int(11) NOT NULL,
    rating tinyint(2) NOT NULL DEFAULT 0, -- 0...10
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS tags;
CREATE TABLE tags (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(32) NOT NULL,
    color varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS users_tags;
CREATE TABLE users_tags (
    tagId int(11) NOT NULL,
    userId int(11) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (tagId, userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS bonuses;
 CREATE TABLE bonuses (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(32) NOT NULL,
    description text NULL,
    amount float(11, 2) not null default 0,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS users_bonuses;
CREATE TABLE users_bonuses (
    bonusId int(11) NOT NULL,
    userId int(11) NOT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bonusId) REFERENCES bonuses(id) ON DELETE CASCADE,
    PRIMARY KEY (bonusId, userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS expenses;
CREATE TABLE expenses (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type varchar(32) NOT NULL, -- device, ticket ...
    amount float(11, 2) NOT NULL DEFAULT 0,
    description text NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS users_expenses;
CREATE TABLE users_expenses (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, -- it can be two or more the same expenses for one user
    expenseId int(11) NOT NULL,
    userId int(11) NOT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS wages;
CREATE TABLE wages (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    departmentId int(11) NOT NULL,
    positionId int(11) NOT NULL,
    userId int(11) NULL, -- if this field is null then we need a user for this position in this department
    blackSalary float(11, 2) NOT NULL DEFAULT 0,
    whiteSalary float(11, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE,
    FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE CASCADE,
    status enum('candidate', 'worker', 'fired') NOT NULL DEFAULT 'candidate'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO users SET id = 1, email = 'admin@gmail.com', firstName = 'Admin';
INSERT INTO roles SET id = 1, name = 'admin';
INSERT INTO users_roles SET roleId = 1, userId = 1;
INSERT INTO rights SET name = '*', description = 'Все включено';
INSERT INTO users_rights SET userId = 1, rightId = 1;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;



-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: it_asset_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pc_name` varchar(100) NOT NULL,
  `serial_no` varchar(100) DEFAULT NULL,
  `model_name` varchar(100) DEFAULT NULL,
  `asset_type` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `work_location` varchar(100) DEFAULT NULL,
  `ram` varchar(50) DEFAULT NULL,
  `storage` varchar(50) DEFAULT NULL,
  `os` varchar(50) DEFAULT NULL,
  `mac_address` varchar(50) DEFAULT NULL,
  `antivirus` varchar(50) DEFAULT NULL,
  `office_version` varchar(50) DEFAULT NULL,
  `other_software` text,
  `status` enum('Active','Repair','Scrapped','In-Store') DEFAULT 'In-Store',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `serial_no` (`serial_no`)
) ENGINE=InnoDB AUTO_INCREMENT=771 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (751,'LPT-FIN-001','SN-DELL-9901','Dell Latitude 5420','Laptop','Finance',NULL,'16GB','512GB SSD','Windows 11',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(752,'LPT-HR-002','SN-HP-8822','HP EliteBook 840 G8','Laptop','HR',NULL,'16GB','256GB SSD','Windows 10',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(753,'WS-ENG-001','SN-LENO-1102','ThinkStation P340','Workstation','Engineering',NULL,'32GB','1TB SSD','Windows 11 Pro',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(754,'LPT-IT-005','SN-AAPL-2233','MacBook Pro M1','Laptop','IT',NULL,'16GB','512GB SSD','macOS Sonoma',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(755,'DT-OPS-009','SN-DELL-4455','OptiPlex 7090','Desktop','Operations',NULL,'8GB','256GB SSD','Windows 10',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(756,'LPT-MKT-003','SN-ASUS-7788','Asus ZenBook 14','Laptop','Marketing',NULL,'16GB','512GB SSD','Windows 11',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(757,'WS-ENG-002','SN-HP-3344','Z2 Tower G5','Workstation','Engineering',NULL,'64GB','2TB SSD','Windows 11 Pro',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(758,'LPT-SAL-011','SN-LENO-6677','ThinkPad X1 Carbon','Laptop','Sales',NULL,'16GB','512GB SSD','Windows 11',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(759,'DT-SEC-001','SN-DELL-8899','OptiPlex 3080','Desktop','Security',NULL,'8GB','1TB HDD','Windows 10',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(760,'LPT-IT-006','SN-MSFT-1122','Surface Laptop 4','Laptop','IT',NULL,'16GB','256GB SSD','Windows 11',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(761,'WS-RD-001','SN-PREC-5566','Dell Precision 3650','Workstation','R&D',NULL,'128GB','2TB SSD','Windows 11 Pro',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(762,'LPT-ACC-004','SN-HP-9900','HP ProBook 450','Laptop','Accounts',NULL,'8GB','256GB SSD','Windows 10',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(763,'LPT-IT-007','SN-LENO-4433','Legion 5 Pro','Laptop','IT',NULL,'32GB','1TB SSD','Windows 11',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(764,'DT-LOG-001','SN-ACER-5544','Acer Veriton','Desktop','Logistics',NULL,'8GB','512GB SSD','Windows 10',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(765,'LPT-QA-001','SN-DELL-2211','Dell Vostro 3510','Laptop','Quality',NULL,'16GB','512GB SSD','Windows 11',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(766,'WS-DES-001','SN-AAPL-9988','Mac Studio','Workstation','Design',NULL,'64GB','1TB SSD','macOS Sonoma',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(767,'LPT-FIN-002','SN-HP-7766','HP Pavilion 15','Laptop','Finance',NULL,'12GB','512GB SSD','Windows 11',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(768,'DT-ADM-005','SN-LENO-1199','IdeaCentre 5','Desktop','Admin',NULL,'8GB','1TB HDD','Windows 10',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(769,'LPT-MKT-004','SN-DELL-6655','XPS 15','Laptop','Marketing',NULL,'32GB','1TB SSD','Windows 11',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39'),(770,'LPT-SAL-012','SN-AAPL-3322','MacBook Air M2','Laptop','Sales',NULL,'8GB','256GB SSD','macOS Sonoma',NULL,NULL,NULL,NULL,'Active',NULL,'2026-05-14 06:17:39','2026-05-14 06:17:39');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dept_name` (`dept_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (8,'Admin'),(4,'Engineering'),(3,'Finance'),(2,'HR'),(1,'IT'),(5,'Marketing'),(7,'Quality'),(6,'Sales');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_name` varchar(100) NOT NULL,
  `emp_id` varchar(50) NOT NULL,
  `dept_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `emp_id` (`emp_id`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Rahul Sharma','EMP101',1),(2,'Anjali Singh','EMP102',2),(3,'Amit Patel','EMP103',3),(4,'Priya Verma','EMP104',4),(5,'Sandeep Gupta','EMP105',5);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issuance_logs`
--

DROP TABLE IF EXISTS `issuance_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issuance_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `material_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `asset_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `issue_date` date DEFAULT NULL,
  `issuer_id` int DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `employee_id` int DEFAULT NULL,
  `manual_receiver_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `material_id` (`material_id`),
  KEY `user_id` (`user_id`),
  KEY `asset_id` (`asset_id`),
  KEY `issuer_id` (`issuer_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `issuance_logs_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`),
  CONSTRAINT `issuance_logs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `issuance_logs_ibfk_3` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`),
  CONSTRAINT `issuance_logs_ibfk_4` FOREIGN KEY (`issuer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `issuance_logs_ibfk_5` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issuance_logs`
--

LOCK TABLES `issuance_logs` WRITE;
/*!40000 ALTER TABLE `issuance_logs` DISABLE KEYS */;
INSERT INTO `issuance_logs` VALUES (1,10,NULL,NULL,3,'2026-05-14',3,'Admin','old cable kharab','2026-05-14 08:35:48',NULL,'lihance'),(2,6,NULL,NULL,4,'2026-05-14',3,'Marketing','purano ram kharab','2026-05-14 08:37:51',5,NULL);
/*!40000 ALTER TABLE `issuance_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `material_name` varchar(100) NOT NULL,
  `total_quantity` int DEFAULT '0',
  `available_quantity` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES (3,'Dell USB Keyboard',50,50,'2026-05-14 06:15:06'),(4,'Logitech Wireless Mouse',40,40,'2026-05-14 06:15:06'),(5,'HDMI Cable (1.5m)',100,100,'2026-05-14 06:15:06'),(6,'DDR4 8GB RAM (Crucial)',30,26,'2026-05-14 06:15:06'),(7,'Kingston 240GB SSD',25,25,'2026-05-14 06:15:06'),(8,'Power Cable (Desktop)',60,60,'2026-05-14 06:15:06'),(9,'DisplayPort to HDMI Adapter',20,20,'2026-05-14 06:15:06'),(10,'Cat6 LAN Cable (3m)',80,77,'2026-05-14 06:15:06'),(11,'USB-C Docking Station',15,15,'2026-05-14 06:15:06'),(12,'Laptop Charger (65W)',70,53,'2026-05-14 06:15:06'),(13,'RAM DDR 4',50,50,'2026-05-14 06:21:20');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Manager','User') DEFAULT 'User',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'admin','admin@tasl.aero','$2b$10$yxlgI7Rkieu/kdLsrDrx3eanb3GbqEJuciYj6XYWm7iSg2KUiaXcS','Admin','2026-05-13 19:32:06'),(3,'lihance','lihancebopche4@gmail.com','$2b$10$ocz6IUR4QpjUIJwByXvUYe8JtdMCSeWwpTNPylwgo81Zpvv78cReS','Admin','2026-05-13 19:36:53'),(4,'lihancebopche','lihancebopche@gmail.com','$2b$10$UdnlxR/aEHN1479uTt9WCOUK7UgzlgtQpzsybVFgyjkdBH7t4e/A2','Manager','2026-05-13 19:49:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-14 23:33:11

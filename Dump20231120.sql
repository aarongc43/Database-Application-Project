-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: project
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `Category_ID` int NOT NULL AUTO_INCREMENT,
  `Cat_Name` char(45) NOT NULL,
  `Vendor_ID` int NOT NULL,
  PRIMARY KEY (`Category_ID`),
  KEY `Vendor_idx` (`Vendor_ID`),
  CONSTRAINT `Vendor` FOREIGN KEY (`Vendor_ID`) REFERENCES `vendors` (`Vendor_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Food',1),(2,'Junk',1),(3,'Gear',2),(4,'Drink',2),(5,'Tech',3),(6,'Tool',3),(7,'Book',4),(8,'Class',4),(9,'Stuff',1),(10,'newcategoryname',5);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `Customer_ID` int NOT NULL AUTO_INCREMENT,
  `First_Name` char(20) NOT NULL,
  `Last_Name` char(20) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` int NOT NULL,
  PRIMARY KEY (`Customer_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Eric','Kirchner','me@you.com',123456),(2,'Jacob','Stump','jstu@email.com',112233),(3,'Aaron','Castillo','acas@email.com',445566),(4,'Marcus','Aurelius','ceasar@rome.com',134679),(5,'Jon','Smith','ee',123),(11,'Wee','Boo','yeye',35646),(18,'Jason','Bourne','hitman@ky.com',798789),(22,'John','Wick','doglover@beast.com',777444);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `Employee_ID` int NOT NULL,
  `FirstName` char(20) NOT NULL,
  `LastName` char(20) NOT NULL,
  PRIMARY KEY (`Employee_ID`),
  UNIQUE KEY `Employee_ID_UNIQUE` (`Employee_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'Eric','Kirchner'),(2,'Aaron','Castillo'),(3,'Jacob','Stump'),(4,'Ada','Lovelace'),(20,'Test','Testy'),(21,'Jon','Doe'),(22,'Tesy','Hashy');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logincreds`
--

DROP TABLE IF EXISTS `logincreds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logincreds` (
  `Username` varchar(20) NOT NULL,
  `HashPass` varchar(224) NOT NULL,
  `Salt` varchar(64) NOT NULL,
  `Employee_ID` int NOT NULL,
  PRIMARY KEY (`Username`),
  KEY `Employee_idx` (`Employee_ID`),
  CONSTRAINT `Employee` FOREIGN KEY (`Employee_ID`) REFERENCES `employee` (`Employee_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logincreds`
--

LOCK TABLES `logincreds` WRITE;
/*!40000 ALTER TABLE `logincreds` DISABLE KEYS */;
INSERT INTO `logincreds` VALUES ('mctesty','850f6e4509f50264942813524a998d6a328b8316489fd8802bcb7eaa','54cfcd7821f2e88b2a8d910e530f25a0e05c15af83dcd9e4c681a6fcea95e7b9',20);
/*!40000 ALTER TABLE `logincreds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetails`
--

DROP TABLE IF EXISTS `orderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetails` (
  `Order_ID` int NOT NULL,
  `Product_ID` int NOT NULL,
  `Quantity` int NOT NULL,
  PRIMARY KEY (`Order_ID`,`Product_ID`),
  KEY `Order_idx` (`Order_ID`),
  KEY `Product_idx` (`Product_ID`),
  CONSTRAINT `Order` FOREIGN KEY (`Order_ID`) REFERENCES `orders` (`Order_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Product` FOREIGN KEY (`Product_ID`) REFERENCES `products` (`Product_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES `orderdetails` WRITE;
/*!40000 ALTER TABLE `orderdetails` DISABLE KEYS */;
INSERT INTO `orderdetails` VALUES (1,4,1),(2,4,1),(5,2,1),(6,2,1),(7,25,1),(12,1,2),(12,8,2),(12,10,6),(13,2,3),(13,9,3),(13,20,1),(14,4,2),(14,19,2),(15,11,3),(16,4,2),(16,13,4),(17,19,9);
/*!40000 ALTER TABLE `orderdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `Order_ID` int NOT NULL AUTO_INCREMENT,
  `Date` varchar(20) NOT NULL,
  `TotalAmount` float NOT NULL,
  `Customer_ID` int NOT NULL,
  PRIMARY KEY (`Order_ID`),
  KEY `Customer_idx` (`Customer_ID`),
  CONSTRAINT `Customer` FOREIGN KEY (`Customer_ID`) REFERENCES `customers` (`Customer_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'10/2',101,1),(2,'10/3',10,2),(5,'5/5',32,5),(6,'4/5',15,11),(7,'4/20',69,1),(12,'6/12',88,18),(13,'12/12',555,2),(14,'10/17',35,2),(15,'11/5',45,3),(16,'2/4',37,1),(17,'9/20',357,3);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `Product_Id` int NOT NULL AUTO_INCREMENT,
  `Category_ID` int NOT NULL,
  `Prod_Name` varchar(45) NOT NULL,
  `Prod_Price` float NOT NULL,
  `Prod_Qty` int NOT NULL,
  `Prod_Desc` varchar(255) NOT NULL,
  PRIMARY KEY (`Product_Id`),
  KEY `Category_idx` (`Category_ID`),
  CONSTRAINT `Category` FOREIGN KEY (`Category_ID`) REFERENCES `categories` (`Category_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,3,'Head',4.2,69,'Ass'),(2,3,'Shoes',60,5,'Feety wraps'),(3,7,'Math',65,55,'Numbers headache'),(4,1,'Vitamin',30,20,'Supplements'),(8,1,'Lentils',10,10,'More supps'),(9,6,'new product',10,10,'desc'),(10,5,'usb',15,55,'flash drive'),(11,6,'wrench',40,12,'thing'),(12,6,'crimps',25,4,'crimpers'),(13,6,'scanner',88,62,'network scanner'),(14,2,'thingy',1000,2,'stuff'),(15,2,'left sock',212,1,'missing left sock'),(16,4,'haterade',16,555,'mmm so good'),(17,4,'NTSC',4311,1,'dog water'),(18,5,'monitor',89,6,'pretty pictures'),(19,7,'Paradoxes',0,0,'>_<;'),(20,8,'Socratic Method',9,5,'all the questions'),(21,9,'IT',79797,500,'ALL THE THINGS'),(22,10,'help ticket',80,0,'no'),(25,10,'panic',69,1,'fire'),(26,6,'New toy',50,100,'Shiny'),(56,2,'what',10,10,'yes'),(57,2,'hiuodhifvkjsb',10,10,'yes');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors` (
  `Vendor_ID` int NOT NULL AUTO_INCREMENT,
  `Vendor_Name` varchar(20) NOT NULL,
  PRIMARY KEY (`Vendor_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,'Eric'),(2,'Jacob'),(3,'Aaron'),(4,'Socrates'),(5,'newvendorname'),(22,'procedure');
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-20 23:45:57

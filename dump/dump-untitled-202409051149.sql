-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: untitled
-- ------------------------------------------------------
-- Server version	11.4.2-MariaDB

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
-- Table structure for table `lecture`
--

DROP TABLE IF EXISTS `lecture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecture` (
  `id` int(11) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `lecture_name` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `teacher_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecture`
--

LOCK TABLES `lecture` WRITE;
/*!40000 ALTER TABLE `lecture` DISABLE KEYS */;
INSERT INTO `lecture` VALUES (1,'2024-06-17 16:28:00.000000','https://ifh.cc/g/NgjAgo.jpg','https://ifh.cc/g/Ft4a38.jpg','#네일 #달콤한무드 #🍫','UNTITLED Valentine Nail',3,'https://videos.pexels.com/video-files/3997787/3997787-uhd_2732_1440_25fps.mp4',4),(2,'2024-06-17 16:29:00.000000','https://ifh.cc/g/TzGqGT.jpg','https://ifh.cc/g/YTWdzN.jpg','#네일 #기초 #💅🏻','UNTITLED Nail Art 1',3,'https://videos.pexels.com/video-files/3997787/3997787-uhd_2732_1440_25fps.mp4',4),(3,'2024-06-17 16:44:00.000000','https://ifh.cc/g/g2vXyL.jpg','https://ifh.cc/g/VhXXnL.jpg','#네일 #심화 #💅🏻','UNTITLED Nail Art 2',3,'https://videos.pexels.com/video-files/3997787/3997787-uhd_2732_1440_25fps.mp4',4),(4,'2024-06-17 16:45:00.000000','','','#눈화장 #기초 #👀','UNTITLED Eye Shadow 1',3,'https://videos.pexels.com/video-files/3181732/3181732-uhd_2560_1440_25fps.mp4',5),(5,'2024-06-18 16:45:00.000000','','','#눈화장 #심화 #👀','UNTITLED Eye Shadow 2',3,'https://videos.pexels.com/video-files/3181732/3181732-uhd_2560_1440_25fps.mp4',5),(6,'2024-06-19 16:45:00.000000','','','#쉐딩 # 기초 #🖌️','UNTITLED Shading 1',3,'https://videos.pexels.com/video-files/3181793/3181793-uhd_2560_1440_25fps.mp4',5),(7,'2024-06-20 16:45:00.000000','','','#쉐딩 #중급 #🖌️','UNTITLED Shading 2',3,'https://videos.pexels.com/video-files/3181793/3181793-uhd_2560_1440_25fps.mp4',5),(8,'2024-06-21 16:45:00.000000','','','#쉐딩 #심화 #🖌️','UNTITLED Shading 3',3,'https://videos.pexels.com/video-files/3181793/3181793-uhd_2560_1440_25fps.mp4',5),(9,'2024-06-22 16:45:00.000000','https://ifh.cc/g/VAwJK1.png','https://ifh.cc/g/BH3NFh.jpg','#메이크업 #올인원 #🥰','UNTITLED Make Up Detail ',3,'https://videos.pexels.com/video-files/4620941/4620941-uhd_2732_1440_25fps.mp4',3);
/*!40000 ALTER TABLE `lecture` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-05 11:49:32

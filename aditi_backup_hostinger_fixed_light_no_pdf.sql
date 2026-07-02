-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: aditi
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_admin_users_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES (1,'admin@aditi.in','$2y$10$kBY2.YHn3nT52Db1hnWZ2OKTkWQ8Lqtz5ow6kbQ6wM0CF8JChyHeW','ADITI Admin',1,'2026-07-01 09:51:49','2026-06-25 16:06:10','2026-07-01 04:21:49');
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `clerk_user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_completed_at` datetime DEFAULT NULL,
  `last_sign_in_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clerk_user_id` (`clerk_user_id`),
  KEY `idx_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'user_3FlcQY2DUzEvTV2qxpV4Et5C4Tx','ankitcodes6933@gmail.com','1010101010','2026-06-24','Ankit Shaw','https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zRmxjUVdXSEpUZFVjdzA2b1c0MVpmVm54QzcifQ','2026-06-30 19:30:29','2026-07-01 11:04:25','2026-06-30 13:59:19','2026-07-01 05:34:25'),(20,'user_3Fld3efeSpo5W8OJVOjNpiQlKHO','ankitshaw6933@gmail.com','989898989','2026-06-24','Ankit Shaw','https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zRTJoZTZIaXA3eURIZ3FSaW1UU2dHa29DUFMiLCJyaWQiOiJ1c2VyXzNGbGQzZWZlU3BvNVc4T0pWT2pOcGlRbEtITyIsImluaXRpYWxzIjoiQVMifQ','2026-06-30 19:45:39','2026-07-01 10:28:51','2026-06-30 14:15:19','2026-07-01 04:58:51');
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

-- Dump completed on 2026-07-01 11:28:11
-- Table structure for table `magazines`
--

DROP TABLE IF EXISTS `magazines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `magazines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sku` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_paise` int unsigned NOT NULL DEFAULT '35000',
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INR',
  `pdf_path` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `pdf_file` longblob,
  `pdf_filename` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdf_mime_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'application/pdf',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `magazines`
--

LOCK TABLES `magazines` WRITE;
/*!40000 ALTER TABLE `magazines` DISABLE KEYS */;
INSERT INTO `magazines` VALUES (1,'ADITI-MAG-V1-I1','aditi-strategy-defence-volume-1-issue-1','ADITI Strategy & Defence Magazine - Volume 1, Issue 1 (Inaugural Issue): Cognitive Dissonance in Indian Strategy',35000,'INR',NULL,1,'2026-06-27 07:01:59','2026-07-01 04:57:43',NULL,'ADITI-Strategy-Defence-Magazine-Volume-1-Issue-1.pdf','application/pdf');
/*!40000 ALTER TABLE `magazines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_sessions`
--

DROP TABLE IF EXISTS `admin_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `admin_user_id` bigint unsigned NOT NULL,
  `token_hash` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `last_used_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_hash` (`token_hash`),
  KEY `fk_admin_sessions_admin_user_id` (`admin_user_id`),
  KEY `idx_admin_sessions_expires_at` (`expires_at`),
  CONSTRAINT `fk_admin_sessions_admin_user_id` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_sessions`
--

LOCK TABLES `admin_sessions` WRITE;
/*!40000 ALTER TABLE `admin_sessions` DISABLE KEYS */;
INSERT INTO `admin_sessions` VALUES (1,1,'5f11a620b5e5ba1d007bc172791057a07c83d93c823311eba738e3d772ba751a','2026-06-26 16:16:03','2026-06-25 21:46:03','2026-06-25 16:16:03'),(2,1,'6b752b49b30279a0b3575d0a53fd446aaf1a0bcd9b8b3bca7fc31e4785213a75','2026-06-26 16:21:12','2026-06-25 21:51:12','2026-06-25 16:21:12'),(3,1,'093b519920315630ef0c70aeeb7924cad74336cf21f0a28d506a040be9883e97','2026-06-26 16:21:57','2026-06-25 21:51:57','2026-06-25 16:21:57'),(4,1,'57af4cb927570c32ac71901a5adcf81d4fa1ce03f8eec926b307c90f2df264c4','2026-06-26 16:24:45','2026-06-25 22:18:38','2026-06-25 16:24:45'),(5,1,'2d9e2566d70df0bf11007214b59e060b727ff3eff1567b89a8d1469014ee2607','2026-06-27 08:08:01','2026-06-26 13:38:01','2026-06-26 08:08:01'),(6,1,'e95c6e73a1e89f31e5fc416aff9772f820fa774f05798e9646a5519cf50bfd13','2026-06-27 08:08:48','2026-06-26 13:39:05','2026-06-26 08:08:48'),(8,1,'f2494427c85879c6ad9bc6f24496d4a70adfb6427532a5fbb00022d62dfa8e0d','2026-06-27 08:12:14','2026-06-26 13:48:07','2026-06-26 08:12:14'),(9,1,'d1840ae0776b1bf2789e660450869f4a9946ca77264948e01f2c78a16e5ab756','2026-06-27 08:18:56','2026-06-26 13:59:14','2026-06-26 08:18:56'),(11,1,'967a3cf58f1b911945610e8fbe8955cd4c68d6c38f0cd79b31b1512ef91a081c','2026-06-29 05:46:19','2026-06-28 11:16:19','2026-06-28 05:46:19'),(12,1,'901790e2bf9fce221107615bf57fdeceb7b6d080141aacad9629dabbbdda58d8','2026-06-29 09:58:55','2026-06-28 15:28:55','2026-06-28 09:58:55'),(14,1,'39a206739b02e7733fd220d0d37c925bf5ec9ffeecb39008c5ba39dac8a449d7','2026-06-29 13:22:36','2026-06-28 18:52:50','2026-06-28 13:22:36'),(15,1,'1e61753b970800827650e3b3869970ad880a5aed973ab7f4cd4c0f50f0d95e3a','2026-06-29 13:25:28','2026-06-28 18:55:57','2026-06-28 13:25:28'),(16,1,'639362f7be84095e23b9cc9cea5d81358cc22272fc3093679987da5708f7faac','2026-07-01 13:59:48','2026-06-30 19:30:00','2026-06-30 13:59:48'),(17,1,'8c4f583676fd91c27ea7c7a98e2ab5f7e8fa4e4539d0a4bb3f1e056ff9e85739','2026-07-02 04:21:49','2026-07-01 10:33:35','2026-07-01 04:21:49');
/*!40000 ALTER TABLE `admin_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_events`
--

DROP TABLE IF EXISTS `payment_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `razorpay_order_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_payment_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_type` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload_json` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payment_events_user_id` (`user_id`),
  KEY `idx_payment_events_razorpay_order_id` (`razorpay_order_id`),
  KEY `idx_payment_events_status` (`status`),
  CONSTRAINT `fk_payment_events_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_events`
--

LOCK TABLES `payment_events` WRITE;
/*!40000 ALTER TABLE `payment_events` DISABLE KEYS */;
INSERT INTO `payment_events` VALUES (1,20,'order_T7w99C8Q9vAtuZ','pay_T7w9cugBaJGY5J','email','receipt_email','disabled','Receipt email was generated but MAIL_ENABLED is false.',NULL,'2026-07-01 04:59:02'),(2,NULL,'order_T7w99C8Q9vAtuZ','pay_T7w9cugBaJGY5J','admin','manual_recovery','paid','Admin recovery matched local order.','{\"status\":\"paid\",\"payment_id\":\"pay_T7w9cugBaJGY5J\",\"order_status\":\"paid\"}','2026-07-01 04:59:02'),(3,20,'order_T7s8gcVFqgDpMv','pay_T7s9eTOHc7eoOe','email','receipt_email','disabled','Receipt email was generated but MAIL_ENABLED is false.',NULL,'2026-07-01 04:59:46'),(4,NULL,'order_T7s8gcVFqgDpMv','pay_T7s9eTOHc7eoOe','admin','manual_recovery','paid','Admin recovery matched local order.','{\"status\":\"paid\",\"payment_id\":\"pay_T7s9eTOHc7eoOe\",\"order_status\":\"paid\"}','2026-07-01 04:59:46'),(5,1,'order_T7rsoiytbTPScD','pay_T7rtNLjzH1IwFP','email','receipt_email','disabled','Receipt email was generated but MAIL_ENABLED is false.',NULL,'2026-07-01 04:59:49'),(6,NULL,'order_T7rsoiytbTPScD','pay_T7rtNLjzH1IwFP','admin','manual_recovery','paid','Admin recovery matched local order.','{\"status\":\"paid\",\"payment_id\":\"pay_T7rtNLjzH1IwFP\",\"order_status\":\"paid\"}','2026-07-01 04:59:49'),(7,1,'order_T87IK0ehVGhbl6',NULL,'checkout','order_created','pending','Razorpay order created and pending purchases saved.','{\"amount_paise\":35000,\"currency\":\"INR\"}','2026-07-01 05:05:20');
/*!40000 ALTER TABLE `payment_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipts`
--

DROP TABLE IF EXISTS `receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receipts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `razorpay_order_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `razorpay_payment_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt_number` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount_paise` int unsigned NOT NULL DEFAULT '0',
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INR',
  `payment_method` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_status` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchase_date` datetime DEFAULT NULL,
  `email_to` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_sent_at` datetime DEFAULT NULL,
  `email_last_error` text COLLATE utf8mb4_unicode_ci,
  `receipt_html` mediumtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_receipts_razorpay_order_id` (`razorpay_order_id`),
  UNIQUE KEY `uq_receipts_receipt_number` (`receipt_number`),
  KEY `idx_receipts_user_id` (`user_id`),
  KEY `idx_receipts_email_sent_at` (`email_sent_at`),
  CONSTRAINT `fk_receipts_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipts`
--

LOCK TABLES `receipts` WRITE;
/*!40000 ALTER TABLE `receipts` DISABLE KEYS */;
INSERT INTO `receipts` VALUES (1,20,'order_T7w99C8Q9vAtuZ','pay_T7w9cugBaJGY5J','ADITI-RCPT-9C8Q9VATUZ',35000,'INR','Razorpay','Paid','Completed','2026-06-30 23:41:47','ankitshaw6933@gmail.com',NULL,NULL,'<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>ADITI-RCPT-9C8Q9VATUZ</title>\n    <style>\n      @media only screen and (max-width: 640px) {\n        .shell {\n          width: 100% !important;\n        }\n\n        .card {\n          padding: 24px !important;\n        }\n\n        .two-col {\n          display: block !important;\n        }\n\n        .two-col td {\n          display: block !important;\n          width: 100% !important;\n          padding-right: 0 !important;\n          padding-bottom: 18px !important;\n        }\n\n        .title {\n          font-size: 30px !important;\n        }\n\n        .cta {\n          display: block !important;\n          text-align: center !important;\n        }\n      }\n    </style>\n  </head>\n  <body style=\"margin:0;background:#eef1f5;font-family:Arial,Helvetica,sans-serif;color:#111827;\">\n    <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"background:#eef1f5;padding:28px 12px;\">\n      <tr>\n        <td align=\"center\">\n          <table role=\"presentation\" class=\"shell\" width=\"640\" cellspacing=\"0\" cellpadding=\"0\" style=\"width:640px;max-width:100%;\">\n            <tr>\n              <td style=\"background:#0b1320;border-radius:18px 18px 0 0;padding:30px 34px;border-bottom:4px solid #c99a4a;\">\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n                  <tr>\n                    <td>\n                      <div style=\"font-size:13px;letter-spacing:8px;color:#f9fafb;font-weight:700;\">ADITI</div>\n                      <div style=\"margin-top:8px;font-size:13px;color:#c99a4a;letter-spacing:2px;text-transform:uppercase;\">Strategy & Defence Magazine</div>\n                    </td>\n                    <td align=\"right\" style=\"font-size:12px;color:#e5e7eb;\">\n                      Receipt<br>\n                      <strong style=\"color:#ffffff;\">ADITI-RCPT-9C8Q9VATUZ</strong>\n                    </td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n\n            <tr>\n              <td class=\"card\" style=\"background:#ffffff;padding:34px;border-radius:0 0 18px 18px;box-shadow:0 18px 44px rgba(15,23,42,0.12);\">\n                <h1 class=\"title\" style=\"margin:0;font-size:38px;line-height:1.05;color:#111827;letter-spacing:0.02em;\">Payment received</h1>\n                <p style=\"margin:12px 0 0;font-size:15px;line-height:1.7;color:#4b5563;\">\n                  Thank you, Ankit Shaw. Your ADITI magazine purchase has been confirmed.\n                </p>\n\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"two-col\" style=\"margin-top:30px;\">\n                  <tr>\n                    <td width=\"50%\" valign=\"top\" style=\"padding-right:18px;\">\n                      <div style=\"font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c99a4a;font-weight:700;\">Billed To</div>\n                      <div style=\"margin-top:10px;font-size:15px;line-height:1.7;color:#111827;\">\n                        <strong>Ankit Shaw</strong><br>\n                        ankitshaw6933@gmail.com<br>\n                        989898989\n                      </div>\n                    </td>\n                    <td width=\"50%\" valign=\"top\">\n                      <div style=\"font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c99a4a;font-weight:700;\">Payment</div>\n                      <div style=\"margin-top:10px;font-size:15px;line-height:1.7;color:#111827;\">\n                        Method: <strong>Razorpay</strong><br>\n                        Date: <strong>30 Jun 2026, 11:41 PM</strong><br>\n                        Payment Status: <strong>Paid</strong><br>\n                        Order Status: <strong>Completed</strong>\n                      </div>\n                    </td>\n                  </tr>\n                </table>\n\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-top:30px;border-collapse:collapse;\">\n                  <tr>\n                    <td style=\"padding:12px 0;border-bottom:1px solid #d1d5db;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#111827;font-weight:700;\">Description</td>\n                    <td align=\"center\" style=\"padding:12px 0;border-bottom:1px solid #d1d5db;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#111827;font-weight:700;\">Qty</td>\n                    <td align=\"right\" style=\"padding:12px 0;border-bottom:1px solid #d1d5db;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#111827;font-weight:700;\">Amount</td>\n                  </tr>\n                  <tr>\n                    <td style=\"padding:18px 0;border-bottom:1px solid #e5e7eb;font-size:15px;line-height:1.6;color:#111827;\">\n                      <strong>ADITI Strategy &amp; Defence Magazine - Volume 1, Issue 1 (Inaugural Issue): Cognitive Dissonance in Indian Strategy</strong><br>\n                      <span style=\"font-size:12px;color:#6b7280;\">SKU: ADITI-MAG-V1-I1</span>\n                    </td>\n                    <td align=\"center\" style=\"padding:18px 0;border-bottom:1px solid #e5e7eb;font-size:15px;color:#111827;\">1</td>\n                    <td align=\"right\" style=\"padding:18px 0;border-bottom:1px solid #e5e7eb;font-size:15px;color:#111827;font-weight:700;\">INR 350</td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"2\" style=\"padding:18px 0 0;font-size:14px;color:#374151;\">Subtotal</td>\n                    <td align=\"right\" style=\"padding:18px 0 0;font-size:14px;color:#374151;\">INR 350</td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"2\" style=\"padding:10px 0 0;font-size:16px;color:#111827;font-weight:700;\">Total Paid</td>\n                    <td align=\"right\" style=\"padding:18px 0 0;font-size:18px;color:#111827;font-weight:700;\">INR 350</td>\n                  </tr>\n                </table>\n\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-top:28px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;\">\n                  <tr>\n                    <td style=\"padding:18px;font-size:13px;line-height:1.8;color:#374151;\">\n                      <strong>Receipt No:</strong> ADITI-RCPT-9C8Q9VATUZ<br>\n                      <strong>Order ID:</strong> order_T7w99C8Q9vAtuZ<br>\n                      <strong>Payment ID:</strong> pay_T7w9cugBaJGY5J<br>\n                      <strong>Currency:</strong> INR<br>\n                      <strong>Account Email:</strong> ankitshaw6933@gmail.com\n                    </td>\n                  </tr>\n                </table>\n\n                <div style=\"margin-top:30px;\">\n                  <a class=\"cta\" href=\"http://localhost:5173/profile\" style=\"display:inline-block;background:#c99a4a;color:#0b1320;text-decoration:none;padding:14px 22px;border-radius:4px;font-size:15px;font-weight:700;\">\n                    Download Magazine\n                  </a>\n                </div>\n\n                <p style=\"margin:30px 0 0;font-size:12px;line-height:1.7;color:#6b7280;\">\n                  This is a computer-generated receipt and does not require a signature.\n                </p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n</html>\n','2026-07-01 04:59:01','2026-07-01 04:59:02'),(2,20,'order_T7s8gcVFqgDpMv','pay_T7s9eTOHc7eoOe','ADITI-RCPT-GCVFQGDPMV',35000,'INR','Razorpay','Paid','Completed','2026-06-30 19:47:00','ankitshaw6933@gmail.com',NULL,NULL,'<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>ADITI-RCPT-GCVFQGDPMV</title>\n    <style>\n      @media only screen and (max-width: 640px) {\n        .shell {\n          width: 100% !important;\n        }\n\n        .card {\n          padding: 24px !important;\n        }\n\n        .two-col {\n          display: block !important;\n        }\n\n        .two-col td {\n          display: block !important;\n          width: 100% !important;\n          padding-right: 0 !important;\n          padding-bottom: 18px !important;\n        }\n\n        .title {\n          font-size: 30px !important;\n        }\n\n        .cta {\n          display: block !important;\n          text-align: center !important;\n        }\n      }\n    </style>\n  </head>\n  <body style=\"margin:0;background:#eef1f5;font-family:Arial,Helvetica,sans-serif;color:#111827;\">\n    <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"background:#eef1f5;padding:28px 12px;\">\n      <tr>\n        <td align=\"center\">\n          <table role=\"presentation\" class=\"shell\" width=\"640\" cellspacing=\"0\" cellpadding=\"0\" style=\"width:640px;max-width:100%;\">\n            <tr>\n              <td style=\"background:#0b1320;border-radius:18px 18px 0 0;padding:30px 34px;border-bottom:4px solid #c99a4a;\">\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n                  <tr>\n                    <td>\n                      <div style=\"font-size:13px;letter-spacing:8px;color:#f9fafb;font-weight:700;\">ADITI</div>\n                      <div style=\"margin-top:8px;font-size:13px;color:#c99a4a;letter-spacing:2px;text-transform:uppercase;\">Strategy & Defence Magazine</div>\n                    </td>\n                    <td align=\"right\" style=\"font-size:12px;color:#e5e7eb;\">\n                      Receipt<br>\n                      <strong style=\"color:#ffffff;\">ADITI-RCPT-GCVFQGDPMV</strong>\n                    </td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n\n            <tr>\n              <td class=\"card\" style=\"background:#ffffff;padding:34px;border-radius:0 0 18px 18px;box-shadow:0 18px 44px rgba(15,23,42,0.12);\">\n                <h1 class=\"title\" style=\"margin:0;font-size:38px;line-height:1.05;color:#111827;letter-spacing:0.02em;\">Payment received</h1>\n                <p style=\"margin:12px 0 0;font-size:15px;line-height:1.7;color:#4b5563;\">\n                  Thank you, Ankit Shaw. Your ADITI magazine purchase has been confirmed.\n                </p>\n\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"two-col\" style=\"margin-top:30px;\">\n                  <tr>\n                    <td width=\"50%\" valign=\"top\" style=\"padding-right:18px;\">\n                      <div style=\"font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c99a4a;font-weight:700;\">Billed To</div>\n                      <div style=\"margin-top:10px;font-size:15px;line-height:1.7;color:#111827;\">\n                        <strong>Ankit Shaw</strong><br>\n                        ankitshaw6933@gmail.com<br>\n                        989898989\n                      </div>\n                    </td>\n                    <td width=\"50%\" valign=\"top\">\n                      <div style=\"font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c99a4a;font-weight:700;\">Payment</div>\n                      <div style=\"margin-top:10px;font-size:15px;line-height:1.7;color:#111827;\">\n                        Method: <strong>Razorpay</strong><br>\n                        Date: <strong>30 Jun 2026, 07:47 PM</strong><br>\n                        Payment Status: <strong>Paid</strong><br>\n                        Order Status: <strong>Completed</strong>\n                      </div>\n                    </td>\n                  </tr>\n                </table>\n\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-top:30px;border-collapse:collapse;\">\n                  <tr>\n                    <td style=\"padding:12px 0;border-bottom:1px solid #d1d5db;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#111827;font-weight:700;\">Description</td>\n                    <td align=\"center\" style=\"padding:12px 0;border-bottom:1px solid #d1d5db;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#111827;font-weight:700;\">Qty</td>\n                    <td align=\"right\" style=\"padding:12px 0;border-bottom:1px solid #d1d5db;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#111827;font-weight:700;\">Amount</td>\n                  </tr>\n                  <tr>\n                    <td style=\"padding:18px 0;border-bottom:1px solid #e5e7eb;font-size:15px;line-height:1.6;color:#111827;\">\n                      <strong>ADITI Strategy &amp; Defence Magazine - Volume 1, Issue 1 (Inaugural Issue): Cognitive Dissonance in Indian Strategy</strong><br>\n                      <span style=\"font-size:12px;color:#6b7280;\">SKU: ADITI-MAG-V1-I1</span>\n                    </td>\n                    <td align=\"center\" style=\"padding:18px 0;border-bottom:1px solid #e5e7eb;font-size:15px;color:#111827;\">1</td>\n                    <td align=\"right\" style=\"padding:18px 0;border-bottom:1px solid #e5e7eb;font-size:15px;color:#111827;font-weight:700;\">INR 350</td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"2\" style=\"padding:18px 0 0;font-size:14px;color:#374151;\">Subtotal</td>\n                    <td align=\"right\" style=\"padding:18px 0 0;font-size:14px;color:#374151;\">INR 350</td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"2\" style=\"padding:10px 0 0;font-size:16px;color:#111827;font-weight:700;\">Total Paid</td>\n                    <td align=\"right\" style=\"padding:18px 0 0;font-size:18px;color:#111827;font-weight:700;\">INR 350</td>\n                  </tr>\n                </table>\n\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-top:28px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;\">\n                  <tr>\n                    <td style=\"padding:18px;font-size:13px;line-height:1.8;color:#374151;\">\n                      <strong>Receipt No:</strong> ADITI-RCPT-GCVFQGDPMV<br>\n                      <strong>Order ID:</strong> order_T7s8gcVFqgDpMv<br>\n                      <strong>Payment ID:</strong> pay_T7s9eTOHc7eoOe<br>\n                      <strong>Currency:</strong> INR<br>\n                      <strong>Account Email:</strong> ankitshaw6933@gmail.com\n                    </td>\n                  </tr>\n                </table>\n\n                <div style=\"margin-top:30px;\">\n                  <a class=\"cta\" href=\"http://localhost:5173/profile\" style=\"display:inline-block;background:#c99a4a;color:#0b1320;text-decoration:none;padding:14px 22px;border-radius:4px;font-size:15px;font-weight:700;\">\n                    Download Magazine\n                  </a>\n                </div>\n\n                <p style=\"margin:30px 0 0;font-size:12px;line-height:1.7;color:#6b7280;\">\n                  This is a computer-generated receipt and does not require a signature.\n                </p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n</html>\n','2026-07-01 04:59:46','2026-07-01 04:59:46'),(3,1,'order_T7rsoiytbTPScD','pay_T7rtNLjzH1IwFP','ADITI-RCPT-OIYTBTPSCD',35000,'INR','Razorpay','Paid','Completed','2026-06-30 19:31:36','ankitcodes6933@gmail.com',NULL,NULL,'<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>ADITI-RCPT-OIYTBTPSCD</title>\n    <style>\n      @media only screen and (max-width: 640px) {\n        .shell {\n          width: 100% !important;\n        }\n\n        .card {\n          padding: 24px !important;\n        }\n\n        .two-col {\n          display: block !important;\n        }\n\n        .two-col td {\n          display: block !important;\n          width: 100% !important;\n          padding-right: 0 !important;\n          padding-bottom: 18px !important;\n        }\n\n        .title {\n          font-size: 30px !important;\n        }\n\n        .cta {\n          display: block !important;\n          text-align: center !important;\n        }\n      }\n    </style>\n  </head>\n  <body style=\"margin:0;background:#eef1f5;font-family:Arial,Helvetica,sans-serif;color:#111827;\">\n    <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"background:#eef1f5;padding:28px 12px;\">\n      <tr>\n        <td align=\"center\">\n          <table role=\"presentation\" class=\"shell\" width=\"640\" cellspacing=\"0\" cellpadding=\"0\" style=\"width:640px;max-width:100%;\">\n            <tr>\n              <td style=\"background:#0b1320;border-radius:18px 18px 0 0;padding:30px 34px;border-bottom:4px solid #c99a4a;\">\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n                  <tr>\n                    <td>\n                      <div style=\"font-size:13px;letter-spacing:8px;color:#f9fafb;font-weight:700;\">ADITI</div>\n                      <div style=\"margin-top:8px;font-size:13px;color:#c99a4a;letter-spacing:2px;text-transform:uppercase;\">Strategy & Defence Magazine</div>\n                    </td>\n                    <td align=\"right\" style=\"font-size:12px;color:#e5e7eb;\">\n                      Receipt<br>\n                      <strong style=\"color:#ffffff;\">ADITI-RCPT-OIYTBTPSCD</strong>\n                    </td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n\n            <tr>\n              <td class=\"card\" style=\"background:#ffffff;padding:34px;border-radius:0 0 18px 18px;box-shadow:0 18px 44px rgba(15,23,42,0.12);\">\n                <h1 class=\"title\" style=\"margin:0;font-size:38px;line-height:1.05;color:#111827;letter-spacing:0.02em;\">Payment received</h1>\n                <p style=\"margin:12px 0 0;font-size:15px;line-height:1.7;color:#4b5563;\">\n                  Thank you, Ankit Shaw. Your ADITI magazine purchase has been confirmed.\n                </p>\n\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" class=\"two-col\" style=\"margin-top:30px;\">\n                  <tr>\n                    <td width=\"50%\" valign=\"top\" style=\"padding-right:18px;\">\n                      <div style=\"font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c99a4a;font-weight:700;\">Billed To</div>\n                      <div style=\"margin-top:10px;font-size:15px;line-height:1.7;color:#111827;\">\n                        <strong>Ankit Shaw</strong><br>\n                        ankitcodes6933@gmail.com<br>\n                        1010101010\n                      </div>\n                    </td>\n                    <td width=\"50%\" valign=\"top\">\n                      <div style=\"font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c99a4a;font-weight:700;\">Payment</div>\n                      <div style=\"margin-top:10px;font-size:15px;line-height:1.7;color:#111827;\">\n                        Method: <strong>Razorpay</strong><br>\n                        Date: <strong>30 Jun 2026, 07:31 PM</strong><br>\n                        Payment Status: <strong>Paid</strong><br>\n                        Order Status: <strong>Completed</strong>\n                      </div>\n                    </td>\n                  </tr>\n                </table>\n\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-top:30px;border-collapse:collapse;\">\n                  <tr>\n                    <td style=\"padding:12px 0;border-bottom:1px solid #d1d5db;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#111827;font-weight:700;\">Description</td>\n                    <td align=\"center\" style=\"padding:12px 0;border-bottom:1px solid #d1d5db;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#111827;font-weight:700;\">Qty</td>\n                    <td align=\"right\" style=\"padding:12px 0;border-bottom:1px solid #d1d5db;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#111827;font-weight:700;\">Amount</td>\n                  </tr>\n                  <tr>\n                    <td style=\"padding:18px 0;border-bottom:1px solid #e5e7eb;font-size:15px;line-height:1.6;color:#111827;\">\n                      <strong>ADITI Strategy &amp; Defence Magazine - Volume 1, Issue 1 (Inaugural Issue): Cognitive Dissonance in Indian Strategy</strong><br>\n                      <span style=\"font-size:12px;color:#6b7280;\">SKU: ADITI-MAG-V1-I1</span>\n                    </td>\n                    <td align=\"center\" style=\"padding:18px 0;border-bottom:1px solid #e5e7eb;font-size:15px;color:#111827;\">1</td>\n                    <td align=\"right\" style=\"padding:18px 0;border-bottom:1px solid #e5e7eb;font-size:15px;color:#111827;font-weight:700;\">INR 350</td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"2\" style=\"padding:18px 0 0;font-size:14px;color:#374151;\">Subtotal</td>\n                    <td align=\"right\" style=\"padding:18px 0 0;font-size:14px;color:#374151;\">INR 350</td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"2\" style=\"padding:10px 0 0;font-size:16px;color:#111827;font-weight:700;\">Total Paid</td>\n                    <td align=\"right\" style=\"padding:18px 0 0;font-size:18px;color:#111827;font-weight:700;\">INR 350</td>\n                  </tr>\n                </table>\n\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-top:28px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;\">\n                  <tr>\n                    <td style=\"padding:18px;font-size:13px;line-height:1.8;color:#374151;\">\n                      <strong>Receipt No:</strong> ADITI-RCPT-OIYTBTPSCD<br>\n                      <strong>Order ID:</strong> order_T7rsoiytbTPScD<br>\n                      <strong>Payment ID:</strong> pay_T7rtNLjzH1IwFP<br>\n                      <strong>Currency:</strong> INR<br>\n                      <strong>Account Email:</strong> ankitcodes6933@gmail.com\n                    </td>\n                  </tr>\n                </table>\n\n                <div style=\"margin-top:30px;\">\n                  <a class=\"cta\" href=\"http://localhost:5173/profile\" style=\"display:inline-block;background:#c99a4a;color:#0b1320;text-decoration:none;padding:14px 22px;border-radius:4px;font-size:15px;font-weight:700;\">\n                    Download Magazine\n                  </a>\n                </div>\n\n                <p style=\"margin:30px 0 0;font-size:12px;line-height:1.7;color:#6b7280;\">\n                  This is a computer-generated receipt and does not require a signature.\n                </p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n</html>\n','2026-07-01 04:59:49','2026-07-01 04:59:49');
/*!40000 ALTER TABLE `receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sign_in_events`
--

DROP TABLE IF EXISTS `sign_in_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sign_in_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `clerk_session_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signed_in_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sign_in_events_user_id` (`user_id`),
  KEY `idx_sign_in_events_signed_in_at` (`signed_in_at`),
  CONSTRAINT `fk_sign_in_events_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sign_in_events`
--

LOCK TABLES `sign_in_events` WRITE;
/*!40000 ALTER TABLE `sign_in_events` DISABLE KEYS */;
INSERT INTO `sign_in_events` VALUES (1,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:29:21','2026-06-30 13:59:21'),(2,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:29:22','2026-06-30 13:59:22'),(3,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:29:23','2026-06-30 13:59:23'),(4,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:29:23','2026-06-30 13:59:23'),(5,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:30:14','2026-06-30 14:00:14'),(6,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:30:15','2026-06-30 14:00:15'),(7,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:30:16','2026-06-30 14:00:16'),(8,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:30:31','2026-06-30 14:00:31'),(9,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:30:40','2026-06-30 14:00:40'),(10,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:30:41','2026-06-30 14:00:41'),(11,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:30:45','2026-06-30 14:00:45'),(12,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:30:46','2026-06-30 14:00:46'),(13,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:43:34','2026-06-30 14:13:34'),(14,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:43:35','2026-06-30 14:13:35'),(15,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:43:45','2026-06-30 14:13:45'),(16,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:43:46','2026-06-30 14:13:46'),(17,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:43:50','2026-06-30 14:13:50'),(18,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:43:54','2026-06-30 14:13:54'),(19,1,'sess_3FrIkEW4K6FmNjsO4Riu13idV3a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:43:55','2026-06-30 14:13:55'),(20,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:45:19','2026-06-30 14:15:19'),(21,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:45:20','2026-06-30 14:15:20'),(22,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:45:23','2026-06-30 14:15:23'),(23,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:45:24','2026-06-30 14:15:24'),(24,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:45:26','2026-06-30 14:15:26'),(25,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:45:27','2026-06-30 14:15:27'),(26,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 19:45:47','2026-06-30 14:15:47'),(27,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 23:40:44','2026-06-30 18:10:44'),(28,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 23:40:46','2026-06-30 18:10:46'),(29,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 23:40:48','2026-06-30 18:10:48'),(30,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 23:44:54','2026-06-30 18:14:54'),(31,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-06-30 23:44:57','2026-06-30 18:14:57'),(32,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 09:51:00','2026-07-01 04:21:00'),(33,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 09:51:01','2026-07-01 04:21:01'),(34,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 09:51:31','2026-07-01 04:21:31'),(35,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 09:51:32','2026-07-01 04:21:32'),(36,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 10:28:50','2026-07-01 04:58:50'),(37,20,'sess_3FrMpMbQyDtrKzsrrz5gwgULcKo','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 10:28:51','2026-07-01 04:58:51'),(38,1,'sess_3Ft73QBwMjTwPmAfyXNo19mHgCS','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 10:35:13','2026-07-01 05:05:13'),(39,1,'sess_3Ft73QBwMjTwPmAfyXNo19mHgCS','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 10:35:14','2026-07-01 05:05:14'),(40,1,'sess_3Ft73QBwMjTwPmAfyXNo19mHgCS','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 10:35:16','2026-07-01 05:05:16'),(41,1,'sess_3Ft73QBwMjTwPmAfyXNo19mHgCS','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 10:35:17','2026-07-01 05:05:17'),(42,1,'sess_3Ft73QBwMjTwPmAfyXNo19mHgCS','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 10:35:48','2026-07-01 05:05:48'),(43,1,'sess_3Ft73QBwMjTwPmAfyXNo19mHgCS','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 10:35:48','2026-07-01 05:05:48'),(44,1,'sess_3Ft73QBwMjTwPmAfyXNo19mHgCS','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 11:04:23','2026-07-01 05:34:23'),(45,1,'sess_3Ft73QBwMjTwPmAfyXNo19mHgCS','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 11:04:24','2026-07-01 05:34:24'),(46,1,'sess_3Ft73QBwMjTwPmAfyXNo19mHgCS','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 11:04:25','2026-07-01 05:34:25'),(47,1,'sess_3Ft73QBwMjTwPmAfyXNo19mHgCS','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','2026-07-01 11:04:25','2026-07-01 05:34:25');
/*!40000 ALTER TABLE `sign_in_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_cart_items`
--

DROP TABLE IF EXISTS `user_cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `magazine_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_cart_magazine` (`user_id`,`magazine_id`),
  KEY `fk_user_cart_items_magazine_id` (`magazine_id`),
  KEY `idx_user_cart_items_user_id` (`user_id`),
  CONSTRAINT `fk_user_cart_items_magazine_id` FOREIGN KEY (`magazine_id`) REFERENCES `magazines` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_user_cart_items_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_cart_items`
--

LOCK TABLES `user_cart_items` WRITE;
/*!40000 ALTER TABLE `user_cart_items` DISABLE KEYS */;
INSERT INTO `user_cart_items` VALUES (4,1,1,'2026-07-01 05:05:16','2026-07-01 05:05:16');
/*!40000 ALTER TABLE `user_cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_magazines`
--

DROP TABLE IF EXISTS `user_magazines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_magazines` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `magazine_id` bigint unsigned NOT NULL,
  `razorpay_order_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_payment_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','paid','failed','refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `purchased_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_magazine_order` (`user_id`,`magazine_id`,`razorpay_order_id`),
  KEY `fk_user_magazines_magazine_id` (`magazine_id`),
  KEY `idx_user_magazines_user_id` (`user_id`),
  KEY `idx_user_magazines_status` (`status`),
  CONSTRAINT `fk_user_magazines_magazine_id` FOREIGN KEY (`magazine_id`) REFERENCES `magazines` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_user_magazines_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_magazines`
--

LOCK TABLES `user_magazines` WRITE;
/*!40000 ALTER TABLE `user_magazines` DISABLE KEYS */;
INSERT INTO `user_magazines` VALUES (1,1,1,'order_T7rsoiytbTPScD','pay_T7rtNLjzH1IwFP','paid','2026-06-30 19:31:36','2026-06-30 14:00:48','2026-07-01 04:59:49'),(2,20,1,'order_T7s8gcVFqgDpMv','pay_T7s9eTOHc7eoOe','paid','2026-06-30 19:47:00','2026-06-30 14:15:50','2026-07-01 04:59:46'),(3,20,1,'order_T7w99C8Q9vAtuZ','pay_T7w9cugBaJGY5J','paid','2026-06-30 23:41:47','2026-06-30 18:11:02','2026-07-01 04:59:01'),(4,1,1,'order_T87IK0ehVGhbl6',NULL,'pending',NULL,'2026-07-01 05:05:20','2026-07-01 05:05:20');
/*!40000 ALTER TABLE `user_magazines` ENABLE KEYS */;
UNLOCK TABLES;

--

-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "firmware" (
	"name" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"architecture" text DEFAULT 'UNKNOWN' NOT NULL,
	"hash_value" text NOT NULL,
	"file_path" text,
	"file_size" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"vendor" text,
	"version" text,
	"extract_path" text
);
--> statement-breakpoint
CREATE TABLE "scan_results" (
	"status" text DEFAULT 'running' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"id" serial PRIMARY KEY NOT NULL,
	"firmware_id" integer NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"total_files" integer,
	"vulnerabilities_found" integer,
	"risk_level" text
);
--> statement-breakpoint
CREATE TABLE "vulnerabilities" (
	"type" text NOT NULL,
	"severity" text NOT NULL,
	"affected_file" text NOT NULL,
	"recommendation" text NOT NULL,
	"discovered_at" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"firmware_id" integer NOT NULL,
	"description" text NOT NULL,
	"cvss_score" integer
);
--> statement-breakpoint
CREATE TABLE "cve_matches" (
	"cve_id" text NOT NULL,
	"cvss_score" real NOT NULL,
	"description" text NOT NULL,
	"published_date" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"firmware_id" integer NOT NULL,
	"severity" text NOT NULL,
	"affected_component" text NOT NULL,
	"patch_available" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_reports" (
	"summary" text NOT NULL,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"firmware_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"risk_level" text NOT NULL,
	"key_findings" text DEFAULT '[]' NOT NULL,
	"recommendations" text DEFAULT '[]' NOT NULL,
	"exploit_probability" real
);
--> statement-breakpoint
CREATE TABLE "malware_hashes" (
	"sha256" text NOT NULL,
	"virus_total_result" text DEFAULT 'unknown' NOT NULL,
	"threat_score" integer DEFAULT 0 NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"firmware_id" integer NOT NULL,
	"is_malicious" boolean DEFAULT false NOT NULL,
	"detection_count" integer DEFAULT 0 NOT NULL,
	"total_engines" integer DEFAULT 72 NOT NULL,
	"file_name" text
);
--> statement-breakpoint
CREATE TABLE "emulation_logs" (
	"running_services" text DEFAULT '[]' NOT NULL,
	"open_ports" text DEFAULT '[]' NOT NULL,
	"runtime_logs" text,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"firmware_id" integer NOT NULL,
	"status" text DEFAULT 'starting' NOT NULL,
	"architecture" text NOT NULL,
	"stopped_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'analyst' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dangerous_functions" (
	"id" serial PRIMARY KEY NOT NULL,
	"firmware_id" integer NOT NULL,
	"name" text NOT NULL,
	"file" text NOT NULL,
	"line" text,
	"risk" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "extracted_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"firmware_id" integer NOT NULL,
	"path" text,
	"type" text,
	"size" text,
	"permissions" text,
	"is_suspicious" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hardcoded_secrets" (
	"id" serial PRIMARY KEY NOT NULL,
	"firmware_id" integer NOT NULL,
	"type" text NOT NULL,
	"value" text NOT NULL,
	"file" text NOT NULL,
	"line" text,
	"severity" text
);
--> statement-breakpoint
CREATE TABLE "activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text,
	"message" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"severity" text,
	"firmware_id" integer,
	"firmware_name" text
);
--> statement-breakpoint
CREATE TABLE "sbom_components" (
	"id" serial PRIMARY KEY NOT NULL,
	"firmware_id" integer NOT NULL,
	"name" text,
	"version" text,
	"type" text,
	"path" text,
	"source" text
);
--> statement-breakpoint
CREATE TABLE "sbom_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"firmware_id" integer NOT NULL,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"cyclonedx_path" text,
	"spdx_path" text,
	"csv_path" text,
	"component_count" text
);

*/
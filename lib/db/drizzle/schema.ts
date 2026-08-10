import { pgTable, text, timestamp, integer, serial, real, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const firmware = pgTable("firmware", {
	name: text().notNull(),
	uploadedAt: timestamp("uploaded_at", { mode: 'string' }).defaultNow().notNull(),
	architecture: text().default('UNKNOWN').notNull(),
	hashValue: text("hash_value").notNull(),
	filePath: text("file_path"),
	fileSize: integer("file_size").notNull(),
	id: serial().primaryKey().notNull(),
	status: text().default('pending').notNull(),
	vendor: text(),
	version: text(),
	extractPath: text("extract_path"),
});

export const scanResults = pgTable("scan_results", {
	status: text().default('running').notNull(),
	startedAt: timestamp("started_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	id: serial().primaryKey().notNull(),
	firmwareId: integer("firmware_id").notNull(),
	progress: integer().default(0).notNull(),
	totalFiles: integer("total_files"),
	vulnerabilitiesFound: integer("vulnerabilities_found"),
	riskLevel: text("risk_level"),
});

export const vulnerabilities = pgTable("vulnerabilities", {
	type: text().notNull(),
	severity: text().notNull(),
	affectedFile: text("affected_file").notNull(),
	recommendation: text().notNull(),
	discoveredAt: timestamp("discovered_at", { mode: 'string' }).defaultNow().notNull(),
	id: serial().primaryKey().notNull(),
	firmwareId: integer("firmware_id").notNull(),
	description: text().notNull(),
	cvssScore: integer("cvss_score"),
});

export const cveMatches = pgTable("cve_matches", {
	cveId: text("cve_id").notNull(),
	cvssScore: real("cvss_score").notNull(),
	description: text().notNull(),
	publishedDate: text("published_date").notNull(),
	id: serial().primaryKey().notNull(),
	firmwareId: integer("firmware_id").notNull(),
	severity: text().notNull(),
	affectedComponent: text("affected_component").notNull(),
	patchAvailable: boolean("patch_available").default(false).notNull(),
});

export const aiReports = pgTable("ai_reports", {
	summary: text().notNull(),
	generatedAt: timestamp("generated_at", { mode: 'string' }).defaultNow().notNull(),
	firmwareId: integer("firmware_id").notNull(),
	id: serial().primaryKey().notNull(),
	riskLevel: text("risk_level").notNull(),
	keyFindings: text("key_findings").default('[]').notNull(),
	recommendations: text().default('[]').notNull(),
	exploitProbability: real("exploit_probability"),
});

export const malwareHashes = pgTable("malware_hashes", {
	sha256: text().notNull(),
	virusTotalResult: text("virus_total_result").default('unknown').notNull(),
	threatScore: integer("threat_score").default(0).notNull(),
	id: serial().primaryKey().notNull(),
	firmwareId: integer("firmware_id").notNull(),
	isMalicious: boolean("is_malicious").default(false).notNull(),
	detectionCount: integer("detection_count").default(0).notNull(),
	totalEngines: integer("total_engines").default(72).notNull(),
	fileName: text("file_name"),
});

export const emulationLogs = pgTable("emulation_logs", {
	runningServices: text("running_services").default('[]').notNull(),
	openPorts: text("open_ports").default('[]').notNull(),
	runtimeLogs: text("runtime_logs"),
	startedAt: timestamp("started_at", { mode: 'string' }).defaultNow().notNull(),
	id: serial().primaryKey().notNull(),
	firmwareId: integer("firmware_id").notNull(),
	status: text().default('starting').notNull(),
	architecture: text().notNull(),
	stoppedAt: timestamp("stopped_at", { mode: 'string' }),
});

export const users = pgTable("users", {
	username: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	role: text().default('analyst').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	id: serial().primaryKey().notNull(),
});

export const dangerousFunctions = pgTable("dangerous_functions", {
	id: serial().primaryKey().notNull(),
	firmwareId: integer("firmware_id").notNull(),
	name: text().notNull(),
	file: text().notNull(),
	line: text(),
	risk: text(),
	description: text(),
});

export const extractedFiles = pgTable("extracted_files", {
	id: serial().primaryKey().notNull(),
	firmwareId: integer("firmware_id").notNull(),
	path: text(),
	type: text(),
	size: text(),
	permissions: text(),
	isSuspicious: boolean("is_suspicious").default(false).notNull(),
});

export const hardcodedSecrets = pgTable("hardcoded_secrets", {
	id: serial().primaryKey().notNull(),
	firmwareId: integer("firmware_id").notNull(),
	type: text().notNull(),
	value: text().notNull(),
	file: text().notNull(),
	line: text(),
	severity: text(),
});

export const activity = pgTable("activity", {
	id: serial().primaryKey().notNull(),
	type: text(),
	message: text(),
	timestamp: timestamp({ mode: 'string' }).defaultNow().notNull(),
	severity: text(),
	firmwareId: integer("firmware_id"),
	firmwareName: text("firmware_name"),
});

export const sbomComponents = pgTable("sbom_components", {
	id: serial().primaryKey().notNull(),
	firmwareId: integer("firmware_id").notNull(),
	name: text(),
	version: text(),
	type: text(),
	path: text(),
	source: text(),
});

export const sbomReports = pgTable("sbom_reports", {
	id: serial().primaryKey().notNull(),
	firmwareId: integer("firmware_id").notNull(),
	generatedAt: timestamp("generated_at", { mode: 'string' }).defaultNow().notNull(),
	cyclonedxPath: text("cyclonedx_path"),
	spdxPath: text("spdx_path"),
	csvPath: text("csv_path"),
	componentCount: text("component_count"),
});

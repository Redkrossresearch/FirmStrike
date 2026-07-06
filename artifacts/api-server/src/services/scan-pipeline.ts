import { db, scanResultsTable, firmwareTable, vulnerabilitiesTable, extractedFilesTable, hardcodedSecretsTable, dangerousFunctionsTable, activityTable, cveMatchesTable, malwareHashesTable, emulationLogsTable, aiReportsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger.js";
import { firmwareExtractPath } from "../lib/paths.js";
import { extractFirmware } from "./extraction.js";
import { analyzeStaticFiles } from "./static-analyzer.js";
import { matchCvesForComponents } from "./cve.js";
import { scanExtractedBinaries } from "./malware-analyzer.js";
import { runEmulation } from "./emulation.js";
import { generateAiReport } from "./ollama.js";
import { generateSbomReport } from "./sbom-generator.js";

function computeRiskLevel(
  vulnCount: number,
  criticalCount: number,
  malwareCount: number,
): "critical" | "high" | "medium" | "low" {
  if (criticalCount > 0 || malwareCount > 0) return "critical";
  if (vulnCount > 5) return "high";
  if (vulnCount > 0) return "medium";
  return "low";
}

export async function runScanPipeline(firmwareId: number, scanId: number): Promise<void> {
  const [fw] = await db.select().from(firmwareTable).where(eq(firmwareTable.id, firmwareId));
  if (!fw?.filePath) {
    await db.update(scanResultsTable).set({ status: "failed", progress: 100 }).where(eq(scanResultsTable.id, scanId));
    await db.update(firmwareTable).set({ status: "failed" }).where(eq(firmwareTable.id, firmwareId));
    return;
  }

  try {
    await db.update(scanResultsTable).set({ progress: 10 }).where(eq(scanResultsTable.id, scanId));

    const extractPath = fw.extractPath ?? firmwareExtractPath(firmwareId);
    const extraction = await extractFirmware(fw.filePath, extractPath);

    await db.update(firmwareTable).set({
      extractPath,
      architecture: extraction.architecture,
    }).where(eq(firmwareTable.id, firmwareId));

    await db.update(scanResultsTable).set({ progress: 30 }).where(eq(scanResultsTable.id, scanId));

    if (extraction.files.length > 0) {
      await db.insert(extractedFilesTable).values(
        extraction.files.map((f) => ({ firmwareId, ...f })),
      );
    }

    const staticAnalysis = await analyzeStaticFiles(
      extractPath,
      extraction.files.map((f) => f.path),
    );

    await db.update(scanResultsTable).set({ progress: 50 }).where(eq(scanResultsTable.id, scanId));

    if (staticAnalysis.secrets.length > 0) {
      await db.insert(hardcodedSecretsTable).values(
        staticAnalysis.secrets.map((s) => ({ firmwareId, ...s })),
      );
    }
    if (staticAnalysis.dangerous.length > 0) {
      await db.insert(dangerousFunctionsTable).values(
        staticAnalysis.dangerous.map((d) => ({ firmwareId, ...d })),
      );
    }
    if (staticAnalysis.vulnerabilities.length > 0) {
      await db.insert(vulnerabilitiesTable).values(
        staticAnalysis.vulnerabilities.map((v) => ({ firmwareId, ...v })),
      );
    }

    const cveMatches = await matchCvesForComponents(extraction.components);
    if (cveMatches.length > 0) {
      await db.insert(cveMatchesTable).values(
        cveMatches.map((c) => ({ firmwareId, ...c })),
      );
    }

    await db.update(scanResultsTable).set({ progress: 70 }).where(eq(scanResultsTable.id, scanId));

    const malwareResults = await scanExtractedBinaries(extractPath, extraction.files);
    if (malwareResults.length > 0) {
      await db.insert(malwareHashesTable).values(
        malwareResults.map((m) => ({
          firmwareId,
          sha256: m.sha256,
          threatScore: m.threatScore,
          virusTotalResult: m.virusTotalResult,
          isMalicious: m.isMalicious,
          detectionCount: m.detectionCount,
          totalEngines: m.totalEngines,
          fileName: m.fileName,
        })),
      );
    }

    const emulation = await runEmulation(fw.filePath, extractPath, extraction.architecture);
    await db.insert(emulationLogsTable).values({
      firmwareId,
      status: "running",
      architecture: emulation.architecture,
      runningServices: JSON.stringify(emulation.runningServices),
      openPorts: JSON.stringify(emulation.openPorts),
      runtimeLogs: emulation.runtimeLogs,
    });

    await db.update(scanResultsTable).set({ progress: 85 }).where(eq(scanResultsTable.id, scanId));

    await generateSbomReport(firmwareId, extractPath);

    const aiReport = await generateAiReport({
      firmwareName: fw.name,
      architecture: extraction.architecture,
      vulnerabilities: staticAnalysis.vulnerabilities.map((v) => ({
        type: v.type,
        severity: v.severity,
        description: v.description,
        file: v.affectedFile,
      })),
      secrets: staticAnalysis.secrets.map((s) => ({
        type: s.type,
        file: s.file,
        severity: s.severity,
      })),
      dangerousFunctions: staticAnalysis.dangerous.map((d) => ({
        name: d.name,
        file: d.file,
        risk: d.risk,
      })),
      cveIds: cveMatches.map((c) => c.cveId),
      malwareFindings: malwareResults.map((m) => ({
        fileName: m.fileName,
        threatScore: m.threatScore,
        result: m.virusTotalResult,
      })),
      components: extraction.components,
    });

    await db.insert(aiReportsTable).values({
      firmwareId,
      summary: aiReport.summary,
      riskLevel: aiReport.riskLevel,
      keyFindings: JSON.stringify(aiReport.keyFindings),
      recommendations: JSON.stringify(aiReport.recommendations),
      exploitProbability: aiReport.exploitProbability,
    }).onConflictDoUpdate({
      target: aiReportsTable.firmwareId,
      set: {
        summary: aiReport.summary,
        riskLevel: aiReport.riskLevel,
        keyFindings: JSON.stringify(aiReport.keyFindings),
        recommendations: JSON.stringify(aiReport.recommendations),
        exploitProbability: aiReport.exploitProbability,
        generatedAt: new Date(),
      },
    });

    const allVulns = staticAnalysis.vulnerabilities;
    const criticalCount = allVulns.filter((v) => v.severity === "critical").length;
    const malwareCount = malwareResults.filter((m) => m.isMalicious).length;
    const riskLevel = computeRiskLevel(allVulns.length, criticalCount, malwareCount);

    await db.update(scanResultsTable).set({
      status: "completed",
      progress: 100,
      completedAt: new Date(),
      totalFiles: extraction.files.length,
      vulnerabilitiesFound: allVulns.length,
      riskLevel,
    }).where(eq(scanResultsTable.id, scanId));

    await db.update(firmwareTable).set({ status: "completed" }).where(eq(firmwareTable.id, firmwareId));

    await db.insert(activityTable).values({
      type: "scan_completed",
      message: `Scan completed: ${allVulns.length} vulnerabilities, ${cveMatches.length} CVEs, risk ${riskLevel.toUpperCase()}`,
      severity: riskLevel === "critical" ? "critical" : riskLevel === "high" ? "high" : "info",
      firmwareId,
      firmwareName: fw.name,
    });

    if (malwareCount > 0) {
      await db.insert(activityTable).values({
        type: "malware_detected",
        message: `Malware indicators found in ${fw.name}`,
        severity: "critical",
        firmwareId,
        firmwareName: fw.name,
      });
    }
  } catch (err) {
    logger.error({ err, firmwareId }, "Scan pipeline failed");
    await db.update(scanResultsTable).set({ status: "failed", progress: 100 }).where(eq(scanResultsTable.id, scanId));
    await db.update(firmwareTable).set({ status: "failed" }).where(eq(firmwareTable.id, firmwareId));
    await db.insert(activityTable).values({
      type: "scan_completed",
      message: `Scan failed for firmware ID ${firmwareId}`,
      severity: "high",
      firmwareId,
    });
  }
}

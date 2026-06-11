import { Router, type IRouter } from "express";
import { createReadStream } from "node:fs";
import { db, aiReportsTable, scanResultsTable, firmwareTable, vulnerabilitiesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { generateTextReport } from "../services/pdf.js";
import { generateAiReport } from "../services/ollama.js";

const router: IRouter = Router();

router.get("/reports/pdf/:firmwareId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.firmwareId) ? req.params.firmwareId[0] : req.params.firmwareId;
  const firmwareId = parseInt(raw, 10);
  if (isNaN(firmwareId)) { res.status(400).json({ error: "Invalid firmwareId" }); return; }

  const { path: reportFilePath, size } = await generateTextReport(firmwareId);
  const [scan] = await db.select().from(scanResultsTable).where(eq(scanResultsTable.firmwareId, firmwareId));

  res.json({
    firmwareId,
    generatedAt: new Date().toISOString(),
    downloadUrl: `/api/reports/pdf/${firmwareId}/download`,
    fileSize: size,
    scanId: scan?.id ?? null,
  });
});

router.get("/reports/pdf/:firmwareId/download", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.firmwareId) ? req.params.firmwareId[0] : req.params.firmwareId;
  const firmwareId = parseInt(raw, 10);
  if (isNaN(firmwareId)) { res.status(400).json({ error: "Invalid firmwareId" }); return; }

  const { path: reportFilePath } = await generateTextReport(firmwareId);
  const [fw] = await db.select().from(firmwareTable).where(eq(firmwareTable.id, firmwareId));

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", `attachment; filename="viv-report-${fw?.name ?? firmwareId}.txt"`);
  createReadStream(reportFilePath).pipe(res);
});

router.get("/reports/ai-summary/:firmwareId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.firmwareId) ? req.params.firmwareId[0] : req.params.firmwareId;
  const firmwareId = parseInt(raw, 10);
  if (isNaN(firmwareId)) { res.status(400).json({ error: "Invalid firmwareId" }); return; }

  let [report] = await db.select().from(aiReportsTable).where(eq(aiReportsTable.firmwareId, firmwareId));

  if (!report) {
    const [fw] = await db.select().from(firmwareTable).where(eq(firmwareTable.id, firmwareId));
    const vulns = await db.select().from(vulnerabilitiesTable).where(eq(vulnerabilitiesTable.firmwareId, firmwareId));

    const ai = await generateAiReport({
      firmwareName: fw?.name ?? `Firmware #${firmwareId}`,
      architecture: fw?.architecture ?? "UNKNOWN",
      vulnerabilities: vulns.map((v) => ({
        type: v.type,
        severity: v.severity,
        description: v.description,
        file: v.affectedFile,
      })),
      secrets: [],
      dangerousFunctions: [],
      cveIds: [],
      malwareFindings: [],
      components: [],
    });

    const [inserted] = await db.insert(aiReportsTable).values({
      firmwareId,
      summary: ai.summary,
      riskLevel: ai.riskLevel,
      keyFindings: JSON.stringify(ai.keyFindings),
      recommendations: JSON.stringify(ai.recommendations),
      exploitProbability: ai.exploitProbability,
    }).returning();
    report = inserted;
  }

  res.json({
    firmwareId: report.firmwareId,
    summary: report.summary,
    riskLevel: report.riskLevel,
    keyFindings: JSON.parse(report.keyFindings),
    recommendations: JSON.parse(report.recommendations),
    generatedAt: report.generatedAt.toISOString(),
    exploitProbability: report.exploitProbability ?? null,
  });
});

router.get("/reports/history", async (_req, res): Promise<void> => {
  const scans = await db.select().from(scanResultsTable).orderBy(desc(scanResultsTable.startedAt)).limit(20);
  const history = await Promise.all(scans.map(async (s) => {
    const [fw] = await db.select().from(firmwareTable).where(eq(firmwareTable.id, s.firmwareId));
    return {
      id: s.id,
      firmwareId: s.firmwareId,
      firmwareName: fw?.name || `Firmware #${s.firmwareId}`,
      scannedAt: s.startedAt.toISOString(),
      status: s.status,
      riskLevel: s.riskLevel || "low",
      vulnerabilitiesFound: s.vulnerabilitiesFound || 0,
      threatScore: s.riskLevel === "critical" ? 87 : s.riskLevel === "high" ? 62 : s.riskLevel === "medium" ? 38 : 15,
    };
  }));
  res.json(history);
});

export default router;

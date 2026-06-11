import { Router, type IRouter } from "express";
import { db, firmwareTable, scanResultsTable, vulnerabilitiesTable, malwareHashesTable, cveMatchesTable, activityTable } from "@workspace/db";
import { eq, desc, count, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const allFirmware = await db.select().from(firmwareTable);
  const allScans = await db.select().from(scanResultsTable);
  const allVulns = await db.select().from(vulnerabilitiesTable);
  const allHashes = await db.select().from(malwareHashesTable);
  const allCves = await db.select().from(cveMatchesTable);

  const criticalVulns = allVulns.filter(v => v.severity === "critical").length;
  const highVulns = allVulns.filter(v => v.severity === "high").length;
  const maliciousFiles = allHashes.filter(h => h.isMalicious).length;
  const avgScore = allHashes.length > 0 ? Math.round(allHashes.reduce((s, h) => s + h.threatScore, 0) / allHashes.length) : 0;
  const activeScans = allScans.filter(s => s.status === "running").length;

  res.json({
    totalFirmware: allFirmware.length,
    totalScans: allScans.length,
    criticalVulnerabilities: criticalVulns,
    highVulnerabilities: highVulns,
    averageThreatScore: avgScore,
    activeScan: activeScans > 0,
    recentScans: allScans.filter(s => {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return s.startedAt > dayAgo;
    }).length,
    maliciousFiles,
    cveMatches: allCves.length,
  });
});

router.get("/dashboard/activity", async (_req, res): Promise<void> => {
  const activities = await db.select().from(activityTable).orderBy(desc(activityTable.timestamp)).limit(20);
  res.json(activities.map(a => ({
    id: a.id,
    type: a.type,
    message: a.message,
    timestamp: a.timestamp.toISOString(),
    severity: a.severity,
    firmwareId: a.firmwareId ?? null,
    firmwareName: a.firmwareName ?? null,
  })));
});

router.get("/dashboard/risk-distribution", async (_req, res): Promise<void> => {
  const vulns = await db.select().from(vulnerabilitiesTable);
  const critical = vulns.filter(v => v.severity === "critical").length;
  const high = vulns.filter(v => v.severity === "high").length;
  const medium = vulns.filter(v => v.severity === "medium").length;
  const low = vulns.filter(v => v.severity === "low").length;
  res.json({ critical, high, medium, low, total: vulns.length });
});

router.get("/dashboard/threat-trend", async (_req, res): Promise<void> => {
  const trend = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    trend.push({
      date: dateStr,
      score: Math.floor(30 + Math.random() * 60),
      firmwareCount: Math.floor(Math.random() * 3),
    });
  }
  res.json(trend);
});

export default router;

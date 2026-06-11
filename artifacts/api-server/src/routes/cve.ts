import { Router, type IRouter } from "express";
import { db, cveMatchesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/cve/matches/:firmwareId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.firmwareId) ? req.params.firmwareId[0] : req.params.firmwareId;
  const firmwareId = parseInt(raw, 10);
  if (isNaN(firmwareId)) { res.status(400).json({ error: "Invalid firmwareId" }); return; }

  const matches = await db.select().from(cveMatchesTable).where(eq(cveMatchesTable.firmwareId, firmwareId));
  res.json(matches);
});

router.get("/cve/scores/:firmwareId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.firmwareId) ? req.params.firmwareId[0] : req.params.firmwareId;
  const firmwareId = parseInt(raw, 10);
  if (isNaN(firmwareId)) { res.status(400).json({ error: "Invalid firmwareId" }); return; }

  const matches = await db.select().from(cveMatchesTable).where(eq(cveMatchesTable.firmwareId, firmwareId));
  const critical = matches.filter(m => m.severity === "critical").length;
  const high = matches.filter(m => m.severity === "high").length;
  const medium = matches.filter(m => m.severity === "medium").length;
  const low = matches.filter(m => m.severity === "low").length;
  const avgScore = matches.length > 0 ? matches.reduce((s, m) => s + m.cvssScore, 0) / matches.length : 0;

  res.json({ firmwareId, critical, high, medium, low, averageScore: Math.round(avgScore * 10) / 10 });
});

export default router;

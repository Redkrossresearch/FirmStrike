import { useParams, Link } from "wouter";
import { 
  useGetAiSummary, getGetAiSummaryQueryKey,
  useGetPdfReport, getGetPdfReportQueryKey,
  useGetScanHistory, getGetScanHistoryQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, ChevronLeft, Brain, Download, History, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ReportsAi() {
  const params = useParams();
  const firmwareId = parseInt(params.firmwareId || "0", 10);

  const { data: aiReport, isLoading: loadingAi } = useGetAiSummary(firmwareId, {
    query: { enabled: !!firmwareId, queryKey: getGetAiSummaryQueryKey(firmwareId) }
  });

  const { data: pdfMeta, isLoading: loadingPdf } = useGetPdfReport(firmwareId, {
    query: { enabled: !!firmwareId, queryKey: getGetPdfReportQueryKey(firmwareId) }
  });

  const { data: history, isLoading: loadingHistory } = useGetScanHistory({
    query: { queryKey: getGetScanHistoryQueryKey() }
  });

  if (!firmwareId) return <div>Invalid ID</div>;

  const handleDownload = () => {
    if (pdfMeta?.downloadUrl) {
      window.open(pdfMeta.downloadUrl, '_blank');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-primary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <Link href={`/firmware`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold font-mono text-primary flex items-center drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]"
          >
            <FileText className="mr-3 text-primary" />
            INTELLIGENCE_REPORTS
          </motion.h1>
        </div>
        <Button 
          variant="outline" 
          className="font-mono text-xs border-primary/50 text-primary hover:bg-primary/20 transition-all"
          onClick={handleDownload}
          disabled={loadingPdf || !pdfMeta}
        >
          <Download className="w-4 h-4 mr-2" /> Download PDF Report
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-primary/20 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.05)] md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Brain className="w-64 h-64" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="font-mono text-sm uppercase text-primary border-b border-border/50 pb-2 flex items-center">
              <Brain className="w-4 h-4 mr-2" /> AI Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            {loadingAi ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : aiReport ? (
              <div className="space-y-6">
                <div className="bg-muted/10 p-4 rounded-md border border-border/50 font-sans text-sm leading-relaxed text-foreground">
                  {aiReport.summary}
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-mono text-xs uppercase text-muted-foreground mb-3">Key Findings</h4>
                    <ul className="space-y-2">
                      {aiReport.keyFindings.map((finding, i) => (
                        <li key={i} className="text-sm flex items-start text-foreground">
                          <ArrowRight className="w-3 h-3 mr-2 mt-1 shrink-0 text-primary" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase text-muted-foreground mb-3">Remediation Steps</h4>
                    <ul className="space-y-2">
                      {aiReport.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm flex items-start text-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2 mt-1.5 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
               <p className="text-muted-foreground font-mono">AI Analysis unavailable.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80 backdrop-blur-md shadow-lg md:col-span-1">
          <CardHeader>
            <CardTitle className="font-mono text-sm uppercase text-primary border-b border-border/50 pb-2">Risk Probability</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            {loadingAi ? (
              <Skeleton className="h-32 w-32 rounded-full" />
            ) : aiReport ? (
              <>
                <div className="relative flex items-center justify-center mb-6">
                  <svg className="w-32 h-32 transform -rotate-90">
                     <circle cx="64" cy="64" r="50" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                     <circle cx="64" cy="64" r="50" stroke="hsl(var(--destructive))" strokeWidth="8" fill="none" 
                             strokeDasharray={314} strokeDashoffset={314 - ((aiReport.exploitProbability || 0) / 100) * 314} 
                             strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-3xl font-bold font-mono text-destructive drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">
                    {aiReport.exploitProbability}%
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-mono text-xs uppercase text-muted-foreground">Exploit Likelihood</p>
                  <Badge variant="outline" className={`mt-2 uppercase font-mono ${aiReport.riskLevel === 'critical' ? 'bg-destructive/10 text-destructive border-destructive/30' : 'bg-primary/10 text-primary border-primary/30'}`}>
                    {aiReport.riskLevel} RISK
                  </Badge>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/80 backdrop-blur-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-mono text-sm uppercase text-primary border-b border-border/50 pb-2 flex items-center">
            <History className="w-4 h-4 mr-2" /> Global Scan History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingHistory ? (
             <div className="p-6 space-y-2">
               {[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full bg-muted/20" />)}
             </div>
          ) : history && history.length > 0 ? (
             <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="border-border/50">
                  <TableHead className="font-mono text-xs uppercase">Target Firmware</TableHead>
                  <TableHead className="font-mono text-xs uppercase">Scan Date</TableHead>
                  <TableHead className="font-mono text-xs uppercase text-center">Status</TableHead>
                  <TableHead className="font-mono text-xs uppercase text-center">Risk Level</TableHead>
                  <TableHead className="font-mono text-xs uppercase text-right">Vulns</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.id} className="border-border/20 hover:bg-muted/5">
                    <TableCell className="font-mono text-sm font-bold text-foreground">
                      <Link href={`/scan/${entry.firmwareId}`} className="hover:text-primary transition-colors cursor-pointer">
                        {entry.firmwareName}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(entry.scannedAt).toLocaleDateString()} {new Date(entry.scannedAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`uppercase text-[10px] ${entry.status === 'completed' ? 'border-green-500/30 text-green-500 bg-green-500/5' : ''}`}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs uppercase font-bold">
                      <span className={getSeverityColor(entry.riskLevel)}>{entry.riskLevel}</span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {entry.vulnerabilitiesFound}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="p-8 text-center text-muted-foreground font-mono">No historical scan data found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useParams, Link } from "wouter";
import { 
  useGetCveMatches, getGetCveMatchesQueryKey,
  useGetCvssScores, getGetCvssScoresQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bug, ChevronLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

export default function CveIntelligence() {
  const params = useParams();
  const firmwareId = parseInt(params.firmwareId || "0", 10);

  const { data: cves, isLoading: loadingCves } = useGetCveMatches(firmwareId, {
    query: { enabled: !!firmwareId, queryKey: getGetCveMatchesQueryKey(firmwareId) }
  });

  const { data: cvss, isLoading: loadingCvss } = useGetCvssScores(firmwareId, {
    query: { enabled: !!firmwareId, queryKey: getGetCvssScoresQueryKey(firmwareId) }
  });

  if (!firmwareId) return <div>Invalid ID</div>;

  const getSeverityColor = (severity: string) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return 'hsl(var(--destructive))';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return 'hsl(var(--primary))';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 uppercase text-[10px]">Critical</Badge>;
      case 'high': return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30 uppercase text-[10px]">High</Badge>;
      case 'medium': return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30 uppercase text-[10px]">Medium</Badge>;
      case 'low': return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30 uppercase text-[10px]">Low</Badge>;
      default: return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30 uppercase text-[10px]">{severity}</Badge>;
    }
  };

  const cvssData = cvss ? [
    { name: 'Critical', value: cvss.critical, fill: getSeverityColor('critical') },
    { name: 'High', value: cvss.high, fill: getSeverityColor('high') },
    { name: 'Medium', value: cvss.medium, fill: getSeverityColor('medium') },
    { name: 'Low', value: cvss.low, fill: getSeverityColor('low') },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
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
          <Bug className="mr-3 text-primary" />
          CVE_INTELLIGENCE
        </motion.h1>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-border bg-card/80 backdrop-blur-md shadow-lg md:col-span-3">
          <CardHeader>
            <CardTitle className="font-mono text-sm uppercase text-primary border-b border-border/50 pb-2">CVSS Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCvss ? (
              <Skeleton className="h-[200px] w-full" />
            ) : cvssData.length > 0 ? (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cvssData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{fill: 'hsl(var(--muted))', opacity: 0.1}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontFamily: 'var(--font-mono)', borderRadius: '4px' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {cvssData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground font-mono">No CVSS data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/80 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,255,0.05)] md:col-span-1">
          <CardHeader>
            <CardTitle className="font-mono text-sm uppercase text-primary border-b border-border/50 pb-2">Average CVSS Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            {loadingCvss ? (
              <Skeleton className="h-24 w-24 rounded-full" />
            ) : (
              <>
                <div className="text-6xl font-bold font-mono text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {cvss?.averageScore.toFixed(1) || '0.0'}
                </div>
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Overall Risk</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/80 backdrop-blur-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-mono text-sm uppercase text-primary border-b border-border/50 pb-2">Matched Common Vulnerabilities and Exposures</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingCves ? (
            <div className="p-6 space-y-2">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : cves && cves.length > 0 ? (
            <div className="max-h-[600px] overflow-auto custom-scrollbar">
              <Table>
                <TableHeader className="bg-muted/10 sticky top-0">
                  <TableRow className="border-border/50">
                    <TableHead className="font-mono text-xs uppercase w-32">CVE ID</TableHead>
                    <TableHead className="font-mono text-xs uppercase w-24">Severity</TableHead>
                    <TableHead className="font-mono text-xs uppercase w-24">Score</TableHead>
                    <TableHead className="font-mono text-xs uppercase">Component</TableHead>
                    <TableHead className="font-mono text-xs uppercase w-1/2">Description</TableHead>
                    <TableHead className="font-mono text-xs uppercase text-right w-24">Patch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cves.map(cve => (
                    <TableRow key={cve.id} className="border-border/20 hover:bg-muted/5">
                      <TableCell className="font-mono text-sm font-bold text-primary flex items-center">
                        <a href={`https://nvd.nist.gov/vuln/detail/${cve.cveId}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center">
                          {cve.cveId} <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                        </a>
                      </TableCell>
                      <TableCell>{getSeverityBadge(cve.severity)}</TableCell>
                      <TableCell className="font-mono text-sm">{cve.cvssScore.toFixed(1)}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{cve.affectedComponent}</TableCell>
                      <TableCell className="text-xs text-muted-foreground line-clamp-2">{cve.description}</TableCell>
                      <TableCell className="text-right">
                        {cve.patchAvailable ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30 text-[10px]">YES</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px]">NO</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground font-mono">No CVEs matched.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

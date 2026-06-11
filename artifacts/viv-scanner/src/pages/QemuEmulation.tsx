import { useState } from "react";
import { useParams, Link } from "wouter";
import { 
  useGetRunningServices, getGetRunningServicesQueryKey,
  useGetOpenPorts, getGetOpenPortsQueryKey,
  useStartEmulation
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, ChevronLeft, Play, Terminal, Cpu, Network } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function QemuEmulation() {
  const params = useParams();
  const firmwareId = parseInt(params.firmwareId || "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isEmulating, setIsEmulating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const { data: services, isLoading: loadingServices } = useGetRunningServices(firmwareId, {
    query: { enabled: !!firmwareId && isEmulating, queryKey: getGetRunningServicesQueryKey(firmwareId) }
  });

  const { data: ports, isLoading: loadingPorts } = useGetOpenPorts(firmwareId, {
    query: { enabled: !!firmwareId && isEmulating, queryKey: getGetOpenPortsQueryKey(firmwareId) }
  });

  const startEmulationMutation = useStartEmulation();

  if (!firmwareId) return <div>Invalid ID</div>;

  const handleStartEmulation = () => {
    startEmulationMutation.mutate({ data: { firmwareId, architecture: 'ARM' } }, {
      onSuccess: () => {
        toast({ title: "QEMU Initialized", description: "Booting firmware image..." });
        setIsEmulating(true);
        // Mock some logs
        setLogs([
          "> QEMU emulator version 8.2.0 starting",
          "> Loading firmware image...",
          "> Kernel boot command line: console=ttyS0 root=/dev/mtdblock2 rw",
          "> Uncompressing Linux... done, booting the kernel.",
          "> Booting Linux on physical CPU 0x0",
          "> Initializing cgroup subsys cpuset",
          "> Linux version 4.1.0-generic (gcc version 7.3.0) #1 SMP",
          "> Mount-cache hash table entries: 1024",
          "> VFS: Mounted root (squashfs filesystem) readonly.",
          "> Freeing unused kernel memory: 236K",
          "> Starting system services...",
          "> init: starting httpd (port 80)",
          "> init: starting dropbear (port 22)"
        ]);
        queryClient.invalidateQueries({ queryKey: getGetRunningServicesQueryKey(firmwareId) });
        queryClient.invalidateQueries({ queryKey: getGetOpenPortsQueryKey(firmwareId) });
      }
    });
  };

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
          <Zap className="mr-3 text-primary" />
          QEMU_EMULATION
        </motion.h1>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-primary/30 bg-card/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.1)] md:col-span-1">
          <CardHeader>
            <CardTitle className="font-mono text-sm uppercase text-primary border-b border-border/50 pb-2">Control Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-mono text-muted-foreground uppercase">Status</p>
              {isEmulating ? (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30 uppercase text-xs w-full justify-center animate-pulse">RUNNING</Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground border-border uppercase text-xs w-full justify-center">STOPPED</Badge>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono text-muted-foreground uppercase">Architecture</p>
              <div className="flex items-center text-sm font-mono bg-muted/20 p-2 rounded border border-border/50">
                <Cpu className="w-4 h-4 mr-2 text-primary" /> ARM (emulated)
              </div>
            </div>
            
            <Button 
              className="w-full font-mono uppercase text-xs tracking-wider" 
              onClick={handleStartEmulation}
              disabled={isEmulating || startEmulationMutation.isPending}
            >
              <Play className="w-4 h-4 mr-2" /> {isEmulating ? "Active" : "Initialize Boot"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80 backdrop-blur-md shadow-lg md:col-span-3 flex flex-col h-[400px]">
          <CardHeader className="py-3 border-b border-border/50 bg-black/40">
            <CardTitle className="font-mono text-sm uppercase text-primary flex items-center">
              <Terminal className="w-4 h-4 mr-2" /> Runtime Console
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 bg-black/80 overflow-auto custom-scrollbar font-mono text-[11px] leading-tight text-green-500/80">
            <div className="p-4 space-y-1">
              {!isEmulating ? (
                 <div className="text-muted-foreground italic opacity-50"># Emulation offline. Awaiting boot command...</div>
              ) : (
                logs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.1 }}
                    key={i}
                  >
                    {log}
                  </motion.div>
                ))
              )}
              {isEmulating && (
                 <motion.div 
                   animate={{ opacity: [1, 0] }} 
                   transition={{ repeat: Infinity, duration: 0.8 }}
                   className="inline-block w-2 h-3 bg-green-500 ml-1 mt-1"
                 />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border bg-card/80 backdrop-blur-md shadow-lg opacity-90">
          <CardHeader>
            <CardTitle className="font-mono text-sm uppercase text-primary border-b border-border/50 pb-2 flex items-center">
              <Cpu className="w-4 h-4 mr-2" /> Discovered Services
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!isEmulating ? (
              <div className="p-8 text-center text-muted-foreground font-mono">Requires active emulation</div>
            ) : loadingServices ? (
              <div className="p-6 space-y-2">
                {[1,2,3].map(i => <Skeleton key={i} className="h-8 w-full bg-muted/20" />)}
              </div>
            ) : services?.[0]?.runningServices && services[0].runningServices.length > 0 ? (
              <div className="p-4">
                <ul className="space-y-2 font-mono text-sm">
                  {services[0].runningServices.map((svc, i) => (
                    <li key={i} className="flex items-center text-foreground before:content-['>_'] before:text-primary before:mr-2">
                      {svc}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
               <div className="p-4 text-muted-foreground font-mono">No services identified.</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80 backdrop-blur-md shadow-lg opacity-90">
          <CardHeader>
            <CardTitle className="font-mono text-sm uppercase text-primary border-b border-border/50 pb-2 flex items-center">
              <Network className="w-4 h-4 mr-2" /> Open Network Ports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!isEmulating ? (
               <div className="p-8 text-center text-muted-foreground font-mono">Requires active emulation</div>
            ) : loadingPorts ? (
               <div className="p-6 space-y-2">
                 {[1,2].map(i => <Skeleton key={i} className="h-8 w-full bg-muted/20" />)}
               </div>
            ) : ports?.ports && ports.ports.length > 0 ? (
               <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow className="border-border/50">
                    <TableHead className="font-mono text-xs uppercase">Port</TableHead>
                    <TableHead className="font-mono text-xs uppercase">Protocol</TableHead>
                    <TableHead className="font-mono text-xs uppercase">Service</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ports.ports.map((p, i) => (
                    <TableRow key={i} className="border-border/20">
                      <TableCell className="font-mono font-bold text-primary">{p.port}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground uppercase">{p.protocol}</TableCell>
                      <TableCell className="font-mono text-xs">{p.service}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
               <div className="p-4 text-muted-foreground font-mono">No open ports detected.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

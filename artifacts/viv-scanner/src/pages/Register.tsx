import { Shield, User, Mail, Lock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";

export default function Register() {
  return (
    <div className="min-h-screen w-full bg-[#0a0f14] flex items-center justify-center relative overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-20 mix-blend-screen" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, hsl(var(--primary) / 0.2) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary) / 0.2) 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
           }} />

      <Card className="w-full max-w-md border-primary/30 bg-card/60 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.1)] relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <CardHeader className="space-y-1 pb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-mono tracking-wider text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">FIRMSTRIKE</CardTitle>
          <CardDescription className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
            New Entity Registration
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase text-muted-foreground">Callsign</p>
            <div className="flex items-center gap-3 px-4 py-3 rounded-md border border-border/40 bg-background/30">
              <User className="w-4 h-4 text-primary/60 shrink-0" />
              <span className="font-mono text-sm text-muted-foreground/70 italic">Unique analyst identifier — e.g. red_team_01</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-xs uppercase text-muted-foreground">Comm Link (Email)</p>
            <div className="flex items-center gap-3 px-4 py-3 rounded-md border border-border/40 bg-background/30">
              <Mail className="w-4 h-4 text-primary/60 shrink-0" />
              <span className="font-mono text-sm text-muted-foreground/70 italic">Primary communication address — e.g. analyst@soc.local</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-xs uppercase text-muted-foreground">Access Token</p>
            <div className="flex items-center gap-3 px-4 py-3 rounded-md border border-border/40 bg-background/30">
              <Lock className="w-4 h-4 text-primary/60 shrink-0" />
              <span className="font-mono text-sm text-muted-foreground/70 italic">Encrypted password credential — minimum 6 characters</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 w-full py-3 rounded-md border border-primary/30 bg-primary/5 font-mono text-xs uppercase tracking-wider text-primary/60">
            <span>Register Entity</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/30 pt-6">
          <p className="text-xs text-muted-foreground font-mono">
            Already registered?{" "}
            <Link href="/login">
              <span className="text-primary hover:underline cursor-pointer">Initialize Session</span>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

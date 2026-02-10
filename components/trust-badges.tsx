import { ShieldCheck, Zap, Users } from "lucide-react"

export function TrustBadges() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all group">
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-bold text-sm">100% Verified</p>
          <p className="text-xs text-muted-foreground">All codes tested</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all group">
        <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
          <Zap className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="font-bold text-sm">Instant Delivery</p>
          <p className="text-xs text-muted-foreground">Get codes now</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all group">
        <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
          <Users className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <p className="font-bold text-sm">1000+ Happy Users</p>
          <p className="text-xs text-muted-foreground">Trusted platform</p>
        </div>
      </div>
    </div>
  )
}

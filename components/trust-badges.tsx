import { ShieldCheck, Zap, Users } from "lucide-react"

export function TrustBadges() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <div>
          <p className="font-semibold">100% Verified</p>
          <p className="text-sm text-muted-foreground">All coupons tested</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
        <Zap className="h-8 w-8 text-primary" />
        <div>
          <p className="font-semibold">Instant Delivery</p>
          <p className="text-sm text-muted-foreground">Get codes immediately</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <p className="font-semibold">1000+ Coupons Sold</p>
          <p className="text-sm text-muted-foreground">Trusted by customers</p>
        </div>
      </div>
    </div>
  )
}

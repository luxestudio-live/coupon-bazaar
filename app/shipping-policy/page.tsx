import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Shipping & Delivery Policy</h1>
            <p className="text-muted-foreground">Last updated: January 15, 2026</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Digital Product Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                ShopEase By TryLooters is a digital marketplace that exclusively deals in digital coupon codes. 
                Since all our products are digital, there is <strong>no physical shipping</strong> involved.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Instant Delivery Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Immediate Access</h3>
                <p>
                  Upon successful payment verification, your purchased coupon codes are instantly displayed 
                  on the order confirmation page.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Download Option</h3>
                <p>
                  You can download all your coupon codes as a TXT file directly from the confirmation page 
                  for safekeeping.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3. No Waiting Period</h3>
                <p>
                  Unlike physical products, there is zero delivery time. Your codes are available the moment 
                  payment is confirmed.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Delivery Confirmation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Once payment is successful, the system automatically allocates unused coupon codes from our 
                inventory and marks them as delivered. Each code is unique and will not be issued to any other customer.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Technical Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you experience any technical difficulties in accessing your codes after payment, please contact 
                our support team immediately at:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email: hello@trylooters.in</li>
                <li>Instagram: <a href="https://instagram.com/Trylooters" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@Trylooters</a></li>
              </ul>
              <p>
                We typically resolve technical issues within 1-2 hours during business hours.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Keep your coupon codes secure and do not share them publicly</li>
                <li>Screenshot or download your codes immediately after purchase</li>
                <li>Used codes cannot be reused or transferred</li>
                <li>Codes are valid as per the terms specified by the brand</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Cancellations & Refunds Policy</h1>
            <p className="text-muted-foreground">Last updated: January 15, 2026</p>
          </div>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important Notice</AlertTitle>
            <AlertDescription>
              Due to the digital nature of our products, all sales are final once coupon codes are delivered.
            </AlertDescription>
          </Alert>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Before Code Delivery</h3>
                <p>
                  Orders can be cancelled only if the payment has been made but coupon codes have not yet been 
                  displayed/delivered to you. This window is typically very small (under 1 minute) as our system 
                  delivers codes instantly upon payment confirmation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">After Code Delivery</h3>
                <p>
                  Once coupon codes are displayed on the confirmation screen, the order cannot be cancelled as 
                  the codes are immediately marked as used in our system and cannot be reissued.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Refunds are provided only in the following circumstances:
              </p>
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Technical Errors</h3>
                <p>
                  If you were charged but did not receive your coupon codes due to a technical error on our end, 
                  you are eligible for a full refund. Please contact support within 24 hours with your order details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Invalid Codes</h3>
                <p>
                  If the coupon codes provided are already used or invalid at the time of delivery, you may request 
                  a refund or replacement. You must report this issue within 24 hours of purchase with proof 
                  (screenshots of the error message from the merchant).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Duplicate Charges</h3>
                <p>
                  If you were charged multiple times for the same order, the duplicate charges will be refunded 
                  automatically within 5-7 business days.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Non-Refundable Situations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Refunds will NOT be provided in the following cases:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Change of mind after receiving valid coupon codes</li>
                <li>Codes rejected by merchant due to user error (wrong product, cart value, etc.)</li>
                <li>Codes expired after purchase due to merchant policy changes</li>
                <li>User forgot to save or lost the coupon codes after delivery</li>
                <li>Codes were shared with others and used by someone else</li>
                <li>User did not meet the merchant's terms and conditions for code usage</li>
                <li><strong>Codes blocked by the brand for any reason</strong></li>
              </ul>
              <p className="font-semibold text-foreground mt-4">
                ⚠️ Important: If any code is blocked by the brand, no refund or replacement would be given.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Refund Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">How to Request a Refund</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Contact our support team via email (hello@trylooters.in) or Instagram (@Trylooters)</li>
                  <li>Provide your order ID and payment transaction details</li>
                  <li>Explain the reason for refund with supporting evidence if applicable</li>
                  <li>Our team will review your request within 24-48 hours</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Refund Timeline</h3>
                <p>
                  If your refund request is approved:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Refund will be initiated within 2-3 business days</li>
                  <li>Amount will be credited to your original payment method</li>
                  <li>Bank processing time: 5-7 business days for credit cards/net banking</li>
                  <li>UPI/Wallet refunds typically process within 24-48 hours</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Replacement Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                In cases where codes are invalid through no fault of yours, we may offer a replacement code instead 
                of a refund, subject to availability in our inventory. This is at our sole discretion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We are committed to resolving any issues fairly. If you are not satisfied with our response to 
                your refund request, you may escalate the matter by emailing us at hello@trylooters.in with 
                "ESCALATION" in the subject line.
              </p>
              <p>
                All disputes will be handled in accordance with Indian consumer protection laws and regulations.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

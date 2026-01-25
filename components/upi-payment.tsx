"use client"

import { useState } from "react"
import { Copy, QrCode, CheckCircle2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface UpiPaymentProps {
  amount: number
  onPaymentSuccess: () => void
}

export function UpiPayment({ amount, onPaymentSuccess }: UpiPaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<"waiting" | "processing" | "verified">("waiting")
  const [showQR, setShowQR] = useState(false)
  const { toast } = useToast()

  const upiId = "yourbusiness@paytm"

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    toast({
      title: "UPI ID Copied",
      description: "UPI ID has been copied to clipboard",
    })
  }

  const handleGenerateQR = () => {
    setShowQR(true)
    toast({
      title: "QR Code Generated",
      description: "Scan the QR code to make payment",
    })
  }

  const handleCompletePayment = () => {
    setPaymentStatus("processing")
    // Simulate payment verification
    setTimeout(() => {
      setPaymentStatus("verified")
      setTimeout(() => {
        onPaymentSuccess()
      }, 1000)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>UPI Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-primary/5 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Amount to Pay</p>
          <p className="text-4xl font-bold text-primary">₹{amount}</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">UPI ID</span>
              <Button variant="outline" size="sm" onClick={handleCopyUPI} className="gap-2 bg-transparent">
                <Copy className="h-3 w-3" />
                Copy
              </Button>
            </div>
            <p className="font-mono text-sm bg-muted p-2 rounded">{upiId}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={handleGenerateQR}>
              <QrCode className="h-4 w-4" />
              Generate QR
            </Button>
          </div>

          {showQR && (
            <div className="p-4 border rounded-lg bg-white">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <img
                  src={`/upi-qr-code-for--.jpg?height=200&width=200&query=UPI+QR+Code+for+₹${amount}`}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">Scan with any UPI app</p>
            </div>
          )}

          <div className="pt-4">
            {paymentStatus === "waiting" && (
              <div className="space-y-3">
                <p className="text-sm text-center text-muted-foreground">Payment Status: Waiting...</p>
                <Button onClick={handleCompletePayment} className="w-full gap-2 h-12 text-base" size="lg">
                  Complete Payment
                </Button>
              </div>
            )}

            {paymentStatus === "processing" && (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Verifying payment...</p>
              </div>
            )}

            {paymentStatus === "verified" && (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 className="h-12 w-12 text-success" />
                <p className="font-semibold text-success">✅ Payment Verified!</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

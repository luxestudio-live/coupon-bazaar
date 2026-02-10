import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg">
              We're here to help! Reach out to us for any queries or support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Instagram
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href="https://instagram.com/Trylooters" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold mb-2 text-primary hover:underline block">
                  @Trylooters
                </a>
                <p className="text-sm text-muted-foreground">
                  Follow us & DM for support
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-2">hello@trylooters.in</p>
                <p className="text-lg font-semibold">+91 9987031290</p>
                <p className="text-sm text-muted-foreground">
                  We'll respond within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-2">Mon - Sat: 9 AM - 8 PM</p>
                <p className="text-sm text-muted-foreground">
                  Sunday: 10 AM - 6 PM (IST)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-2">India</p>
                <p className="text-sm text-muted-foreground">
                  Serving customers across India
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">How do I get my coupon codes after payment?</h3>
                <p className="text-sm text-muted-foreground">
                  Coupon codes are instantly displayed on the order confirmation page and can be downloaded as a TXT file.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Are the coupon codes genuine?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, all our coupon codes are 100% verified and sourced directly from authorized channels.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  We accept all major payment methods through Razorpay including UPI, Cards, NetBanking, and Wallets.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What if my code is blocked by the brand?</h3>
                <p className="text-sm text-muted-foreground">
                  If any code is blocked by the brand, no refund or replacement would be given. Please ensure you meet all brand terms before using the code.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

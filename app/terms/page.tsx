import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-muted-foreground">Last updated: January 15, 2026</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                By accessing and using ShopEase By TryLooters, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg mt-4">
                <h3 className="font-semibold text-foreground mb-2">Third-Party Seller Disclosure</h3>
                <p className="text-sm">
                  ShopEase By TryLooters is an <strong>independent third-party seller</strong> and reseller of discount coupon codes. 
                  We are <strong>not affiliated with, endorsed by, or directly connected to any of the brands</strong> whose 
                  coupon codes we sell. We obtain coupon codes through legitimate channels and resell them to customers. 
                  All brand names, logos, and trademarks mentioned on this platform belong to their respective owners. 
                  Final acceptance and validity of coupon codes are subject to the terms and conditions of the issuing brands.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. Use of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                ShopEase By TryLooters provides a platform for purchasing verified discount coupon codes. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate payment and contact information</li>
                <li>Use coupon codes only for personal, non-commercial purposes</li>
                <li>Not resell or redistribute purchased coupon codes</li>
                <li>Not attempt to reverse-engineer or exploit our system</li>
                <li>Not engage in any fraudulent activities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>ShopEase By TryLooters operates as an independent third-party reseller.</strong> We source and resell 
                discount coupon codes obtained through legitimate channels. We strive to ensure all coupon codes 
                listed on our platform are:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Verified and sourced from authorized channels</li>
                <li>Valid and unused at the time of purchase</li>
                <li>Subject to the terms and conditions of the respective brands</li>
              </ul>
              <p>
                However, we do not guarantee acceptance by merchants as final terms are controlled by the issuing brands. 
                <strong>We are not representatives or agents of these brands.</strong> Any disputes regarding code validity 
                or usage terms should be resolved according to the brand's policies.
              </p>
              <p className="font-semibold text-foreground mt-4">
                Important: If any code is blocked by the brand, no refund or replacement would be given.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All payments are processed securely through Razorpay</li>
                <li>Prices are listed in Indian Rupees (INR)</li>
                <li>Payment must be completed before coupon codes are released</li>
                <li>We accept UPI, Cards, NetBanking, and Digital Wallets</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                All content on ShopEase By TryLooters, including but not limited to text, graphics, logos, and software, 
                is the property of ShopEase By TryLooters or its content suppliers and is protected by intellectual property laws.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>6. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                ShopEase By TryLooters shall not be liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Rejection of coupon codes by merchants due to their internal policies</li>
                <li>Changes in brand terms and conditions after purchase</li>
                <li>Any indirect, incidental, or consequential damages</li>
                <li>Technical issues beyond our control</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>7. Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Your use of ShopEase By TryLooters is also governed by our Privacy Policy. Please review our Privacy Policy 
                to understand our practices regarding your personal information.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>8. Modifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon 
                posting on the website. Your continued use of the service constitutes acceptance of modified terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                For any questions regarding these terms, please contact us at:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email: hello@trylooters.in</li>
                <li>Instagram: <a href="https://instagram.com/Trylooters" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@Trylooters</a></li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

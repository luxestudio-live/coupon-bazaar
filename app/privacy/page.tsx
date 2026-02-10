import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 15, 2026</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                ShopEase By TryLooters ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg mt-4">
                <h3 className="font-semibold text-foreground mb-2">About Our Service</h3>
                <p className="text-sm">
                  ShopEase By TryLooters operates as an <strong>independent third-party seller and reseller</strong> of discount 
                  coupon codes. We are <strong>not affiliated with, endorsed by, or directly connected to any of the brands</strong> 
                  whose coupon codes we offer. We source codes through legitimate channels and resell them to customers. 
                  All brand names and trademarks belong to their respective owners.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Payment Information</h3>
                <p>
                  When you make a purchase, payment information is collected and processed by our payment partner 
                  Razorpay. We do not store your complete card details, CVV, or banking credentials. We only receive 
                  transaction confirmation and order IDs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Usage Data</h3>
                <p>
                  We automatically collect certain information about your device, including information about your 
                  web browser, IP address, time zone, and some of the cookies installed on your device.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Order Information</h3>
                <p>
                  We collect details about the coupons you purchase, including order ID, purchase date, quantity, 
                  and allocated coupon codes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and respond to inquiries</li>
                <li>Prevent fraudulent transactions and protect against malicious activity</li>
                <li>Improve and optimize our website and service</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. Sharing Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We share your information with third parties only to help us use your information, as described above:</p>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Payment Processing</h3>
                <p>
                  We use Razorpay for payment processing. Your payment information is transmitted directly to 
                  Razorpay, which is compliant with PCI-DSS standards.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Database & Hosting</h3>
                <p>
                  We use Firebase (Google Cloud) to store order and coupon data. All data is encrypted and stored 
                  in secure data centers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Analytics</h3>
                <p>
                  We may use Vercel Analytics to understand how our service is being used. This helps us improve 
                  user experience.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We implement appropriate technical and organizational security measures to protect your personal 
                information. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All payment processing is done through secure, encrypted channels</li>
                <li>Sensitive data is encrypted both in transit and at rest</li>
                <li>Access to personal data is restricted to authorized personnel only</li>
                <li>We regularly review and update our security practices</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>6. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We retain your order information for our records and to comply with legal obligations. Order data 
                is typically retained for 7 years as per Indian tax and accounting regulations.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>7. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (subject to legal retention requirements)</li>
                <li>Opt-out of marketing communications (if any)</li>
                <li>Lodge a complaint with a data protection authority</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>8. Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We use cookies and similar tracking technologies to track activity on our service and hold certain 
                information. Cookies are essential for the website to function properly (like maintaining your cart).
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>9. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our service is not intended for individuals under the age of 18. We do not knowingly collect 
                personal information from children under 18.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email: hello@trylooters.in</li>
                <li>Phone: +91 9987031290</li>
                <li>Instagram: <a href="https://instagram.com/Trylooters" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@Trylooters</a></li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

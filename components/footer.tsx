import Link from "next/link"
import { Ticket, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Ticket className="h-6 w-6 text-primary" />
              <span>CouponBazaar</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted destination for verified discount coupons. Save more on every purchase.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold mb-4">Policies</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-primary transition-colors">
                  Cancellations & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@luxestudio.live" className="hover:text-primary transition-colors">
                  hello@luxestudio.live
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold">Social:</span>
                <a href="https://instagram.com/Trylooters" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Instagram
                </a>
                <span>|</span>
                <a href="https://t.me/Trylooters" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} CouponBazaar. All rights reserved.</p>
            <p className="text-center">
              Dreamed, designed, and brought to life by{" "}
              <a 
                href="https://www.luxestudio.live" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline transition-colors"
              >
                LuxeStudio
              </a>
              {" "}— where ideas find their elegance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

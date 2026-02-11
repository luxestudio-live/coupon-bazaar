import Link from "next/link"
import { Ticket, Mail, Instagram, Send, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="container relative mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-primary to-blue-600 p-2 shadow-lg">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">ShopEase</span>
                <span className="text-xs font-medium text-muted-foreground -mt-1">By TryLooters</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Verified coupons, instant delivery, and transparent policies. Save more with confidence.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://instagram.com/Trylooters"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Instagram className="h-4 w-4 text-pink-600" />
                Instagram
              </a>
              <a
                href="https://t.me/Trylooters"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Send className="h-4 w-4 text-sky-600" />
                Telegram
              </a>
              <a
                href="https://youtube.com/@trylooters"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Youtube className="h-4 w-4 text-red-600" />
                YouTube
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Quick Links</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
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
          <div className="md:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Policies</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
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
          <div className="md:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Contact</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@trylooters.in" className="hover:text-primary transition-colors">
                  hello@trylooters.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} ShopEase By TryLooters. All rights reserved.</p>
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

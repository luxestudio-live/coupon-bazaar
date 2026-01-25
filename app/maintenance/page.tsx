"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function MaintenancePage() {
  const router = useRouter()
  const [adminAttempt, setAdminAttempt] = useState(0)

  // Triple click to access admin
  const handleLogoClick = () => {
    setAdminAttempt(prev => prev + 1)
    if (adminAttempt >= 2) {
      router.push("/admin/login")
    }
  }

  useEffect(() => {
    if (adminAttempt > 0) {
      const timer = setTimeout(() => setAdminAttempt(0), 3000)
      return () => clearTimeout(timer)
    }
  }, [adminAttempt])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4" onClick={handleLogoClick}>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Wrench className="w-10 h-10 text-primary animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-2xl">Under Maintenance</CardTitle>
          <CardDescription className="text-base mt-2">
            We're currently performing scheduled maintenance to improve your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-left text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  We'll be back soon!
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  Our team is working hard to bring you an improved experience. 
                  Thank you for your patience.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t space-y-2">
            <p className="text-sm text-muted-foreground">
              For urgent inquiries, please contact us:
            </p>
            <div className="space-y-1">
              <p className="text-sm">
                📧 <a href="mailto:hello@luxestudio.live" className="text-primary hover:underline">
                  hello@luxestudio.live
                </a>
                <br />
                📞 <a href="tel:+919987031290" className="text-primary hover:underline">
                  +91 9987031290
                </a>
              </p>
              <p className="text-sm">
                📱 <a href="https://instagram.com/Trylooters" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  @Trylooters
                </a>
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Check Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

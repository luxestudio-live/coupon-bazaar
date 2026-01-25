"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WhatsAppButton() {
  const handleClick = () => {
    window.open("https://wa.me/1234567890?text=Hi, I need help with coupons", "_blank")
  }

  return (
    <Button
      onClick={handleClick}
      size="icon"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40 bg-[#25D366] hover:bg-[#20BA5A]"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  )
}

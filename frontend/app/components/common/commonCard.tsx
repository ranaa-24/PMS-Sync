import React from 'react'
import { Card } from "@/components/ui/card"

function CommonCard({children}: {children: React.ReactNode}) {
  return (
    <Card className="mx-auto w-xs md:w-sm lg:w-[450px] bg-surface text-main-font border-2 border-main-border">
        {children}
    </Card>
  )
}

export default CommonCard
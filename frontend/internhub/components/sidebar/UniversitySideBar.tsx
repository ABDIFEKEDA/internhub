"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, FileText } from "lucide-react"

export function UniversitySidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard/university",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Applications",
      href: "/dashboard/university/application",
      icon: <FileText size={18} />,
    },
    {
      label: "Students",
      href: "/dashboard/university/students",
      icon: <Users size={18} />,
    },
  ]

  return (
    <>
      {/* Fixed Sidebar */}
      <aside className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-b from-orange-100 to-orange-50 p-6 shadow-xl border-r border-orange-200 overflow-y-auto">
        {/* University Logo/Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-700 to-orange-600 bg-clip-text text-transparent">
            University
          </h2>
          <div className="h-1 w-12 bg-orange-500 rounded-full mt-2"></div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
                           (item.href !== "/dashboard/university" && 
                            pathname?.startsWith(item.href))

            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start text-orange-800 hover:bg-orange-200/80 transition-all duration-200",
                  isActive && "bg-orange-500 text-white hover:bg-orange-600 font-semibold shadow-md"
                )}
              >
                <Link href={item.href}>
                  <span className={cn(
                    "mr-2",
                    isActive ? "text-white" : "text-orange-600"
                  )}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </nav>

        {/* Footer/User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-orange-200 bg-orange-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-orange-800 truncate">University Admin</p>
              <p className="text-xs text-orange-600 truncate">admin@university.edu</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer div to push main content to the right */}
      <div className="w-64 flex-shrink-0" />
    </>
  )
}
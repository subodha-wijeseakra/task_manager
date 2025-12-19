"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { FiMoon, FiSun } from "react-icons/fi"
import { Button } from "@/components/ui/Button"

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="rounded-full">
                <span className="sr-only">Toggle theme</span>
                <div className="h-5 w-5" />
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
            className="rounded-full"
        >
            {resolvedTheme === "dark" ? (
                <FiMoon className="h-5 w-5" />
            ) : (
                <FiSun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

"use client";

import React from "react";
import { cn } from "@/lib/utils"

interface MobileContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function MobileContainer({
    children,
    className
}: MobileContainerProps) {
    return (
        <div className="min-h-dvh bg-neutral-950 flex justify-center items-center sm:py-6">
            <main className={cn("w-full max-w-md min-h-dvh sm:min-h-[844px] sm:max-h-[920px]",
                "bg-slate-50 text-slate-900 relative flex flex-col overflow-y-auto",
                "sm:rounded-[40px] sm:border sm:border-slate-300/80 sm:shadow-2xl sm:shadow-black/50",
                className
             )}>
                {children}
             </main>
        </div>
    );
}
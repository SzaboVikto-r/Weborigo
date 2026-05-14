"use client"

import Image from "next/image"

export function WeborigoLogo() {
  return (
    <div className="w-full flex items-center justify-center">
      <Image
        src="/images/weborigo-logo.png"
        alt="Weborigo"
        width={500}
        height={72}
        priority
        className="w-full h-auto sm:w-[clamp(9rem,20vw,16rem)] 2xl:w-[min(29.645vw,30.8rem)]"
      />
    </div>
  )
}

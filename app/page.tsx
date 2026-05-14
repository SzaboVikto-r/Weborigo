import { WeborigoLogo } from "@/components/weborigo-logo"
import { EmotionCard } from "@/components/emotion-card"

export default function Page() {
  return (
    <main
      className="min-h-screen w-full flex flex-col items-center"
      style={{ backgroundColor: "#FF7A00" }}
    >
      {/* Header / Logo — mobile: card-width (90 vw), sm+: full width */}
      <header
        className="w-[90vw] sm:w-full mx-auto flex justify-center sm:px-4"
        style={{
          paddingTop: "clamp(1.25rem, 3vw, 2.5rem)",
          paddingBottom: "clamp(1.25rem, 3vw, 2.5rem)",
        }}
      >
        <WeborigoLogo />
      </header>

      {/* Card */}
      <section
        className="w-full flex justify-center"
        style={{
          padding: "0 clamp(0.75rem, 3vw, 2rem) clamp(1.5rem, 4vw, 3rem)",
        }}
      >
        <EmotionCard />
      </section>
    </main>
  )
}

"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Image from "next/image"

interface WordPair {
  english: string
  serbian: string
  image: string
}

const WORD_PAIRS: WordPair[] = [
  { english: "happy",       serbian: "srećan",             image: "/images/happy-woman.jpg"    },
  { english: "nice",        serbian: "lepo",               image: "/images/nice_img.jpg"       },
  { english: "friend",      serbian: "prijatelj",          image: "/images/friend_img.jpg"     },
  { english: "explosion",   serbian: "eksplozija",         image: "/images/explosion_img.jpg"  },
  { english: "carrot",      serbian: "šargarepa",          image: "/images/carrot_img.jpg"     },
  { english: "car",         serbian: "auto",               image: "/images/car_img.jpg"        },
  { english: "soldier",     serbian: "vojnik",             image: "/images/solider_img.jpg"    },
  { english: "fear",        serbian: "strah",              image: "/images/fear_img.jpg"       },
  { english: "relativity",  serbian: "relativnost",        image: "/images/relativity_img.jpg" },
  { english: "book",        serbian: "knjiga",             image: "/images/book_img.jpg"       },
  { english: "Earth",       serbian: "Zemlja",             image: "/images/earth_img.jpg"      },
  { english: "speed limit", serbian: "ograničenje brzine", image: "/images/speedlimit_img.jpg" },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Language = "english" | "serbian"
const randomLang = (): Language => (Math.random() < 0.5 ? "english" : "serbian")
const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export function EmotionCard() {
  const [pool, setPool] = useState<WordPair[]>(WORD_PAIRS)
  const [currentPair, setCurrentPair] = useState<WordPair>(WORD_PAIRS[0])
  const [showLang, setShowLang] = useState<Language>("english")
  const [guess, setGuess] = useState("")
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [imgVisible, setImgVisible] = useState(true)
  const [shakeInput, setShakeInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const total = correct + wrong
  const shownWord = showLang === "english" ? currentPair?.english : currentPair?.serbian

  const transitionToNext = useCallback((newPool: WordPair[]) => {
    setImgVisible(false)
    setTimeout(() => {
      if (newPool.length === 0) {
        const fresh = shuffle(WORD_PAIRS)
        setPool(fresh)
        setCurrentPair(fresh[0])
        setCorrect(0)
        setWrong(0)
      } else {
        setPool(newPool)
        setCurrentPair(pickRandom(newPool))
      }
      setShowLang(randomLang())
      setFeedback(null)
      setImgVisible(true)
      inputRef.current?.focus()
    }, 280)
  }, [])

  const handleSubmit = useCallback(() => {
    if (!guess.trim() || !currentPair || feedback !== null) return

    const expected = (showLang === "english" ? currentPair.serbian : currentPair.english)
      .toLowerCase()
      .trim()
    const isCorrect = guess.toLowerCase().trim() === expected

    setGuess("")

    const newPool = pool.filter((p) => p !== currentPair)

    if (isCorrect) {
      setCorrect((c) => c + 1)
      setFeedback("correct")
      setTimeout(() => transitionToNext(newPool), 700)
    } else {
      setWrong((w) => w + 1)
      setFeedback("wrong")
      setShakeInput(true)
      setTimeout(() => setShakeInput(false), 500)
      setTimeout(() => transitionToNext(newPool), 700)
    }
  }, [guess, currentPair, showLang, pool, feedback, transitionToNext])

  useEffect(() => {
    const shuffled = shuffle(WORD_PAIRS)
    setPool(shuffled)
    setCurrentPair(pickRandom(shuffled))
    setShowLang(randomLang())
    inputRef.current?.focus()
  }, [])

  return (
    <div
      /* 90 vw on mobile, 77 vw on sm+ — maxWidth caps at 1280 px (80 rem).
         card-ratio adds aspect-ratio 1280/827 above the sm breakpoint.        */
      className="card-enter card-ratio w-[90vw] sm:w-[77vw] mx-auto bg-white flex flex-col items-center shadow-2xl"
      style={{
        maxWidth: "80rem",
        borderRadius: "clamp(0.875rem, 1.5vw, 1.25rem)",
        overflow: "hidden",
      }}
    >
      {/* Inner wrapper — h-full + justify-center centres the content vertically
          inside the fixed-ratio card on desktop.                               */}
      <div
        className="w-full h-full flex flex-col items-center justify-center"
        style={{ padding: "clamp(1rem, 3%, 2.5rem)" }}
      >
        {/* ── Score counters (mobile only — top position) ─────────────── */}
        <div
          className="flex sm:hidden items-center justify-between w-[82%] mb-3"
          style={{ position: "relative", zIndex: 1 }}
        >
          <div className="flex items-center gap-2">
            <div
              className="shrink-0"
              role="img"
              aria-label="Correct"
              style={{
                width: "clamp(1.25rem, 1.6vw, 1.5rem)",
                height: "clamp(1.25rem, 1.6vw, 1.5rem)",
                backgroundImage: "url('/images/thumbs-up.png')",
                backgroundSize: "auto 100%",
                backgroundPosition: "left center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <span className="text-[#FF8C00] font-semibold tabular-nums" style={{ fontSize: "clamp(0.875rem, 1.2vw, 1rem)" }}>
              {correct} / {total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="shrink-0"
              role="img"
              aria-label="Wrong"
              style={{
                width: "clamp(1.25rem, 1.6vw, 1.5rem)",
                height: "clamp(1.25rem, 1.6vw, 1.5rem)",
                backgroundImage: "url('/images/thumbs-down.png')",
                backgroundSize: "auto 100%",
                backgroundPosition: "left center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <span className="text-[#FF8C00] font-semibold tabular-nums" style={{ fontSize: "clamp(0.875rem, 1.2vw, 1rem)" }}>
              {wrong} / {total}
            </span>
          </div>
        </div>

        {/* ── Image + Blob ─────────────────────────────────────────────── */}
        {/* 82 % on mobile → 55 % on sm+ to match the design proportion   */}
        <div className="relative w-[82%] sm:w-[55%]" style={{ marginBottom: "0.75rem" }}>

          {/* Blob — absolutely positioned behind the photo, offset lower-left */}
          <div
            className="absolute pointer-events-none select-none hidden sm:block"
            style={{ top: "-13%", left: "-18%", right: "8%", bottom: "-60%", zIndex: 0 }}
          >
            <Image
              src="/images/blob-shape.png"
              alt=""
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Photo — 31.25 % of card at xl (1280 px = 31.25/55 ≈ 56.82 % of this wrapper),
               full wrapper width everywhere else                                          */}
          <div className="relative z-10 w-full xl:w-[56.82%] 2xl:w-full mx-auto">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "700 / 464",
                opacity: imgVisible ? 1 : 0,
                transition: "opacity 0.28s ease",
              }}
            >
              <Image
                src={currentPair?.image || "/images/happy-woman.jpg"}
                alt={shownWord || ""}
                fill
                className="object-cover"
                priority
              />
              {/* Ring overlay rendered above the photo so the inset shadow is visible */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  boxShadow:
                    feedback === "correct"
                      ? "inset 0 0 0 4px #4ade80"
                      : feedback === "wrong"
                        ? "inset 0 0 0 4px #f87171"
                        : "none",
                  transition: "box-shadow 0.15s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Word label ───────────────────────────────────────────────── */}
        <p
          className="text-[#333333] font-semibold text-center select-none"
          style={{
            fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
            marginTop: "0.75rem",
            letterSpacing: "0.01em",
            position: "relative",
            zIndex: 1,
          }}
        >
          {shownWord}
        </p>

        {/* ── Input ────────────────────────────────────────────────────── */}
        <div className="w-[82%] sm:w-[55%]" style={{ marginTop: "0.75rem", position: "relative", zIndex: 1 }}>
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className={`w-full rounded-xl border text-[#333333] outline-none transition-all duration-200 bg-white ${
              shakeInput ? "animate-shake" : ""
            } ${
              feedback === "wrong"
                ? "border-red-400"
                : feedback === "correct"
                  ? "border-green-400"
                  : "border-[#f0e0d0] focus:border-[#ff8c00]"
            }`}
            style={{
              boxShadow: "0 0 12px 4px rgba(255,160,60,0.22), 0 4px 8px 0 rgba(255,140,0,0.15)",
              fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
              height: "clamp(2.5rem, 3.5vw, 2.875rem)",
              padding: "0 clamp(0.75rem, 1.5%, 1.25rem)",
            }}
            aria-label="Your answer"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* ── Let's see button ─────────────────────────────────────────── */}
        <button
          onClick={handleSubmit}
          className="border-none bg-transparent p-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-150 hover:brightness-105"
          style={{ width: "min(70%, 20.25rem)", marginTop: "1rem", position: "relative", zIndex: 1 }}
          aria-label="Let's see"
        >
          <Image
            src="/images/lets-see-btn.png"
            alt="Let's see"
            width={324}
            height={60}
            className="w-full h-auto drop-shadow-sm"
          />
        </button>

        {/* ── Score counters (sm+ only — original bottom position) ────── */}
        <div
          className="hidden sm:flex items-center justify-between w-[82%] sm:w-[55%]"
          style={{ marginTop: "0.75rem", position: "relative", zIndex: 1 }}
        >
          {/* Correct */}
          <div className="flex items-center gap-2">
            <div
              className="shrink-0"
              role="img"
              aria-label="Correct"
              style={{
                width: "clamp(1.25rem, 1.6vw, 1.5rem)",
                height: "clamp(1.25rem, 1.6vw, 1.5rem)",
                backgroundImage: "url('/images/thumbs-up.png')",
                backgroundSize: "auto 100%",
                backgroundPosition: "left center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <span
              className="text-[#FF8C00] font-semibold tabular-nums"
              style={{ fontSize: "clamp(0.875rem, 1.2vw, 1rem)" }}
            >
              {correct} / {total}
            </span>
          </div>

          {/* Wrong */}
          <div className="flex items-center gap-2">
            <div
              className="shrink-0"
              role="img"
              aria-label="Wrong"
              style={{
                width: "clamp(1.25rem, 1.6vw, 1.5rem)",
                height: "clamp(1.25rem, 1.6vw, 1.5rem)",
                backgroundImage: "url('/images/thumbs-down.png')",
                backgroundSize: "auto 100%",
                backgroundPosition: "left center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <span
              className="text-[#FF8C00] font-semibold tabular-nums"
              style={{ fontSize: "clamp(0.875rem, 1.2vw, 1rem)" }}
            >
              {wrong} / {total}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"

type VideoItem = {
  title: string
  img: string
  bvid: string
  aid: string
}

// =========================================================
// 配置区：把每个视频的 bvid（推荐）或 aid 填进来即可
// - bvid 示例： "BV1xx411c7XD"
// - 如果你只有 aid，把 bvid 留空，填 aid（纯数字，如 "12345678"）
// =========================================================
const VIDEOS: VideoItem[] = [
  { title: "和狗狗们一起作图", img: "/images/dogs.png", bvid: "BV1b15M6yEK9", aid: "" },
  { title: "小兔子们的钟形曲线", img: "/images/rabbits.png", bvid: "BV1jE5Lz4EuJ", aid: "" },
  { title: "鸭妈妈和神秘的蛋", img: "/images/duck.png", bvid: "BV1JvRBBLEat", aid: "" },
  { title: "小猴子们的扔栗子比赛", img: "/images/monkeys.png", bvid: "BV1vyLn6oE6A", aid: "" },
]

function buildSrc(v: VideoItem): string {
  const params = "page=1&high_quality=1&danmaku=0&autoplay=1"
  if (v.bvid && v.bvid.trim()) {
    return `https://player.bilibili.com/player.html?bvid=${v.bvid.trim()}&${params}`
  }
  if (v.aid && v.aid.trim()) {
    return `https://player.bilibili.com/player.html?aid=${v.aid.trim()}&${params}`
  }
  return ""
}

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const openVideo = useCallback((i: number) => setActiveIndex(i), [])
  const closeVideo = useCallback(() => setActiveIndex(null), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = activeIndex !== null ? "hidden" : ""
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [activeIndex, closeVideo])

  const active = activeIndex !== null ? VIDEOS[activeIndex] : null
  const activeSrc = active ? buildSrc(active) : ""

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ebf4ff] to-white text-[#1a365d]">
      <header className="px-5 pb-7 pt-14 text-center">
        <h1 className="text-balance text-[clamp(2rem,6vw,3.4rem)] font-extrabold tracking-[4px] text-[#2b6cb0] [text-shadow:0_2px_0_#fff]">
          看图学统计
        </h1>
        <p className="mt-3 text-[clamp(0.95rem,2.5vw,1.1rem)] tracking-wide text-[#5a6b82]">
          用可爱的小故事，轻松读懂统计学
        </p>
      </header>

      <main className="mx-auto grid max-w-[980px] grid-cols-1 gap-6 px-5 pb-16 pt-4 sm:grid-cols-2 sm:gap-7">
        {VIDEOS.map((v, i) => (
          <button
            key={v.title}
            onClick={() => openVideo(i)}
            className="flex cursor-pointer flex-col overflow-hidden rounded-[22px] border border-[#bee3f8] bg-white text-left shadow-[0_8px_24px_rgba(43,108,176,0.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(43,108,176,0.18)] focus-visible:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4299e1]"
          >
            <div className="aspect-[4/3] overflow-hidden bg-[#ebf4ff]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.img || "/placeholder.svg"} alt={v.title} className="block h-full w-full object-cover" />
            </div>
            <div className="px-5 py-[18px] text-center">
              <h2 className="text-[1.2rem] font-bold text-[#2b6cb0]">{v.title}</h2>
              <span className="mt-2 inline-block text-[0.85rem] tracking-wide text-[#4299e1]">点击播放视频 ▶</span>
            </div>
          </button>
        ))}
      </main>

      <footer className="px-6 py-6 text-center text-[0.85rem] text-[#5a6b82]">
        看图学统计 · 蓝白主题 · 部署于 GitHub Pages
      </footer>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeVideo()
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(26,54,93,0.6)] p-5 backdrop-blur-sm"
        >
          <div className="w-[min(900px,100%)] overflow-hidden rounded-[18px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between border-b border-[#ebf4ff] px-5 py-3.5">
              <h3 className="text-[1.05rem] font-semibold text-[#2b6cb0]">{active.title}</h3>
              <button
                onClick={closeVideo}
                aria-label="关闭"
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#ebf4ff] text-[1.2rem] text-[#2b6cb0] transition-colors hover:bg-[#bee3f8]"
              >
                ×
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              {activeSrc ? (
                <iframe
                  src={activeSrc}
                  scrolling="no"
                  frameBorder="no"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                  title={active.title}
                />
              ) : (
                <p className="absolute inset-0 flex items-center justify-center p-10 text-center text-white">
                  请先在代码的 VIDEOS 配置中填入该视频的 bvid 或 aid。
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

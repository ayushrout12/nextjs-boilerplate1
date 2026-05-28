"use client"

import Image from "next/image"

export function FounderSection() {
  return (
    <section id="founder" className="py-24 md:py-32 relative overflow-hidden">
      {/* decorative elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <p className="text-sm text-primary font-light tracking-[0.2em] uppercase">meet the creator</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light tracking-wide">
              the mind behind lotus
            </h2>
          </div>

          <div className="flex flex-col items-center text-center space-y-8">
            {/* founder image - circular with glow */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-full blur-2xl opacity-60" />
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-primary/20 lotus-glow">
                <Image
                  src="/founder.png"
                  alt="ayush rout"
                  fill
                  sizes="(max-width: 768px) 192px, 224px"
                  quality={100}
                  priority
                  unoptimized
                  className="object-cover object-[center_20%] scale-105"
                />
              </div>
            </div>

            {/* name and title */}
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-serif font-normal tracking-wide">
                ayush rout
              </h3>
              <p className="text-sm text-primary font-light tracking-[0.15em]">
                founder & ceo
              </p>
            </div>

            {/* bio */}
            <div className="max-w-2xl space-y-6">
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed tracking-wide">
                i am ayush rout, a passionate 14 year old who loves to vibe code with the help of ai and turn things into unimaginable results. not only this, but i actually have published three apps on the app store.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed tracking-wide">
                i have started coding ever since i was seven, so i currently have multiple years of experience.
              </p>
              <p className="text-xl md:text-2xl font-serif font-normal tracking-wide text-foreground/90 italic pt-4">
                &ldquo;if you can dream it, you can build it.&rdquo;
              </p>
              <p className="text-sm text-primary/70 font-light tracking-[0.2em]">
                — signed a.r.
              </p>
            </div>

            {/* decorative lotus petals */}
            <div className="flex items-center gap-2 pt-6">
              <div className="w-2 h-2 rounded-full bg-primary/20" />
              <div className="w-3 h-3 rounded-full bg-primary/30" />
              <div className="w-4 h-4 rounded-full bg-primary/40" />
              <div className="w-3 h-3 rounded-full bg-primary/30" />
              <div className="w-2 h-2 rounded-full bg-primary/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Star, Verified } from "lucide-react"

export const TestimonialCard = ({ name, role, text, color, avatar }: { name: string, role: string, text: string, color: string, avatar: string }) => (
  <div className="relative bg-white/80 dark:bg-[#1a2f26]/80 backdrop-blur-xl rounded-2xl shadow-xl border border-accent/10 p-8 flex flex-col items-center gap-4 animate-fade-in-up hover:scale-105 transition-transform duration-300">
    <div className="flex items-center space-x-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
      ))}
    </div>
    <p className="text-muted-foreground text-center text-lg">{`"${text}"`}</p>
    <div className="flex items-center space-x-3 mt-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-accent/40 bg-accent/10 text-xl font-bold" style={{ color, background: `${color}22` }}>
        {avatar}
      </div>
      <div className="text-left">
        <p className="font-semibold text-base text-foreground flex items-center gap-1">{name} <Verified className="w-4 h-4 text-accent" /></p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </div>
)

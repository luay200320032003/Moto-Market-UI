import { Link, useSearchParams } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";

const HERO_IMAGE = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1600";

export default function ComingSoon() {
  const [searchParams] = useSearchParams();
  const feature = searchParams.get("feature") || "This feature";

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Motorcycle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-600/20 border border-red-500/40 px-4 py-1.5 text-sm font-semibold text-red-400 mb-6">
          <Sparkles className="w-4 h-4" />
          Coming Soon
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          {feature}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10">
          We're revving the engine on this one. Check back soon — it'll be worth the wait.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

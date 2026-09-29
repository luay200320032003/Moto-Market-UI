import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, Loader2, AlertCircle, ExternalLink, Tag, Calendar, ArrowRight, Bot, Bike } from "lucide-react";
import { createPageUrl } from "../utils";
import { askAi, AskAiResult } from "../services/AskAiService";

// The search index's contentType vocabulary is the OPPOSITE of the rest of
// the app's `source` field: "listing" here means MarketCheck/dealer data,
// "userListing" means an actual user-created listing (dbo.Listings).
function resultLink(result: AskAiResult): { to: string; external: boolean } | null {
  if (result.contentType === "listing" && result.listingId != null) {
    return { to: createPageUrl(`Motorcycle?id=${result.listingId}`), external: false };
  }
  if (result.contentType === "userListing" && result.listingId != null) {
    return { to: createPageUrl(`Motorcycle?id=${result.listingId}&type=listing`), external: false };
  }
  if (result.url) {
    return { to: result.url, external: /^https?:\/\//i.test(result.url) };
  }
  return null;
}

function ResultCardBanner({ imageUrl, alt }: { imageUrl?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        onError={() => setFailed(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-600/20 via-gray-950/80 to-gray-950/80">
      <Bike className="w-10 h-10 text-red-400/70" />
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: Math.min(i, 8) * 0.06 } }),
};

const EXAMPLE_PROMPTS = [
  "A reliable commuter bike under $6,000",
  "Beginner-friendly cruiser from Honda or Yamaha",
  "Fast sportbike under 10,000 miles",
];

export default function AskAi() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<AskAiResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (overrideQuestion?: string) => {
    const trimmed = (overrideQuestion ?? question).trim();
    if (!trimmed || isLoading) return;

    setQuestion(trimmed);
    setIsLoading(true);
    setError("");
    setAnswer("");
    setResults(null);

    try {
      const data = await askAi(trimmed);
      setAnswer(data.answer);
      setResults(data.results);
    } catch (err) {
      console.error("Ask AI search failed:", err);
      setError("Something went wrong while searching. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gray-900 overflow-hidden">
      {/* Ambient background — carries through the whole page, not just the hero */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-24 w-[24rem] h-[24rem] bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1600"
            alt="Motorcycles"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/85 to-gray-900"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-600/15 border border-red-500/40 px-4 py-1.5 text-sm font-semibold text-red-400 mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Search
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-tight">
            Find Your Perfect
            <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent"> Ride</span>
          </h1>
          <p className="text-gray-400 mb-10 text-lg">
            Describe what you're looking for in plain English — budget, style, brand, whatever matters to you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 bg-white/5 backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-2xl shadow-black/40">
            <div className="flex items-center flex-1 gap-2 px-2">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="e.g. a reliable commuter bike under $6,000"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white border-0 text-base h-12 placeholder:text-gray-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={isLoading || !question.trim()}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              {isLoading ? "Searching..." : "Ask"}
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {answer && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl shadow-black/20 px-5 py-4 mb-8"
            >
              <div className="mt-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-white">
                <Bot className="w-4 h-4" />
              </div>
              <p className="text-gray-200 leading-relaxed whitespace-pre-line">{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {results === null && !isLoading && !error && (
          <div className="text-center py-16">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-gray-400 mb-6">Not sure where to start? Try one of these:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSearch(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {results && results.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-gray-400">No matches found. Try describing what you're after a little differently.</p>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((result, i) => {
              const link = resultLink(result);
              const heading =
                result.make || result.model
                  ? `${result.year ? `${result.year} ` : ""}${result.make ?? ""} ${result.model ?? ""}`.trim()
                  : result.title;

              const card = (
                <motion.div
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="group h-full bg-white/5 backdrop-blur-xl hover:bg-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/10 hover:border-red-500/30"
                >
                  <div className="relative h-32 bg-gray-900">
                    <ResultCardBanner imageUrl={result.imageUrl} alt={heading} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {result.year && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-gray-200">
                        <Calendar className="w-3 h-3" />
                        {result.year}
                      </span>
                    )}

                    {result.price != null && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                        <Tag className="w-3 h-3" />
                        ${result.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-white truncate group-hover:text-red-400 transition-colors">
                        {heading}
                      </h3>
                      {(result.make || result.model) && result.title && result.title !== heading && (
                        <p className="text-sm text-gray-500 truncate mt-0.5">{result.title}</p>
                      )}
                    </div>
                    {link?.external ? (
                      <ExternalLink className="w-4 h-4 shrink-0 text-gray-500 group-hover:text-red-400 transition-colors" />
                    ) : (
                      <ArrowRight className="w-4 h-4 shrink-0 text-gray-600 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </div>
                </motion.div>
              );

              if (!link) return <div key={i}>{card}</div>;

              return link.external ? (
                <a key={i} href={link.to} target="_blank" rel="noopener noreferrer" className="block h-full">
                  {card}
                </a>
              ) : (
                <Link key={i} to={link.to} className="block h-full">
                  {card}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

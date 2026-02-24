import { Sparkles, TrendingUp, Lightbulb, Zap } from "lucide-react";

interface InsightArticle {
  title: string;
  views: number;
  category?: string;
}

interface AIInsightsProps {
  topArticles: InsightArticle[];
}

export default function AIInsights({ topArticles = [] }: AIInsightsProps) {
  const trending = topArticles[0];
  const secondary = topArticles[1];

  return (
    <div className="bg-gradient-to-br from-[#4c1d95] to-[#5b21b6] rounded-xl p-6 text-white shadow-lg relative overflow-hidden h-full flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={100} />
      </div>

      <div className="flex items-center gap-2 mb-6 relative z-10">
        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
          <Sparkles size={20} className="text-yellow-300" />
        </div>
        <h3 className="text-xl font-bold">AI Insights</h3>
      </div>

      <div className="space-y-4 relative z-10 flex-1 overflow-y-auto pr-2">
        {/* Insight 1: Trending */}
        {trending ? (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-white/20 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-yellow-300 text-sm font-bold uppercase tracking-wider">
                <TrendingUp size={14} /> Trending Topic Alert
              </div>
              <span className="bg-yellow-500/20 text-yellow-200 text-[10px] px-2 py-0.5 rounded border border-yellow-500/30">
                HIGH
              </span>
            </div>
            <p className="text-sm text-gray-100 leading-relaxed">
              Search volume for <strong>&ldquo;{trending.title}&rdquo;</strong>{" "}
              is rising. Current views: <strong>{trending.views}</strong>.
            </p>
            <button className="mt-3 flex items-center gap-2 text-xs font-bold bg-white text-purple-900 px-3 py-1.5 rounded hover:bg-gray-100 transition">
              <Zap size={12} /> View Details
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 flex flex-col items-center justify-center text-center h-[140px] border border-white/5">
            <Lightbulb size={24} className="text-white/40 mb-3" />
            <p className="text-sm text-gray-200 font-medium">
              Waiting for data...
            </p>
            <p className="text-xs text-blue-200 mt-1">
              Insights will appear as visitors arrive.
            </p>
          </div>
        )}

        {/* Insight 2: SEO or Secondary */}
        {secondary && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-white/20 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-green-300 text-sm font-bold uppercase tracking-wider">
                <Lightbulb size={14} /> Popular Category
              </div>
            </div>
            <p className="text-sm text-gray-100 leading-relaxed">
              <strong>{secondary.category || "Opinion"}</strong> is getting
              attention. Consider writing a follow-up piece.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

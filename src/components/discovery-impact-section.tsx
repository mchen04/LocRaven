import { CheckCircle, Clock, Eye, EyeOff, MapPin, Search, Target,TrendingUp, Users, XCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  before: {
    icon: React.ReactNode;
    text: string;
    value: string;
  };
  after: {
    icon: React.ReactNode;
    text: string;
    value: string;
  };
}

function MetricCard({ title, before, after }: MetricCardProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6 text-center">{title}</h3>
      
      <div className="space-y-4">
        {/* Before */}
        <div className="flex items-center gap-3 p-3 bg-red-950/30 border border-red-800/30 rounded-md">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-red-200 text-sm">{before.text}</div>
            <div className="text-red-100 font-semibold">{before.value}</div>
          </div>
        </div>
        
        {/* Arrow */}
        <div className="flex justify-center">
          <TrendingUp className="w-6 h-6 text-green-400" />
        </div>
        
        {/* After */}
        <div className="flex items-center gap-3 p-3 bg-green-950/30 border border-green-800/30 rounded-md">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-green-200 text-sm">{after.text}</div>
            <div className="text-green-100 font-semibold">{after.value}</div>
          </div>
        </div>
      </div>
    </div>
  );
}


export function DiscoveryImpactSection() {
  return (
    <section className="flex flex-col gap-12 rounded-lg bg-black py-12">
      {/* Problem Section */}
      <div className="text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-4">
          Your Business May Be Missing 56% of Potential Customers
        </h2>
        <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-8">
          Every day, millions of people search for businesses like yours. But if you're not optimized for discovery, you're invisible to more than half of them.
        </p>
        
        {/* Problem Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="bg-red-950/30 border border-red-800/30 rounded-lg p-4">
            <EyeOff className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-300">58%</div>
            <div className="text-sm text-red-200">Businesses Not Optimized</div>
          </div>
          
          <div className="bg-blue-950/30 border border-blue-800/30 rounded-lg p-4">
            <Search className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-300">56%</div>
            <div className="text-sm text-blue-200">Searches Are Discovery</div>
          </div>
          
          <div className="bg-purple-950/30 border border-purple-800/30 rounded-lg p-4">
            <MapPin className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-300">5.9M</div>
            <div className="text-sm text-purple-200">"Near Me" Keywords</div>
          </div>
          
          <div className="bg-yellow-950/30 border border-yellow-800/30 rounded-lg p-4">
            <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-300">900%</div>
            <div className="text-sm text-yellow-200">Growth in 2 Years</div>
          </div>
        </div>
      </div>

      {/* What LocRaven Does */}
      <div className="px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            AI-Optimized Pages Built for Discovery
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <Target className="w-8 h-8 text-green-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Multiple Page Types</h4>
              <p className="text-zinc-300">Generates 6 different optimized pages: business, update, category, location, service, and competitive pages.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <Search className="w-8 h-8 text-blue-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Technical SEO</h4>
              <p className="text-zinc-300">Adds schema markup, local keywords, and structured data that search engines require to find you.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <MapPin className="w-8 h-8 text-purple-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Location-Specific</h4>
              <p className="text-zinc-300">Creates content targeting every search intent: "near me", branded local, service urgent, and competitive.</p>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <Clock className="w-8 h-8 text-orange-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Automatic Updates</h4>
              <p className="text-zinc-300">Updates in real-time with your business changes, no technical knowledge required.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expected Impact */}
      <div className="px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-2 text-center">
            Expected Impact Based on Industry Data
          </h3>
          <p className="text-center text-zinc-400 mb-8 text-sm">
            *Results based on industry averages. Individual results vary.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Discovery Potential"
              before={{
                icon: <EyeOff className="w-4 h-4" />,
                text: "Missing discovery searches",
                value: "Invisible online"
              }}
              after={{
                icon: <Eye className="w-4 h-4" />,
                text: "Found in local searches",
                value: "100s of searches*"
              }}
            />
            
            <MetricCard
              title="Customer Potential"
              before={{
                icon: <Users className="w-4 h-4" />,
                text: "Conversion opportunity",
                value: "28% of searchers*"
              }}
              after={{
                icon: <Users className="w-4 h-4" />,
                text: "Visit within 24 hours",
                value: "76% of searchers*"
              }}
            />
            
            <MetricCard
              title="Time Savings"
              before={{
                icon: <Clock className="w-4 h-4" />,
                text: "Current marketing time",
                value: "20 hours/week"
              }}
              after={{
                icon: <Clock className="w-4 h-4" />,
                text: "With LocRaven",
                value: "2 hours/week"
              }}
            />
          </div>
        </div>
      </div>

      {/* Beta Program */}
      <div className="px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700/50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Currently in Beta - Sign Up Free
            </h3>
            <p className="text-zinc-300 mb-6">
              LocRaven is currently in beta. Join free and help us build the future of local business discovery.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2 text-green-300">
                <CheckCircle className="w-4 h-4" />
                <span>Free access during beta period</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-300">
                <CheckCircle className="w-4 h-4" />
                <span>AI-generated pages for local discovery</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-300">
                <CheckCircle className="w-4 h-4" />
                <span>Help shape the product with feedback</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-300">
                <CheckCircle className="w-4 h-4" />
                <span>Early access to new features</span>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
              Sign Up Free
            </button>
            
            <p className="text-xs text-zinc-500 mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
      
      {/* Verified Stats */}
      <div className="text-center px-4">
        <div className="inline-flex items-center gap-6 bg-zinc-900/50 border border-zinc-800 rounded-full px-6 py-3">
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">56%</div>
            <div className="text-xs text-zinc-400">Discovery Searches</div>
          </div>
          <div className="w-px h-6 bg-zinc-700" />
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">76%</div>
            <div className="text-xs text-zinc-400">Visit in 24h</div>
          </div>
          <div className="w-px h-6 bg-zinc-700" />
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">7x</div>
            <div className="text-xs text-zinc-400">More Clicks</div>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Source: Google, BrightLocal, Think with Google 2024
        </p>
      </div>
    </section>
  );
}

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const SearchArena = () => {
  const searchModels = [
    { rank: 1, model: "gemini-2-pro-grounding", organization: "Google", score: 1142, votes: "1,215", ciScore: "", license: "Proprietary" },
    { rank: 1, model: "ppl-sonar-reasoning-pro-high", organization: "Perplexity", score: 1136, votes: "861", ciScore: "", license: "Proprietary" },
    { rank: 3, model: "ppl-sonar-reasoning", organization: "Perplexity", score: 1097, votes: "1,644", ciScore: "", license: "Proprietary" },
    { rank: 3, model: "ppl-sonar", organization: "Perplexity", score: 1072, votes: "1,208", ciScore: "", license: "Proprietary" },
    { rank: 3, model: "ppl-sonar-pro-high", organization: "Perplexity", score: 1071, votes: "1,364", ciScore: "", license: "Proprietary" },
    { rank: 4, model: "ppl-sonar-pro", organization: "Perplexity", score: 1066, votes: "1,214", ciScore: "", license: "Proprietary" },
    { rank: 7, model: "gemini-2.0-flash-grounding", organization: "Google", score: 1028, votes: "1,193", ciScore: "", license: "Proprietary" },
    { rank: 7, model: "api-gpt-4o-search", organization: "OpenAI", score: 1000, votes: "1,196", ciScore: "", license: "Proprietary" },
    { rank: 7, model: "api-gpt-4o-search-high", organization: "OpenAI", score: 999, votes: "1,707", ciScore: "", license: "Proprietary" },
    { rank: 8, model: "api-gpt-4o-search-high-loc", organization: "OpenAI", score: 994, votes: "1,226", ciScore: "", license: "Proprietary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Search VibeCoders Board</h1>
            <p className="text-muted-foreground mb-4">
              Compare search and retrieval models across various tasks and domains.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Last Updated: May 30, 2025</span>
              <span>Total Votes: 25,988</span>
              <span>Total Models: 14</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">Overall</Badge>
        </div>

        {/* Leaderboard Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle>Search Model Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-3">Rank (UB)</th>
                    <th className="text-left p-3">Model</th>
                    <th className="text-left p-3">Score</th>
                    <th className="text-left p-3">Votes</th>
                    <th className="text-left p-3">Organization</th>
                    <th className="text-left p-3">License</th>
                  </tr>
                </thead>
                <tbody>
                  {searchModels.map((model, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-bold text-primary">{model.rank}</td>
                      <td className="p-3 font-medium">{model.model}</td>
                      <td className="p-3 font-bold text-secondary">{model.score}</td>
                      <td className="p-3">{model.votes}</td>
                      <td className="p-3 text-muted-foreground">{model.organization}</td>
                      <td className="p-3">
                        <Badge variant="secondary">{model.license}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline">View all</Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default SearchArena;

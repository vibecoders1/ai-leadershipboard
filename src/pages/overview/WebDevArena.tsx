
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const WebDevArena = () => {
  const webdevModels = [
    { rank: 1, model: "Claude Opus 4 (20250514)", organization: "Anthropic", score: 1416, votes: "1,494", ciScore: "+17/-16", license: "Proprietary" },
    { rank: 1, model: "Gemini-2.5-Pro-Preview-05-06", organization: "Google", score: 1409, votes: "3,740", ciScore: "+15/-10", license: "Proprietary" },
    { rank: 1, model: "Claude Sonnet 4 (20250514)", organization: "Anthropic", score: 1386, votes: "1,490", ciScore: "+17/-15", license: "Proprietary" },
    { rank: 4, model: "Claude 3.7 Sonnet (20250219)", organization: "Anthropic", score: 1357, votes: "7,481", ciScore: "+9/-7", license: "Proprietary" },
    { rank: 5, model: "Gemini-2.5-Flash-Preview-05-20", organization: "Google", score: 1313, votes: "2,312", ciScore: "+12/-11", license: "Proprietary" },
    { rank: 6, model: "GPT-4.1-2025-04-14", organization: "OpenAI", score: 1256, votes: "5,278", ciScore: "+10/-9", license: "Proprietary" },
    { rank: 7, model: "Claude 3.5 Sonnet (20241022)", organization: "Anthropic", score: 1238, votes: "26,338", ciScore: "+4/-5", license: "Proprietary" },
    { rank: 8, model: "DeepSeek-V3-0324", organization: "DeepSeek", score: 1207, votes: "1,097", ciScore: "+21/-21", license: "MIT" },
    { rank: 8, model: "DeepSeek-R1", organization: "DeepSeek", score: 1199, votes: "3,760", ciScore: "+10/-9", license: "MIT" },
    { rank: 8, model: "o3-2025-04-16", organization: "OpenAI", score: 1188, votes: "4,209", ciScore: "+9/-11", license: "Proprietary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">WebDev VibeCoders Board</h1>
            <p className="text-muted-foreground mb-4">
              Compare the performance of AI models specialized in web development tasks like HTML, CSS, and JavaScript.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Test your web development prompts at web.lmarena.ai.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Last Updated: May 28, 2025</span>
              <span>Total Votes: 122,675</span>
              <span>Total Models: 33</span>
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
            <CardTitle>WebDev Model Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-3">Rank (UB)</th>
                    <th className="text-left p-3">Model</th>
                    <th className="text-left p-3">Score</th>
                    <th className="text-left p-3">95% CI (±)</th>
                    <th className="text-left p-3">Votes</th>
                    <th className="text-left p-3">Organization</th>
                    <th className="text-left p-3">License</th>
                  </tr>
                </thead>
                <tbody>
                  {webdevModels.map((model, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-bold text-primary">{model.rank}</td>
                      <td className="p-3 font-medium">{model.model}</td>
                      <td className="p-3 font-bold text-secondary">{model.score}</td>
                      <td className="p-3">{model.ciScore}</td>
                      <td className="p-3">{model.votes}</td>
                      <td className="p-3 text-muted-foreground">{model.organization}</td>
                      <td className="p-3">
                        <Badge variant={model.license === "MIT" ? "default" : "secondary"}>
                          {model.license}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default WebDevArena;

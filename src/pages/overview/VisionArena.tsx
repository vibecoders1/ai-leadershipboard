
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const VisionArena = () => {
  const visionModels = [
    { rank: 1, model: "gemini-2.5-pro-preview-05-06", organization: "Google", score: 1291, votes: "1,558", ciScore: "+15/-15", license: "Proprietary" },
    { rank: 2, model: "o3-2025-04-16", organization: "OpenAI", score: 1249, votes: "1,235", ciScore: "+21/-16", license: "Proprietary" },
    { rank: 2, model: "chatgpt-4o-latest-20250326", organization: "OpenAI", score: 1247, votes: "2,861", ciScore: "+10/-11", license: "Proprietary" },
    { rank: 2, model: "gpt-4.5-preview-2025-02-27", organization: "OpenAI", score: 1231, votes: "3,059", ciScore: "+13/-10", license: "Proprietary" },
    { rank: 2, model: "gemini-2.5-flash-preview-05-20", organization: "Google", score: 1220, votes: "493", ciScore: "+19/-24", license: "Proprietary" },
    { rank: 3, model: "o4-mini-2025-04-16", organization: "OpenAI", score: 1216, votes: "1,091", ciScore: "+18/-18", license: "Proprietary" },
    { rank: 4, model: "gpt-4.1-2025-04-14", organization: "OpenAI", score: 1223, votes: "2,020", ciScore: "+9/-13", license: "Proprietary" },
    { rank: 4, model: "gemini-2.5-flash-preview-04-17", organization: "Google", score: 1212, votes: "2,365", ciScore: "+11/-11", license: "Proprietary" },
    { rank: 6, model: "o1-2024-12-17", organization: "OpenAI", score: 1199, votes: "3,822", ciScore: "+7/-9", license: "Proprietary" },
    { rank: 6, model: "gpt-4.1-mini-2025-04-14", organization: "OpenAI", score: 1192, votes: "1,415", ciScore: "+14/-16", license: "Proprietary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Vision VibeCoders Board</h1>
            <p className="text-muted-foreground mb-4">
              View rankings across multimodal, generative AI models capable of understanding and processing visual inputs.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Last Updated: May 23, 2025</span>
              <span>Total Votes: 197,715</span>
              <span>Total Models: 75</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">Overall</Badge>
          <Button variant="ghost" size="sm">Default</Button>
        </div>

        {/* Leaderboard Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle>Vision Model Rankings</CardTitle>
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
                  {visionModels.map((model, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-bold text-primary">{model.rank}</td>
                      <td className="p-3 font-medium">{model.model}</td>
                      <td className="p-3 font-bold text-secondary">{model.score}</td>
                      <td className="p-3">{model.ciScore}</td>
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

export default VisionArena;

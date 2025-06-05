
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CopilotArena = () => {
  const copilotModels = [
    { rank: 1, model: "Deepseek V2.5 (FIM)", organization: "Deepseek AI", score: 1028, votes: "2,292", ciScore: "+15/-16", license: "Deepseek" },
    { rank: 1, model: "Claude 3.5 Sonnet (06/20)", organization: "Anthropic", score: 1012, votes: "3,544", ciScore: "+11/-12", license: "Proprietary" },
    { rank: 1, model: "Claude 3.5 Sonnet (10/22)", organization: "Anthropic", score: 1004, votes: "3,596", ciScore: "+12/-10", license: "Proprietary" },
    { rank: 1, model: "Codestral (25.01)", organization: "Mistral", score: 1001, votes: "2,180", ciScore: "+13/-12", license: "Mistral AI N..." },
    { rank: 1, model: "Qwen-2.5-Coder (FIM)", organization: "Alibaba", score: 998, votes: "3,401", ciScore: "+16/-13", license: "Alibaba" },
    { rank: 1, model: "Mercury Coder Mini", organization: "Inception AI", score: 994, votes: "1,430", ciScore: "+19/-18", license: "Unreleased" },
    { rank: 2, model: "Codestral (05/24)", organization: "Mistral", score: 1001, votes: "5,744", ciScore: "+6/-9", license: "Mistral AI N..." },
    { rank: 3, model: "Gemini-1.5-Pro-002", organization: "Google", score: 986, votes: "3,441", ciScore: "+10/-11", license: "Proprietary" },
    { rank: 3, model: "GPT-4o (08/06)", organization: "OpenAI", score: 986, votes: "4,464", ciScore: "+11/-10", license: "Proprietary" },
    { rank: 3, model: "Meta-Llama-3.1-405B-Instruct", organization: "Meta", score: 984, votes: "3,432", ciScore: "+10/-11", license: "Llama 3.1 C..." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Copilot VibeCoders Board</h1>
            <p className="text-muted-foreground mb-4">
              Compare how well AI coding assistants understand and generate code across various programming languages and tasks.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Learn more about Copilot Arena at our blog.
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
            <CardTitle>Copilot Model Rankings</CardTitle>
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
                  {copilotModels.map((model, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-bold text-primary">{model.rank}</td>
                      <td className="p-3 font-medium">{model.model}</td>
                      <td className="p-3 font-bold text-secondary">{model.score}</td>
                      <td className="p-3">{model.ciScore}</td>
                      <td className="p-3">{model.votes}</td>
                      <td className="p-3 text-muted-foreground">{model.organization}</td>
                      <td className="p-3">
                        <Badge variant={model.license.includes("MIT") || model.license.includes("Apache") ? "default" : "secondary"}>
                          {model.license}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline">Collapse table</Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default CopilotArena;

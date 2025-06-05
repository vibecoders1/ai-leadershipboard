
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Trophy, Medal, Star } from 'lucide-react';

const TopPerformers = () => {
  const leaders = [
    {
      rank: 1,
      name: "Human Panel",
      organization: "Human",
      score: 98.0,
      type: "N/A",
      icon: Crown,
      description: "The gold standard for AI evaluation, representing human-level performance."
    },
    {
      rank: 2,
      name: "o3-preview (Low)",
      organization: "OpenAI",
      score: 75.7,
      type: "CoT + Synthesis",
      icon: Trophy,
      description: "Leading AI model with advanced reasoning capabilities."
    },
    {
      rank: 3,
      name: "ARChitects",
      organization: "ARC Prize 2024",
      score: 56.0,
      type: "Custom",
      icon: Medal,
      description: "Innovative custom architecture designed for complex reasoning tasks."
    },
    {
      rank: 4,
      name: "o3 (Medium)",
      organization: "OpenAI",
      score: 53.0,
      type: "CoT",
      icon: Star,
      description: "High-performing model with consistent reasoning patterns."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
            TOP PERFORMERS
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up">
            Meet the top performers in artificial intelligence reasoning
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto animate-pulse"></div>
        </section>

        {/* Leadership Cards */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center animate-fade-in-up">ELITE PERFORMERS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((leader, index) => {
              const IconComponent = leader.icon;
              return (
                <Card 
                  key={leader.rank} 
                  className="bg-card/50 backdrop-blur-sm border-border cyber-gradient animate-fade-in-up hover:scale-105 transition-transform"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-primary/20">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{leader.name}</CardTitle>
                    <CardDescription>{leader.organization}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="text-3xl font-bold text-secondary">
                      {leader.score}%
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/50">
                      {leader.type}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {leader.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Performance Insights */}
        <section className="space-y-6 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-center text-primary">PERFORMANCE INSIGHTS</h2>
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8 grid-bg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4">Performance Trends</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Human performance remains the gold standard at 98%</li>
                  <li>• AI models are rapidly approaching human-level reasoning</li>
                  <li>• Custom architectures show promising specialized capabilities</li>
                  <li>• Cost efficiency varies significantly across different approaches</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4">Key Observations</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Chain of Thought reasoning shows consistent performance</li>
                  <li>• Synthesis capabilities enhance problem-solving abilities</li>
                  <li>• Large language models demonstrate strong baseline performance</li>
                  <li>• Innovation in custom models drives breakthrough results</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TopPerformers;

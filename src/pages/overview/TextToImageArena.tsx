
import { Header } from '../../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Image, Palette, Zap, Crown, Star, TrendingUp } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const TextToImageArena = () => {
  // Sample data for charts
  const performanceData = [
    { name: 'DALL-E 3', score: 92, generation_time: 8.5, quality: 95 },
    { name: 'Midjourney v6', score: 89, generation_time: 12.2, quality: 91 },
    { name: 'Stable Diffusion XL', score: 85, generation_time: 6.8, quality: 87 },
    { name: 'Adobe Firefly', score: 83, generation_time: 9.1, quality: 84 },
    { name: 'Leonardo AI', score: 81, generation_time: 7.3, quality: 82 },
    { name: 'RunwayML', score: 78, generation_time: 10.5, quality: 79 }
  ];

  const qualityTrendData = [
    { month: 'Jan', dalle3: 88, midjourney: 85, stable: 82 },
    { month: 'Feb', dalle3: 89, midjourney: 86, stable: 83 },
    { month: 'Mar', dalle3: 90, midjourney: 87, stable: 84 },
    { month: 'Apr', dalle3: 91, midjourney: 88, stable: 85 },
    { month: 'May', dalle3: 92, midjourney: 89, stable: 85 },
    { month: 'Jun', dalle3: 92, midjourney: 89, stable: 85 }
  ];

  const styleCategories = [
    { name: 'Photorealistic', value: 35, color: '#8B5CF6' },
    { name: 'Artistic', value: 28, color: '#06B6D4' },
    { name: 'Cartoon/Anime', value: 18, color: '#10B981' },
    { name: 'Abstract', value: 12, color: '#F59E0B' },
    { name: 'Technical', value: 7, color: '#EF4444' }
  ];

  const topModels = [
    {
      rank: 1,
      name: "DALL-E 3",
      organization: "OpenAI",
      score: 92,
      badge: "🏆",
      strengths: ["Photorealism", "Text adherence", "Creative interpretation"],
      weaknesses: ["Speed", "Cost per generation"]
    },
    {
      rank: 2,
      name: "Midjourney v6",
      organization: "Midjourney Inc",
      score: 89,
      badge: "🥈",
      strengths: ["Artistic quality", "Style consistency", "Community"],
      weaknesses: ["Text generation", "Fine control"]
    },
    {
      rank: 3,
      name: "Stable Diffusion XL",
      organization: "Stability AI",
      score: 85,
      badge: "🥉",
      strengths: ["Open source", "Customization", "Speed"],
      weaknesses: ["Consistency", "Complex prompts"]
    }
  ];

  const evaluationMetrics = [
    { metric: "Visual Quality", weight: "30%", description: "Overall aesthetic and technical quality" },
    { metric: "Prompt Adherence", weight: "25%", description: "How well the image matches the text prompt" },
    { metric: "Creativity", weight: "20%", description: "Originality and artistic interpretation" },
    { metric: "Consistency", weight: "15%", description: "Reproducibility across similar prompts" },
    { metric: "Speed", weight: "10%", description: "Generation time and efficiency" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-8">
          <div className="flex items-center justify-center gap-3">
            <Image className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TEXT-TO-IMAGE VIBECODERS BOARD
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive evaluation of AI image generation models, comparing quality, creativity, and prompt adherence
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Palette className="w-4 h-4" />
              <span>6 Models Tested</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>1M+ Generations Analyzed</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>Updated Weekly</span>
            </div>
          </div>
        </section>

        {/* Performance Overview Chart */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Performance Overview</h2>
          <Card className="bg-card/50 backdrop-blur-sm border-border cyber-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Overall Performance Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="score" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quality Trends */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Quality Trends</h2>
          <Card className="bg-card/50 backdrop-blur-sm border-border cyber-gradient">
            <CardHeader>
              <CardTitle>6-Month Quality Evolution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={qualityTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 95]} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="dalle3" stroke="#8B5CF6" strokeWidth={3} name="DALL-E 3" />
                    <Line type="monotone" dataKey="midjourney" stroke="#06B6D4" strokeWidth={3} name="Midjourney" />
                    <Line type="monotone" dataKey="stable" stroke="#10B981" strokeWidth={3} name="Stable Diffusion" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Style Categories */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Popular Generation Styles</h2>
          <Card className="bg-card/50 backdrop-blur-sm border-border cyber-gradient">
            <CardHeader>
              <CardTitle>Distribution by Style Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={styleCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {styleCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`${value}%`, 'Usage']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {styleCategories.map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Top Models */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Top Performing Models</h2>
          <div className="grid gap-6">
            {topModels.map((model) => (
              <Card key={model.rank} className="bg-card/50 backdrop-blur-sm border-border cyber-gradient">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{model.badge}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-bold">{model.name}</h3>
                          <Badge variant="secondary">#{model.rank}</Badge>
                        </div>
                        <p className="text-muted-foreground">{model.organization}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{model.score}</div>
                      <div className="text-sm text-muted-foreground">Overall Score</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="font-semibold text-green-500 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {model.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-500 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1">
                        {model.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Evaluation Methodology */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Evaluation Methodology</h2>
          <Card className="bg-card/50 backdrop-blur-sm border-border cyber-gradient">
            <CardHeader>
              <CardTitle>How We Measure Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {evaluationMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                    <div>
                      <h4 className="font-semibold">{metric.metric}</h4>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                    <Badge variant="outline">{metric.weight}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 py-12">
          <h2 className="text-3xl font-bold">Ready to Explore More?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dive deeper into our comprehensive AI model evaluations and stay updated with the latest developments
          </p>
          <Button size="lg" className="gap-2">
            View All VibeCoders Boards
            <ArrowRight className="w-4 h-4" />
          </Button>
        </section>
      </main>
    </div>
  );
};

export default TextToImageArena;

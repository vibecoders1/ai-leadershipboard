
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Brain, Zap, Target, Users } from 'lucide-react';

const About = () => {
  const aiResources = [
    {
      name: "OpenAI",
      description: "Leading AI research company behind GPT models",
      url: "https://openai.com",
      logo: "🤖"
    },
    {
      name: "Anthropic",
      description: "AI safety focused company creating Claude models",
      url: "https://anthropic.com",
      logo: "🧠"
    },
    {
      name: "Google AI",
      description: "Google's artificial intelligence research division",
      url: "https://ai.google",
      logo: "🔍"
    },
    {
      name: "Meta AI",
      description: "Meta's AI research and development initiatives",
      url: "https://ai.meta.com",
      logo: "📘"
    },
    {
      name: "DeepMind",
      description: "Google's AI subsidiary focusing on general intelligence",
      url: "https://deepmind.com",
      logo: "🧬"
    },
    {
      name: "Hugging Face",
      description: "Open-source AI community and model hub",
      url: "https://huggingface.co",
      logo: "🤗"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Intelligence Tracking",
      description: "Monitor the latest developments in artificial intelligence reasoning and performance metrics."
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get instant updates on new model releases and performance benchmarks across the industry."
    },
    {
      icon: Target,
      title: "Comprehensive Analysis",
      description: "Deep dive into model capabilities, costs, and effectiveness across different use cases."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by and for the AI community to foster collaboration and knowledge sharing."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
            ABOUT VIBE CODERS
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up max-w-3xl mx-auto">
            Empowering the AI community with comprehensive intelligence tracking and performance analytics
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto animate-pulse"></div>
        </section>

        {/* Mission Statement */}
        <section className="space-y-6 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-center text-primary">OUR MISSION</h2>
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8 grid-bg">
            <div className="prose prose-invert max-w-none text-center">
              <p className="text-lg leading-relaxed text-muted-foreground">
                At VIBE CODERS, we believe in democratizing access to AI performance data and insights. 
                Our platform serves as a comprehensive hub for tracking the latest developments in artificial 
                intelligence, providing researchers, developers, and enthusiasts with the tools they need to 
                understand and leverage cutting-edge AI capabilities.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center animate-fade-in-up">WHAT WE OFFER</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  className="bg-card/50 backdrop-blur-sm border-border cyber-gradient animate-fade-in-up hover:scale-105 transition-transform"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-primary/20">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* AI Resources */}
        <section className="space-y-6 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-center text-secondary">AI RESOURCES & REFERENCES</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiResources.map((resource, index) => (
              <Card 
                key={resource.name}
                className="bg-card/50 backdrop-blur-sm border-border cyber-gradient animate-fade-in-up hover:scale-105 transition-transform"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{resource.logo}</span>
                    <div>
                      <CardTitle className="text-lg">{resource.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {resource.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    asChild
                  >
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="space-y-6 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-center text-primary">GET IN TOUCH</h2>
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8 grid-bg text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Have questions, suggestions, or want to contribute to our platform? 
              We'd love to hear from the AI community!
            </p>
            <div className="space-y-4">
              <p className="text-secondary font-semibold">
                Follow our journey and connect with us
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  GitHub
                </Button>
                <Button variant="outline" size="sm">
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  Discord
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Globe, Eye, Image, Search, Bot } from 'lucide-react';

export const OverviewCards = () => {
  const overviewItems = [
    {
      title: 'Text VibeCoders Board',
      description: 'Explore cutting-edge text generation and language models performance',
      icon: Code,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      link: '/overview/text'
    },
    {
      title: 'WebDev VibeCoders Board',
      description: 'Discover the latest in web development AI assistance and automation',
      icon: Globe,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      link: '/overview/webdev'
    },
    {
      title: 'Vision VibeCoders Board',
      description: 'Advanced computer vision and image understanding capabilities',
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      link: '/overview/vision'
    },
    {
      title: 'Text-to-Image VibeCoders Board',
      description: 'Revolutionary AI models for generating images from text descriptions',
      icon: Image,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      link: '/overview/text-to-image'
    },
    {
      title: 'Search VibeCoders Board',
      description: 'Next-generation search and information retrieval systems',
      icon: Search,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      link: '/overview/search'
    },
    {
      title: 'Copilot VibeCoders Board',
      description: 'AI-powered coding assistants and development productivity tools',
      icon: Bot,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      link: '/overview/copilot'
    }
  ];

  return (
    <section className="space-y-8 animate-fade-in-up">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          EXPLORE OVERVIEW BOARDS
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Dive deeper into specialized AI domains and discover the leading models in each category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card 
              key={index} 
              className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-all duration-300 hover:scale-105 cyber-gradient group"
            >
              <CardHeader className="space-y-4">
                <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-6 h-6 ${item.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <Link to={item.link}>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 gap-2"
                  >
                    Explore Board
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

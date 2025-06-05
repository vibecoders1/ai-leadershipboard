import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, AlertCircle, ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <div className="text-8xl font-bold text-primary animate-fade-in">
              404
            </div>
            <h1 className="text-4xl font-bold text-foreground animate-fade-in">
              Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto animate-fade-in">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  Go Home
                </CardTitle>
                <CardDescription>
                  Return to the main dashboard and explore AI leaderboards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/">
                  <Button className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Explore
                </CardTitle>
                <CardDescription>
                  Browse top AI performers and models in different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/top-performers">
                  <Button variant="outline" className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    View Top Performers
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Support
                </CardTitle>
                <CardDescription>
                  Need help? Learn more about our AI evaluation platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/about">
                  <Button variant="outline" className="w-full">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Button 
              variant="ghost" 
              className="animate-fade-in hover-scale"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
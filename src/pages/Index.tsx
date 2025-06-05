
import { Header } from '../components/Header';
import { ScatterPlot } from '../components/ScatterPlot';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { InfoSections } from '../components/InfoSections';
import { OverviewCards } from '../components/OverviewCards';
import { Footer } from '../components/Footer';
import { useLeaderboardData } from '../hooks/useLeaderboardData';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { data, isLoading, error } = useLeaderboardData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">Error loading data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section with Animation */}
        <section className="text-center space-y-6 py-12">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
            AI LEADERSHIP BOARD
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up">BY VIBE CODERS</p>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto animate-pulse"></div>
        </section>

        {/* Main Graph Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center animate-fade-in-up">VIBE CODERS LEADERBOARD</h2>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 cyber-gradient animate-fade-in-up">
            <ScatterPlot data={data || []} />
          </div>
        </section>

        {/* Info Sections */}
        <InfoSections />

        {/* Leaderboard Table */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center animate-fade-in-up">LEADERBOARD BREAKDOWN</h2>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden cyber-gradient animate-fade-in-up">
            <LeaderboardTable data={data || []} />
          </div>
        </section>

        {/* Overview Cards */}
        <OverviewCards />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

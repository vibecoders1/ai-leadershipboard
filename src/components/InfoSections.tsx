
export const InfoSections = () => {
  return (
    <div className="space-y-12">
      {/* Understanding the Leaderboard */}
      <section className="space-y-6 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-center text-primary">UNDERSTANDING THE LEADERBOARD</h2>
        <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8 grid-bg">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-muted-foreground">
              The VIBE CODERS Leaderboard showcases the performance of various AI systems on cutting-edge reasoning and 
              evaluation benchmarks. Each entry represents a unique approach to solving complex problems that require 
              advanced artificial intelligence capabilities and fluid reasoning.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mt-4">
              Models are evaluated based on their ability to identify patterns, apply logical reasoning, and solve 
              novel challenges across different domains, making this one of the most comprehensive AI evaluation 
              platforms available.
            </p>
          </div>
        </div>
      </section>

      {/* Interpreting the Data */}
      <section className="space-y-6 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-center text-secondary">INTERPRETING THE DATA</h2>
        <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8 grid-bg">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-primary mb-4">Scoring System</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong className="text-foreground">VIBE CODERS 1:</strong> Primary reasoning and problem-solving score</li>
                <li>• <strong className="text-foreground">VIBE CODERS 2:</strong> Advanced evaluation metrics and performance</li>
                <li>• <strong className="text-foreground">Cost/Task:</strong> Economic efficiency per computational task</li>
                <li>• <strong className="text-foreground">System Types:</strong> Classification by methodology and architecture</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-4">Model Categories</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong className="text-green-400">CoT:</strong> Chain of Thought reasoning models</li>
                <li>• <strong className="text-blue-400">CoT + Synthesis:</strong> Enhanced reasoning with synthesis capabilities</li>
                <li>• <strong className="text-yellow-400">Base LLM:</strong> Foundational large language models</li>
                <li>• <strong className="text-orange-400">Custom:</strong> Specialized and custom-built architectures</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

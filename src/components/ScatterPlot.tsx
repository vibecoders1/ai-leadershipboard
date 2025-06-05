
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LeaderboardEntry } from '../types/leaderboard';

interface ScatterPlotProps {
  data: LeaderboardEntry[];
}

export const ScatterPlot = ({ data }: ScatterPlotProps) => {
  const chartData = data.map(entry => ({
    name: entry.ai_system,
    vibeCoders1: entry.arc_agi_1 || 0,
    vibeCoders2: entry.arc_agi_2 || 0,
    organization: entry.organization,
    systemType: entry.system_type,
  }));

  const getColorByType = (systemType: string) => {
    const colors = {
      'CoT': '#ff00ff',
      'CoT + Synthesis': '#00ffff',
      'Base LLM': '#ffff00',
      'Custom': '#ff6600',
      'N/A': '#ffffff',
    };
    return colors[systemType as keyof typeof colors] || '#ffffff';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg neon-glow animate-fade-in">
          <p className="text-primary font-bold">{data.name}</p>
          <p className="text-secondary">Organization: {data.organization}</p>
          <p className="text-muted-foreground">System: {data.systemType}</p>
          <p className="text-foreground">VIBE CODERS 1: {data.vibeCoders1}%</p>
          <p className="text-foreground">VIBE CODERS 2: {data.vibeCoders2}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96 grid-bg rounded-lg p-4 animate-fade-in-up">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 80, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 0, 255, 0.2)" />
          <XAxis 
            type="number" 
            dataKey="vibeCoders1" 
            name="VIBE CODERS 1 Score"
            domain={[0, 'dataMax + 5']}
            tick={{ fill: '#ffffff', fontSize: 12 }}
            tickCount={6}
            label={{ 
              value: 'VIBE CODERS 1 Score (%)', 
              position: 'insideBottom', 
              offset: -20, 
              style: { textAnchor: 'middle', fill: '#ffffff', fontSize: '14px' } 
            }}
          />
          <YAxis 
            type="number" 
            dataKey="vibeCoders2" 
            name="VIBE CODERS 2"
            domain={[0, 'dataMax + 5']}
            tick={{ fill: '#ffffff', fontSize: 12 }}
            tickCount={6}
            label={{ 
              value: 'VIBE CODERS 2 Score (%)', 
              angle: -90, 
              position: 'insideLeft', 
              offset: 10,
              style: { textAnchor: 'middle', fill: '#ffffff', fontSize: '14px' } 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {Object.entries(
            chartData.reduce((acc, item) => {
              if (!acc[item.systemType]) acc[item.systemType] = [];
              acc[item.systemType].push(item);
              return acc;
            }, {} as Record<string, any[]>)
          ).map(([systemType, items]) => (
            <Scatter
              key={systemType}
              name={systemType}
              data={items}
              fill={getColorByType(systemType)}
              stroke={getColorByType(systemType)}
              strokeWidth={2}
              fillOpacity={0.8}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

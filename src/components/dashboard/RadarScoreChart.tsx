import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Cell } from 'recharts'
import { Brain, Shield, Sparkles, Target, TrendingUp, Award } from 'lucide-react'

interface RadarScoreChartProps {
  domainScores?: Record<string, number>
  overallScore?: number
  completedDomains: string[]
}

export const RadarScoreChart: React.FC<RadarScoreChartProps> = ({
  domainScores,
  overallScore,
  completedDomains
}) => {
  // Transform domain scores into radar chart data
  const radarData = React.useMemo(() => {
    const domains = [
      { key: 'human_centricity', name: 'Human Centricity', icon: Brain, color: '#3b82f6' },
      { key: 'resilience', name: 'Resilience', icon: Shield, color: '#10b981' },
      { key: 'elca', name: 'Environmental LCA', icon: Sparkles, color: '#8b5cf6' },
      { key: 'slca', name: 'Social LCA', icon: Sparkles, color: '#f59e0b' },
      { key: 'lcc', name: 'Life Cycle Cost', icon: Sparkles, color: '#ef4444' }
    ]

    return domains.map(domain => ({
      domain: domain.name,
      score: domainScores?.[domain.key] || 0,
      fullMark: 100,
      color: domain.color,
      isCompleted: completedDomains.includes(domain.key)
    }))
  }, [domainScores, completedDomains])

  const getScoreRating = (score?: number) => {
    if (!score) return { text: 'Not Started', color: 'text-muted-foreground', bgColor: 'bg-gray-100' }
    if (score >= 90) return { text: 'Excellent', color: 'text-emerald-600', bgColor: 'bg-emerald-100' }
    if (score >= 80) return { text: 'Very Good', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 70) return { text: 'Good', color: 'text-lime-600', bgColor: 'bg-lime-100' }
    if (score >= 60) return { text: 'Satisfactory', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { text: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  const overallRating = getScoreRating(overallScore)

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="border-0 bg-gradient-to-br from-primary/5 via-primary/3 to-background">
        <CardHeader className="text-center pb-3">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Target className="w-6 h-6 text-primary" />
            Overall Assessment Score
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="relative">
            <div className="text-5xl font-bold text-primary mb-2">
              {overallScore ? overallScore.toFixed(1) : '--'}
            </div>
            <Badge className={`${overallRating.bgColor} ${overallRating.color} border-0`}>
              {overallRating.text}
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Award className="w-4 h-4" />
            <span>Out of 100 points</span>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                <PolarGrid gridType="polygon" stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="domain" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  className="text-sm"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Domain Score Legend */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
            {radarData.map((item, index) => {
              const rating = getScoreRating(item.score)
              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {item.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">
                      {item.score > 0 ? item.score.toFixed(1) : '--'}
                    </span>
                    {item.isCompleted && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                        Done
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
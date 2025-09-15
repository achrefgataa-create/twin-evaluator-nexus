import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Gauge, TrendingUp, Clock, CheckCircle, Brain, Shield, Sparkles, Trophy, Star, Activity } from 'lucide-react'

interface OverallScoreDisplayProps {
  overallScore?: number | null
  domainScores?: Record<string, number> | null
  finalResults?: any
  completionPercentage?: number
  totalDomains?: number
}

const CircularProgress: React.FC<{
  value: number | null | undefined
  size?: number
  strokeWidth?: number
  className?: string
}> = ({ value, size = 120, strokeWidth = 8, className = "" }) => {
  // Handle null/undefined values
  const safeValue = value ?? 0
  const percentage = Math.max(0, Math.min(100, safeValue))
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Color based on score
  const getColor = (score: number) => {
    if (score >= 80) return 'stroke-green-500'
    if (score >= 60) return 'stroke-yellow-500'
    if (score >= 40) return 'stroke-orange-500'
    return 'stroke-red-500'
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted stroke-current opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-500 ease-out ${getColor(percentage)}`}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <div className="text-2xl font-bold text-foreground">
          {value !== null && value !== undefined ? value.toFixed(1) : '--'}
        </div>
        <div className="text-xs text-muted-foreground">Score</div>
      </div>
    </div>
  )
}

export const OverallScoreDisplay: React.FC<OverallScoreDisplayProps> = ({
  overallScore,
  domainScores,
  finalResults,
  completionPercentage = 0,
  totalDomains = 5
}) => {
  const hasData = overallScore !== null && overallScore !== undefined
  const completedDomains = domainScores ? Object.keys(domainScores).length : 0

  // Group domains by modules
  const moduleScores = React.useMemo(() => {
    if (!domainScores) return {}
    
    const modules = {
      human_centricity: {
        name: 'Human Centricity',
        icon: Brain,
        domains: ['human_centricity'],
        color: 'text-sky-500'
      },
      resilience: {
        name: 'Resilience',
        icon: Shield,
        domains: ['resilience'],
        color: 'text-green-600'
      },
      sustainability: {
        name: 'Sustainability',
        icon: Sparkles,
        domains: ['elca', 'slca', 'lcc'],
        color: 'text-purple-600'
      }
    }

    const result: Record<string, { score: number; name: string; icon: any; color: string }> = {}
    
    Object.entries(modules).forEach(([key, module]) => {
      const scores = module.domains
        .map(domain => domainScores[domain])
        .filter(score => score !== undefined) as number[]
      
      if (scores.length > 0) {
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
        result[key] = {
          score: avgScore,
          name: module.name,
          icon: module.icon,
          color: module.color
        }
      }
    })

    return result
  }, [domainScores])

  const getScoreRating = (score?: number | null) => {
    if (!score) return { text: 'Not Available', color: 'text-muted-foreground', icon: Clock }
    if (score >= 90) return { text: 'Excellent', color: 'text-emerald-600', icon: Trophy }
    if (score >= 80) return { text: 'Very Good', color: 'text-green-600', icon: Star }
    if (score >= 70) return { text: 'Good', color: 'text-lime-600', icon: CheckCircle }
    if (score >= 60) return { text: 'Satisfactory', color: 'text-yellow-600', icon: TrendingUp }
    if (score >= 50) return { text: 'Needs Improvement', color: 'text-orange-600', icon: TrendingUp }
    return { text: 'Poor', color: 'text-red-600', icon: TrendingUp }
  }

  const scoreRating = getScoreRating(overallScore)
  const RatingIcon = scoreRating.icon

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card/90 to-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
          <Gauge className="w-6 h-6 text-primary" />
          Overall Assessment Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circular Progress with enhanced styling */}
        <div className="flex justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-full blur-xl"></div>
          <CircularProgress 
            value={overallScore} 
            size={160} 
            strokeWidth={14}
            className="relative z-10"
          />
        </div>

        {/* Score Rating with enhanced styling */}
        {hasData && (
          <div className="text-center space-y-3 p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10">
            <div className="flex items-center justify-center gap-3">
              <RatingIcon className={`w-6 h-6 ${scoreRating.color}`} />
              <span className={`text-lg font-bold ${scoreRating.color}`}>
                {scoreRating.text}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Assessment Quality Rating
            </p>
          </div>
        )}

        {/* Completion Progress with modern styling */}
        <div className="space-y-4 p-4 rounded-xl bg-gradient-to-r from-muted/20 to-muted/10 border border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Progress
            </span>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              {completedDomains}/{totalDomains} domains
            </Badge>
          </div>
          <Progress 
            value={completionPercentage} 
            className="h-3 bg-muted/50"
          />
          <p className="text-xs text-muted-foreground text-center font-medium">
            {completionPercentage.toFixed(0)}% Complete
          </p>
        </div>

        {/* Module Scores with enhanced design */}
        {Object.keys(moduleScores).length > 0 && (
          <div className="space-y-4">
            <h4 className="text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Module Performance
            </h4>
            <div className="space-y-3">
              {Object.entries(moduleScores).map(([moduleKey, module]) => {
                const Icon = module.icon
                const moduleRating = getScoreRating(module.score)
                
                return (
                  <div key={moduleKey} className="group p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-background/50">
                          <Icon className={`w-5 h-5 ${module.color}`} />
                        </div>
                        <span className="font-semibold text-foreground">
                          {module.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${moduleRating.color}`}>
                          {module.score.toFixed(1)}
                        </span>
                        <Badge variant="outline" className="text-xs bg-background/50">
                          {moduleRating.text}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Status Indicator with enhanced styling */}
        <div className="flex items-center justify-center gap-3 pt-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
          {completionPercentage === 100 ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-base font-bold text-green-600">Assessment Complete</span>
            </>
          ) : (
            <>
              <Clock className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-base font-bold text-primary">Assessment in Progress</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
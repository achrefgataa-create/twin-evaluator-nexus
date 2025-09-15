import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Brain, Users, Eye, Heart, Target, Sparkles } from 'lucide-react'

interface HumanCentricityPanelProps {
  data?: {
    scores?: {
      overall_score?: number
      domain_scores?: {
        Core_Usability?: number
        Performance?: number
        Workload_Comfort?: number
        Emotional_Response?: number
        Trust_Transparency?: number
      }
      detailed_metrics?: {
        Core_Usability?: {
          mean_rating?: number
          score?: number
          response_count?: number
          rating_distribution?: {
            min?: number
            max?: number
            std?: number
          }
        }
        Performance?: {
          raw_metrics?: {
            task_completion_time_min?: number
            error_rate?: number
            help_requests?: number
          }
          combined_score?: number
          individual_scores?: {
            time_score?: number
            errors_score?: number
            help_score?: number
          }
        }
        Workload_Comfort?: {
          combined_score?: number
          workload?: {
            mental_demand?: number
            effort_required?: number
            frustration_level?: number
            mean_workload?: number
            score?: number
          }
          cybersickness?: {
            mean_severity?: number
            score?: number
            symptoms?: Record<string, number>
          }
        }
        Emotional_Response?: {
          valence?: number
          arousal?: number
          valence_normalized?: number
          arousal_normalized?: number
          score?: number
          interpretation?: {
            valence_label?: string
            arousal_label?: string
            quadrant?: string
          }
        }
        Trust_Transparency?: {
          mean_rating?: number
          score?: number
          response_count?: number
          rating_distribution?: {
            min?: number
            max?: number
            std?: number
          }
        }
      }
    }
  }
}

export const HumanCentricityPanel: React.FC<HumanCentricityPanelProps> = ({ data }) => {
  if (!data?.scores) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="relative">
              <div className="p-4 rounded-full bg-muted/20 mb-4">
                <Sparkles className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-blue-900 to-blue-400 opacity-20 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Awaiting human centricity assessment</p>
              <p className="text-xs text-muted-foreground/70">User experience evaluation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { overall_score, domain_scores, detailed_metrics } = data.scores
  
  const categories = [
    { key: 'Core_Usability', label: 'Core Usability', icon: Users, color: '#3b82f6' },
    { key: 'Performance', label: 'Performance', icon: Target, color: '#10b981' },
    { key: 'Workload_Comfort', label: 'Workload & Comfort', icon: Brain, color: '#8b5cf6' },
    { key: 'Emotional_Response', label: 'Emotional Response', icon: Heart, color: '#f59e0b' },
    { key: 'Trust_Transparency', label: 'Trust & Transparency', icon: Eye, color: '#06b6d4' }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-500'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-red-500'
  }

  // Extract key insights from the new detailed metrics structure
  const getKeyInsights = () => {
    const insights = []
    
    // Trust rating from Trust_Transparency
    if (detailed_metrics?.Trust_Transparency?.mean_rating) {
      insights.push({
        label: 'Trust Rating',
        value: `${detailed_metrics.Trust_Transparency.mean_rating.toFixed(1)}/7`,
        type: 'rating'
      })
    }

    // Mental demand from Workload_Comfort
    if (detailed_metrics?.Workload_Comfort?.workload?.mental_demand) {
      insights.push({
        label: 'Mental Demand',
        value: `${detailed_metrics.Workload_Comfort.workload.mental_demand}/20`,
        type: 'scale'
      })
    }

    // Task completion time from Performance
    if (detailed_metrics?.Performance?.raw_metrics?.task_completion_time_min) {
      insights.push({
        label: 'Task Time',
        value: `${detailed_metrics.Performance.raw_metrics.task_completion_time_min}m`,
        type: 'time'
      })
    }

    // Error rate from Performance
    if (detailed_metrics?.Performance?.raw_metrics?.error_rate !== undefined) {
      insights.push({
        label: 'Error Rate',
        value: `${detailed_metrics.Performance.raw_metrics.error_rate}`,
        type: 'count'
      })
    }

    return insights.slice(0, 2) // Only show top 2 insights to fit the existing layout
  }

  const keyInsights = getKeyInsights()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-1"></CardHeader>
      
      <CardContent className="space-y-6">
        {/* Domain Scores Grid */}
        {domain_scores && (
          <div className="grid grid-cols-1 gap-4">
            {categories.map(({ key, label, icon: Icon, color }) => {
              const score = domain_scores[key as keyof typeof domain_scores]
              if (score === undefined) return null

              return (
                <div key={key} className="flex items-center justify-between group hover:bg-slate-50 p-3 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>
                      <Icon className="h-3.5 w-3.5" style={{ color }} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${getProgressColor(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 w-8 text-right">
                      {score.toFixed(0)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Key Insights - Only if we have meaningful data */}
        {keyInsights.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              Key Insights
            </div>
            <div className="grid grid-cols-2 gap-3">
              {keyInsights.map((insight, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-slate-900 mb-1">
                    {insight.value}
                  </div>
                  <div className="text-xs text-slate-500">
                    {insight.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
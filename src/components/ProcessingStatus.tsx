import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, Search, Brain, Palette, CheckCircle, XCircle } from 'lucide-react';
import { ProcessingStatus as ProcessingStatusType } from '@/types/brand';

interface ProcessingStatusProps {
  status: ProcessingStatusType;
}

const getStageIcon = (stage: ProcessingStatusType['stage']) => {
  switch (stage) {
    case 'uploading':
      return Upload;
    case 'extracting':
      return Search;
    case 'analyzing':
      return Brain;
    case 'generating':
      return Palette;
    case 'complete':
      return CheckCircle;
    case 'error':
      return XCircle;
    default:
      return Loader2;
  }
};

const getStageColor = (stage: ProcessingStatusType['stage']) => {
  switch (stage) {
    case 'complete':
      return 'text-green-500';
    case 'error':
      return 'text-red-500';
    default:
      return 'text-primary';
  }
};

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status }) => {
  const Icon = getStageIcon(status.stage);
  const colorClass = getStageColor(status.stage);
  const isAnimated = !['complete', 'error'].includes(status.stage);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Icon 
              className={`h-12 w-12 ${colorClass} ${isAnimated ? 'animate-spin' : ''}`} 
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {status.stage === 'uploading' && 'Uploading Content'}
              {status.stage === 'extracting' && 'Extracting Content'}
              {status.stage === 'analyzing' && 'Analyzing Brand Elements'}
              {status.stage === 'generating' && 'Generating Brand Pack'}
              {status.stage === 'complete' && 'Brand Pack Complete!'}
              {status.stage === 'error' && 'Processing Error'}
            </h3>
            <p className="text-muted-foreground">{status.message}</p>
          </div>
          
          <div className="space-y-2">
            <Progress value={status.progress} className="w-full" />
            <p className="text-sm text-muted-foreground">{status.progress}% complete</p>
          </div>
          
          {status.stage === 'error' && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                There was an error processing your content. Please check your API settings and try again.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
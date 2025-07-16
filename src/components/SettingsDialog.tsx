import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStore } from '@/store/useStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Key, Brain } from 'lucide-react';

const settingsSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  model: z.string().min(1, 'Model is required'),
});

type SettingsForm = z.infer<typeof settingsSchema>;

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const { apiKey, model, setApiKey, setModel } = useStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      apiKey,
      model,
    },
  });

  const onSubmit = (data: SettingsForm) => {
    setApiKey(data.apiKey);
    setModel(data.model);
    onOpenChange(false);
  };

  React.useEffect(() => {
    reset({ apiKey, model });
  }, [apiKey, model, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Settings</span>
          </DialogTitle>
          <DialogDescription>
            Configure your OpenRouter API settings for AI-powered brand generation.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>OpenRouter API Key</span>
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your OpenRouter API key"
              {...register('apiKey')}
            />
            {errors.apiKey && (
              <p className="text-sm text-destructive">{errors.apiKey.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Input
              id="model"
              placeholder="e.g., openai/gpt-4-vision-preview"
              {...register('model')}
            />
            {errors.model && (
              <p className="text-sm text-destructive">{errors.model.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Recommended: openai/gpt-4-vision-preview for best results with visual content
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Palette, Download } from 'lucide-react';
import { SettingsDialog } from '@/components/SettingsDialog';
import { useStore } from '@/store/useStore';

interface HeaderProps {
  onSettingsClick: () => void;
  onDownloadClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick, onDownloadClick }) => {
  const { currentBrandPack } = useStore();

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Palette className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Brand Pack Generator</h1>
            <p className="text-sm text-muted-foreground">AI-Powered Brand Identity Creation</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {currentBrandPack && onDownloadClick && (
            <Button variant="outline" onClick={onDownloadClick} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          )}
          <Button variant="outline" onClick={onSettingsClick} className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
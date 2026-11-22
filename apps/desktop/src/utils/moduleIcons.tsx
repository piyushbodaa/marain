import React from 'react';
import {
  Brain,
  Coins,
  Cpu,
  Globe,
  KeyRound,
  Layers,
  MessageSquareText,
  Rocket,
  Smartphone,
  Sparkles,
  Terminal,
  Wrench,
  AppWindow,
} from 'lucide-react';

export function ModuleIcon({
  name,
  className = 'w-5 h-5',
}: {
  name?: string;
  className?: string;
}) {
  const key = (name || '').toLowerCase();
  if (key.includes('brain') || key.includes('ai')) return <Brain className={className} />;
  if (key.includes('layers')) return <Layers className={className} />;
  if (key.includes('token') || key.includes('message') || key.includes('chat'))
    return <MessageSquareText className={className} />;
  if (key.includes('key')) return <KeyRound className={className} />;
  if (key.includes('credit') || key.includes('coin') || key.includes('dollar'))
    return <Coins className={className} />;
  if (key.includes('harness') || key.includes('agent') || key.includes('wrench') || key.includes('cpu'))
    return <Cpu className={className} />;
  if (key.includes('cli') || key.includes('terminal') || key.includes('code'))
    return <Terminal className={className} />;
  if (key.includes('web') || key.includes('globe') || key.includes('site'))
    return <Globe className={className} />;
  if (key.includes('phone') || key.includes('mobile')) return <Smartphone className={className} />;
  if (key.includes('app') || key.includes('rocket')) return <AppWindow className={className} />;
  return <Sparkles className={className} />;
}

export function LabIcon({
  labId,
  className = 'w-4 h-4',
}: {
  labId: string;
  className?: string;
}) {
  switch (labId) {
    case 'tokenizer':
      return <Layers className={className} />;
    case 'api-credits':
      return <KeyRound className={className} />;
    case 'harness-agent':
      return <Wrench className={className} />;
    case 'claude-cli':
      return <Terminal className={className} />;
    case 'website-builder':
      return <Globe className={className} />;
    case 'app-builder':
      return <Rocket className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

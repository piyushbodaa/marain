import { contextBridge, ipcRenderer } from 'electron';

const zero2aiApi = {
  exportProject: (folderName: string, files: Record<string, string>) =>
    ipcRenderer.invoke('zero2ai:exportProject', folderName, files),

  openPath: (targetPath: string) =>
    ipcRenderer.invoke('zero2ai:openPath', targetPath),

  runSafeCommand: (command: string, cwd?: string) =>
    ipcRenderer.invoke('zero2ai:runSafeCommand', command, cwd),

  testProviderCall: (req: {
    provider: 'openai' | 'anthropic' | 'gemini' | 'ollama';
    apiKey?: string;
    baseUrl?: string;
    model: string;
    systemPrompt?: string;
    prompt: string;
  }) => ipcRenderer.invoke('zero2ai:testProviderCall', req),

  getEnvironmentInfo: () =>
    ipcRenderer.invoke('zero2ai:getEnvironmentInfo'),

  loadProgress: () =>
    ipcRenderer.invoke('zero2ai:loadProgress'),

  saveProgress: (progress: unknown) =>
    ipcRenderer.invoke('zero2ai:saveProgress', progress),
};

contextBridge.exposeInMainWorld('zero2ai', zero2aiApi);

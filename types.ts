
export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

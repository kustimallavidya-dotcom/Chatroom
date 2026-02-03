
import { Peer } from 'peerjs';
import type { DataConnection } from 'peerjs';

export class PeerManager {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private onMessageReceived: (data: any) => void;
  private onStatusChange: (status: 'connected' | 'disconnected' | 'connecting' | 'error') => void;
  private retryTimeout: number | null = null;

  constructor(
    onMessage: (data: any) => void,
    onStatus: (status: 'connected' | 'disconnected' | 'connecting' | 'error') => void
  ) {
    this.onMessageReceived = onMessage;
    this.onStatusChange = onStatus;
  }

  public init(roomID: string) {
    this.onStatusChange('connecting');

    // PeerJS configuration with public Google STUN servers for better connectivity
    const peerConfig = {
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ]
      },
      debug: 1 // Only errors
    };

    const id1 = `${roomID}-ghost-1`;
    const id2 = `${roomID}-ghost-2`;

    this.peer = new Peer(id1, peerConfig);

    this.peer.on('open', (id) => {
      console.log('Peer ID obtained:', id);
      // Try to connect to the other possible ID
      this.attemptConnection(id2);
    });

    this.peer.on('error', (err) => {
      console.error('PeerJS Error:', err.type, err);
      
      if (err.type === 'unavailable-id') {
        // If ID 1 is taken, become ID 2
        this.peer?.destroy();
        this.peer = new Peer(id2, peerConfig);
        this.peer.on('open', () => {
          this.attemptConnection(id1);
        });
        this.peer.on('connection', (conn) => this.handleConnection(conn));
        this.peer.on('error', (e) => {
           if (e.type !== 'peer-unavailable') {
             this.onStatusChange('error');
           }
        });
      } else if (err.type === 'peer-unavailable') {
        // This is normal if the other peer isn't online yet
        // We just wait for them to connect to us
        console.log('Target peer not online yet, waiting...');
      } else {
        this.onStatusChange('error');
      }
    });

    this.peer.on('connection', (conn) => {
      this.handleConnection(conn);
    });
  }

  private attemptConnection(targetID: string) {
    if (!this.peer || this.peer.destroyed) return;
    
    // Attempting to call the other person
    const conn = this.peer.connect(targetID, {
      reliable: true
    });
    this.handleConnection(conn);
  }

  private handleConnection(conn: DataConnection) {
    // If we already have an active connection, don't replace it
    if (this.connection && this.connection.open) return;

    this.connection = conn;

    conn.on('open', () => {
      console.log('Secure P2P tunnel established');
      this.onStatusChange('connected');
    });

    conn.on('data', (data) => {
      this.onMessageReceived(data);
    });

    conn.on('close', () => {
      console.log('Connection closed');
      this.onStatusChange('disconnected');
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
      // Don't immediately show error if it's just a failed connection attempt
      if (this.status !== 'connected') {
        // Silent fail, wait for incoming connection instead
      } else {
        this.onStatusChange('error');
      }
    });
  }

  // Helper to check status indirectly
  private get status(): string {
    if (!this.connection) return 'disconnected';
    return this.connection.open ? 'connected' : 'connecting';
  }

  public send(data: any) {
    if (this.connection && this.connection.open) {
      this.connection.send(data);
      return true;
    }
    return false;
  }

  public destroy() {
    if (this.retryTimeout) clearTimeout(this.retryTimeout);
    this.connection?.close();
    this.peer?.destroy();
    this.peer = null;
    this.connection = null;
  }
}


import { Peer } from 'peerjs';
import type { DataConnection } from 'peerjs';

export class PeerManager {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private onMessageReceived: (data: any) => void;
  private onStatusChange: (status: 'connected' | 'disconnected' | 'connecting' | 'error') => void;

  constructor(
    onMessage: (data: any) => void,
    onStatus: (status: 'connected' | 'disconnected' | 'connecting' | 'error') => void
  ) {
    this.onMessageReceived = onMessage;
    this.onStatusChange = onStatus;
  }

  public init(roomID: string) {
    this.onStatusChange('connecting');

    const peerConfig = {
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ]
      },
      debug: 1
    };

    const hostID = `${roomID}-ghost-1`;
    const guestID = `${roomID}-ghost-2`;

    // Try to be the Host first
    this.peer = new Peer(hostID, peerConfig);

    this.peer.on('open', (id) => {
      console.log('Host mode active. Waiting for peer...', id);
      // As host, we just wait for 'connection' event
    });

    this.peer.on('connection', (conn) => {
      console.log('Guest connected to us!');
      this.handleConnection(conn);
    });

    this.peer.on('error', (err) => {
      if (err.type === 'unavailable-id') {
        // Host ID is taken, so we must be the Guest
        this.peer?.destroy();
        this.startAsGuest(guestID, hostID, peerConfig);
      } else if (err.type === 'peer-unavailable') {
        // This happens if Guest tries to connect to Host who isn't there yet
        // We can ignore this and let the Guest retry or wait
        console.log('Target peer not yet available.');
      } else {
        console.error('Peer error:', err.type);
        this.onStatusChange('error');
      }
    });
  }

  private startAsGuest(myID: string, targetID: string, config: any) {
    this.peer = new Peer(myID, config);
    
    this.peer.on('open', () => {
      console.log('Guest mode active. Connecting to Host...');
      const conn = this.peer!.connect(targetID, { reliable: true });
      this.handleConnection(conn);
    });

    this.peer.on('connection', (conn) => {
      // In some race conditions, host might try to connect to guest
      this.handleConnection(conn);
    });

    this.peer.on('error', (err) => {
      if (err.type === 'peer-unavailable') {
         // Host might have left or not joined yet
         // We stay in connecting state
      } else {
        this.onStatusChange('error');
      }
    });
  }

  private handleConnection(conn: DataConnection) {
    if (this.connection && this.connection.open) return;

    this.connection = conn;

    conn.on('open', () => {
      this.onStatusChange('connected');
    });

    conn.on('data', (data) => {
      this.onMessageReceived(data);
    });

    conn.on('close', () => {
      this.onStatusChange('disconnected');
    });

    conn.on('error', () => {
      this.onStatusChange('error');
    });
  }

  public send(data: any) {
    if (this.connection && this.connection.open) {
      this.connection.send(data);
      return true;
    }
    return false;
  }

  public destroy() {
    this.connection?.close();
    this.peer?.destroy();
    this.peer = null;
    this.connection = null;
  }
}


import { Peer, DataConnection } from 'peerjs';

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

    // We try to use the roomID as part of the Peer ID. 
    // Usually Peer IDs must be unique. We'll use RoomID + '-1' and try to connect to RoomID + '-2'.
    // If RoomID + '-1' fails because it exists, we become RoomID + '-2' and connect to '-1'.
    
    const id1 = `${roomID}-ghost-1`;
    const id2 = `${roomID}-ghost-2`;

    this.peer = new Peer(id1);

    this.peer.on('open', (id) => {
      console.debug('Peer opened with ID:', id);
      // Attempt to connect to the other peer if they are already there
      this.attemptConnection(id2);
    });

    this.peer.on('error', (err) => {
      if (err.type === 'unavailable-id') {
        // ID taken, try being the second ghost
        this.peer?.destroy();
        this.peer = new Peer(id2);
        this.peer.on('open', () => {
          this.attemptConnection(id1);
        });
        this.peer.on('connection', (conn) => this.handleConnection(conn));
        this.peer.on('error', () => this.onStatusChange('error'));
      } else {
        this.onStatusChange('error');
      }
    });

    this.peer.on('connection', (conn) => {
      this.handleConnection(conn);
    });
  }

  private attemptConnection(targetID: string) {
    if (!this.peer) return;
    const conn = this.peer.connect(targetID);
    this.handleConnection(conn);
  }

  private handleConnection(conn: DataConnection) {
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

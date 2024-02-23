interface AiSocketEvent {
  ServerToClientEvent: {
    streamStart: () => void;
    streaming: (token: string) => void;
    streamEnd: () => void;
    tarotCard: () => void; // 타로 카드 펼치기 요청
    chatEnd: (resultId: string) => void;
    error: (message: string) => void;
  };
  ClientToServerEvent: {
    message: (message: string) => void;
    tarotRead: (cardIdx: number) => void; // 타로 카드 해설 요청
  };
  InterServerEvents: {};
  SocketData: {};
}

interface HumanSocketEvent {
  ServerToClientEvent: {
    connection: (data: {
      description?: RTCSessionDescription | null;
      candidate?: RTCIceCandidate | null;
    }) => void;
    welcome: (otherUsers: any) => void;
    userExit: (data: { id: string }) => void;
    hostExit: () => void;
    roomCreated: () => void;
    roomNameGenerated: (roomId: string) => void;
    joinRoomFailed: () => void;
    joinRoomSuccess: (roomId: string) => void;
    roomExist: () => void;
    roomNotExist: () => void;
    roomFull: () => void;
  };
  ClientToServerEvent: {
    connection: (data: {
      description?: RTCSessionDescription | null;
      candidate?: RTCIceCandidate | null;
      roomName: string;
    }) => void;
    generateRoomName: () => void;
    createRoom: (roomId: string, password: string) => void;
    joinRoom: (roomId: string, password: string) => void;
    checkRoomExist: (roomName: string) => void;
  };
  InterServerEvents: {};
  SocketData: {};
}

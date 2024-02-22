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
  ServerToClientEvent: {};
  ClientToServerEvent: {};
  InterServerEvents: {};
  SocketData: {};
}

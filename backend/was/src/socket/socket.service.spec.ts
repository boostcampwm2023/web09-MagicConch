describe('SocketService', () => {
  it('SocketService 생성', () => {});

  it('client 소켓 초기화', () => {});

  describe('sendWelcomeMessage()', () => {
    it('token 단위로 메세지 전달', () => {});
    it('오류 발생 시 client에게 알림', () => {});
  });

  describe('handleMessageEvent()', () => {
    it('token 단위로 ai 답장 전달', () => {});
    it('chatLog 업데이트', () => {});
    it('ai가 타로 카드 뽑기 제안 시 tarotCard 이벤트 발생', () => {});
    it('오류 발생 시 client에게 알림', () => {});
  });

  describe('handleTarotReadEvent()', () => {
    it('token 단위로 ai 답장 전달', () => {});
    it('chatLog 업데이트', () => {});
    it('타로 결과 DB에 저장하고, client에게 결과 링크 ID 전달', () => {});
    it('채팅 종료 상태 업데이트', () => {});
    it('chatLog DB에 저장', () => {});
    it('오류 발생 시 client에게 알림', () => {});
  });

  describe('streamMessage()', () => {
    it('stream 시작을 알림', () => {});
    it('token 단위로 client에게 메세지 전달', () => {});
    it('stream 종료을 알림', () => {});
    it('chatLog 업데이트', () => {});
    it('완성된 메세지 반환', () => {});
    it('오류 발생 시 client에게 알림', () => {});
  });

  it('test (3): 타로 상담 결과 생성', async () => {});
});

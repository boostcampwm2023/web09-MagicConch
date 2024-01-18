import { Member } from 'src/members/entities';

function makeMemberMock(memberId: string): Member {
  const memberMock: Member = new Member();
  memberMock.id = memberId;
  return memberMock;
}

export const memberId: string = 'memberId';

export const diffMemberId: string = 'diffMemberId';

export const memberMock = makeMemberMock(memberId);

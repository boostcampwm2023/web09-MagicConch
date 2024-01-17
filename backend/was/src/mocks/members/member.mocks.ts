import { Member } from 'src/members/entities';
import { v4 as uuidv4 } from 'uuid';

function makeMemberMock(memberId: string): Member {
  const memberMock: Member = new Member();
  memberMock.id = memberId;
  return memberMock;
}

export const memberId: string = uuidv4();

export const diffMemberId: string = uuidv4();

export const memberMock = makeMemberMock(memberId);

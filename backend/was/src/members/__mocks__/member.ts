import { CreateMemberDto, UpdateMemberDto } from 'src/members/dto';
import { Member } from 'src/members/entities';

function makeMemberMock(
  memberId: string,
  email: string,
  nickname: string,
  profileUrl: string,
  providerId: number,
): Member {
  const memberMock: Member = new Member();
  memberMock.id = memberId;
  memberMock.email = email;
  memberMock.nickname = nickname;
  memberMock.profileUrl = profileUrl;
  memberMock.providerId = providerId;
  return memberMock;
}

const nickname: string = 'nickname';

const diffNickname: string = 'diffNickname';

const profileUrl: string = 'profileUrl';

export const email: string = 'email';

export const providerId: number = 0;

export const diffProviderId: number = 1;

export const memberId: string = '12345678-1234-5678-1234-567812345678';

export const diffMemberId: string = '12345678-1234-5678-1234-567812345679';

export const memberMock: Member = makeMemberMock(
  memberId,
  email,
  nickname,
  profileUrl,
  providerId,
);

export const memberMocks: Member[] = [memberMock];

export const createMemberDtoMock: CreateMemberDto = CreateMemberDto.fromProfile(
  providerId,
  {
    email: email,
    nickname: nickname,
    profileUrl: profileUrl,
  },
);

export const updateMemberDtoMock: UpdateMemberDto = UpdateMemberDto.fromProfile(
  providerId,
  {
    email: email,
    nickname: diffNickname,
    profileUrl: profileUrl,
  },
);

import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MEMBERS_CODEMAP } from '@exceptions/codemap/members-codemap';
import { CustomException } from '@exceptions/custom-exception';
import { MemberDto } from './dto/member.dto';
import { Member } from './entities';
import { MembersService } from './members.service';

describe('MembersService', () => {
  let membersService: MembersService;
  let membersRepository: Repository<Member>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
        },
      ],
    }).compile();

    membersService = moduleRef.get<MembersService>(MembersService);
    membersRepository = moduleRef.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(membersService).toBeDefined();
  });

  describe('findMemberByEmail', () => {
    it('이메일에 해당하는 사용자 정보를 조회한다.', async () => {
      const testData = [
        {
          input: { email: 'tarotmilktea@kakao.com', providerId: 0 },
          entity: {
            id: '12345678-1234-5678-1234-567812345671',
            email: 'tarotmilktea@kakao.com',
            providerId: 0,
            nickname: '타로밀크티',
            profileUrl:
              'https://kr.object.ncloudstorage.com/magicconch/basic/0.jpg',
          },
          dto: {
            nickname: '타로밀크티',
            profileUrl:
              'https://kr.object.ncloudstorage.com/magicconch/basic/0.jpg',
          },
        },
        {
          input: { email: 'tarotmilktea2@kakao.com', providerId: 0 },
          entity: {
            id: '12345678-1234-5678-1234-567812345671',
            email: 'tarotmilktea2@kakao.com',
            providerId: 0,
          },
          dto: {
            nickname: '타로밀크티2',
            profileUrl: undefined,
          },
        },
      ];
      for (const { input, entity, dto } of testData) {
        const findOneMock = jest
          .spyOn(membersRepository, 'findOne')
          .mockResolvedValue(entity);

        const expectation: MemberDto = await membersService.findMemberByEmail(
          input.email,
          input.providerId,
        );
        expect(expectation).toEqual(dto);
        expect(findOneMock).toHaveBeenCalledWith({
          where: { email: input.email, providerId: input.providerId },
          select: ['nickname', 'profileUrl'],
        });
      }
    });

    it('이메일에 해당하는 사용자가 없는 경우 에러를 반환한다.', async () => {
      const email: string = 'tarotmilktea@kakao.com';
      const providerId: number = 0;

      const findOneMock = jest
        .spyOn(membersRepository, 'findOne')
        .mockResolvedValue(null);

      await expect(
        membersService.findMemberByEmail(email, providerId),
      ).rejects.toThrow(new CustomException(MEMBERS_CODEMAP.NOT_FOUND));
      expect(findOneMock).toHaveBeenCalledWith({
        where: { email, providerId },
        select: ['nickname', 'profileUrl'],
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createMemberDtoMock,
  diffProviderId,
  email,
  memberId,
  memberMock,
  providerId,
  updateMemberDtoMock,
} from 'src/mocks/members';
import { Repository } from 'typeorm';
import { Member } from './entities';
import { MembersService } from './members.service';

describe('MembersService', () => {
  let service: MembersService;
  let repository: Repository<Member>;

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

    service = moduleRef.get<MembersService>(MembersService);
    repository = moduleRef.get<Repository<Member>>(getRepositoryToken(Member));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('회원을 생성한다', async () => {
      const saveMock = jest
        .spyOn(repository, 'save')
        .mockResolvedValueOnce(memberMock);

      await expect(service.create(createMemberDtoMock)).resolves.not.toThrow();
      expect(saveMock).toHaveBeenCalledWith(
        expect.objectContaining(createMemberDtoMock),
      );
    });
  });

  describe('findByEmail', () => {
    it('해당 이메일과 제공자 ID를 가진 회원을 조회한다 (존재하는 경우)', async () => {
      const findOneBy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(memberMock);

      const expectation: Member | null = await service.findByEmail(
        email,
        providerId,
      );
      expect(expectation).toEqual(memberMock);
      expect(findOneBy).toHaveBeenCalledWith({
        email: email,
        providerId: providerId,
      });
    });

    it('해당 이메일과 제공자 ID를 가진 회원을조회한다 (존재하지 않는 경우)', async () => {
      const findOneBy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(null);

      const expectation: Member | null = await service.findByEmail(
        email,
        diffProviderId,
      );
      expect(expectation).toBe(null);
      expect(findOneBy).toHaveBeenCalledWith({
        email: email,
        providerId: diffProviderId,
      });
    });
  });

  describe('update', () => {
    it('해당 PK의 회원 정보를 수정한다.', async () => {
      const updateMock = jest
        .spyOn(repository, 'update')
        .mockResolvedValueOnce({ affected: 1 } as any);

      const expectation: boolean = await service.update(
        memberId,
        updateMemberDtoMock,
      );
      expect(expectation).toBe(true);
      expect(updateMock).toHaveBeenCalledWith(
        { id: memberId },
        updateMemberDtoMock,
      );
    });
  });
});

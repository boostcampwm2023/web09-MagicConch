import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  tarotCardMock,
  tarotResultId,
  tarotResultMessage,
  tarotResultMock,
} from 'src/mocks/tarot';
import { Repository } from 'typeorm';
import { CreateTarotResultDto, TarotCardDto, TarotResultDto } from './dto';
import { TarotCard, TarotResult } from './entities';
import { TarotService } from './tarot.service';

describe('TarotService', () => {
  let service: TarotService;
  let tarotCardRepository: Repository<TarotCard>;
  let tarotResultRepository: Repository<TarotResult>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TarotService,
        {
          provide: getRepositoryToken(TarotCard),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TarotResult),
          useClass: Repository,
        },
      ],
    }).compile();

    service = moduleRef.get<TarotService>(TarotService);
    tarotCardRepository = moduleRef.get<Repository<TarotCard>>(
      getRepositoryToken(TarotCard),
    );
    tarotResultRepository = moduleRef.get<Repository<TarotResult>>(
      getRepositoryToken(TarotResult),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTarotResult', () => {
    it('타로 결과를 생성한다', async () => {
      const createTarotResultDto: CreateTarotResultDto =
        CreateTarotResultDto.fromResult(
          tarotCardMock.cardNo,
          tarotResultMessage,
        );

      const saveMock = jest
        .spyOn(tarotResultRepository, 'save')
        .mockResolvedValueOnce(tarotResultMock);

      await expect(
        service.createTarotResult(createTarotResultDto),
      ).resolves.not.toThrow();
      expect(saveMock).toHaveBeenCalledWith({
        cardUrl: createTarotResultDto.cardUrl,
        message: createTarotResultDto.message,
      });
    });
  });

  describe('findTarotCardByCardNo', () => {
    it('해당 번호의 타로 카드를 조회한다', async () => {
      const tarotCardDto: TarotCardDto = TarotCardDto.fromEntity(tarotCardMock);

      const findOneByMock = jest
        .spyOn(tarotCardRepository, 'findOneBy')
        .mockResolvedValueOnce(tarotCardMock);

      const expectation: TarotCardDto = await service.findTarotCardByCardNo(
        tarotCardMock.cardNo,
      );
      expect(expectation).toEqual(tarotCardDto);
      expect(findOneByMock).toHaveBeenCalledWith({
        cardNo: tarotCardMock.cardNo,
        cardPack: tarotCardMock.cardPack,
      });
    });

    it('해당 번호의 타로 카드가 존재하지 않아 NotFoundException을 반환한다', async () => {
      const findOneByMock = jest
        .spyOn(tarotCardRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      const wrongTarotCardNo: number = -1;
      await expect(
        service.findTarotCardByCardNo(wrongTarotCardNo),
      ).rejects.toThrow(NotFoundException);
      expect(findOneByMock).toHaveBeenCalledWith({
        cardNo: wrongTarotCardNo,
        cardPack: undefined,
      });
    });
  });

  describe('findTarotResultById', () => {
    it('해당 PK의 타로 결과를 조회한다', async () => {
      const tarotResultDto = TarotResultDto.fromEntity(tarotResultMock);

      const findOneByMock = jest
        .spyOn(tarotResultRepository, 'findOneBy')
        .mockResolvedValueOnce(tarotResultMock);

      const expectation: TarotResultDto =
        await service.findTarotResultById(tarotResultId);
      expect(expectation).toEqual(tarotResultDto);
      expect(findOneByMock).toHaveBeenCalledWith({ id: tarotResultId });
    });

    it('해당 PK의 타로 결과가 존재하지 않아 NotFoundException을 반환한다', async () => {
      const findOneByMock = jest
        .spyOn(tarotResultRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      const wrongResultId: string = 'wrongResultId';
      await expect(service.findTarotResultById(wrongResultId)).rejects.toThrow(
        NotFoundException,
      );
      expect(findOneByMock).toHaveBeenCalledWith({ id: wrongResultId });
    });
  });
});

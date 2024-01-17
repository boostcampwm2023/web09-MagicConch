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
import { v4 as uuidv4 } from 'uuid';
import { CreateTarotResultDto, TarotCardDto, TarotResultDto } from './dto';
import { TarotCard, TarotResult } from './entities';
import { TarotService } from './tarot.service';

describe('TarotService', () => {
  let service: TarotService;
  let tarotCardRepository: Repository<TarotCard>;
  let tarotResultRepository: Repository<TarotResult>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<TarotService>(TarotService);
    tarotCardRepository = module.get<Repository<TarotCard>>(
      getRepositoryToken(TarotCard),
    );
    tarotResultRepository = module.get<Repository<TarotResult>>(
      getRepositoryToken(TarotResult),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTarotResult', () => {
    it('should create a tarot result', async () => {
      const createTarotResultDto: CreateTarotResultDto =
        CreateTarotResultDto.fromResult(
          tarotCardMock.cardNo,
          tarotResultMessage,
        );

      const saveMock = jest
        .spyOn(tarotResultRepository, 'save')
        .mockResolvedValueOnce(new TarotResult());

      await expect(
        service.createTarotResult(createTarotResultDto),
      ).resolves.not.toThrow();

      expect(saveMock).toHaveBeenCalledWith({
        cardUrl: createTarotResultDto.cardUrl,
        message: createTarotResultDto.message,
      });
    });
  });

  describe('findTarotCardById', () => {
    it('should find specific tarot card', async () => {
      const tarotCardDto: TarotCardDto = TarotCardDto.fromEntity(tarotCardMock);

      const findOneByMock = jest
        .spyOn(tarotCardRepository, 'findOneBy')
        .mockResolvedValueOnce(tarotCardMock);

      const result = await service.findTarotCardById(tarotCardMock.cardNo);

      expect(result).toEqual(tarotCardDto);

      expect(findOneByMock).toHaveBeenCalledWith({
        cardNo: tarotCardMock.cardNo,
        cardPack: tarotCardMock.cardPack,
      });
    });

    it('should throw NotFoundException if tarot card is not found', async () => {
      const findOneByMock = jest
        .spyOn(tarotCardRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      const nonTarotCardNo = 80;

      await expect(service.findTarotCardById(nonTarotCardNo)).rejects.toThrow(
        NotFoundException,
      );

      expect(findOneByMock).toHaveBeenCalledWith({
        cardNo: nonTarotCardNo,
        cardPack: undefined,
      });
    });
  });

  describe('findTarotResultById', () => {
    it('should find specific tarot result', async () => {
      const tarotResultDto = TarotResultDto.fromEntity(tarotResultMock);

      const findOneByMock = jest
        .spyOn(tarotResultRepository, 'findOneBy')
        .mockResolvedValueOnce(tarotResultMock);

      const result = await service.findTarotResultById(tarotResultId);

      expect(result).toEqual(tarotResultDto);

      expect(findOneByMock).toHaveBeenCalledWith({ id: tarotResultId });
    });

    it('should throw NotFoundException if tarot result is not found', async () => {
      const findOneByMock = jest
        .spyOn(tarotResultRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      const wrongResultId = uuidv4();

      await expect(service.findTarotResultById(wrongResultId)).rejects.toThrow(
        NotFoundException,
      );

      expect(findOneByMock).toHaveBeenCalledWith({ id: wrongResultId });
    });
  });
});

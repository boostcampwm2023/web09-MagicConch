import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateTarotResultDto } from './dto/create-tarot-result.dto';
import { TarotCardResponseDto } from './dto/tarot-card-response.dto';
import { TarotResultResponseDto } from './dto/tarot-result-response.dto';
import { TarotCard } from './entities/tarot-card.entity';
import { TarotResult } from './entities/tarot-result.entity';
import { TarotService } from './tarot.service';

describe('TarotService', () => {
  let service: TarotService;
  let tarotCardRepository: Repository<TarotCard>;
  let tarotResultRepository: Repository<TarotResult>;

  /**
   * mock data
   */
  const tarotResultId = uuidv4();

  const cardUrlMock =
    'https://kr.object.ncloudstorage.com/magicconch/basic/0.jpg';

  const tarotResultMessageMock = 'tarot result message';

  const tarotCardMock = new TarotCard();
  tarotCardMock.cardNo = 0;
  tarotCardMock.ext = '.jpg';

  const tarotResultMock = new TarotResult();
  tarotResultMock.id = tarotResultId;
  tarotResultMock.cardUrl = cardUrlMock;
  tarotResultMock.message = tarotResultMessageMock;

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
          tarotResultMessageMock,
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
      const tarotCardResponseDto: TarotCardResponseDto =
        TarotCardResponseDto.fromEntity(tarotCardMock);

      const findOneByMock = jest
        .spyOn(tarotCardRepository, 'findOneBy')
        .mockResolvedValueOnce(tarotCardMock);

      const result = await service.findTarotCardById(tarotCardMock.cardNo);

      expect(result).toEqual(tarotCardResponseDto);

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
      const tarotResultResponseDto =
        TarotResultResponseDto.fromEntity(tarotResultMock);

      const findOneByMock = jest
        .spyOn(tarotResultRepository, 'findOneBy')
        .mockResolvedValueOnce(tarotResultMock);

      const result = await service.findTarotResultById(tarotResultId);

      expect(result).toEqual(tarotResultResponseDto);

      expect(findOneByMock).toHaveBeenCalledWith({ id: tarotResultId });
    });

    it('should throw NotFoundException if tarot result is not found', async () => {
      const findOneByMock = jest
        .spyOn(tarotResultRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      const nonResultId = uuidv4();

      await expect(service.findTarotResultById(nonResultId)).rejects.toThrow(
        NotFoundException,
      );

      expect(findOneByMock).toHaveBeenCalledWith({ id: nonResultId });
    });
  });
});

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BUCKET_URL } from 'src/common/constants/etc';
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
    describe('성공', () => {
      it('타로 결과를 생성한다', async () => {
        [
          {
            cardNo: 0,
            message: '0번 카드에 대한 해설',
            cardUrl: `${BUCKET_URL}/basic/0.jpg`,
          },
          {
            cardNo: 1,
            message: '1번 카드에 대한 해설',
            cardUrl: `${BUCKET_URL}/basic/1.jpg`,
          },
          {
            cardNo: 2,
            message: '2번 카드에 대한 해설',
            cardUrl: `${BUCKET_URL}/basic/2.jpg`,
          },
        ].forEach(async (scenario) => {
          const ext: string = scenario.cardNo === 78 ? '.png' : '.jpg';
          const tarotResult: TarotResult = {
            id: '12345678-1234-5678-1234-567812345678',
            message: scenario.message,
            cardUrl: `${BUCKET_URL}/basic/${scenario.cardNo}${ext}`,
          };
          const createTarotResultDto: CreateTarotResultDto =
            CreateTarotResultDto.fromResult(
              scenario.cardNo,
              tarotResult.message,
            );

          const saveMock = jest
            .spyOn(tarotResultRepository, 'save')
            .mockResolvedValueOnce(tarotResult);

          await expect(
            service.createTarotResult(createTarotResultDto),
          ).resolves.not.toThrow();
          expect(saveMock).toHaveBeenCalledWith({
            cardUrl: scenario.cardUrl,
            message: scenario.message,
          });
        });
      });
    });
  });

  describe('findTarotCardByCardNo', () => {
    describe('성공', () => {
      it('해당 번호의 타로 카드를 조회한다', async () => {
        [
          { cardNo: 0, ext: '.jpg' },
          { cardNo: 1, ext: '.jpg' },
          { cardNo: 2, ext: '.jpg' },
        ].forEach(async (scenario) => {
          const tarotCard: TarotCard = {
            id: '12345678-1234-5678-1234-567812345678',
            cardNo: scenario.cardNo,
            ext: scenario.ext,
          };
          const tarotCardDto: TarotCardDto = TarotCardDto.fromEntity(tarotCard);

          const findOneByMock = jest
            .spyOn(tarotCardRepository, 'findOneBy')
            .mockResolvedValueOnce(tarotCard);

          const expectation: TarotCardDto = await service.findTarotCardByCardNo(
            tarotCard.cardNo,
          );
          expect(expectation).toEqual(tarotCardDto);
          expect(findOneByMock).toHaveBeenCalledWith({
            cardNo: scenario.cardNo,
            cardPack: undefined,
          });
        });
      });
    });

    describe('실패', () => {
      it('해당 번호의 타로 카드가 존재하지 않아 NotFoundException을 반환한다', async () => {
        [{ cardNo: -1 }, { cardNo: 79 }].forEach(async (scenario) => {
          const findOneByMock = jest
            .spyOn(tarotCardRepository, 'findOneBy')
            .mockResolvedValueOnce(null);

          await expect(
            service.findTarotCardByCardNo(scenario.cardNo),
          ).rejects.toThrow(NotFoundException);
          expect(findOneByMock).toHaveBeenCalledWith({
            cardNo: scenario.cardNo,
            cardPack: undefined,
          });
        });
      });
    });
  });

  describe('findTarotResultById', () => {
    describe('성공', () => {
      it('해당 PK의 타로 결과를 조회한다', async () => {
        [
          {
            id: '12345678-1234-5678-1234-567812345670',
            message: '0번 카드에 대한 해설',
            cardUrl: `${BUCKET_URL}/basic/0.jpg`,
          },
          {
            id: '12345678-1234-5678-1234-567812345671',
            message: '1번 카드에 대한 해설',
            cardUrl: `${BUCKET_URL}/basic/1.jpg`,
          },
          {
            id: '12345678-1234-5678-1234-567812345672',
            message: '2번 카드에 대한 해설',
            cardUrl: `${BUCKET_URL}/basic/2.jpg`,
          },
        ].forEach(async (scenario) => {
          const tarotResult: TarotResult = {
            id: scenario.id,
            message: scenario.message,
            cardUrl: scenario.cardUrl,
          };
          const tarotResultDto = TarotResultDto.fromEntity(tarotResult);

          const findOneByMock = jest
            .spyOn(tarotResultRepository, 'findOneBy')
            .mockResolvedValueOnce(tarotResult);

          const expectation: TarotResultDto = await service.findTarotResultById(
            scenario.id,
          );
          expect(expectation).toEqual(tarotResultDto);
          expect(findOneByMock).toHaveBeenCalledWith({ id: scenario.id });
        });
      });
    });

    describe('실패', () => {
      it('해당 PK의 타로 결과가 존재하지 않아 NotFoundException을 반환한다', async () => {
        [
          { id: '12345678-1234-5678-1234-567812345670' },
          { id: '12345678-1234-5678-1234-567812345671' },
        ].forEach(async (scenario) => {
          const findOneByMock = jest
            .spyOn(tarotResultRepository, 'findOneBy')
            .mockResolvedValueOnce(null);

          await expect(
            service.findTarotResultById(scenario.id),
          ).rejects.toThrow(NotFoundException);
          expect(findOneByMock).toHaveBeenCalledWith({ id: scenario.id });
        });
      });
    });
  });
});

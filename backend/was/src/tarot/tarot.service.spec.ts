import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BUCKET_URL, ExtEnum } from '@constants/etc';
import { TAROT_CODEMAP } from '@exceptions/codemap';
import { CustomException } from '@exceptions/custom-exception';
import { CreateTarotResultDto, TarotCardDto, TarotResultDto } from './dto';
import { TarotCard, TarotResult } from './entities';
import { TarotService } from './tarot.service';

describe('TarotService', () => {
  let tarotService: TarotService;
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

    tarotService = moduleRef.get<TarotService>(TarotService);
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
    expect(tarotService).toBeDefined();
  });

  describe('createTarotResult', () => {
    it('타로 결과를 생성한다.', async () => {
      [
        {
          id: '12345678-1234-5678-1234-567812345670',
          cardNo: 0,
          message: '0번 카드에 대한 해설',
          cardUrl: `${BUCKET_URL}/basic/0.jpg`,
        },
        {
          id: '12345678-1234-5678-1234-567812345671',
          cardNo: 1,
          message: '1번 카드에 대한 해설',
          cardUrl: `${BUCKET_URL}/basic/1.jpg`,
        },
        {
          id: '12345678-1234-5678-1234-567812345672',
          cardNo: 2,
          message: '2번 카드에 대한 해설',
          cardUrl: `${BUCKET_URL}/basic/2.jpg`,
        },
      ].forEach(async ({ id, cardNo, message, cardUrl }) => {
        const tarotResult: TarotResult = {
          id: id,
          message: message,
          cardUrl: cardUrl,
        };
        const createTarotResultDto: CreateTarotResultDto =
          CreateTarotResultDto.fromResult(cardNo, message);

        const saveMock = jest
          .spyOn(tarotResultRepository, 'save')
          .mockResolvedValueOnce(tarotResult);

        await expect(
          tarotService.createTarotResult(createTarotResultDto),
        ).resolves.not.toThrow();
        expect(saveMock).toHaveBeenCalledWith({
          cardUrl: cardUrl,
          message: message,
        });
      });
    });
  });

  describe('findTarotCardByCardNo', () => {
    it('해당 번호의 타로 카드를 조회한다.', async () => {
      [
        {
          id: '12345678-1234-5678-1234-567812345670',
          cardNo: 0,
          ext: ExtEnum.JPG,
        },
        {
          id: '12345678-1234-5678-1234-567812345671',
          cardNo: 1,
          ext: ExtEnum.JPG,
        },
        {
          id: '12345678-1234-5678-1234-567812345672',
          cardNo: 2,
          ext: ExtEnum.JPG,
        },
      ].forEach(async ({ id, cardNo, ext }) => {
        const tarotCard: TarotCard = {
          id: id,
          cardNo: cardNo,
          ext: ext,
        };
        const tarotCardDto: TarotCardDto = TarotCardDto.fromEntity(tarotCard);

        const findOneMock = jest
          .spyOn(tarotCardRepository, 'findOne')
          .mockResolvedValueOnce(tarotCard);

        const expectation: TarotCardDto =
          await tarotService.findTarotCardByCardNo(tarotCard.cardNo);
        expect(expectation).toEqual(tarotCardDto);
        expect(findOneMock).toHaveBeenCalledWith({
          where: {
            cardNo: cardNo,
            cardPack: undefined,
          },
          select: ['cardNo', 'ext', 'cardPack'],
        });
      });
    });

    it('해당 번호의 타로 카드가 존재하지 않아 NotFoundException을 반환한다.', async () => {
      [{ cardNo: -1 }, { cardNo: 79 }].forEach(async ({ cardNo }) => {
        const findOneMock = jest
          .spyOn(tarotCardRepository, 'findOne')
          .mockResolvedValueOnce(null);

        await expect(
          tarotService.findTarotCardByCardNo(cardNo),
        ).rejects.toThrow(new CustomException(TAROT_CODEMAP.CARD_NOT_FOUND));
        expect(findOneMock).toHaveBeenCalledWith({
          where: {
            cardNo: cardNo,
            cardPack: undefined,
          },
          select: ['cardNo', 'ext', 'cardPack'],
        });
      });
    });
  });

  describe('findTarotResultById', () => {
    it('해당 아이디의 타로 결과를 조회한다.', async () => {
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
      ].forEach(async ({ id, message, cardUrl }) => {
        const tarotResult: TarotResult = {
          id: id,
          message: message,
          cardUrl: cardUrl,
        };
        const tarotResultDto = TarotResultDto.fromEntity(tarotResult);

        const findOneMock = jest
          .spyOn(tarotResultRepository, 'findOne')
          .mockResolvedValueOnce(tarotResult);

        const expectation: TarotResultDto =
          await tarotService.findTarotResultById(id);
        expect(expectation).toEqual(tarotResultDto);
        expect(findOneMock).toHaveBeenCalledWith({
          where: { id: id },
          select: ['cardUrl', 'message'],
        });
      });
    });

    it('해당 아이디의 타로 결과가 존재하지 않아 NotFoundException을 반환한다.', async () => {
      [
        { id: '12345678-1234-5678-1234-567812345670' },
        { id: '12345678-1234-5678-1234-567812345671' },
      ].forEach(async ({ id }) => {
        const findOneMock = jest
          .spyOn(tarotResultRepository, 'findOne')
          .mockResolvedValueOnce(null);

        await expect(tarotService.findTarotResultById(id)).rejects.toThrow(
          new CustomException(TAROT_CODEMAP.RESULT_NOT_FOUND),
        );
        expect(findOneMock).toHaveBeenCalledWith({
          where: { id: id },
          select: ['cardUrl', 'message'],
        });
      });
    });
  });
});

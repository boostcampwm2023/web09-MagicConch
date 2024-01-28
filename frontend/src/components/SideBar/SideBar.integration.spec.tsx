import { act, render } from '@testing-library/react';

import { initialState, useSideBarStore } from '@stores/zustandStores/useSideBarStore';

import { toBeCenterOfScreenX, toBeLeftOfScreenX } from '@utils/matcher';
import { sleep } from '@utils/time';

import { IntegratedSideBar } from './__mocks__';

expect.extend({ toBeCenterOfScreenX, toBeLeftOfScreenX });

describe('SideBar 관련 컴포넌트 통합 테스트', () => {
  let sideBar: HTMLElement;
  let contentArea: HTMLElement;
  let sideBarButton: HTMLElement;

  beforeEach(async () => {
    const { findByText, findByLabelText } = render(<IntegratedSideBar />);

    sideBar = await findByText('side bar');
    contentArea = await findByText('content area');
    sideBarButton = await findByLabelText('button');
  });

  describe('처음 렌더링 이후', () => {
    it('side bar는 화면에 보이지 않는다.', () => {
      expect(sideBar).not.toBeVisible();
    });

    it('content area는 x축 기준 화면 중앙에 있다.', () => {
      expect(contentArea).toBeCenterOfScreenX();
    });

    it('애니메이션 효과는 발생하지 않는다. (시간이 지나도 상태가 그대로이다)', async () => {
      expect(sideBar).not.toBeVisible();
      expect(contentArea).toBeCenterOfScreenX();

      await sleep(1000);

      expect(sideBar).not.toBeVisible();
      expect(contentArea).toBeCenterOfScreenX();
    });

    it('sidebar 관련 zustand store는 초기화된다.', () => {
      act(() => {
        useSideBarStore.setState({ ...initialState, sideBarState: !initialState.sideBarState });
      });

      render(<IntegratedSideBar />);

      const sideBarStore = useSideBarStore.getState();
      const curState = {
        sideBarState: sideBarStore.sideBarState,
        sideBarButtonState: sideBarStore.sideBarButtonState,
      };

      expect(curState).toEqual(initialState);
    });
  });

  describe('side bar 버튼을 클릭해서 상태가 바뀌는 경우', () => {
    [
      {
        scenario: 'side bar hide 상태에서 side bar 버튼을 클릭하면, side bar가 화면에 보여진다.',
        initialState: {
          sideBarState: false,
          sideBarButtonState: true,
        },
        expected: {
          sideBarVisible: true,
        },
      },
      {
        scenario:
          'side bar hide 상태에서 side bar 버튼을 클릭하면, content area는 x축 기준 화면 중앙에서 왼쪽으로 이동된다.',
        initialState: {
          sideBarState: false,
          sideBarButtonState: true,
        },
        expected: {
          contentAreaPosX: 'left',
        },
      },
      {
        scenario: 'side bar show 상태에서 side bar 버튼을 클릭하면, side bar는 화면에서 사라진다.',
        initialState: {
          sideBarState: true,
          sideBarButtonState: true,
        },
        expected: {
          sideBarVisible: false,
        },
      },
      {
        scenario: 'side bar show 상태에서 side bar 버튼을 클릭하면, content area는 x축 기준 화면 중앙으로 이동된다.',
        initialState: {
          sideBarState: true,
          sideBarButtonState: true,
        },
        expected: {
          contentAreaPosX: 'center',
        },
      },
      {
        scenario: 'side bar hide 상태에서 side bar 버튼이 비활성화되면 버튼을 클릭해도 작동하지 않는다.',
        initialState: {
          sideBarState: false,
          sideBarButtonState: false,
        },
        expected: {
          sideBarVisible: false,
          contentAreaPosX: 'center',
        },
        loopCount: 2,
      },
      {
        scenario:
          'side bar show 상태에서 side bar 버튼이 비활성화되면 content area가 x축 기준 화면 중앙으로 이동하면서 side bar가 화면에서 사라지고, 버튼을 클릭해도 작동하지 않는다.',
        initialState: {
          sideBarState: true,
          sideBarButtonState: false,
        },
        expected: {
          sideBarVisible: false,
          contentAreaPosX: 'left',
        },
        loopCount: 2,
      },
    ].forEach(({ scenario, initialState, expected, loopCount = 1 }) => {
      it(scenario, async () => {
        // 초기 store 설정
        act(() => {
          useSideBarStore.setState(initialState);
        });

        // 테스트 시작 (loopCount 만큼 반복해서 테스트)
        for (let i = 0; i < loopCount; i++) {
          // 클릭 이벤트 발생
          act(() => {
            sideBarButton?.click();
          });
          await sleep(1000); // 애니메이션 효과가 발생하므로 1초 대기

          // 예상한 상태가 맞는지 확인
          if (expected.sideBarVisible != undefined) {
            if (expected.sideBarVisible) {
              expect(sideBar).toBeVisible();
            } else {
              expect(sideBar).not.toBeVisible();
            }
          }

          if (expected.contentAreaPosX != undefined) {
            if (expected.contentAreaPosX === 'center') {
              expect(contentArea).toBeCenterOfScreenX();
            } else {
              expect(contentArea).toBeLeftOfScreenX();
            }
          }
        }
      });
    });
  });
});

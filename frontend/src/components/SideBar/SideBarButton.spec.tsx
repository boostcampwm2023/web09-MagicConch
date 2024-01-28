import { render, renderHook } from '@testing-library/react';

import { initialState, useSideBarStore } from '@stores/zustandStores/useSideBarStore';

import SideBarButton from './SideBarButton';

describe('<SideBarButton> 컴포넌트 테스트', () => {
  const sidebarStore = renderHook(() => useSideBarStore()).result;
  let button: HTMLElement;

  beforeEach(async () => {
    const { findByLabelText } = render(<SideBarButton />);
    button = await findByLabelText('button');
  });

  it('<button> 태그가 렌더링에 포함된다', async () => {
    expect(button).toBeInTheDocument();
  });

  it('처음 렌더링 된 이후에 sidebar 관련 zustand store는 초기화된다.', () => {
    sidebarStore.current.showSideBar();
    sidebarStore.current.deactiveSideBarButton();

    render(<SideBarButton />);

    const curState = {
      sideBarState: sidebarStore.current.sideBarState,
      sideBarButtonState: sidebarStore.current.sideBarButtonState,
    };
    expect(curState).toEqual(initialState);
  });

  [
    {
      scenario: 'sideBarState가 false인 상태에서 side bar 버튼을 클릭하면, sideBarState가 true가 된다.',
      initialState: {
        sideBarState: false,
        sideBarButtonState: true,
      },
      expected: {
        sideBarState: true,
      },
    },
    {
      scenario: 'sideBarState가 true인 상태에서 side bar 버튼을 클릭하면, sideBarState가 false가 된다.',
      initialState: {
        sideBarState: true,
        sideBarButtonState: true,
      },
      expected: {
        sideBarState: false,
      },
    },
    {
      scenario:
        'side bar 버튼이 비활성화된 상태이고 sideBarState가 false인 상태에서 side bar 버튼을 클릭하면, sideBarState가 바뀌지 않는다.',
      initialState: {
        sideBarState: false,
        sideBarButtonState: false,
      },
      expected: {
        sideBarButtonState: false,
      },
      loopCount: 2,
    },
    {
      scenario: `sideBarState가 true인 상태에서 side bar 버튼이 비활성화된 상태되면, sideBarState가 false가 되고, 
      이후에 side bar 버튼을 클릭해도 sideBarState가 바뀌지 않는다.`,
      initialState: {
        sideBarState: true,
        sideBarButtonState: false,
      },
      expected: {
        sideBarButtonState: false,
      },
      loopCount: 2,
    },
  ].forEach(({ scenario, initialState, expected, loopCount = 1 }) => {
    it(scenario, async () => {
      // 초기 store 설정
      if (initialState.sideBarState) {
        sidebarStore.current.showSideBar();
      } else {
        sidebarStore.current.hideSideBar();
      }
      expect(sidebarStore.current.sideBarState).toBe(initialState.sideBarState);

      if (initialState.sideBarButtonState) {
        sidebarStore.current.activeSideBarButton();
      } else {
        sidebarStore.current.deactiveSideBarButton();
      }
      expect(sidebarStore.current.sideBarButtonState).toBe(initialState.sideBarButtonState);

      // 테스트 시작 (loopCount 만큼 반복해서 테스트)
      for (let i = 0; i < loopCount; i += 1) {
        button?.click();

        // 예상한 store가 맞는지 확인
        expect(sidebarStore.current.sideBarState).toBe(expected.sideBarState);
        expect(sidebarStore.current.sideBarButtonState).toBe(expected.sideBarButtonState);
      }
    });
  });
});

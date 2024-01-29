import { act, render } from '@testing-library/react';

import { initialState, useSideBarStore } from '@stores/zustandStores/useSideBarStore';

import { SideBarButton } from './__mocks__';

describe('<SideBarButton> 컴포넌트 테스트', () => {
  let button: HTMLElement;

  beforeEach(async () => {
    const { getByRole } = render(<SideBarButton />);
    button = await getByRole('button');
  });

  it('<button> 태그가 렌더링에 포함된다', () => {
    expect(button).toBeInTheDocument();
  });

  it('처음 렌더링 된 이후에 sidebar 관련 store는 초기화된다.', () => {
    act(() => {
      useSideBarStore.setState({ ...initialState, sideBarState: !initialState.sideBarState });
    });

    render(<SideBarButton />);

    const sideBarStore = useSideBarStore.getState();
    const curState = {
      first: sideBarStore.first,
      sideBarState: sideBarStore.sideBarState,
      sideBarButtonState: sideBarStore.sideBarButtonState,
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
        sideBarState: false,
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
        sideBarState: false,
      },
      loopCount: 2,
    },
  ].forEach(({ scenario, initialState, expected, loopCount = 1 }) => {
    it(scenario, () => {
      // 초기 store 설정
      act(() => {
        useSideBarStore.setState(initialState);
      });

      // 테스트 시작 (loopCount 만큼 반복해서 테스트)
      for (let i = 0; i < loopCount; i += 1) {
        act(() => {
          button?.click();
        });

        // 예상한 store가 맞는지 확인
        expect(useSideBarStore.getState().sideBarState).toBe(expected.sideBarState);
      }
    });
  });
});

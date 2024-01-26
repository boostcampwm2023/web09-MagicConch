import { render, renderHook } from '@testing-library/react';

import { initialState, useSideBarStore } from '@stores/zustandStores/useSideBarStore';

import SideBarButton from './SideBarButton';

describe('SideBarButton', () => {
  it('<button> 태그가 렌더링에 포함된다', async () => {
    const { findByLabelText } = render(<SideBarButton />);

    const button = await findByLabelText('button');

    expect(button).toBeInTheDocument();
  });

  it('처음 렌더링 된 이후에 sidebar 관련 zustand store는 초기화된다.', () => {
    const { result } = renderHook(() => useSideBarStore());

    result.current.showSideBar();
    result.current.deactiveSideBarButton();

    render(<SideBarButton />);

    const curState = {
      sideBarState: result.current.sideBarState,
      sideBarButtonState: result.current.sideBarButtonState,
    };
    expect(curState).toEqual(initialState);
  });

  it('sideBarState가 false인 상태에서 side bar 버튼을 클릭하면, sideBarState가 true가 된다.', async () => {
    const { result } = renderHook(() => useSideBarStore());
    const { findByLabelText } = render(<SideBarButton />);

    const button = await findByLabelText('button');

    result.current.hideSideBar();

    expect(result.current.sideBarState).toBeFalsy();

    button?.click();

    expect(result.current.sideBarState).toBeTruthy();
  });

  it('sideBarState가 true인 상태에서 side bar 버튼을 클릭하면, sideBarState가 false가 된다.', async () => {
    const { result } = renderHook(() => useSideBarStore());
    const { findByLabelText } = render(<SideBarButton />);

    const button = await findByLabelText('button');

    result.current.showSideBar();

    expect(result.current.sideBarState).toBeTruthy();

    button?.click();

    expect(result.current.sideBarState).toBeFalsy();
  });

  it('sideBarButtonState가 false인 상태에서 side bar 버튼을 클릭하면, sideBarButtonState가 바뀌지 않는다.', async () => {
    const { result } = renderHook(() => useSideBarStore());
    const { findByLabelText } = render(<SideBarButton />);

    const button = await findByLabelText('button');

    result.current.hideSideBar();

    expect(result.current.sideBarState).toBeFalsy();

    result.current.deactiveSideBarButton();
    button?.click();

    expect(result.current.sideBarButtonState).toBeFalsy();

    result.current.activeSideBarButton();
    button?.click();

    expect(result.current.sideBarButtonState).toBeTruthy();
  });
});

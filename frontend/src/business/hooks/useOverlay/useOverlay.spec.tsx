import useOverlay, { OverlayProvider } from '.';
import { act, renderHook, screen } from '@testing-library/react';

describe('useOvelay훅 테스트', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => <OverlayProvider>{children}</OverlayProvider>;

  it('useOverlay의 open, close함수 호출시 mount되고 unmount된다.', async () => {
    const { result } = renderHook(() => useOverlay(), { wrapper });
    const { closeOverlay, openOverlay } = result.current;

    // 오버레이가 열린다.
    act(() => {
      openOverlay(() => <div>testOverlay</div>);
    });
    expect(screen.getByText('testOverlay')).toBeInTheDocument();

    // 오버레이가 닫힌다.
    act(() => {
      closeOverlay();
    });
    expect(screen.queryByText('testOverlay')).not.toBeInTheDocument();
  });
});

import ContentAreaWithSideBar from './ContentAreaWithSideBar';
import SideBarButton from './SideBarButton';

const IntegrationComponent = () => {
  return (
    <body>
      <header>
        <SideBarButton />
      </header>
      <ContentAreaWithSideBar sideBar={<div>side bar</div>}>
        <div>content area</div>
      </ContentAreaWithSideBar>
    </body>
  );
};

describe('SideBar 관련 컴포넌트 통합 테스트', () => {
  describe('처음 렌더링 이후', () => {
    it('sidebar 관련 zustand store는 초기화된다.', () => {});
    it('side bar는 화면에 보이지 않는다.', () => {});
    it('content area는 x축 기준 화면 중앙에 있다.', () => {});
    it('애니메이션 효과는 발생하지 않는다.', () => {});
  });
  describe('상태가 바뀌는 경우', () => {
    it('애니메이션 효과가 발생한다.', () => {});
    it('side bar hide 상태에서 side bar 버튼을 클릭하면, side bar가 화면에 보여진다.', () => {});
    it('side bar hide 상태에서 side bar 버튼을 클릭하면, content area는 x축 기준 화면 중앙에서 왼쪽으로 이동된다.', () => {});
    it('side bar show 상태에서 side bar 버튼을 클릭하면, side bar는 화면에서 사라진다.', () => {});
    it('side bar show 상태에서 side bar 버튼을 클릭하면, content area는 x축 기준 화면 중앙으로 이동된다.', () => {});
    it('side bar hide 상태에서 side bar 버튼이 비활성화되면 버튼을 클릭해도 작동하지 않는다.', () => {});
    it('side bar show 상태에서 side bar 버튼이 비활성화되면 content area가 x축 기준 화면 중앙으로 이동하면서 side bar가 화면에서 사라지고, 버튼을 클릭해도 작동하지 않는다.', () => {});
  });
});

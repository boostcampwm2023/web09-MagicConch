import CustomButton from "@components/CustomButton";

const HomePage = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-[80px]">
      <img className="absolute w-full h-full object-cover -z-10" src="/bg.png" />
      <img className="w-[214px] h-[214px] animate-shining" src="/moon.png" />
      <div className="flex gap-[36px] mb-[128px]">
        <CustomButton color="active" size="s">AI에게 타로보기</CustomButton>
        <CustomButton color="cancel" size="s">채팅방 개설하기</CustomButton>
      </div>
    </div>
  );
};

export default HomePage;

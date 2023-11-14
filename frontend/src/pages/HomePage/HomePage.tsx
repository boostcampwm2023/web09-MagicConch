interface HomePageProps {}

const HomePage = ({}: HomePageProps) => {
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center">
      <img className="w-full h-full object-cover" src="/bg.png" />
      <img className="w-[200px] h-[200px] absolute top-[160px]" src="/moon.png" />
    </div>
  );
};

export default HomePage;

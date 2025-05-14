const HomePage = () => {
  return (
    <div className="pageTemplate1">
      <div className="w-full flex justify-center items-center gap-4 bg-blue-600 border-4 border-white rounded-[300px] ring-4 ring-purple-600 p-10">
        <div className="flex-1 flex flex-col justify-center items-start gap-8 ml-16 -mt-8">
          <h1 className="text-5xl pt-2 font-bold text-transparent bg-gradient-to-b from-amber-400 to-amber-600 bg-clip-text">
            E-Commerce
          </h1>
          <h1 className="text-2xl pt-3 leading-6 font-bold text-white">
            Shop here
          </h1>
        </div>
        <div className="flex-1 flex flex-col justify-center items-end">
          <img
            src="images/e-commerce.jpg"
            className="w-[360px] h-[360px] object-cover rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

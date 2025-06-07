import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate("/login");
  };

  return (
    <div className="pageTemplate1 bg-gradient-to-br from-blue-50 to-blue-100 py-20 px-4 w-full overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-screen-xl mx-auto items-center">
        
        {/* Imazhi në të majtë */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-[320px] h-[320px] md:w-[360px] md:h-[360px]">
            <img
              src="images/e-commerce.jpg"
              alt="E-Commerce"
              className="rounded-full object-cover w-full h-full border-4 border-white shadow-2xl ring-8 ring-blue-300"
            />
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white opacity-10 animate-pulse"></div>
          </div>
        </div>

        {/* Teksti në të djathtë */}
        <div className="text-right space-y-6 pr-2 md:pr-8">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500">
            Blej me lehtësi. Jetë më e zgjuar.
          </h1>
          <p className="text-base md:text-lg text-gray-700">
            Zbuloni produktet më të fundit dhe më të mira në platformën tonë E-Commerce.
            Qëndroni përpara me teknologjinë dhe modën që ju përshtatet.
          </p>
          <div className="flex justify-end">
            <button
              onClick={handleShopClick}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold transition duration-300 shadow-lg hover:shadow-xl"
            >
              Shop Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;

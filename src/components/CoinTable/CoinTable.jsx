import { useState, memo } from "react";
import { fetchCoinData } from "../../services/fetchCoinData";
import { useQuery } from "react-query";
import currencyStore from "../../state/store";
import { useNavigate } from "react-router-dom";
import PageLoader from "../PageLoader/PageLoader";

// Memoized Coin Row Component to avoid re-rendering
const CoinRow = memo(({ coin, handleCoinRedirect }) => {
    return (
        <div 
            onClick={() => handleCoinRedirect(coin.id)} 
            className="w-full bg-transparent text-white flex py-4 px-2 font-semibold items-center justify-between flex-wrap cursor-pointer hover:bg-gray-800"
        >
            <div className="flex items-center justify-start gap-3 basis-full sm:basis-1/2 md:basis-[35%]">
                <div className="w-[3rem] h-[3rem] md:w-[5rem] md:h-[5rem]">
                    <img src={coin.image}  className="w-full h-full" loading="lazy" />
                </div>
                <div className="flex flex-col">
                    <div className="text-lg md:text-3xl">{coin.name}</div>
                    <div className="text-sm md:text-xl">{coin.symbol}</div>
                </div>
            </div>
            <div className="basis-full flex justify-center items-center sm:basis-1/2 md:basis-[25%] text-center md:text-left mt-2 sm:mt-0">
                {coin.current_price}
            </div>
            <div className="basis-full flex justify-center items-center sm:basis-1/2 md:basis-[20%] text-center md:text-left mt-2 sm:mt-0">
                {coin.price_change_24h}
            </div>
            <div className="basis-full flex justify-center items-center sm:basis-1/2 md:basis-[20%] text-center md:text-left mt-2 sm:mt-0">
                {coin.market_cap}
            </div>
        </div>
    );
});

function CoinTable() {
    const { currency } = currencyStore();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, error } = useQuery(
        ['coins', page, currency],
        () => fetchCoinData(page, currency),
        {
            cacheTime: 1000 * 60 * 2,
            staleTime: 1000 * 60 * 2,
        }
    );

    const handleCoinRedirect = (id) => {
        navigate(`/details/${id}`);
    };

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

    // if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;
    if(isLoading) {
        return <PageLoader />
    }

    return (
        <div className="my-5 flex flex-col items-center justify-center gap-5 w-[90vw] md:w-[80vw] mx-auto">
            <div className="w-full bg-yellow-400 text-black flex py-4 px-2 font-semibold items-center justify-center flex-wrap">
                <div className="basis-full sm:basis-1/2 md:basis-[35%] text-center md:text-left">
                    <span className="m-4">Coin</span> 
                </div>
                <div className="basis-full sm:basis-1/2 md:basis-[25%] text-center">
                    Price
                </div>
                <div className="basis-full sm:basis-1/2 md:basis-[20%] text-center">
                    24h Change
                </div>
                <div className="basis-full sm:basis-1/2 md:basis-[20%] text-center">
                    Market Cap
                </div>
            </div>

            <div className="flex flex-col w-full mx-auto">
                {data && data.map((coin) => (
                    <CoinRow key={coin.id} coin={coin} handleCoinRedirect={handleCoinRedirect} />
                ))}
            </div>

            <div className="flex gap-4 justify-center items-center">
                <button
                    disabled={page === 1}
                    onClick={handlePrevPage}
                    className="btn btn-primary btn-wide text-white text-lg md:text-2xl"
                >
                    Prev
                </button>
                <button
                    onClick={handleNextPage}
                    className="btn btn-secondary btn-wide text-white text-lg md:text-2xl"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default memo(CoinTable);

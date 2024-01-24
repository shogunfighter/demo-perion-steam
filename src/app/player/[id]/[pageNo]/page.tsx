// import MostPlayedGames from "@/app/component/MostPlayedGames";
import MostPlayedGames from "@/app/component/MostPlayedGames";
import { handleQueryPlayerInfo, mapGamesOwned, mostPlayedGames, totalNumberOfGamesOwned, totalPlaytimeAcrossAllGames } from "../../../server/actions";
import SteamClient from "../../../util/steam";
import Link from "next/link";
// import fetch from "node-fetch";

type TPageParam = { params: { id: string, pageNo: string } }

export default async function Page(args: TPageParam) {
    console.log("XXXXXXXXXXXXXXX: ", JSON.stringify(args, null, 2));

    const id = args.params.id;
    const pageNo = Number(args.params.pageNo) || 1;
    console.log("id:", id);
    console.log("pageNo:", pageNo);

    let data;
    try {
        data = await SteamClient.getUserOwnedGames(id);
    }
    catch (error) {
        throw new Error("Steam API request failed.");
    }

    // http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=STEAM_KEY&steamid=76561197960434622&format=json
    // const response = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${id[0]}&format=json`);
    // const data = await response.json();

    // console.log("data:", data);

    const mapGamesOwnedResult = await mapGamesOwned(data, pageNo);
    const totalNumberOfGamesOwnedResult = await totalNumberOfGamesOwned(data);
    const totalPlaytimeAcrossAllGamesResult = await totalPlaytimeAcrossAllGames(data);
    const mostPlayedGamesResult = await mostPlayedGames(data);

    const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
    const startIndex = (pageNo - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageContent = mapGamesOwnedResult.slice(startIndex, endIndex);
    const pageCount = Math.ceil(totalNumberOfGamesOwnedResult / itemsPerPage);

    return (
        <>
            <main>
                <form action={handleQueryPlayerInfo}>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Steam ID</label>
                            <input type="text" name="id" id="id" placeholder="steam id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                    </div>

                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>

                <br />
                <br />

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Game Name</th>
                            <th scope="col" className="px-6 py-3">Time Spent (minutes)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mapGamesOwnedResult.map((item, index) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</th>
                                <td scope="row" className="px-6 py-4">{item.name}</td>
                                <td scope="row" className="px-6 py-4">{item.minutes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <br />
                <br />

                <nav aria-label="Page navigation example">
                    {pageCount > 1 && <ul className="inline-flex flex-row flex-wrap justify-center items-start -space-x-px text-sm">
                        <li>
                            <Link href={pageNo > 1 ? `/player/${id}/${pageNo - 1}` : "#"} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ms-0 border-e-0 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</Link>
                        </li>
                        {
                            Array.from({ length: pageCount }).map((_, index) => <li>
                                <Link href={`/player/${id}/${index + 1}`} className={
                                    (pageNo === index + 1)
                                        ? "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        : "flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                } key={index}>{index + 1}</Link>
                            </li>)
                        }
                        <li>
                            <Link href={pageNo < pageCount ? `/player/${id}/${pageNo + 1}` : "#"} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</Link>
                        </li>
                    </ul>
                    }
                </nav>

                <br />
                <br />

                {/* <pre>{ JSON.stringify(mapGamesOwnedResult, null, 2) }</pre> */}
                <br />
                <p>
                    Total number of games owned: {totalNumberOfGamesOwnedResult}
                </p>
                <p>
                    Total playtime across all games: {totalPlaytimeAcrossAllGamesResult}
                </p>
                <br />
                <p>
                    {/* Most played games: {JSON.stringify(mostPlayedGamesResult, null, 2)} */}
                    Most played games: {mostPlayedGamesResult && <MostPlayedGames games={mostPlayedGamesResult} />}
                </p>
            </main>
        </>
    );
}
import 'dotenv/config';
// console.log("ENV:STEAM_API_KEY", process.env.STEAM_API_KEY);
import SteamAPI from 'steamapi'; // https://www.npmjs.com/package/steam-web

const SteamClient = new SteamAPI(process.env.STEAM_API_KEY as string)

export default SteamClient;

// // 76561198308880126 not work - mine
// // 76561197960434622 works
// /**
//  * Extract the total time the player spent on all Steam Games
//  * @param steamId steam identifier
//  * @returns total time the player spent on all Steam Games
//  */
// export const playerTotalPlaytime = async (steamId: string) => {
//     try {
//         const data = await steam.getUserOwnedGames(steamId);

//         if (data?.length > 0) {
//             // result in minutes
//             return data.reduce((sum: number, game: any) => sum + game.minutes, 0);
//         }
//         console.log(data);
//     }
//     catch (error) {
//         return new Error("[playerTotalPlaytime] Unable to load information from steam");
//     }
// }
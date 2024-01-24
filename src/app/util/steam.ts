import 'dotenv/config';
// console.log("ENV:STEAM_API_KEY", process.env.STEAM_API_KEY);
import SteamAPI from 'steamapi'; // https://www.npmjs.com/package/steam-web

const SteamClient = new SteamAPI(process.env.STEAM_API_KEY as string)

export default SteamClient;
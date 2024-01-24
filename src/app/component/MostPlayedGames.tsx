import Image from 'next/image'
import { Game, GameInfo, GameInfoExtended, UserPlaytime } from "steamapi";
import SteamClient from "../util/steam";

export default async function MostPlayedGames({ games } : { games: Array<UserPlaytime<Game | GameInfo | GameInfoExtended>>}) {

  console.log("XXXXXXXXXXXXXXXXXXX MostPlayedGames games:",JSON.stringify(games, null, 2))


  const gameDetailList = [];

  for (const item of games) {
    // const gameDetail = await SteamClient.getGameDetails(item.game.id);
    // console.log("XXXXXX gameDetail:", JSON.stringify(gameDetail, null, 2));
    gameDetailList.push(await SteamClient.getGameDetails(item.game.id));
  }

  console.log("XXXXXXXXXX gameDetailList:",gameDetailList);

  return (
    <div>
      {
        gameDetailList.map((gameDetail, id) => {
          return <div key={id}>
            <Image
              src={gameDetail.capsule_image}
              width={231}
              height={87}
              alt={gameDetail.name}
            />
            {/* <span>{JSON.stringify(gameDetail)}</span> */}
            <br />
          </div>
        })
      }
    </div>
  );
}
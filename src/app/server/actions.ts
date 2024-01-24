"use server";

import { Game, GameInfo, GameInfoExtended, UserPlaytime } from "steamapi";
import SteamClient from "../util/steam";
import sortBy from "lodash/sortBy";
import { redirect } from "next/navigation";

type CachedGameDetails = {
    [key: string]: any;
};

type GamesOwned = {
    id: number;
    name: string;
    minutes: number;
}

let cachedGameDetails: CachedGameDetails = {};


export async function handleQueryPlayerInfo(formData: FormData) {
    'use server';
    const id = formData.get('id');
    redirect(`/player/${id}/1`); // Navigate to specific player page
}

export const mapGamesOwned = async (data: Array<UserPlaytime<Game | GameInfo | GameInfoExtended>>, page: number = 1): Promise<GamesOwned[]> => {
    let result: GamesOwned[] = [];
    const dataSortedByPlaytime = sortBy(data, 'minutes').reverse();

    const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageContent = dataSortedByPlaytime.slice(startIndex, endIndex);

    let requestCountGameName = 0;

    /**
     * Sometimes, a player has enormous amounts of owned games (e.g., steamid: 76561197960434622)
     * This guy has 1042 games, imagine iterating and fetching those game information for each game id
     * 
     * Propose a solution:
     * 1. Pagination - i better use this
     * 2. Queue and Caching (but this might slow down the display)
     */
    gameNameDetail: for (const {game, minutes} of pageContent) {

        if (requestCountGameName < 10) {
            let item: GamesOwned = {
                id: game.id,
                name: "",
                minutes
            };

            if (!Object.keys(cachedGameDetails).includes(String(game.id))) {
                // fetch game details
                const gameDetail = await SteamClient.getGameDetails(game.id);
                item.name = gameDetail.name;
            }
            else {
                // load from cache
                item.name = cachedGameDetails[game.id].name;
            }

            result.push(item);
        }
        else {
            break gameNameDetail;
        }

        requestCountGameName++;
    }

    return result;
}


/**
 * @param data 
 * @returns Array<UserPlaytime<Game | GameInfo | GameInfoExtended>> 
 */
export const mostPlayedGames = (data: Array<UserPlaytime<Game | GameInfo | GameInfoExtended>>): Array<UserPlaytime<Game | GameInfo | GameInfoExtended>> => {
    const maxMinutes = Math.max(...data.map(item => item.minutes));
    const mostPlayedGames = data.filter(item => item.minutes === maxMinutes);
    return mostPlayedGames;
}

/**
 * 
 * @param data 
 * @returns 
 */
export const totalPlaytimeAcrossAllGames = (data: Array<UserPlaytime<Game | GameInfo | GameInfoExtended>>) => data.reduce((sum: number, userPlayTime: UserPlaytime<Game | GameInfo | GameInfoExtended>) => sum + userPlayTime.minutes, 0);


/**
 * 
 * @param data 
 * @returns 
 */
export const totalNumberOfGamesOwned = (data: Array<UserPlaytime<Game | GameInfo | GameInfoExtended>>) => data.map(item => item.game.id).length;
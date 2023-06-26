import {fetchRedis} from "@/helpers/redis";

export const getFriendsByUserId = async (userId: string) => {
    const friendsIds = (await fetchRedis(
        'smembers',
        `user:${userId}:friends`
    )) as string[];

    return await Promise.all(
        friendsIds.map(async (friend) => {
            return await fetchRedis('get', `user:${friendsIds}`) as User;
        })
    );
}
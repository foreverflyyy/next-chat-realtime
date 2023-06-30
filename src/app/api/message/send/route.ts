import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {fetchRedis} from "@/helpers/redis";
import {nanoid} from "nanoid";
import {db} from "@/lib/db";
import {messageValidator} from "@/lib/validate/message";
import {ZodError} from "zod";
import {pusherServer} from "@/lib/pusher";
import {toPusherKey} from "@/lib/utils";

export async function POST(req: Request){
    try {
        const {text, chatId}: {text: string, chatId: string} = await req.json();
        const session = await getServerSession(authOptions);

        if(!session)
            return new Response("Unauthorized", {status: 401})

        const [userId1, userId2] = chatId.split("--");

        if(session.user.id !== userId1 && session.user.id !== userId2)
            return new Response("Unauthorized", {status: 401})

        const friendId = session.user.id === userId1 ? userId2 : userId1;

        const friends = (await fetchRedis(
            'smembers',
            `user:${session.user.id}:friends`
        )) as string[]
        const isFriend = friends.includes(friendId);

        if(!isFriend)
            return new Response("Sender isn't friend", {status: 401})

        const timestamp = Date.now();

        const messageData: Message = {
            id: nanoid(),
            text,
            timestamp,
            senderId: session.user.id,
            receiverId: friendId,
        }

        const message = messageValidator.parse(messageData);

        // notify all connected chat room clients
        await pusherServer.trigger(
            toPusherKey(`chat:${chatId}`),
            'incoming-message',
            message
        )

        await db.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(message)
        });

        return new Response("OK");
    } catch (error) {
        if(error instanceof Error)
            return new Response('Invalid message', {status: 500});

        return new Response('Something wrong', {status: 500});
    }
}
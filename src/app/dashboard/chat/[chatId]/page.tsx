import React from 'react';
import {getServerSession} from "next-auth";
import {NotFound} from "next/dist/client/components/error";
import {fetchRedis} from "@/helpers/redis";
import {notFound} from "next/navigation";
import {messageArrayValidator} from "@/lib/validate/message";
import {db} from "@/lib/db";
import {authOptions} from "@/lib/auth";

interface PageProps {
    params: {
        chatId: string;
    }
}

async function getChatMessages(chatId: string){
    try {
        const results: string[] = await fetchRedis(
            'zrange',
            `chat:${chatId}:messages`,
            0,
            -1
        )

        const dbMessages = results.map(message => JSON.parse(message) as Message);
        const reversedDbMessages = dbMessages.reverse();

        return messageArrayValidator.parse(reversedDbMessages);
    } catch(error){
        return notFound();
    }
}

const Page = async ({params: {chatId}}: PageProps) => {

    const session = await getServerSession(authOptions);
    if(!session) return NotFound();

    const {user} = session;

    const [userId1, userId2] = chatId.split("--");
    if(userId1 !== user.id && userId2 !== user.id) return NotFound();

    const chatPartnerId = user.id === userId1 ? userId2 : userId1;
    const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;
    const initialMessages = await getChatMessages(chatId);

    return (
        <div>
            {chatId}
        </div>
    );
};

export default Page;
import React from 'react';
import {getServerSession} from "next-auth";
import {NotFound} from "next/dist/client/components/error";

interface PageProps {
    params: {
        chatId: string;
    }
}

const Page = async ({params: {chatId}}: PageProps) => {

    const session = await getServerSession();
    if(!session) return NotFound();

    const {user} = session;

    const [userId1, userId2] = chatId.split("--");
    if(userId1 !== user.id && userId2 !== user.id) return NotFound();

    return (
        <div>
            Page Chat
        </div>
    );
};

export default Page;
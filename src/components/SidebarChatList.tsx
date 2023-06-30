"use client"
import React, {useState} from 'react';
import {usePathname, useRouter} from "next/navigation";
import {useEffect} from "react";
import {chatHrefConstructor, toPusherKey} from "@/lib/utils";
import {pusherClient} from "@/lib/pusher";
import toast from "react-hot-toast";
import UnseenChatToast from "@/components/UnseenChatToast";

interface SidebarChatListProps {
    friends: User[];
    sessionId: string;
}

interface ExtendedMessage extends Message {
    senderImg: string,
    senderName: string
}

const SidebarChatList = ({friends, sessionId}: SidebarChatListProps) => {

    const router = useRouter();
    const pathname = usePathname();
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

        const newFriendHandler = (newFriend: User) => {
            toast.custom(t => (
                <UnseenChatToast
                    t={t}
                    sessionId={sessionId}
                    senderId={newFriend.id}
                    senderImg={newFriend.image}
                    senderName={newFriend.name}
                    senderMessage={"This guy received you in friends"}
                />
            ))
        }

        const chatHandler = (message: ExtendedMessage) => {
            const shouldNotify =
                pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

            if(!shouldNotify) return;

            toast.custom(t => (
                <UnseenChatToast
                    t={t}
                    sessionId={sessionId}
                    senderId={message.senderId}
                    senderImg={message.senderImg}
                    senderName={message.senderName}
                    senderMessage={message.text}
                />
            ))

            setUnseenMessages(prev => [...prev, message])
        }

        pusherClient.bind('new_friend', newFriendHandler)
        pusherClient.bind('new_message', chatHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

            pusherClient.unbind('new_friend', newFriendHandler)
            pusherClient.unbind('new_message', chatHandler)
        }
    }, [pathname, sessionId, router])

    useEffect(() => {
        if(pathname?.includes('chat')){
            setUnseenMessages(prev => {
                return prev.filter(msg => !pathname.includes(msg.senderId))
            })
        }
    }, [pathname])

    return (
        <ul role={"list"} className={"max-h-[25rem] overflow-y-auto -mx-2 space-y-1"}>
            {friends.sort().map(friend => {
                const unseenMessagesCount = unseenMessages.filter(msg =>
                    msg.senderId == friend.id).length;
                return (
                    <li key={friend.id}>
                        <a
                            href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}
                            className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        >
                            {friend.name}
                            {unseenMessagesCount > 0 && (
                                <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                                    {unseenMessagesCount}
                                </div>
                            )}
                        </a>
                    </li>
                )
            })}
        </ul>
    );
};

export default SidebarChatList;

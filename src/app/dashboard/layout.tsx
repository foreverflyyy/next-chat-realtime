import React, {ReactNode} from 'react';
import Link from "next/link";
import {Icons} from "@/components/Icons";
import {SidebarOption, sidebarOptions} from "@/data/SidebarOptions";
import {session} from "next-auth/core/routes";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {NotFound} from "next/dist/client/components/error";
import Image from "next/image"
import SignOutButton from "@/components/SignOutButton";
import FriendRequestSidebarOptions from "@/components/FriendRequestSidebarOptions";
import {fetchRedis} from "@/helpers/redis";
import {getFriendsByUserId} from "@/helpers/get-friend-by-user-id";
import SidebarChatList from "@/components/SidebarChatList";

async function Layout({children}: {children: ReactNode}) {
    const session = await getServerSession(authOptions);
    if(!session) return NotFound();

    const unseenRequestCount = (
        await fetchRedis(
            'smembers',
            `user:${session.user.id}:incoming_friend_requests`
        ) as User[]
    ).length;

    const friends = await getFriendsByUserId(session.user.id);

    return (
        <div className={"w-full flex h-screen"}>
            <div className={"hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6"}>
                <Link href={"/dashboard"} className={"flex h-16 shrink-0 items-center"}>
                    <Icons.Logo className={"h-8 w-auto text-indigo-600"}/>
                </Link>

                {friends.length > 0 && (
                    <div className={"text-xs font-semibold leading-6 text-gray-400"}>
                        Your chats
                    </div>
                )}

                <nav className={"flex flex-1 flex-col"}>
                    <ul role={"list"} className={"flex flex-1 flex-col gap-y-7"}>
                        <li>
                            <SidebarChatList friends={friends} sessionId={session.user.id}/>
                        </li>

                        <li>
                            <div className={"text-xs font-semibold leading-6 text-gray-400"}>
                                Overview
                            </div>

                            <ul role={"list"} className={"mt-2 space-y-1"}>
                                {sidebarOptions.map((option: SidebarOption) => {
                                    const Icon = Icons[option.Icon];
                                    return (
                                        <li key={option.id}>
                                            <Link
                                                href={option.href}
                                                className={"text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md py-2 text-sm leading-6 font-semibold"}
                                            >
                                                <span className={"tet-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"}>
                                                    <Icon className={"h-4 w-4"}/>
                                                </span>
                                                <span className={"truncate"}>{option.name}</span>
                                            </Link>
                                        </li>
                                    )
                                })}

                                <li>
                                    <FriendRequestSidebarOptions
                                        sessionId={session.user.id}
                                        initialUnseenRequestCount={unseenRequestCount}
                                    />
                                </li>
                            </ul>
                        </li>

                        <li className={"mt-auto flex items-center"}>
                            <div className={"flex flex-1 items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900"}>
                                <div className={"relative h-8 w-8 bg-gray-50"}>
                                    <Image
                                        fill
                                        referrerPolicy={'no-referrer'}
                                        className={"rounded-full"}
                                        src={session?.user.image || ''}
                                        alt={"Your profile picture"}
                                    />
                                </div>

                                <span className={"sr-only"}>Your profile</span>
                                <div className={"flex flex-col"}>
                                    <span aria-hidden={true}>{session?.user.name}</span>
                                    <span aria-hidden={true} className={"text-xs text-zinc-400"}>
                                        {session?.user.email}
                                    </span>
                                </div>
                            </div>
                            <SignOutButton className={"h-full aspect-square"}/>
                        </li>
                    </ul>
                </nav>
            </div>
            {children}
        </div>
    );
}

export default Layout;
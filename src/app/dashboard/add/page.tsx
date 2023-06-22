import React from 'react';
import AddFriendForm from "@/components/AddFriendForm";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

const Page = async () => {

    const check = await getServerSession(authOptions);
    console.log(check)

    return (
        <main className={"pt-8"}>
            <h1 className={"font-bold text-5xl mb-8"}>Add a friend</h1>
            <AddFriendForm/>
        </main>
    );
};

export default Page;
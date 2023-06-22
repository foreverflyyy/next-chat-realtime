import Image from 'next/image'
import {db} from "@/lib/db";

export default async function Home() {

    await db.set("hello", "hello");

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            Hello world~
        </main>
    )
}

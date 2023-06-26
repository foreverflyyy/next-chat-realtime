import Image from 'next/image'
import {db} from "@/lib/db";
import Link from "next/link";

export default async function Home() {

    return (
        //<main className="flex min-h-screen flex-col items-center justify-between p-24">
        <main className="flex min-h-screen flex-col items-center p-24">
            Hello world
            <Link
                href={'/login'}
                className={"pt-5 font-bold text-3xl hover:text-blue-700"}
            >
                Login
            </Link>
            <Link
                href={'/dashboard'}
                className={"pt-5 font-bold text-3xl hover:text-blue-700"}
            >
                Dashboard
            </Link>
        </main>
    )
}

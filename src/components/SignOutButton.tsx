"use client"
import {ButtonHTMLAttributes, useState} from 'react';
import Button from "@/components/ui/Button";
import {signOut} from "next-auth/react";
import toast from "react-hot-toast";
import {Loader2, LogOut} from "lucide-react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{}

const SignOutButton = ({...props}: SignOutButtonProps) => {

    const [isSignOut, setIsSignOut] = useState(false);

    const handlerSignOut = async () => {
        setIsSignOut(true);
        try {
            await signOut();
        } catch(err){
            toast.error("There was a problem signing out")
        } finally {
            setIsSignOut(false);
        }
    }

    return (
        <Button
            {...props}
            variant={'ghost'}
            onClick={handlerSignOut}
            >
            {isSignOut
                ? <Loader2 className={"animate-spin h-4 w-4"}/>
                : <LogOut className={"w-4 h-4 "}/>
            }
        </Button>
    );
};

export default SignOutButton;
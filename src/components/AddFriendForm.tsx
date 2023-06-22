"use client"

import React, {useState} from 'react';
import {addFriendValidator} from "@/lib/validate/addFriendValidator";
import axios, {AxiosError} from "axios";
import {z, ZodError} from "zod";
import Button from "@/components/ui/Button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendForm = () => {

    const [showSuccessState, setShowSuccessState] = useState(false);

    const { register,
        handleSubmit,
        setError ,
        formState: {errors}
    } = useForm<FormData>({ resolver: zodResolver(addFriendValidator) })

    const addFriend = async (email: string) =>{
        try {
            const validateEmail = addFriendValidator.parse({email});

            await axios.post('/api/friends/add', {
                email: validateEmail
            })
        } catch(err) {
            if(err instanceof AxiosError) {
                setError('email', {message: err.response?.data})
                return;
            }

            if(err instanceof ZodError) {
                setError('email', {message: err.message})
                return;
            }

            setError('email', {message: 'Something went wrong'})
        }
    }

    const onSubmit = (data: FormData) => {
        addFriend(data.email);
    }

    return (
        <form className={"max-w-sm"} onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor={"email"} className={"block text-sm font-medium leading-6 text-gray-900"}>
                Add friend by E-mail
            </label>

            <div className={"mt-2 flex gap-4"}>
                <input
                    {...register('email')}
                    type={"text"}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder={"you@example.com"}
                />
                <Button>Add</Button>
            </div>
            <p className={"mt-1 text-sm text-red-600"}>{errors.email?.message}</p>
            {showSuccessState && (
                <p className={"mt-1 text-sm text-green-600"}>friend success sent!</p>
            )}
        </form>
    );
};

export default AddFriendForm;
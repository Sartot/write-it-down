"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";


import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { auth } from "@/app/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const formSchema = z.object({
    email: z.string().min(1, {
        message: "Required field"
    }).email("Invalid e-mail"),
    pwd: z.string().min(6, {
        message: "Password minimum length is 6 characters!"
    })
})

export default function LoginForm() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            pwd: ""
        },
    })

    function onSubmit(values) {
        createUserWithEmailAndPassword(auth, values.email, values.pwd).then((userCredentials) => {
            const { user } = userCredentials;
            user.getIdToken().then(idToken => {
                fetch("/api/sessionToken", {
                    method: "POST",
                    body: JSON.stringify({
                        "idToken": idToken
                    })
                });
            });
        });
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="pwd"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}
import LoginForm from "@/components/login-form"
import SignUpForm from "@/components/signup-form"

import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function LoginPage(){
    return (
        <main className="flex justify-center items-center h-svh">
            <div className="w-2/12">
                <Tabs defaultValue="login">
                    <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <LoginForm />   
                    </TabsContent>
                    <TabsContent value="signup">
                        <SignUpForm />   
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}
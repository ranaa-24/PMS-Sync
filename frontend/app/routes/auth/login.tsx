import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { LoginSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import type { Route } from "./+types/login";
import { useLoginMutation } from "@/hooks/useAuthenticate"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { useAuthContext } from "@/providers/auth.context"


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sync | Login" },
    { name: "description", content: "Login To Your Accout" },
  ];
}

//innfering a type from schema defination
export type LoginFormType = z.infer<typeof LoginSchema>

function login() {
  const navigate = useNavigate();
  const {login} = useAuthContext();


  const form = useForm<LoginFormType>(
    {
      resolver: zodResolver(LoginSchema),
      defaultValues: {
        email: "",
        password: "",
      }
    }
  )

  const { mutate, isPending} = useLoginMutation();

  const handleOnSubmit = (data: LoginFormType) => {
    mutate(data, {
      onSuccess: (data: any) => {   // this data contains the actaul login tokken
        console.log("log in data: ", data);
        toast.success(data?.message || "Welcome back!", {
          description: "You're now logged in. Let's get started.",
        });
        login(data);
        navigate('/dashboard')
      },  

      onError: (error: any) => {
        const errorMsg = error.response?.data?.message || "Login Failed! try again later"
        toast.error(errorMsg);
        console.log("Error in login (FE): ", error);
      }
    })
  }


  return (
    <div className="w-full mx-auto h-screen flex justify-center items-center">
      <Card className="mx-auto w-[360px] md:w-sm lg:w-[420px] bg-surface text-main-font border-2 border-main-border animate-fade animate-once animate-duration-[500ms]">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-2xl md:text-3xl font-bold">Welcome Back!</CardTitle>
          <CardDescription className=" text-xs md:text-sm text-secondary-font">Everything you need, right where you left it. Log in and power on.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">

                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          {/* spreading the feild which contains the actual data */}
                          <Input className="border-main-border h-11" type="mail" placeholder="Email Address" {...field}/>   
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                  )}  
                >
                </FormField>

                 <FormField
                  control={form.control}
                  name="password"
                  render={({field}) => (
                    <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link to="/forgot-password" className="text-xs md:text-sm text-secondary-font hover:underline">Forgot Password?</Link>
                        </div>
                        <FormControl>
                          {/* spreading the feild which contains the actual data */}
                          <Input className="border-main-border h-11" type="password" placeholder="Password" {...field}/>   
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                  )}  
                >
                </FormField>
                <Button type="submit" className="w-full h-11 font-bold bg-theme-tertiary text-black hover:bg-theme-tertiary/85" disabled={isPending}>
                  {isPending ? "Logging in..." : "Log In"}
                </Button>
              </form>
          </Form>

          <CardFooter className="mt-4">
            <div className="flex items-center justify-center text-xs md:text-sm w-full">
              <div className="text-muted-foreground">Don't have an account? {" "}
                <Link to="/signup" className="text-theme-primary hover:underline">Sign up</Link>
              </div>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default login
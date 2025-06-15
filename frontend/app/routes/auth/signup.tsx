import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { SignupSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { useSignUpMutation } from "@/hooks/useAuthenticate"
import { toast } from "sonner"
import type { Route } from "./+types/signup"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sync | Signup" },
    { name: "description", content: "Create a Accout" },
  ];
}


//innfering a type from schema defination
export type SignupFormType = z.infer<typeof SignupSchema>

function SignUp() {
  const navigate = useNavigate();

  const form = useForm<SignupFormType>(
    {
      resolver: zodResolver(SignupSchema),
      defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
      }
    }
  )

  // provided by useMutation()
  const { mutate: mutateSignUp, isPending } = useSignUpMutation();

  const handleOnSubmit = (data: SignupFormType) => {
    mutateSignUp(data, {
      onSuccess: (data: any) => {
        toast.success('Email Verification Required!', {
          description: data?.message || "Please check your email to verify your account.",
        });
        setTimeout(() => {
          navigate("/login");
        }, 5000);
        form.reset();
      },

      // when axios returns a error, type any coz not sure about the error type, tho its AxiosError type.. still
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "Signup failed. Please try again later";
        console.log("Error signUp: ", error);
        toast.error(errorMessage);
      }
    })
  }

  return (
    <div className="w-full mx-auto h-screen flex justify-center items-center ">
      <Card className="mx-auto w-[360px] md:w-sm lg:w-[420px] bg-surface text-main-font border-2 border-main-border animate-fade animate-once animate-duration-[500ms]">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-2xl md:text-3xl font-bold">Create an account</CardTitle>
          <CardDescription className=" text-xs md:text-sm text-secondary-font">Create your account in seconds and get started with a smarter, smoother workflow.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-3 lg:space-y-4">

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      {/* spreading the feild which contains the actual data */}
                      <Input className="border-main-border h-11" type="text" placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      {/* spreading the feild which contains the actual data */}
                      <Input className="border-main-border h-11" type="mail" placeholder="Email Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      {/* spreading the feild which contains the actual data */}
                      <Input className="border-main-border h-11" type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      {/* spreading the feild which contains the actual data */}
                      <Input className="border-main-border h-11" type="password" placeholder="Re-enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>

              <Button
                type="submit"
                className="w-full h-11 font-bold bg-theme-tertiary text-black hover:bg-theme-tertiary/85"
                disabled={isPending}
              >
                {isPending ? "Please wait..." : "Create Account"}
              </Button>
            </form>
          </Form>

          <CardFooter className="mt-4">
            <div className="flex items-center justify-center text-xs md:text-sm w-full">
              <div className="text-muted-foreground">Already have an account? {" "}
                <Link to="/login" className="text-theme-primary hover:underline">Log in</Link>
              </div>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUp
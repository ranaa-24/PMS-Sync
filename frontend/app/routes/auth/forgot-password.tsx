import { forgotPasswordSchema } from "@/lib/schema"
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import { Link, useNavigate } from "react-router";
import type { Route } from "../../+types/root";
import { useForgotPasswordMutation } from "@/hooks/useAuthenticate";
import { toast } from "sonner";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sync | Forgot Password" },
    { name: "description", content: "Reset password request" },
  ];
}


type ForgetPasswordFromType = z.infer<typeof forgotPasswordSchema>;

function ForgotPassword() {
  const navigate = useNavigate();

  const [isSuccess, setIsSuccess] = useState(false);

  const {mutate: mutateForgotPassword, isPending} = useForgotPasswordMutation();


  const form = useForm<ForgetPasswordFromType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    }
  });

  const handleSubmit = async (data: ForgetPasswordFromType) => {
    mutateForgotPassword(data, {
      onSuccess: () => {
        setIsSuccess(true);
        toast.success("Email Sent!", {
          description: "Please check your inbox (and spam folder)."
        });

        setTimeout(() => {
          navigate('/login');
        }, 5000);
      }, 

      onError: (error: any) => {
        const errMsg = error.response?.data?.message || "Something went wrong, Please Try again later."
        toast.error(errMsg);
        console.log(error)
      }
    })
  }

  return (
    <div className="w-full mx-auto h-screen flex justify-center items-center">
      <Card className="mx-auto w-[360px] md:w-sm lg:w-[420px] bg-surface text-main-font border-2 border-main-border animate-fade animate-once animate-duration-[500ms]">
        <CardHeader className="text-center mb-3">
          <CardTitle className="text-2xl md:text-3xl font-bold">Forgot Your Password?</CardTitle>
          <CardDescription className=" text-xs md:text-sm text-secondary-font text-pretty">Enter your email to get a reset link.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Enter your email</FormLabel>
                    </div>
                    <FormControl>
                      <Input className="border-main-border h-11" type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>

              <Button type="submit" className={`w-full h-11 font-bold bg-theme-tertiary text-black hover:bg-theme-tertiary/85 ${isPending && "bg-disabled text-main-font"}`} disabled={isPending}>
                {isPending ? <Loader /> : "Get Reset Email"}
              </Button>
            </form>
          </Form>

          <CardFooter className="mt-4">
                <div className="flex items-center justify-center text-xs md:text-sm w-full">
                  <div className="text-muted-foreground">Oh, remembered it? {" "}
                    <Link to="/login" className="text-theme-primary hover:underline">Log in</Link>
                  </div>
                </div>
              </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword
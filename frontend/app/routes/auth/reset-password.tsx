import { resetPasswordSchema } from "@/lib/schema"
import { string, z } from "zod"
import type { Route } from "../../+types/root";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import { useResetPasswordMutation } from "@/hooks/useAuthenticate";
import { toast } from "sonner";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sync | Reset Password" },
    { name: "description", content: "Reset password" },
  ];
}

type ResetFormType = z.infer<typeof resetPasswordSchema>;

function ResetPassword() {
  const [searchparams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  
  const {mutate: mutateResetPassword, isPending} = useResetPasswordMutation();
  
  const token = searchparams.get("token");
  const handleSubmit = async (data: ResetFormType) => {
    if(!token){
      toast.error("Invalid Token!");
      return;
    }

    // trust me bro token is a type string
    mutateResetPassword({token: token as string, ...data}, {
      onSuccess: () => {
        setIsSuccess(true);
        toast.success("All Set!", {
          description: "Your password has been successfully changed."
        });

        setTimeout(() => {
          navigate('/login', {replace: true});
        }, 2000);
      }, 

      onError: (error: any) => {
        const errMsg = error.response?.data?.message || "Failed to reset password, please try again later."
        toast.error(errMsg);
      }
    })

  }
  
  const form = useForm<ResetFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    },
  });
  return (
    <div className="w-full mx-auto h-screen flex justify-center items-center">
      <Card className="mx-auto w-[360px] md:w-sm lg:w-[420px] bg-surface text-main-font border-2 border-main-border animate-fade animate-once animate-duration-[500ms]">
        <CardHeader className="text-center mb-3">
          <CardTitle className="text-2xl md:text-3xl font-bold">Create a New Password</CardTitle>
          <CardDescription className=" text-xs md:text-sm text-secondary-font text-pretty">Set a strong new password and continue where you left off.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>New Password</FormLabel>
                    </div>
                    <FormControl>
                      {/* spreading the feild which contains the actual data */}
                      <Input className="border-main-border h-11" type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              >
              </FormField>

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Confirm Password</FormLabel>
                    </div>
                    <FormControl>
                      {/* spreading the feild which contains the actual data */}
                      <Input className="border-main-border h-11" type="password" placeholder="Confirm Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              >
              </FormField>
                <Button type="submit" className={`w-full h-11 font-bold bg-theme-tertiary text-black hover:bg-theme-tertiary/85 ${isPending && "bg-disabled text-main-font"}`} disabled={isPending}>
                {isPending ? <Loader/> : "Reset Password"}
              </Button>
            </form>
          </Form>

          {/* <CardFooter className="mt-4">
            <div className="flex items-center justify-center text-xs md:text-sm w-full">
              <div className="text-muted-foreground">Don't have an account? {" "}
                <Link to="/signup" className="text-theme-primary hover:underline">Sign up</Link>
              </div>
            </div>
          </CardFooter> */}
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword
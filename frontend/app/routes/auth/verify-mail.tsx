import { useSearchParams } from "react-router"
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react"
import Loader from "@/components/common/Loader";
import { useVerifyEmailMutation } from "@/hooks/useAuthenticate";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/verify-mail";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sync | Email Verification" },
    { name: "description", content: "Verify Your Accout" },
  ];
}

function VerificationMail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const token = searchParams.get("token");
  

  const {mutate: mutateVerify, isPending: isVerifying } = useVerifyEmailMutation();

  useEffect(() => {
    if(!token) {
      setIsSuccess(false);
    }else{
      mutateVerify({token}, {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            navigate("/login")
          }, 10000); // Redirect after 10 seconds
        }, 
        onError: (error: any) => {
          setIsSuccess(false);
          toast.error(error.response?.data?.message || "Verification failed" , {
            description: "Click the verification link in your email to try again."
          })
          console.log("Verification failed:", error.response?.data?.message);
        }
      })
    }

  }, [searchParams]);


  return (
    <div className="w-full mx-auto h-screen flex justify-center items-center">
      <Card className={`mx-auto w-[360px] md:w-sm lg:w-[420px] bg-surface text-main-font border-2 border-main-border animate-fade animate-once animate-duration-[500ms] `}>
        <CardHeader className="text-center mb-4">
          <CardTitle className={`text-2xl md:text-3xl font-bold ${ isVerifying ? "animate-none" : "animate-flip-up animate-once animate-duration-1000"} ${(!isVerifying && !isSuccess) && "text-destructive"}`}>{ isVerifying ? "Verifying Your Email…" : isSuccess ? "🎉 You're all set!" : "Verification failed."}</CardTitle>

          <CardDescription className=" text-xs md:text-sm text-secondary-font text-pretty" hidden={!isVerifying}>Hang tight! We're verifying your email.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={() => navigate('/login')} type="submit" className={`w-full h-11 font-bold bg-theme-tertiary text-black hover:bg-theme-tertiary/85 cursor-pointer ${(isVerifying || !isSuccess) && 'bg-disabled text-main-font'}`} disabled={isVerifying || !isSuccess}>

              {isVerifying ? (
                <Loader/>
              ) : isSuccess ? (
                <>
                  Go to Login <ArrowRight className="size-4" />
                </>
              ) : (
                "Retry Verification"
              )}
            </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerificationMail
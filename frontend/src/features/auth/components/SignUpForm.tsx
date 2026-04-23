import { cn } from "@/libs/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { useAuthFormLogic } from "../hooks/useAuthFormLogic"
import { useNavigate } from "react-router"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const { signUp } = useAuthFormLogic();
  const { register, handleSubmit } = signUp.form;
  const navigate = useNavigate();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(signUp.submit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your information below to create your account
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Field>
                  <FieldLabel htmlFor="userName">Full Name</FieldLabel>
                  <Input id="userName" type="text" placeholder="John Doe" required {...register("userName")} />
                  {signUp.errors.userName && <p className="text-destructive text-xs mt-1">{signUp.errors.userName.message}</p>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="userEmail">Email</FieldLabel>
                  <Input id="userEmail" type="email" placeholder="name@example.com" required {...register("userEmail")} />
                  {signUp.errors.userEmail && <p className="text-destructive text-xs mt-1">{signUp.errors.userEmail.message}</p>}
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="userPhone">Phone</FieldLabel>
                    <Input id="userPhone" type="tel" placeholder="+84 ..." required {...register("userPhone")} />
                    {signUp.errors.userPhone && <p className="text-destructive text-xs mt-1">{signUp.errors.userPhone.message}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="userAddress">Address</FieldLabel>
                    <Input id="userAddress" type="text" placeholder="City, Country" required {...register("userAddress")} />
                    {signUp.errors.userAddress && <p className="text-destructive text-xs mt-1">{signUp.errors.userAddress.message}</p>}
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" required {...register("password")} />
                    {signUp.errors.password && <p className="text-destructive text-xs mt-1">{signUp.errors.password.message}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm</FieldLabel>
                    <Input id="confirmPassword" type="password" required {...register("confirmPassword")} />
                    {signUp.errors.confirmPassword && <p className="text-destructive text-xs mt-1">{signUp.errors.confirmPassword.message}</p>}
                  </Field>
                </div>
              </div>

              <Field className="mt-2">
                <Button type="submit" disabled={signUp.isSubmitting} className="w-full">
                  {signUp.isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-xs">
                Or continue with
              </FieldSeparator>

              <div className="flex justify-center">
                <Button variant="outline" type="button" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Google
                </Button>
              </div>

              <FieldDescription className="text-center mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate('/signin')}
                  className="underline underline-offset-4 hover:text-primary transition-colors font-medium"
                >
                  Sign In
                </button>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000&auto=format&fit=crop"
              alt="Signup Background"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a>{" "}
        and <a href="#" className="underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

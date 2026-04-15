import { useNavigate } from 'react-router';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

const signUpSchema = z.object({
    userName: z.string().min(2, "Name must be at least 2 characters long"),
    userEmail: z.email("Invalid email address"),
    userPhone: z.string().min(10, "Phone number must be at least 10 digits long"),
    userAddress: z.string().min(5, "Address must be at least 5 characters long"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export function useAuthFormLogic() {
    const { signIn, signUp } = useAuthStore();
    const navigate = useNavigate();

    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const signUpForm = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const onLoginSubmit = async (data: LoginFormData) => {
        try {
            await signIn(data.email, data.password);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const onSignUpSubmit = async (data: SignUpFormData) => {
        try {
            await signUp(data.userName, data.userEmail, data.userPhone, data.userAddress, data.password);
            navigate("/signin");
        } catch (error) {
            console.error("Sign up failed:", error);
        }
    };

    return {
        login: {
            form: loginForm,
            submit: onLoginSubmit,
            isSubmitting: loginForm.formState.isSubmitting,
            errors: loginForm.formState.errors
        },
        signUp: {
            form: signUpForm,
            submit: onSignUpSubmit,
            isSubmitting: signUpForm.formState.isSubmitting,
            errors: signUpForm.formState.errors
        }
    };
}

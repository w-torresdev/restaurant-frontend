import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Mail, Lock, Sparkles } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      await login(data);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Decorative Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/20 dark:bg-primary-600/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/10 blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-2xl rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 mb-6">
              <Sparkles className="text-white h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Bem-vindo de volta</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-center text-sm">
              Insira suas credenciais para acessar a plataforma corporativa
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="E-mail"
              icon={Mail}
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label="Senha"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-colors" />
                <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Lembrar-me</span>
              </label>
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            <Button type="submit" className="w-full mt-2 py-3 text-base" isLoading={isSubmitting}>
              Entrar na plataforma
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

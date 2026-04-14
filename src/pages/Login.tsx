import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { login } from "../services/authService";
import { getStoredToken } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accountType = ((location.state as { accountType?: "individual" | "dealer" } | null)?.accountType ?? "individual");
  const isDealerLogin = accountType === "dealer";

  const redirectTarget = useMemo(() => {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
    return from ?? "/";
  }, [location.state]);

  useEffect(() => {
    if (getStoredToken()) {
      navigate(redirectTarget, { replace: true });
    }
  }, [navigate, redirectTarget]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      navigate(redirectTarget, { replace: true });
    } catch (err: unknown) {
      const fallbackMessage = "Unable to sign in. Check your email, password, or backend endpoint.";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
      ) {
        setError((err as { response?: { data?: { message?: string } } }).response!.data!.message!);
      } else if (err instanceof Error) {
        setError(err.message || fallbackMessage);
      } else {
        setError(fallbackMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.15),_transparent_35%),linear-gradient(135deg,_#111827_0%,_#1f2937_40%,_#f8fafc_40%,_#f8fafc_100%)]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-center text-white">
            <span className="mb-4 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur">
              {isDealerLogin ? "Secure dealer access" : "Secure rider access"}
            </span>
            <h1 className="max-w-xl text-4xl font-black tracking-tight sm:text-5xl">
              {isDealerLogin
                ? "Sign in to manage dealer inventory, listings, and buyer activity."
                : "Sign in to manage listings, saved bikes, and rider activity."}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-gray-300">
              This page sends your credentials to the .NET backend, stores the returned token in the browser, and lets the rest of the app use it automatically.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-200">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                JWT saved to local storage
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                Default endpoint: /api/auth/login
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl shadow-gray-900/20 backdrop-blur sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isDealerLogin ? "Dealer Login" : "Individual Login"}
                </h2>
                <p className="text-sm text-gray-500">Use your backend account credentials.</p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="h-11 border-gray-200 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-11 border-gray-200 bg-white"
                  required
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full bg-red-600 text-white hover:bg-red-700"
              >
                {isSubmitting ? "Signing in..." : `Sign in as ${isDealerLogin ? "Dealer" : "Individual"}`}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            <p className="mt-6 text-sm text-gray-500">
              After login, the token is saved in the browser and automatically attached to API requests.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex text-sm font-medium text-red-600 transition-colors hover:text-red-700"
            >
              Back to marketplace
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

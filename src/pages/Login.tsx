import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { getIndividualSsoLoginUrl, login } from "../services/authService";
import { getStoredToken, storeToken } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSsoSubmitting, setIsSsoSubmitting] = useState(false);

  
  const accountType =
    searchParams.get("accountType") === "dealer"
      ? "dealer"
      : ((location.state as { accountType?: "individual" | "dealer" } | null)?.accountType ?? "individual");
  const isDealerLogin = accountType === "dealer";

  const redirectTarget = useMemo(() => {
    const returnTo = searchParams.get("returnTo");
    if (returnTo && returnTo.startsWith("/")) {
      return returnTo;
    }

    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
    return from ?? "/";
  }, [location.state, searchParams]);

  const individualSsoReturnUrl = useMemo(() => {
    const callbackUrl = new URL(`${window.location.origin}/login`);

    callbackUrl.searchParams.set("accountType", "individual");
    callbackUrl.searchParams.set("returnTo", redirectTarget);

    return callbackUrl.toString();
  }, [redirectTarget]);

  useEffect(() => {
    if (getStoredToken()) {
      navigate(redirectTarget, { replace: true });
    }
  }, [navigate, redirectTarget]);

  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
    const token =
      searchParams.get("token") ??
      searchParams.get("access_token") ??
      hashParams.get("token") ??
      hashParams.get("access_token");
    const authError =
      searchParams.get("error_description") ??
      searchParams.get("error") ??
      hashParams.get("error_description") ??
      hashParams.get("error");

    if (!token) {
      if (authError) {
        setError(authError);
        setIsSsoSubmitting(false);
      }
      return;
    }

    storeToken(token);
    navigate(redirectTarget, { replace: true });
  }, [location.hash, navigate, redirectTarget, searchParams]);

  const handleIndividualSso = () => {
    setError("");
    setIsSsoSubmitting(true);
    window.location.assign(getIndividualSsoLoginUrl(individualSsoReturnUrl));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({
        userNameOrEmail: email.trim(),
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
    <div className="min-h-[calc(100vh-6rem)] bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.15),_transparent_35%),linear-gradient(135deg,_#3b548a_0%,_#1f2937_40%,_#1e2f46_40%,_#9bbbdb_100%)]">
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
                <p className="text-sm text-gray-500">
                  {isDealerLogin ? "Use your backend account credentials." : "Use SSO or your backend account credentials."}
                </p>
              </div>
            </div>

            {!isDealerLogin && (
              <>
                <Button
                  type="button"
                  disabled={isSubmitting || isSsoSubmitting}
                  onClick={handleIndividualSso}
                  className="h-11 w-full border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                >
                  {isSsoSubmitting ? "Redirecting to SSO..." : "Continue with your SSO"}
                  {!isSsoSubmitting && <ArrowRight className="h-4 w-4" />}
                </Button>

                <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span>Or use email and password</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
              </>
            )}

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
                disabled={isSubmitting || isSsoSubmitting}
                className="h-11 w-full bg-red-600 text-white hover:bg-red-700"
              >
                {isSubmitting ? "Signing in..." : `Sign in as ${isDealerLogin ? "Dealer" : "Individual"}`}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

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

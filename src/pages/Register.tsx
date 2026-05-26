import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, Building2, UserRound } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { registerDealer, registerIndividual } from "../services/registerService";
import { getStoredToken } from "../utils/auth";

type AccountType = "individual" | "dealer";

export default function Register() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shared fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Dealer-only fields
  const [dealershipName, setDealershipName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [website, setWebsite] = useState("");

  const isDealer = accountType === "dealer";

  useEffect(() => {
    if (getStoredToken()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isDealer) {
        await registerDealer({
          firstName,
          lastName,
          email: email.trim(),
          password,
          dealershipName,
          phone,
          street,
          city,
          state,
          zip,
          website,
        });
      } else {
        await registerIndividual({
          firstName,
          lastName,
          email: email.trim(),
          password,
        });
      }

      navigate("/login", {
        state: { registered: true, accountType },
      });
    } catch (err: unknown) {
      const fallback = "Registration failed. Please try again.";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
      ) {
        setError((err as { response?: { data?: { message?: string } } }).response!.data!.message!);
      } else if (err instanceof Error) {
        setError(err.message || fallback);
      } else {
        setError(fallback);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.15),_transparent_35%),linear-gradient(135deg,_#3b548a_0%,_#1f2937_40%,_#1e2f46_40%,_#9bbbdb_100%)]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left panel */}
          <section className="flex flex-col justify-center text-white">
            <span className="mb-4 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur">
              {isDealer ? "Dealer registration" : "Rider registration"}
            </span>
            <h1 className="max-w-xl text-4xl font-black tracking-tight sm:text-5xl">
              {isDealer
                ? "Register your dealership and start listing motorcycles today."
                : "Create your account and explore thousands of motorcycles."}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-gray-300">
              {isDealer
                ? "Dealer accounts give you access to inventory management, buyer inquiries, and featured listing placement."
                : "Individual accounts let you save favorites, contact sellers, and list your own bikes for sale."}
            </p>
          </section>

          {/* Right panel */}
          <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl shadow-gray-900/20 backdrop-blur sm:p-8">
            {/* Account type toggle */}
            <div className="mb-6 flex rounded-xl border border-gray-200 bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => { setAccountType("individual"); setError(""); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                  !isDealer
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <UserRound className="h-4 w-4" />
                Individual
              </button>
              <button
                type="button"
                onClick={() => { setAccountType("dealer"); setError(""); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                  isDealer
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Building2 className="h-4 w-4" />
                Dealer
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700" htmlFor="firstName">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="h-10 border-gray-200 bg-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700" htmlFor="lastName">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="h-10 border-gray-200 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-10 border-gray-200 bg-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="h-10 border-gray-200 bg-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="h-10 border-gray-200 bg-white"
                  required
                />
              </div>

              {/* Dealer-only fields */}
              {isDealer && (
                <>
                  <div className="my-2 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span>Dealership Details</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700" htmlFor="dealershipName">
                      Dealership Name
                    </label>
                    <Input
                      id="dealershipName"
                      type="text"
                      value={dealershipName}
                      onChange={(e) => setDealershipName(e.target.value)}
                      placeholder="Moto World Inc."
                      className="h-10 border-gray-200 bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700" htmlFor="phone">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="h-10 border-gray-200 bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700" htmlFor="street">
                      Street Address
                    </label>
                    <Input
                      id="street"
                      type="text"
                      autoComplete="street-address"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="123 Main St"
                      className="h-10 border-gray-200 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700" htmlFor="city">
                        City
                      </label>
                      <Input
                        id="city"
                        type="text"
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Nashville"
                        className="h-10 border-gray-200 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700" htmlFor="state">
                        State
                      </label>
                      <Input
                        id="state"
                        type="text"
                        autoComplete="address-level1"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="TN"
                        maxLength={2}
                        className="h-10 border-gray-200 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700" htmlFor="zip">
                        ZIP
                      </label>
                      <Input
                        id="zip"
                        type="text"
                        autoComplete="postal-code"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="37201"
                        className="h-10 border-gray-200 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700" htmlFor="website">
                      Website <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <Input
                      id="website"
                      type="text"
                      autoComplete="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="www.yourdealer.com"
                      className="h-10 border-gray-200 bg-white"
                    />
                  </div>
                </>
              )}

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
                {isSubmitting
                  ? "Creating account..."
                  : `Create ${isDealer ? "Dealer" : "Individual"} Account`}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            <p className="mt-5 text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to={`/login?accountType=${accountType}`}
                className="font-medium text-red-600 hover:text-red-700"
              >
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

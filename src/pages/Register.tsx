import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, Building2, CheckCircle2, UserRound } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { registerDealer, registerIndividual } from "../services/registerService";
import { getStoredToken } from "../utils/auth";

type AccountType = "individual" | "dealer";

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  // dealer-only
  dealershipName?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,19}$/;
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/;

interface DealerFields {
  dealershipName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  website: string;
}

function validateFields(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  isDealer: boolean,
  dealer: DealerFields
): FieldErrors {
  const errors: FieldErrors = {};

  if (!firstName.trim()) {
    errors.firstName = "First name is required.";
  } else if (firstName.trim().length > 50) {
    errors.firstName = "First name must be between 1 and 50 characters.";
  }

  if (!lastName.trim()) {
    errors.lastName = "Last name is required.";
  } else if (lastName.trim().length > 50) {
    errors.lastName = "Last name must be between 1 and 50 characters.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Email is not valid.";
  } else if (email.trim().length > 256) {
    errors.email = "Email must not exceed 256 characters.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.password =
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&).";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (isDealer) {
    if (!dealer.dealershipName.trim()) {
      errors.dealershipName = "Dealership name is required.";
    } else if (dealer.dealershipName.trim().length > 100) {
      errors.dealershipName = "Dealership name must be between 1 and 100 characters.";
    }

    if (!dealer.phone.trim()) {
      errors.phone = "Phone is required.";
    } else if (!PHONE_REGEX.test(dealer.phone.trim())) {
      errors.phone = "Phone number is not valid.";
    } else if (dealer.phone.trim().length > 20) {
      errors.phone = "Phone must not exceed 20 characters.";
    }

    if (!dealer.street.trim()) {
      errors.street = "Street address is required.";
    } else if (dealer.street.trim().length > 100) {
      errors.street = "Street must be between 1 and 100 characters.";
    }

    if (!dealer.city.trim()) {
      errors.city = "City is required.";
    } else if (dealer.city.trim().length > 50) {
      errors.city = "City must be between 1 and 50 characters.";
    }

    if (!dealer.state.trim()) {
      errors.state = "State is required.";
    } else if (dealer.state.trim().length < 2 || dealer.state.trim().length > 5) {
      errors.state = "State must be between 2 and 5 characters.";
    }

    if (!dealer.zip.trim()) {
      errors.zip = "ZIP code is required.";
    } else if (dealer.zip.trim().length < 3 || dealer.zip.trim().length > 10) {
      errors.zip = "ZIP code must be between 3 and 10 characters.";
    }

    if (dealer.website.trim() && !URL_REGEX.test(dealer.website.trim())) {
      errors.website = "Website must be a valid URL (e.g. https://www.example.com).";
    } else if (dealer.website.trim().length > 256) {
      errors.website = "Website must not exceed 256 characters.";
    }
  }

  return errors;
}

export default function Register() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dealerRegistered, setDealerRegistered] = useState(false);
  const [individualRegistered, setIndividualRegistered] = useState(false);

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
    setSubmitError("");

    const errors = validateFields(firstName, lastName, email, password, confirmPassword, isDealer, {
      dealershipName, phone, street, city, state, zip, website,
    });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);
    try {
      if (isDealer) {
        await registerDealer({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
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
        setDealerRegistered(true);
        return;
      } else {
        await registerIndividual({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
        });
        setIndividualRegistered(true);
        return;
      }
    } catch (err: unknown) {
      const fallback = "Registration failed. Please try again.";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
      ) {
        setSubmitError((err as { response?: { data?: { message?: string } } }).response!.data!.message!);
      } else if (err instanceof Error) {
        setSubmitError(err.message || fallback);
      } else {
        setSubmitError(fallback);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (dealerRegistered || individualRegistered) {
    const isDealer = dealerRegistered;
    const displayName = isDealer ? dealershipName : `${firstName} ${lastName}`.trim();
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.15),_transparent_35%),linear-gradient(135deg,_#3b548a_0%,_#1f2937_40%,_#1e2f46_40%,_#9bbbdb_100%)] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl text-center backdrop-blur">

          {/* Animated check */}
          <div className="flex justify-center mb-6">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-40" style={{ animationDuration: "2s" }} />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-1">
            Welcome, <span className="font-semibold">{displayName}</span>!
          </p>
          <p className="text-gray-500 text-sm mb-2">
            {isDealer
              ? "Your dealer account is ready. Sign in to start managing your inventory and listings."
              : "Your account is ready. Sign in to browse, save favorites, and list your own bikes."}
          </p>

          {/* What's next */}
          <div className="my-6 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left space-y-2.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">What's next</p>
            {(isDealer ? [
              "Sign in to your dealer account",
              "Add your first motorcycle listing",
              "Manage inquiries from buyers",
            ] : [
              "Sign in to your new account",
              "Browse thousands of motorcycles",
              "List your own bike for sale",
            ]).map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-600">{step}</p>
              </div>
            ))}
          </div>

          <Link
            to={`/login?accountType=${isDealer ? "dealer" : "individual"}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Sign in to your account
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/" className="mt-4 inline-block text-sm font-medium text-red-600 hover:text-red-700">
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

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
                onClick={() => { setAccountType("individual"); setSubmitError(""); setFieldErrors({}); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                  !isDealer ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <UserRound className="h-4 w-4" />
                Individual
              </button>
              <button
                type="button"
                onClick={() => { setAccountType("dealer"); setSubmitError(""); setFieldErrors({}); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                  isDealer ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-700"
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
                  <label className="text-sm font-medium text-gray-700" htmlFor="firstName">First Name</label>
                  <Input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    maxLength={50}
                    className={`h-10 bg-white ${fieldErrors.firstName ? "border-red-400" : "border-gray-200"}`}
                  />
                  {fieldErrors.firstName && (
                    <p className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700" htmlFor="lastName">Last Name</label>
                  <Input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    maxLength={50}
                    className={`h-10 bg-white ${fieldErrors.lastName ? "border-red-400" : "border-gray-200"}`}
                  />
                  {fieldErrors.lastName && (
                    <p className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  maxLength={256}
                  className={`h-10 bg-white ${fieldErrors.email ? "border-red-400" : "border-gray-200"}`}
                />
                {fieldErrors.email && (
                  <p className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className={`h-10 bg-white ${fieldErrors.password ? "border-red-400" : "border-gray-200"}`}
                />
                {fieldErrors.password ? (
                  <p className="flex items-start gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />{fieldErrors.password}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    Min 8 chars · uppercase · lowercase · digit · special (@$!%*?&)
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={`h-10 bg-white ${fieldErrors.confirmPassword ? "border-red-400" : "border-gray-200"}`}
                />
                {fieldErrors.confirmPassword && (
                  <p className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.confirmPassword}
                  </p>
                )}
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
                    <label className="text-sm font-medium text-gray-700" htmlFor="dealershipName">Dealership Name</label>
                    <Input
                      id="dealershipName"
                      type="text"
                      value={dealershipName}
                      onChange={(e) => setDealershipName(e.target.value)}
                      placeholder="Moto World Inc."
                      maxLength={100}
                      className={`h-10 bg-white ${fieldErrors.dealershipName ? "border-red-400" : "border-gray-200"}`}
                    />
                    {fieldErrors.dealershipName && (
                      <p className="flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.dealershipName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700" htmlFor="phone">Phone</label>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      maxLength={20}
                      className={`h-10 bg-white ${fieldErrors.phone ? "border-red-400" : "border-gray-200"}`}
                    />
                    {fieldErrors.phone && (
                      <p className="flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700" htmlFor="street">Street Address</label>
                    <Input
                      id="street"
                      type="text"
                      autoComplete="street-address"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="123 Main St"
                      maxLength={100}
                      className={`h-10 bg-white ${fieldErrors.street ? "border-red-400" : "border-gray-200"}`}
                    />
                    {fieldErrors.street && (
                      <p className="flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.street}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700" htmlFor="city">City</label>
                      <Input
                        id="city"
                        type="text"
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Nashville"
                        maxLength={50}
                        className={`h-10 bg-white ${fieldErrors.city ? "border-red-400" : "border-gray-200"}`}
                      />
                      {fieldErrors.city && (
                        <p className="flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.city}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700" htmlFor="state">State</label>
                      <Input
                        id="state"
                        type="text"
                        autoComplete="address-level1"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="TN"
                        maxLength={5}
                        className={`h-10 bg-white ${fieldErrors.state ? "border-red-400" : "border-gray-200"}`}
                      />
                      {fieldErrors.state && (
                        <p className="flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.state}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700" htmlFor="zip">ZIP</label>
                      <Input
                        id="zip"
                        type="text"
                        autoComplete="postal-code"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="37201"
                        maxLength={10}
                        className={`h-10 bg-white ${fieldErrors.zip ? "border-red-400" : "border-gray-200"}`}
                      />
                      {fieldErrors.zip && (
                        <p className="flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.zip}
                        </p>
                      )}
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
                      placeholder="https://www.yourdealer.com"
                      maxLength={256}
                      className={`h-10 bg-white ${fieldErrors.website ? "border-red-400" : "border-gray-200"}`}
                    />
                    {fieldErrors.website ? (
                      <p className="flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.website}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Include https:// — e.g. https://www.yourdealer.com</p>
                    )}
                  </div>
                </>
              )}

              {submitError && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full bg-red-600 text-white hover:bg-red-700"
              >
                {isSubmitting ? "Creating account..." : `Create ${isDealer ? "Dealer" : "Individual"} Account`}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            <p className="mt-5 text-sm text-gray-500">
              Already have an account?{" "}
              <Link to={`/login?accountType=${accountType}`} className="font-medium text-red-600 hover:text-red-700">
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

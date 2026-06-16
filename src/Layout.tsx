import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Heart, PlusCircle, Home, Grid3X3, Phone, User, LogOut, Menu, X, UserPlus, UserRound, Building2, Bike } from "lucide-react";
import { Button } from "./Components/ui/button";
import { Outlet } from "react-router-dom";
import { clearStoredToken, clearStoredUser, getStoredToken, getUserFromToken, getStoredUser, isTrialActive, trialDaysLeft } from "./utils/auth";
//import { User as UserEntity } from "./Entities/User";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./Components/ui/dropdown-menu";


interface UserType {
  full_name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

type LoginAccountType = "individual" | "dealer";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
;

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    const cached = getStoredUser();
    setUser(cached ?? getUserFromToken(token));
    setIsLoading(false);
  }, [location.pathname, location.search]);

  const storedUser = getStoredUser();
  const onTrial = isTrialActive(storedUser);
  const daysLeft = trialDaysLeft(storedUser);

  const handleLogin = (accountType: LoginAccountType) => {
    const searchParams = new URLSearchParams({
      accountType,
      returnTo: `${location.pathname}${location.search}${location.hash}`,
    });

    navigate(`/login?${searchParams.toString()}`, { state: { accountType } });
  };

  const handleLogout = () => {
    clearStoredToken();
    clearStoredUser();
    setUser(null);
    navigate("/");
  };

const isActive = (pageName: string): boolean => {
  if (pageName === "Home") {
    return location.pathname === "/" || location.pathname.toLowerCase() === "/home";
  }
  return location.pathname.toLowerCase() === `/${pageName.toLowerCase()}`;
};


  return (
    <div className="min-h-screen bg-white">
      {/* Top Header Bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            <div className="flex items-center space-x-6">
              <span>🏍️ Find Your Perfect Ride</span>
              <span className="hidden md:inline">📞 1-800-MOTO-TRADE</span>
            </div>
            <div className="flex items-center space-x-4">
              {!isLoading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 flex items-center">
                          {((user as any).avatarUrl) ? (
                            <img src={(user as any).avatarUrl} alt="avatar" className="w-6 h-6 rounded-full mr-2 object-cover" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 mr-2 flex items-center justify-center text-xs font-semibold">
                              {(() => {
                                const name = (user as any).full_name || ((user as any).firstName ? `${(user as any).firstName} ${(user as any).lastName || ''}`.trim() : (user as any).email || 'U');
                                return name ? name.split(' ').map((n: string) => n[0]).slice(0,2).join('').toUpperCase() : 'U';
                              })()}
                            </div>
                          )}
                          <span className="mr-1">{(user as any).full_name || `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim() || (user as any).email}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onTrial && (
                          <div className="px-3 py-2 text-xs font-medium text-amber-700 bg-amber-50 rounded-t-md border-b border-amber-100">
                            Trial: {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left` : "expires today"}
                          </div>
                        )}
                        <DropdownMenuItem>
                          <User className="w-4 h-4 mr-2" />
                          My Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/my-listings" className="flex items-center w-full">
                            <Bike className="w-4 h-4 mr-2" />
                            My Garage
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Heart className="w-4 h-4 mr-2" />
                          Saved Motorcycles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleLogin("individual")} className="text-white hover:bg-gray-800">
                        <UserRound className="w-4 h-4 mr-2" />
                        Login as Individual
                      </Button>
                      <span className="text-gray-400">|</span>
                      <Button variant="ghost" size="sm" onClick={() => handleLogin("dealer")} className="text-white hover:bg-gray-800">
                        <Building2 className="w-4 h-4 mr-2" />
                        Login as Dealer
                      </Button>
                      <span className="text-gray-400">|</span>
                      <Link to="/register" className="flex items-center text-sm text-white hover:bg-gray-800 px-3 py-1.5 rounded-md transition-colors">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Register
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">MotoTrade</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive("Home") 
                    ? "bg-red-50 text-red-600" 
                    : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>             
              <Link 
                to={createPageUrl("Browse")}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive("Browse") 
                    ? "bg-red-50 text-red-600" 
                    : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Buy Motorcycles</span>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-red-600 hover:bg-gray-50">
                    Sell Your Motorcycle
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Sell")} className="flex items-center w-full">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      List Your Bike
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="flex items-center w-full">
                      📊 Get Trade-In Value
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="flex items-center w-full">
                      📋 Selling Tips
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/subscribe"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors font-medium ${
                  isActive("subscribe")
                    ? "bg-red-50 text-red-600"
                    : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                Subscription
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-red-600 hover:bg-gray-50">
                    Services
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <span className="flex items-center w-full">
                      💰 Financing
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="flex items-center w-full">
                      🛡️ Insurance
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="flex items-center w-full">
                      🔧 Inspections
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="flex items-center w-full">
                      🚚 Shipping
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-red-600">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-red-600">
                <Phone className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <Link 
                to={createPageUrl("Home")}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  isActive("Home") ? "bg-red-50 text-red-600" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5 mr-3" />
                Home
              </Link>
              
              <Link 
                to={createPageUrl("Browse")}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  isActive("Browse") ? "bg-red-50 text-red-600" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Grid3X3 className="w-5 h-5 mr-3" />
                Buy Motorcycles
              </Link>
              
              <Link 
                to={createPageUrl("Sell")}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  isActive("Sell") ? "bg-red-50 text-red-600" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle className="w-5 h-5 mr-3" />
                Sell Your Motorcycle
              </Link>

              <Link
                to="/register"
                className={`flex items-center px-3 py-2 rounded-lg ${
                  isActive("register") ? "bg-red-50 text-red-600" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserPlus className="w-5 h-5 mr-3" />
                Register
              </Link>

              <Link
                to="/subscribe"
                className={`flex items-center px-3 py-2 rounded-lg ${
                  isActive("subscribe") ? "bg-red-50 text-red-600" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Subscription
              </Link>

              <div className="border-t border-gray-200 my-2"></div>

              <div className="px-3 py-2 text-gray-600">
                <div className="text-sm font-medium mb-2">Services</div>
                <div className="space-y-1 text-sm">
                  <div className="py-1">💰 Financing</div>
                  <div className="py-1">🛡️ Insurance</div>
                  <div className="py-1">🔧 Inspections</div>
                  <div className="py-1">🚚 Shipping</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
           <Outlet /> 
      </main>

     
    </div>
  );
}

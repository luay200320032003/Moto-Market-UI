import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Heart, PlusCircle, Home, Grid3X3, Phone, User, LogIn, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User as UserEntity } from "@/entities/User";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await UserEntity.me();
      setUser(currentUser);
    } catch (error) {
      // User not logged in
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    UserEntity.login();
  };

  const handleLogout = async () => {
    await UserEntity.logout();
    setUser(null);
  };

  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
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
                        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                          <User className="w-4 h-4 mr-2" />
                          {user.full_name || user.email}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <User className="w-4 h-4 mr-2" />
                          My Profile
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
                      <Button variant="ghost" size="sm" onClick={handleLogin} className="text-white hover:bg-gray-800">
                        <LogIn className="w-4 h-4 mr-2" />
                        Login as Individual
                      </Button>
                      <span className="text-gray-400">|</span>
                      <Button variant="ghost" size="sm" onClick={handleLogin} className="text-white hover:bg-gray-800">
                        <LogIn className="w-4 h-4 mr-2" />
                        Login as Dealer
                      </Button>
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
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">MotoTrade</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to={createPageUrl("Home")}
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
              <Link to={createPageUrl("Sell")}>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Sell Now
                </Button>
              </Link>
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
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="text-xl font-bold">MotoTrade</span>
              </div>
              <p className="text-gray-400 max-w-md mb-4">
                The premier destination for buying and selling motorcycles. 
                Find your perfect ride or sell your bike to passionate riders.
              </p>
              <div className="flex space-x-4">
                <span className="text-gray-400">Follow us:</span>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer transition-colors">
                    <span className="text-sm">f</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer transition-colors">
                    <span className="text-sm">t</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer transition-colors">
                    <span className="text-sm">i</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Buy & Sell</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to={createPageUrl("Browse")} className="hover:text-white transition-colors">Browse Motorcycles</Link></li>
                <li><Link to={createPageUrl("Sell")} className="hover:text-white transition-colors">Sell Your Bike</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Trade-In Value</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dealer Program</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support & Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Financing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Insurance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Inspections</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2024 MotoTrade. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
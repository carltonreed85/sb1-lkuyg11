import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Search, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { Link, useNavigate } from 'react-router-dom';
import { usePatients } from '../../contexts/PatientContext';
import { useReferrals } from '../../contexts/ReferralContext';

interface HeaderProps {
  onMenuClick: () => void;
}

interface SearchResult {
  id: string;
  type: 'patient' | 'referral';
  title: string;
  subtitle: string;
  link: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { organizationSettings } = useSettings();
  const { patients } = usePatients();
  const { referrals } = useReferrals();
  const navigate = useNavigate();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality
  const searchResults: SearchResult[] = React.useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search patients
    patients.forEach(patient => {
      if (
        patient.fullName.toLowerCase().includes(query) ||
        patient.contactInfo.phone.includes(query)
      ) {
        results.push({
          id: patient.id,
          type: 'patient',
          title: patient.fullName,
          subtitle: `DOB: ${new Date(patient.dateOfBirth).toLocaleDateString()}`,
          link: `/patients?id=${patient.id}`
        });
      }
    });

    // Search referrals
    referrals.forEach(referral => {
      if (
        referral.patient.name.toLowerCase().includes(query) ||
        referral.details.provider.toLowerCase().includes(query) ||
        referral.details.medicalService.toLowerCase().includes(query) ||
        referral.caseId.toLowerCase().includes(query)
      ) {
        results.push({
          id: referral.id,
          type: 'referral',
          title: `${referral.caseId} - ${referral.patient.name}`,
          subtitle: `${referral.details.medicalService} | ${referral.details.provider}`,
          link: `/referrals?id=${referral.id}`
        });
      }
    });

    return results.slice(0, 8); // Limit to 8 results
  }, [searchQuery, patients, referrals]);

  const handleSearchSelect = (result: SearchResult) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(result.link);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between gap-4">
          {/* Logo and Menu */}
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary">
                {organizationSettings.name || 'RMD'}
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg" ref={searchRef}>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                placeholder="Search patients or referrals..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {showResults && searchQuery && (
                <div className="absolute mt-2 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                  {searchResults.length > 0 ? (
                    <div className="py-1">
                      {searchResults.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                          onClick={() => handleSearchSelect(result)}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                result.type === 'patient' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                              }`}>
                                {result.type === 'patient' ? 
                                  <User className="h-4 w-4" /> : 
                                  <Search className="h-4 w-4" />
                                }
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{result.title}</p>
                              <p className="text-sm text-gray-500">{result.subtitle}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* User section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Bell className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-medium text-primary">
                      {user?.name ? getInitials(user.name) : <User className="h-5 w-5" />}
                    </span>
                  )}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 text-sm text-gray-900">
                    {user?.name}
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-500">
                    {user?.email}
                  </div>
                  <div className="border-t border-gray-100" />
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
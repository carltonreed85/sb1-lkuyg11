import React, { useState } from 'react';
import { Key, Shield, Save } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export default function SecuritySettings() {
  const { settings, updateSecuritySettings } = useSettings();
  const [securitySettings, setSecuritySettings] = useState({
    requireMfa: settings?.security?.requireMfa || false,
    passwordExpiration: settings?.security?.passwordExpiration || 90,
    sessionTimeout: settings?.security?.sessionTimeout || 30,
    minimumPasswordLength: settings?.security?.minimumPasswordLength || 8,
    requireSpecialCharacters: settings?.security?.requireSpecialCharacters || true,
    requireNumbers: settings?.security?.requireNumbers || true,
    requireUppercase: settings?.security?.requireUppercase || true,
    maxLoginAttempts: settings?.security?.maxLoginAttempts || 5,
  });

  const handleSave = () => {
    updateSecuritySettings(securitySettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        {/* Authentication Settings */}
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Authentication
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={securitySettings.requireMfa}
                  onChange={(e) => setSecuritySettings({
                    ...securitySettings,
                    requireMfa: e.target.checked
                  })}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label className="font-medium text-gray-700">
                  Require Two-Factor Authentication
                </label>
                <p className="text-sm text-gray-500">
                  Enforce two-factor authentication for all users
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password Expiration (days)
              </label>
              <input
                type="number"
                value={securitySettings.passwordExpiration}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings,
                  passwordExpiration: parseInt(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings,
                  sessionTimeout: parseInt(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Password Requirements
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Password Length
              </label>
              <input
                type="number"
                value={securitySettings.minimumPasswordLength}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings,
                  minimumPasswordLength: parseInt(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={securitySettings.requireSpecialCharacters}
                  onChange={(e) => setSecuritySettings({
                    ...securitySettings,
                    requireSpecialCharacters: e.target.checked
                  })}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label className="font-medium text-gray-700">
                  Require Special Characters
                </label>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={securitySettings.requireNumbers}
                  onChange={(e) => setSecuritySettings({
                    ...securitySettings,
                    requireNumbers: e.target.checked
                  })}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label className="font-medium text-gray-700">
                  Require Numbers
                </label>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={securitySettings.requireUppercase}
                  onChange={(e) => setSecuritySettings({
                    ...securitySettings,
                    requireUppercase: e.target.checked
                  })}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label className="font-medium text-gray-700">
                  Require Uppercase Letters
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Login Attempts */}
        <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Login Security
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Login Attempts Before Lockout
            </label>
            <input
              type="number"
              value={securitySettings.maxLoginAttempts}
              onChange={(e) => setSecuritySettings({
                ...securitySettings,
                maxLoginAttempts: parseInt(e.target.value)
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
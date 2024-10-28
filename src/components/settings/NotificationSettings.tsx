import React, { useState } from 'react';
import { Bell, Save } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export default function NotificationSettings() {
  const { notificationSettings, updateNotificationSettings } = useSettings();
  const [settings, setSettings] = useState(notificationSettings);

  const handleChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = () => {
    updateNotificationSettings(settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-6 w-6 text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications"
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleChange('emailNotifications')}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                  Email Notifications
                </label>
                <p className="text-gray-500">Receive updates and alerts via email</p>
              </div>
            </div>

            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="smsNotifications"
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={() => handleChange('smsNotifications')}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="smsNotifications" className="font-medium text-gray-700">
                  SMS Notifications
                </label>
                <p className="text-gray-500">Receive updates and alerts via text message</p>
              </div>
            </div>

            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="referralUpdates"
                  type="checkbox"
                  checked={settings.referralUpdates}
                  onChange={() => handleChange('referralUpdates')}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="referralUpdates" className="font-medium text-gray-700">
                  Referral Updates
                </label>
                <p className="text-gray-500">Get notified about referral status changes</p>
              </div>
            </div>

            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="taskReminders"
                  type="checkbox"
                  checked={settings.taskReminders}
                  onChange={() => handleChange('taskReminders')}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="taskReminders" className="font-medium text-gray-700">
                  Task Reminders
                </label>
                <p className="text-gray-500">Receive reminders for upcoming tasks and deadlines</p>
              </div>
            </div>

            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="systemAlerts"
                  type="checkbox"
                  checked={settings.systemAlerts}
                  onChange={() => handleChange('systemAlerts')}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="systemAlerts" className="font-medium text-gray-700">
                  System Alerts
                </label>
                <p className="text-gray-500">Get important system notifications and updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
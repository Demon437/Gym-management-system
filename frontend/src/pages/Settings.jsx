// import React, { useState } from 'react';
// import { Save, Building, Users, Shield } from 'lucide-react';
// import { useData } from '../contexts/DataContext';
// import { useNotification } from '../contexts/NotificationContext';

// const Settings = () => {
//   const { data, loading } = useData();
//   const { showSuccess } = useNotification();
//   const [activeTab, setActiveTab] = useState('profile');
//   const [gymProfile, setGymProfile] = useState(data.settings?.gymProfile || {});

//   const handleSave = () => {
//     showSuccess('Settings saved successfully!');
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: 'profile', label: 'Gym Profile', icon: Building },
//     { id: 'roles', label: 'Roles & Permissions', icon: Shield },
//   ];

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="page-header">
//         <h1 className="page-title">Settings</h1>
//         <p className="page-subtitle">Manage your gym configuration and preferences</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Sidebar Tabs */}
//         <div className="lg:col-span-1">
//           <div className="card p-2 space-y-1">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
//                   activeTab === tab.id
//                     ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
//                     : 'text-gray-700 dark:text-dark-700 hover:bg-gray-100 dark:hover:bg-dark-50'
//                 }`}
//               >
//                 <tab.icon className="w-5 h-5" />
//                 <span className="font-medium">{tab.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="lg:col-span-3">
//           {activeTab === 'profile' && (
//             <div className="card p-6">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
//                 Gym Profile Information
//               </h2>
//               <form className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
//                       Gym Name
//                     </label>
//                     <input
//                       type="text"
//                       value={gymProfile.name}
//                       onChange={(e) => setGymProfile({ ...gymProfile, name: e.target.value })}
//                       className="input-field"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       value={gymProfile.email}
//                       onChange={(e) => setGymProfile({ ...gymProfile, email: e.target.value })}
//                       className="input-field"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
//                       Phone
//                     </label>
//                     <input
//                       type="tel"
//                       value={gymProfile.phone}
//                       onChange={(e) => setGymProfile({ ...gymProfile, phone: e.target.value })}
//                       className="input-field"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
//                       Website
//                     </label>
//                     <input
//                       type="url"
//                       value={gymProfile.website}
//                       onChange={(e) => setGymProfile({ ...gymProfile, website: e.target.value })}
//                       className="input-field"
//                     />
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
//                       Address
//                     </label>
//                     <textarea
//                       value={gymProfile.address}
//                       onChange={(e) => setGymProfile({ ...gymProfile, address: e.target.value })}
//                       className="input-field"
//                       rows="3"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                     Opening Hours
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {Object.entries(gymProfile.openingHours || {}).map(([day, hours]) => (
//                       <div key={day} className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-700 dark:text-dark-700 capitalize w-24">
//                           {day}:
//                         </span>
//                         <input
//                           type="text"
//                           value={hours}
//                           className="input-field flex-1"
//                           readOnly
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex justify-end">
//                   <button type="button" onClick={handleSave} className="btn-primary flex items-center gap-2">
//                     {/* <Save className="w-4 h-4" /> */}
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {activeTab === 'roles' && (
//             <div className="card p-6">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
//                 User Roles & Permissions
//               </h2>
//               <div className="space-y-4">
//                 {data.settings?.roles?.map((role) => (
//                   <div
//                     key={role.id}
//                     className="p-4 border border-gray-200 dark:border-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-50 transition-colors"
//                   >
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
//                           <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-gray-900 dark:text-white">{role.name}</h3>
//                           <p className="text-sm text-gray-500 dark:text-dark-500">
//                             {role.permissions.length} permissions
//                           </p>
//                         </div>
//                       </div>
//                       <button className="btn-primary text-sm">Edit Role</button>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       {role.permissions.map((permission, index) => (
//                         <span
//                           key={index}
//                           className="px-3 py-1 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-dark-700 rounded-full text-xs font-medium"
//                         >
//                           {permission}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

import React, { useState } from 'react';
import { Save, Building, Users, Shield } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';

const Settings = () => {
  const { data, loading } = useData();
  const { showSuccess } = useNotification();
  const [activeTab, setActiveTab] = useState('profile');
  const [gymProfile, setGymProfile] = useState(data.settings?.gymProfile || {});

  const handleSave = () => {
    showSuccess('Settings saved successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Gym Profile', icon: Building },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your gym configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="card p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-dark-700 hover:bg-gray-100 dark:hover:bg-dark-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Gym Profile Information
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                      Gym Name
                    </label>
                    <input
                      type="text"
                      value={gymProfile.name}
                      onChange={(e) => setGymProfile({ ...gymProfile, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={gymProfile.email}
                      onChange={(e) => setGymProfile({ ...gymProfile, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={gymProfile.phone}
                      onChange={(e) => setGymProfile({ ...gymProfile, phone: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={gymProfile.website}
                      onChange={(e) => setGymProfile({ ...gymProfile, website: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={gymProfile.address}
                      onChange={(e) => setGymProfile({ ...gymProfile, address: e.target.value })}
                      className="input-field"
                      rows="3"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Opening Hours
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(gymProfile.openingHours || {}).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-dark-700 capitalize w-24">
                          {day}:
                        </span>
                        <input
                          type="text"
                          value={hours}
                          className="input-field flex-1"
                          readOnly
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={handleSave} className="btn-primary flex items-center gap-2">
                    {/* <Save className="w-4 h-4" /> */}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                User Roles & Permissions
              </h2>
              <div className="space-y-4">
                {data.settings?.roles?.map((role) => (
                  <div
                    key={role.id}
                    className="p-4 border border-gray-200 dark:border-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                          {/* <p className="text-sm text-gray-500 dark:text-dark-500">
                            {role.permissions.length} permissions
                          </p> */}
                        </div>
                      </div>
                      <button className="btn-primary text-sm">Edit Role</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-dark-700 rounded-full text-xs font-medium"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;


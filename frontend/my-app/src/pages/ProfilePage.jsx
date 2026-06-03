import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || 'Ahmad Sulaiman',
    email: user?.email || 'ahmad.sulaiman@msme-group.id',
    phone: '+62 812 3456 7890',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Profil berhasil diperbarui!')
  }

  return (
    <DashboardLayout title="" subtitle="">
      {/* Profile Header */}
      <div className="bg-surface-container-lowest h-48 relative flex items-end pb-6 px-10 rounded-xl overflow-hidden mb-8 -mt-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-container/30 to-secondary/10"></div>
        <div className="relative z-10 flex items-center gap-6 w-full">
          <div className="relative">
            <div className="w-32 h-32 rounded-xl bg-primary-container border-4 border-surface shadow-lg flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-6xl">person</span>
            </div>
            <button className="absolute bottom-2 right-2 bg-primary text-on-primary p-2 rounded-lg shadow-md hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            </button>
          </div>
          <div className="flex-grow">
            <h2 className="text-headline-lg font-hanken text-primary">{form.name}</h2>
            <p className="text-on-surface-variant text-body-md">{form.email}</p>
            <div className="mt-2 flex gap-2">
              <span className="bg-secondary-fixed text-on-secondary-fixed text-label-sm px-3 py-1 rounded-full">Pro Account</span>
              <span className="bg-surface-container-high text-on-surface-variant text-label-sm px-3 py-1 rounded-full">ID Verified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Navigation */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl card-shadow border border-outline-variant/30">
            <h3 className="text-headline-md font-hanken text-primary mb-3">Account Settings</h3>
            <nav className="space-y-1">
              {[
                { icon: 'person', label: 'Personal Information', active: true },
                { icon: 'security', label: 'Security & Privacy' },
                { icon: 'notifications', label: 'Notifications' },
                { icon: 'payments', label: 'Billing & Credit' },
              ].map((item) => (
                <a key={item.label} href="#" className={`flex items-center justify-between p-3 rounded-lg transition-all ${item.active ? 'bg-secondary/10 text-secondary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Credit Tier */}
          <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-label-sm uppercase tracking-widest opacity-70 mb-2">Current Credit Tier</p>
              <h4 className="text-headline-md font-hanken mb-4">Elite Business</h4>
              <div className="w-full bg-on-primary/20 h-2 rounded-full mb-2">
                <div className="bg-secondary-container w-[85%] h-full rounded-full"></div>
              </div>
              <p className="text-label-sm">850/1000 Trust Score</p>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] opacity-10 pointer-events-none">verified</span>
          </div>
        </div>

        {/* Right: Form */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-surface-container-lowest p-6 rounded-xl card-shadow border border-outline-variant/30">
            <div className="mb-6 border-b border-outline-variant/30 pb-4">
              <h3 className="text-headline-md font-hanken text-primary">Edit Profile</h3>
              <p className="text-on-surface-variant text-body-md mt-1">Manage your account identity and login credentials.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-label-md text-on-surface-variant ml-1">Full Name</label>
                  <input className="w-full h-12 px-4 bg-surface-container-low border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md" name="name" type="text" value={form.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-label-md text-on-surface-variant ml-1">Email Address</label>
                  <input className="w-full h-12 px-4 bg-surface-container-low border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md" name="email" type="email" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-label-md text-on-surface-variant ml-1">Phone Number</label>
                <input className="w-full h-12 px-4 bg-surface-container-low border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md" name="phone" type="tel" value={form.phone} onChange={handleChange} />
              </div>
              {/* Password Section */}
              <div className="pt-6 border-t border-outline-variant/30 space-y-6">
                <h4 className="text-[18px] font-hanken text-primary">Security Update</h4>
                <div className="space-y-2">
                  <label className="text-label-md text-on-surface-variant ml-1">Current Password</label>
                  <input className="w-full h-12 px-4 bg-surface-container-low border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md" name="currentPassword" placeholder="••••••••" type="password" value={form.currentPassword} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-label-md text-on-surface-variant ml-1">New Password</label>
                    <input className="w-full h-12 px-4 bg-surface-container-low border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md" name="newPassword" placeholder="Enter new password" type="password" value={form.newPassword} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-md text-on-surface-variant ml-1">Confirm New Password</label>
                    <input className="w-full h-12 px-4 bg-surface-container-low border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md" name="confirmPassword" placeholder="Confirm new password" type="password" value={form.confirmPassword} onChange={handleChange} />
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <button type="button" className="text-error text-label-md flex items-center gap-2 hover:underline">
                  <span className="material-symbols-outlined">delete_forever</span> Deactivate Account
                </button>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button type="reset" className="px-6 py-3 text-on-surface-variant text-label-md hover:bg-surface-container-low rounded-lg transition-all w-1/2 md:w-auto">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-primary text-on-primary text-label-md rounded-lg shadow-lg hover:opacity-90 active:scale-95 transition-all w-1/2 md:w-auto">Simpan Perubahan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

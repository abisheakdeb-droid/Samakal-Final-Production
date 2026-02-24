"use client";

import { useState } from 'react';
import { UserPlus, X, Search, User } from 'lucide-react';

interface Contributor {
  id?: string;
  name: string;
  role: string;
  custom?: boolean;
}

interface ContributorSelectorProps {
  contributors: Contributor[];
  onChange: (contributors: Contributor[]) => void;
}

const ROLES = [
  'নিজস্ব প্রতিবেদক',
  'জ্যেষ্ঠ প্রতিবেদক',
  'বিশেষ প্রতিনিধি',
  'জেলা প্রতিনিধি',
  'উপজেলা প্রতিনিধি',
  'স্টাফ রিপোর্টার',
  'অনলাইন ডেস্ক',
  'Photographer',
  'Guest Writer'
];

export default function ContributorSelector({ contributors, onChange }: ContributorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);

  const handleAddContributor = (name: string) => {
    // Prevent duplicates
    if (contributors.some(c => c.name === name)) {
      return;
    }

    onChange([
      ...contributors,
      {
        name,
        role: selectedRole,
        custom: true // Treating all as custom for now until we connect user DB
      }
    ]);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemove = (index: number) => {
    onChange(contributors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        প্রতিবেদক ও কন্ট্রিবিউটর
      </h3>

      {/* Selected Contributors List */}
      <div className="flex flex-wrap gap-2">
        {contributors.map((contributor, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-100"
          >
            <User size={14} />
            <span className="font-medium">{contributor.name}</span>
            <span className="text-xs opacity-75">({contributor.role})</span>
            <button
              onClick={() => handleRemove(index)}
              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {contributors.length === 0 && (
          <p className="text-sm text-gray-400 italic">কোন প্রতিবেদক যুক্ত করা হয়নি</p>
        )}
      </div>

      {/* Add New Contributor */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
        >
          <UserPlus size={16} />
          <span>প্রতিবেদক যুক্ত করুন</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-3">
            <div className="space-y-3">
              {/* Role Selection */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">পদবী</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded p-2 outline-none focus:border-blue-500"
                >
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Name Input */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">নাম</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="নাম লিখুন..."
                    className="flex-1 text-sm border border-gray-200 rounded p-2 outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => searchTerm && handleAddContributor(searchTerm)}
                    disabled={!searchTerm}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    যুক্ত
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

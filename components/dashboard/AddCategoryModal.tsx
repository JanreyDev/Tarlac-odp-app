// components/dashboard/AddCategoryModal.tsx
import React, { useState } from 'react';
import { X, Search, Check, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Popular Lucide icons for categories
const POPULAR_ICONS = [
  'Database', 'Folder', 'FileText', 'Tag', 'Grid3x3', 'Box',
  'Package', 'Archive', 'Briefcase', 'BookOpen', 'GraduationCap',
  'Heart', 'Building2', 'Wheat', 'TreePine', 'TrendingUp',
  'Landmark', 'Shield', 'Bus', 'HeartHandshake', 'Wifi',
  'Zap', 'Droplets', 'Banknote', 'Home', 'Eye',
  'Cloud', 'MapPin', 'Users', 'Globe', 'Layers',
  'Target', 'Award', 'Star', 'Flag', 'Calendar',
  'Clock', 'Settings', 'Tool', 'Wrench', 'Hammer',
  'Lightbulb', 'Rocket', 'Leaf', 'Sun', 'Moon'
];

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Database');
  const [iconSearch, setIconSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  if (!isOpen) return null;

  const filteredIcons = POPULAR_ICONS.filter(icon =>
    icon.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const token = window.localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          icon: selectedIcon,
          description: description.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create category');
      }

      // Reset form and close
      setName('');
      setDescription('');
      setSelectedIcon('Database');
      setIconSearch('');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className="h-5 w-5" />;
  };

  const SelectedIconComponent = (LucideIcons as any)[selectedIcon];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-green-50 border-b border-green-200 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 rounded-lg p-2.5 text-white">
              {SelectedIconComponent && <SelectedIconComponent className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Add New Category
              </h3>
              <p className="text-sm text-gray-600 mt-0.5">
                Create a new category for organizing datasets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <div className="flex-shrink-0 text-red-600 mt-0.5">
                  <X className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Category Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g., Education, Health, Infrastructure"
                required
                maxLength={255}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Choose a clear, descriptive name for the category
              </p>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Icon <span className="text-red-500">*</span>
              </label>
              
              {/* Selected Icon Display */}
              <div
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-all flex items-center gap-3"
              >
                <div className="bg-green-100 text-green-700 rounded-md p-2">
                  {SelectedIconComponent && <SelectedIconComponent className="h-5 w-5" />}
                </div>
                <span className="text-gray-700 font-medium">{selectedIcon}</span>
                <div className="ml-auto text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
              </div>

              {/* Icon Picker Dropdown */}
              {showIconPicker && (
                <div className="mt-2 border border-gray-300 rounded-lg bg-white shadow-lg">
                  {/* Search */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                        placeholder="Search icons..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Icon Grid */}
                  <div className="p-3 max-h-64 overflow-y-auto">
                    <div className="grid grid-cols-8 gap-2">
                      {filteredIcons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => {
                            setSelectedIcon(icon);
                            setShowIconPicker(false);
                            setIconSearch('');
                          }}
                          className={`relative p-3 rounded-lg border-2 transition-all hover:bg-green-50 hover:border-green-300 ${
                            selectedIcon === icon
                              ? 'bg-green-100 border-green-500'
                              : 'border-gray-200'
                          }`}
                          title={icon}
                        >
                          <div className="flex items-center justify-center">
                            {renderIcon(icon)}
                          </div>
                          {selectedIcon === icon && (
                            <div className="absolute -top-1 -right-1 bg-green-600 rounded-full p-0.5">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {filteredIcons.length === 0 && (
                      <p className="text-center text-sm text-gray-500 py-8">
                        No icons found matching "{iconSearch}"
                      </p>
                    )}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-1.5">
                Select an icon to visually represent this category
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                Description <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Brief description of what this category includes..."
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-gray-500">
                  Help users understand what datasets belong in this category
                </p>
                <p className="text-xs text-gray-400">
                  {description.length}/500
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !selectedIcon}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Create Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
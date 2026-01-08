// components/dashboard/TagInput.tsx
import React, { useState, KeyboardEvent } from 'react';
import { X, Plus, Tag } from 'lucide-react';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  tagColor?: 'green' | 'blue' | 'purple';
  icon?: React.ReactNode;
  description?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  onChange,
  placeholder = 'Type and press Enter to add',
  suggestions = [],
  tagColor = 'green',
  icon,
  description
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const colorClasses = {
    green: {
      tag: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
      badge: 'bg-green-600 text-white',
      focus: 'ring-green-500 border-green-500'
    },
    blue: {
      tag: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
      badge: 'bg-blue-600 text-white',
      focus: 'ring-blue-500 border-blue-500'
    },
    purple: {
      tag: 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200',
      badge: 'bg-purple-600 text-white',
      focus: 'ring-purple-500 border-purple-500'
    },
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      !tags.includes(suggestion) &&
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
  };

  return (
    <div className="space-y-3">
      {/* Label and Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <label className="block text-sm font-semibold text-gray-900">
            {label}
          </label>
          {tags.length > 0 && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses[tagColor].badge}`}>
              {tags.length}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-600">{description}</p>
      )}

      {/* Input Container */}
      <div className={`border-2 rounded-lg transition-all ${
        isFocused 
          ? `${colorClasses[tagColor].focus} border-2` 
          : 'border-gray-200 hover:border-gray-300'
      }`}>
        {/* Tags Display */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 border-b border-gray-200 bg-gray-50">
            {tags.map((tag, index) => (
              <div
                key={index}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${colorClasses[tagColor].tag}`}
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 rounded"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Field */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Plus className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsFocused(true);
                setShowSuggestions(inputValue.length > 0);
              }}
              onBlur={() => {
                setIsFocused(false);
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder={placeholder}
              className="flex-1 outline-none text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              <div className="py-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  Suggestions
                </div>
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono shadow-sm">
          Enter
        </kbd>
        <span>to add</span>
        <span className="text-gray-300">•</span>
        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono shadow-sm">
          Backspace
        </kbd>
        <span>to remove last</span>
        <span className="text-gray-300">•</span>
        <span>Click × to remove individual items</span>
      </div>
    </div>
  );
};
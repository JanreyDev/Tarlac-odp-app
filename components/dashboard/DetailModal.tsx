// components/dashboard/DetailModal.tsx
import React, { useEffect, useState } from 'react';
import { fetchCategories, fetchTags } from '@/lib/api';
import type { Category } from '@/lib/api';
import { downloadFile, downloadMultipleFiles } from '@/lib/downloadUtils';

import { ConfirmationDialog } from './ConfirmationDialog';
import { FolderOpen, Tag, AlertCircle, Check, ChevronDown, Download, Package, Loader2 } from 'lucide-react';
import { TagInput } from './TagInput';


interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  file_path?: string; // Add this for the actual file path
}

interface Submission {
  id: string;
  title: string;
  status: 'approved' | 'disapproved' | 'pending';
  submittedBy: string;
  submittedDate: string;
  message: string;
  categories: string[];
  tags: string[];
  organization: string;
  requestType: string;
  uploadedFiles: UploadedFile[];
}

interface DetailModalProps {
  submission: Submission;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Submission>) => void;
}

const availableRequestTypes = [
  'Submit Dataset',
  'Request Dataset',
  'Report Issue',
  'General Feedback',
];

export const DetailModal: React.FC<DetailModalProps> = ({
  submission,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [editedSubmission, setEditedSubmission] = useState(submission);
  const [originalSubmission, setOriginalSubmission] = useState(submission);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState<'approve' | 'reject' | 'pending' | 'save'>('save');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  // Fetch categories and tags on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const [categories, tags] = await Promise.all([
          fetchCategories(),
          fetchTags(),
        ]);
        
        setAllCategories(categories);
        setTagSuggestions(tags.map(t => t.name));
      } catch (error) {
        console.error('Error loading categories/tags:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  // Update edited submission when prop changes
  useEffect(() => {
    setEditedSubmission(submission);
    setOriginalSubmission(submission);
    setHasUnsavedChanges(false);
  }, [submission]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = 
      editedSubmission.status !== originalSubmission.status ||
      JSON.stringify(editedSubmission.categories) !== JSON.stringify(originalSubmission.categories) ||
      JSON.stringify(editedSubmission.tags) !== JSON.stringify(originalSubmission.tags) ||
      editedSubmission.title !== originalSubmission.title ||
      editedSubmission.message !== originalSubmission.message ||
      editedSubmission.organization !== originalSubmission.organization;
    
    setHasUnsavedChanges(hasChanges);
  }, [editedSubmission, originalSubmission]);

  if (!isOpen) return null;

  const handleDownloadFile = async (file: UploadedFile) => {
    setDownloadingFileId(file.id);
    try {
      // Use file_path if available, otherwise construct from name
      const filePath = file.file_path || `uploads/${file.name}`;
      await downloadFile(filePath, file.name);
    } catch (error) {
      console.error('Failed to download file:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    try {
      const filesForDownload = editedSubmission.uploadedFiles.map(f => ({
        file_path: f.file_path || `uploads/${f.name}`,
        original_name: f.name
      }));
      
      const zipName = `${editedSubmission.title.replace(/[^a-z0-9]/gi, '_')}_files.zip`;
      await downloadMultipleFiles(filesForDownload, zipName);
    } catch (error) {
      console.error('Failed to download all files:', error);
      alert('Failed to download files. Please try again.');
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const getConfirmationConfig = () => {
    const statusChanged = editedSubmission.status !== originalSubmission.status;
    
    if (statusChanged) {
      switch (editedSubmission.status) {
        case 'approved':
          return {
            title: 'Approve Submission',
            message: 'Are you sure you want to approve this submission? This will make the dataset publicly available on the portal.',
            confirmText: 'Approve Submission',
            type: 'success' as const
          };
        case 'disapproved':
          return {
            title: 'Reject Submission',
            message: 'Are you sure you want to reject this submission? The contributor will be notified of this decision.',
            confirmText: 'Reject Submission',
            type: 'danger' as const
          };
        case 'pending':
          return {
            title: 'Mark as Pending',
            message: 'Are you sure you want to mark this submission as pending? This will move it back to the review queue.',
            confirmText: 'Mark as Pending',
            type: 'warning' as const
          };
      }
    }
    
    return {
      title: 'Save Changes',
      message: 'Are you sure you want to save these changes? This will update the submission details including categories and tags.',
      confirmText: 'Save Changes',
      type: 'warning' as const
    };
  };

  const handleSaveClick = () => {
    if (!hasUnsavedChanges) {
      onClose();
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmSave = () => {
    onUpdate(submission.id, editedSubmission);
    onClose();
  };

  const handleCategoryToggle = (categoryName: string) => {
    const isSelected = editedSubmission.categories.includes(categoryName);
    if (isSelected) {
      setEditedSubmission({
        ...editedSubmission,
        categories: editedSubmission.categories.filter(c => c !== categoryName)
      });
    } else {
      setEditedSubmission({
        ...editedSubmission,
        categories: [...editedSubmission.categories, categoryName]
      });
    }
  };

  const handleRemoveCategory = (categoryName: string) => {
    setEditedSubmission({
      ...editedSubmission,
      categories: editedSubmission.categories.filter(c => c !== categoryName)
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('excel') || type.includes('csv') || type.includes('xlsx') || type.includes('xls')) return '📊';
    if (type.includes('word') || type.includes('docx')) return '📝';
    if (type.includes('zip')) return '🗜️';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = allCategories.find(c => c.name === categoryName);
    return category?.icon || 'Database';
  };

  const confirmConfig = getConfirmationConfig();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-green-700 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Review Submission</h2>
                <p className="text-sm text-green-100 mt-1">
                  Review and manage submission details, categories, and tags
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-green-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Unsaved Changes Warning */}
          {hasUnsavedChanges && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">You have unsaved changes</span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Dataset Title
                </label>
                <input
                  type="text"
                  value={editedSubmission.title}
                  onChange={(e) =>
                    setEditedSubmission({ ...editedSubmission, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              {/* Organization and Request Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={editedSubmission.organization}
                    onChange={(e) =>
                      setEditedSubmission({ ...editedSubmission, organization: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Request Type
                  </label>
                  <select
                    value={editedSubmission.requestType}
                    onChange={(e) =>
                      setEditedSubmission({ ...editedSubmission, requestType: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    {availableRequestTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submitted By and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Submitted By
                  </label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {editedSubmission.submittedBy}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Submission Date
                  </label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {new Date(editedSubmission.submittedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Submission Status
                </label>
                <select
                  value={editedSubmission.status}
                  onChange={(e) =>
                    setEditedSubmission({
                      ...editedSubmission,
                      status: e.target.value as Submission['status'],
                    })
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-medium"
                >
                  <option value="pending">⏳ Pending Review</option>
                  <option value="approved">✅ Approved</option>
                  <option value="disapproved">❌ Rejected</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Changing the status will notify the contributor
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  value={editedSubmission.message}
                  onChange={(e) =>
                    setEditedSubmission({ ...editedSubmission, message: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all"
                />
              </div>

              {/* Uploaded Files */}
              {editedSubmission.uploadedFiles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-900">
                      Attached Files ({editedSubmission.uploadedFiles.length})
                    </label>
                    {editedSubmission.uploadedFiles.length > 1 && (
                      <button
                        onClick={handleDownloadAll}
                        disabled={isDownloadingAll}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDownloadingAll ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Package className="h-4 w-4" />
                            Download All
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                    {editedSubmission.uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getFileIcon(file.type)}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {file.size} • {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(file)}
                          disabled={downloadingFileId === file.id}
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {downloadingFileId === file.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              Download
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Classification & Metadata
                </h3>
              </div>

              {/* Categories Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-gray-500" />
                    Categories
                  </div>
                </label>
                
                {editedSubmission.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {editedSubmission.categories.map((categoryName) => {
                      const category = allCategories.find(c => c.name === categoryName);
                      return (
                        <span
                          key={categoryName}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                        >
                          {categoryName}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(categoryName)}
                            className="ml-1 hover:text-green-900"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all flex items-center justify-between bg-white hover:bg-gray-50"
                  >
                    <span className="text-gray-700">
                      {editedSubmission.categories.length === 0
                        ? 'Select categories...'
                        : `${editedSubmission.categories.length} selected`}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showCategoryDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {isLoadingOptions ? (
                        <div className="px-4 py-3 text-sm text-gray-500">Loading categories...</div>
                      ) : allCategories.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No categories available. Add categories from the dashboard.
                        </div>
                      ) : (
                        <div className="py-1">
                          {allCategories.map((category) => {
                            const isSelected = editedSubmission.categories.includes(category.name);
                            return (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() => handleCategoryToggle(category.name)}
                                className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                                  isSelected ? 'bg-green-50' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
                                    isSelected
                                      ? 'bg-green-600 border-green-600'
                                      : 'border-gray-300'
                                  }`}>
                                    {isSelected && <Check className="h-3 w-3 text-white" />}
                                  </div>
                                  <div className="text-left">
                                    <div className="text-sm font-medium text-gray-900">
                                      {category.name}
                                    </div>
                                    {category.description && (
                                      <div className="text-xs text-gray-500 line-clamp-1">
                                        {category.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-1.5">
                  Organize the dataset into relevant categories for easier discovery
                </p>
              </div>

              {/* Tags Input */}
              {isLoadingOptions ? (
                <div className="text-sm text-gray-500">Loading tags...</div>
              ) : (
                <TagInput
                  label="Tags"
                  tags={editedSubmission.tags}
                  onChange={(tags) =>
                    setEditedSubmission({ ...editedSubmission, tags })
                  }
                  placeholder="Type tag name and press Enter (e.g., urgent, public-data)"
                  suggestions={tagSuggestions}
                  tagColor="blue"
                  icon={<Tag className="h-4 w-4 text-gray-500" />}
                  description="Add keywords to help users find this dataset through search"
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Submission ID:</span> #{submission.id}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                disabled={!hasUnsavedChanges}
                className={`px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all ${
                  hasUnsavedChanges
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSave}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText="Cancel"
        type={confirmConfig.type}
      />
    </>
  );
};
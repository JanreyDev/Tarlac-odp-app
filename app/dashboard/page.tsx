// app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { DetailModal } from '@/components/dashboard/DetailModal';
import { AddCategoryModal } from '@/components/dashboard/AddCategoryModal';
import { Header } from '@/components/layout/header';
import { Loader2, ShieldAlert, AlertCircle, CheckCircle2, X, Plus, FolderPlus } from 'lucide-react';
import { fetchContributes, updateContribution } from '@/lib/api';

type LaravelContribution = {
  id: number
  title: string
  organization: string
  request_type: string
  message: string
  file_path: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    email: string
  }
  categories?: Array<{ id: number; name: string }>
  tags?: Array<{ id: number; name: string }>
  // Add the files array type
  files?: Array<{
    id: number
    original_name: string
    file_type: string
    file_size: number
    formatted_size: string
    file_path: string
  }>
}

type Submission = {
  id: string
  title: string
  status: 'approved' | 'disapproved' | 'pending'
  submittedBy: string
  submittedDate: string
  message: string
  categories: string[]
  tags: string[]
  organization: string
  requestType: string
  uploadedFiles: Array<{
    id: string
    name: string
    size: string
    type: string
    uploadedAt: string
  }>
}

const ITEMS_PER_PAGE = 5;

const SuccessNotification = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
    <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-md">
      <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">Success</p>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const router = useRouter();

  const convertToSubmission = (contrib: LaravelContribution): Submission => {
    // FIXED: Map the files array from backend
    let uploadedFiles: Array<{
      id: string
      name: string
      size: string
      type: string
      uploadedAt: string
    }> = [];

    // Check if files array exists and has items
    if (contrib.files && contrib.files.length > 0) {
      uploadedFiles = contrib.files.map(file => ({
        id: file.id.toString(),
        name: file.original_name,
        size: file.formatted_size,
        type: file.file_type,
        uploadedAt: contrib.created_at,
        file_path: file.file_path
      }));
    } 
    // Fallback to old file_path for backward compatibility
    else if (contrib.file_path) {
      uploadedFiles = [{
        id: contrib.id.toString(),
        name: contrib.file_path.split('/').pop() || 'file',
        size: 'Unknown',
        type: 'application/octet-stream',
        uploadedAt: contrib.created_at
      }];
    }

    return {
      id: contrib.id.toString(),
      title: contrib.title,
      status: contrib.status === 'rejected' ? 'disapproved' : contrib.status,
      submittedBy: contrib.user.name,
      submittedDate: contrib.created_at,
      message: contrib.message,
      categories: contrib.categories?.map(c => c.name) || [],
      tags: contrib.tags?.map(t => t.name) || [],
      organization: contrib.organization,
      requestType: contrib.request_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      uploadedFiles: uploadedFiles
    };
  };

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (typeof window === 'undefined') return;

      const token = window.localStorage.getItem('authToken');
      const userDataStr = window.localStorage.getItem('userData');

      if (!token || !userDataStr) {
        router.push('/login');
        return;
      }

      try {
        const userData = JSON.parse(userDataStr) as { role?: string };
        
        if (userData.role !== 'admin') {
          router.push('/contribute');
          return;
        }

        setIsAuthorized(true);

        const response = await fetchContributes(token) as LaravelContribution[];
        const converted = response.map(convertToSubmission);
        setSubmissions(converted);
        setFilteredSubmissions(converted);
        setError(null);
      } catch (error) {
        console.error('Error fetching contributions:', error);
        setError('Unable to load submissions. Please refresh the page or contact support.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredSubmissions(submissions);
    } else {
      const filtered = submissions.filter(s => s.status === statusFilter || (statusFilter === 'rejected' && s.status === 'disapproved'));
      setFilteredSubmissions(filtered);
    }
    setCurrentPage(1);
  }, [statusFilter, submissions]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  const handleRowClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleUpdate = async (id: string, updates: Partial<Submission>) => {
    const token = window.localStorage.getItem('authToken');
    if (!token) return;

    try {
      let apiStatus = updates.status;
      if (updates.status === 'disapproved') {
        apiStatus = 'rejected';
      }

      const payload: any = {};
      
      if (apiStatus) {
        payload.status = apiStatus;
      }
      
      if (updates.categories && updates.categories.length >= 0) {
        payload.categories = updates.categories;
      }
      
      if (updates.tags && updates.tags.length >= 0) {
        payload.tags = updates.tags;
      }

      await updateContribution(id, payload, token);

      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
      );

      // Generate professional success message
      const hasStatusChange = updates.status && updates.status !== selectedSubmission?.status;
      const hasCategoriesChange = updates.categories !== undefined;
      const hasTagsChange = updates.tags !== undefined;

      let message = '';
      if (hasStatusChange) {
        switch (updates.status) {
          case 'approved':
            message = 'Submission has been approved and is now publicly available.';
            break;
          case 'disapproved':
            message = 'Submission has been rejected. The contributor will be notified.';
            break;
          case 'pending':
            message = 'Submission status has been changed to pending review.';
            break;
        }
      } else if (hasCategoriesChange && hasTagsChange) {
        message = 'Categories and tags have been successfully updated.';
      } else if (hasCategoriesChange) {
        message = 'Categories have been successfully updated.';
      } else if (hasTagsChange) {
        message = 'Tags have been successfully updated.';
      } else {
        message = 'Submission details have been successfully updated.';
      }

      setSuccessMessage(message);
      
    } catch (error) {
      console.error('Error updating submission:', error);
      setError('Failed to update submission. Please try again or contact support.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategorySuccess = () => {
    setSuccessMessage('Category created successfully! It will now appear in the categories list.');
  };

  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'disapproved').length,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-sm text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 text-center">
          <ShieldAlert className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-sm text-gray-600">Administrator privileges are required to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {successMessage && (
        <SuccessNotification
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <div className="bg-green-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white mb-3">
            <ShieldAlert className="h-4 w-4" />
            Admin Dashboard
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Review Submissions</h1>
          <p className="text-lg text-green-50">
            Manage dataset submissions and maintain data quality standards
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === 'approved'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({statusCounts.approved})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === 'rejected'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({statusCounts.rejected})
            </button>
          </div>

          {/* Add Category Button */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all shadow-sm"
          >
            <FolderPlus className="h-4 w-4" />
            Add Category
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredSubmissions.length)} of{' '}
            {filteredSubmissions.length} submissions
          </p>
        </div>

        {currentSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter === 'all' 
                ? 'No submissions have been received yet.' 
                : `No ${statusFilter} submissions at this time.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentSubmissions.map((submission) => (
              <div
                key={submission.id}
                onClick={() => handleRowClick(submission)}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer space-x-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors">
                        {submission.title} →
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {submission.message}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        {submission.submittedBy}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 rounded text-gray-600">
                        {submission.organization}
                      </span>
                      <span className="text-gray-500">
                        {submission.requestType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {submission.categories.length > 0 ? (
                        submission.categories.map((category, idx) => (
                          <span
                            key={`cat-${idx}`}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                          >
                            {category}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200 border-dashed">
                          No categories
                        </span>
                      )}

                      {submission.tags.length > 0 ? (
                        submission.tags.map((tag, idx) => (
                          <span
                            key={`tag-${idx}`}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200 border-dashed">
                          No tags
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 ml-4">
                    <StatusBadge status={submission.status} />
                    <div className="text-xs text-gray-500">
                      📅 {new Date(submission.submittedDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 bg-green-50 border-green-500 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {selectedSubmission && (
        <DetailModal
          submission={selectedSubmission}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={handleCategorySuccess}
      />
    </div>
  );
}
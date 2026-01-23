// lib/downloadUtils.ts

/**
 * Download a single file from the server
 */
export async function downloadFile(filePath: string, fileName: string) {
  try {
    // Use the API route for downloads
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
    
    // Clean up file path - remove 'uploads/' prefix if present
    const cleanPath = filePath.replace(/^uploads\//, '').replace(/^\/+/, '');
    
    // Use the API download endpoint
    const fileUrl = `${apiBaseUrl}/download/${cleanPath}`;
    
    console.log('Downloading file from:', fileUrl);
    
    const response = await fetch(fileUrl);
    if (!response.ok) {
      console.error('Download failed:', response.status, response.statusText);
      throw new Error('Failed to download file');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

/**
 * Download multiple files as a zip
 */
export async function downloadMultipleFiles(
  files: Array<{ file_path: string; original_name: string }>,
  zipName: string = 'files.zip'
) {
  try {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    // Use the API route for downloads
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
    
    // Fetch all files
    const filePromises = files.map(async (file) => {
      // Clean up file path - remove 'uploads/' prefix if present
      const cleanPath = file.file_path.replace(/^uploads\//, '').replace(/^\/+/, '');
      const fileUrl = `${apiBaseUrl}/download/${cleanPath}`;
      
      console.log('Fetching file:', fileUrl);
      
      const response = await fetch(fileUrl);
      if (!response.ok) {
        console.error(`Failed to download ${file.original_name}:`, response.status);
        throw new Error(`Failed to download ${file.original_name}`);
      }
      const blob = await response.blob();
      return { name: file.original_name, blob };
    });
    
    const downloadedFiles = await Promise.all(filePromises);
    
    // Add files to zip
    downloadedFiles.forEach(({ name, blob }) => {
      zip.file(name, blob);
    });
    
    // Generate zip and download
    const content = await zip.generateAsync({ type: 'blob' });
    const url = window.URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = zipName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}
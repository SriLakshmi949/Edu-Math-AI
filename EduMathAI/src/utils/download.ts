/**
 * Utility to download the project zip reliably across all desktop and mobile browsers,
 * including within sandboxed iframes.
 */
export async function downloadProjectZip(onProgress?: (status: string) => void): Promise<void> {
  try {
    if (onProgress) onProgress('Preparing download...');
    const response = await fetch('/api/download-project-zip');
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    if (onProgress) onProgress('Receiving zip package...');
    const blob = await response.blob();
    
    // Create download trigger via blob object URL
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'EduMathAI-Class9-Platform.zip';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      if (onProgress) onProgress('Downloaded successfully!');
    }, 1200);
  } catch (error) {
    console.error('Blob download failed, falling back to direct link:', error);
    // Fallback: direct window location trigger
    window.location.href = '/api/download-project-zip';
  }
}

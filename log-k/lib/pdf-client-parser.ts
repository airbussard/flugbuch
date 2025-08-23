// Client-side PDF text extraction using pdf.js
import * as pdfjsLib from 'pdfjs-dist'

// Configure worker - use local worker file
if (typeof window !== 'undefined') {
  // Use local worker from public folder
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    let fullText = ''
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      // Combine text items
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      
      fullText += pageText + '\n'
    }
    
    return fullText
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw new Error('Failed to extract text from PDF')
  }
}
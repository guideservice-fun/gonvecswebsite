import * as QRCode from 'qrcode';

export interface QRCodeOptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  type?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number;
  margin?: number;
  width?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generate UPI QR Code
 * @param upiId - UPI ID (e.g., merchant@upi)
 * @param name - Merchant name
 * @param amount - Amount (optional)
 * @param options - QR Code options
 */
export async function generateUPIQRCode(
  upiId: string,
  name: string,
  amount?: number,
  options?: QRCodeOptions
): Promise<string> {
  try {
    let upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}`;
    
    if (amount) {
      upiUrl += `&am=${amount}`;
    }
    
    upiUrl += '&tn=Wallet%20TopUp';

    const dataUrl = await QRCode.toDataURL(upiUrl, {
      errorCorrectionLevel: options?.errorCorrectionLevel || 'H',
      type: options?.type || 'image/png',
      quality: options?.quality || 0.95,
      margin: options?.margin || 1,
      width: options?.width || 300,
      color: options?.color || {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate Generic QR Code
 * @param text - Text to encode
 * @param options - QR Code options
 */
export async function generateQRCode(
  text: string,
  options?: QRCodeOptions
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: options?.errorCorrectionLevel || 'H',
      type: options?.type || 'image/png',
      quality: options?.quality || 0.95,
      margin: options?.margin || 1,
      width: options?.width || 300,
      color: options?.color || {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR Code Canvas
 * @param text - Text to encode
 * @param options - QR Code options
 */
export async function generateQRCodeCanvas(
  text: string,
  options?: QRCodeOptions
): Promise<HTMLCanvasElement> {
  try {
    const canvas = document.createElement('canvas');
    
    await QRCode.toCanvas(canvas, text, {
      errorCorrectionLevel: options?.errorCorrectionLevel || 'H',
      width: options?.width || 300,
      margin: options?.margin || 1,
      color: options?.color || {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return canvas;
  } catch (error) {
    console.error('Error generating QR code canvas:', error);
    throw new Error('Failed to generate QR code canvas');
  }
}

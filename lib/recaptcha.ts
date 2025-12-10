/**
 * Утилита для проверки reCAPTCHA v3
 */

/**
 * Проверка reCAPTCHA токена на сервере
 */
export async function verifyRecaptcha(
  token: string,
  secretKey: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  if (!token) {
    return { success: false, error: 'Token is missing' };
  }
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });
    
    const data = await response.json();
    
    if (!data.success) {
      return {
        success: false,
        error: data['error-codes']?.join(', ') || 'Verification failed'
      };
    }
    
    // reCAPTCHA v3 возвращает score от 0.0 до 1.0
    // Обычно score > 0.5 считается человеком
    const score = data.score || 0;
    const isHuman = score >= 0.5;
    
    return {
      success: isHuman,
      score: score,
      error: !isHuman ? `Score too low: ${score}` : undefined
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Проверка Cloudflare Turnstile токена
 */
export async function verifyTurnstile(
  token: string,
  secretKey: string,
  clientIP?: string
): Promise<{ success: boolean; error?: string }> {
  if (!token) {
    return { success: false, error: 'Token is missing' };
  }
  
  try {
    const body = new URLSearchParams({
      secret: secretKey,
      response: token,
      ...(clientIP && { remoteip: clientIP })
    });
    
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    
    const data = await response.json();
    
    return {
      success: data.success === true,
      error: data.success === false ? 'Verification failed' : undefined
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}




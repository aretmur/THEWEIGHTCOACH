export async function getCountryFromIP() {
  try {
    const res = await fetch('https://ipapi.co/json');
    const data = await res.json();
    return data.country_code || 'AU';
  } catch (e) {
    return 'AU'; // Fallback
  }
}
  

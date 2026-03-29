const UNSPLASH_KEY = 'CWE3neCUMpKmo1H5y5Of87l5xoVYucP2_fJ72F0NOGo';

async function getZenContent() {
  try {
    // 1. Fetch Background from Unsplash
    const imgRes = await fetch(`https://api.unsplash.com/photos/random?query=nature,zen&client_id=${UNSPLASH_KEY}`);
    const imgData = await imgRes.json();
    document.body.style.backgroundImage = `url('${imgData.urls.regular}')`;

    // 2. Fetch Quote from ZenQuotes (Using 'today' mode)
    // Note: If you face CORS issues, use a proxy or their specific 'today' endpoint
    const quoteRes = await fetch('https://api.zenquotes.io/api/today');
    const quoteData = await quoteRes.json();
    
    document.getElementById('text').innerText = `"${quoteData[0].q}"`;
    document.getElementById('author').innerText = `- ${quoteData[0].a}`;
    
  } catch (error) {
    console.error("ZenGarden Error:", error);
    document.getElementById('text').innerText = "Focus on the present moment.";
    document.getElementById('author').innerText = "- Zen Proverb";
  }
}

// Run on load
window.addEventListener('DOMContentLoaded', getZenContent);
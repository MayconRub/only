fetch('https://api.turbofypay.com/health').then(r => console.log("turbofypay.com health:", r.status)).catch(e => console.log("turbofypay.com health ERROR:", e.message));
fetch('https://api.turbofypay.com.br/health').then(r => console.log("turbofypay.com.br health:", r.status)).catch(e => console.log("turbofypay.com.br health ERROR:", e.message));

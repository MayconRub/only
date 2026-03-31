fetch('https://api.turbofy.com.br/rifeiro/pix').then(r => console.log("turbofy.com.br:", r.status)).catch(e => console.log("turbofy.com.br ERROR:", e.message, e.cause));
fetch('https://api.turbofypay.com/rifeiro/pix').then(r => console.log("turbofypay.com:", r.status)).catch(e => console.log("turbofypay.com ERROR:", e.message, e.cause));

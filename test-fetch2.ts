const urls = [
  'https://api.turbofypay.com',
  'https://api.turbofypay.com.br',
  'https://api.turbofy.com',
  'https://app.turbofypay.com/api'
];
Promise.all(urls.map(url => fetch(url + '/rifeiro/pix').then(r => console.log(url, r.status)).catch(e => console.log(url, e.cause ? e.cause.code : e.message)))).then(() => console.log("done"));


if('serviceWorker' in navigator){ 
  navigator.serviceWorker.register('/sw.js')
  .then((reg)=>{console.log( 'serviceworker registered',reg)})
  .catch((err)=>{console.log("Error", err)})
} 
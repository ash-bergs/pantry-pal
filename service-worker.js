if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let c={};const t=e=>i(e,o),f={module:{uri:o},exports:c,require:t};s[o]=Promise.all(n.map((e=>f[e]||t(e)))).then((e=>(r(...e),c)))}}define(["./workbox-1c3383c2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"README.md",revision:"64b038e9b4b1bc12447fd4b3c7a7a857"},{url:"assets/favicon.png",revision:"9bc88d4edacc164efc61ea1fecc08b15"},{url:"assets/icon-192.png",revision:"45f0e9513ee33bdb3ff8879f7c2fc268"},{url:"assets/icon-384.png",revision:"3cf251a83522d13e74d40f753556f2a0"},{url:"assets/icon-512.png",revision:"69cea7d072d7e42f2bad8b6b1a562b09"},{url:"assets/version-1-screenshot-2.png",revision:"4875af09dceebd124486a43c0bde7383"},{url:"assets/version-1-screenshot.png",revision:"e814f9992a524597be13273173cf54b6"},{url:"index.html",revision:"7d9831a09725391aa4d0fbf153bdbfca"},{url:"index.js",revision:"3b36db5ed92c0f31e242f128e67e02b5"},{url:"manifest.json",revision:"b5c1f81119dae5e1aa4890e8eb3fbe8b"}],{})}));

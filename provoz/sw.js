{\rtf1\ansi\ansicpg1250\cocoartf2639
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw8400\paperh11900\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const CACHE_NAME = 'ofl-quiz-app-v1';\
const ASSETS = [\
  './',\
  './index.html',\
  './styles.css',\
  './app.js',\
  './manifest.json',\
  './questions.json'\
];\
\
self.addEventListener('install', (e) => \{\
  e.waitUntil(\
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))\
  );\
\});\
\
self.addEventListener('fetch', (e) => \{\
  e.respondWith(\
    caches.match(e.request).then((res) => res || fetch(e.request))\
  );\
\});\
}

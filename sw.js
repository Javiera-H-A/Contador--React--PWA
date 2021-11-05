// guardamos todo lo que queremos que guarde el cache
const CACHE_ELEMENTS = [
    './',
    'https://unpkg.com/react@17/umd/react.production.min.js',
    'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'index.css'
]
// le colocamos un nombre 
const CACHE_NAME = 'v3_cache_contador_react'
// evento del sw, escuchamos el evento install, es la primera parte del 
// ciclo de vida del sw, al installarse es cachear todas las rutas que le dimos 
// y ya no haga tantas peticiones a internet
self.addEventListener('install', (e) =>{
//espera a que algo sucesa, le colocas el nombre de tu cache 
// y con addAll le dices que cosas quieres que te devuelva
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache =>{
            cache.addAll(CACHE_ELEMENTS).then(() =>{
                self.skipWaiting()
            }).catch(err => console.log(err))
        })
    )
});

self.addEventListener('activate', (e) =>{

    const cacheWhiteList = [CACHE_NAME];

    //ahora veremos como se activa 
        e.waitUntil(
            // el metodo keys me dará todas las claves en caso de que 
            // tengamos mas de un caché instalado
            caches.keys().then((cacheNames) => {
                return Promise.all(cacheNames.map(cacheName =>{
                    cacheWhiteList.indexOf(cacheName) === -1 && caches.delete(cacheName)
                }))
            }).then(() => self.clients.claim())
        );
    });
// busca una nueva version de nuestros archivos y va a retornar las respuestas que esten cacheadas
// en caso de que vaya a cachear una nueva, lo que hará es hacer la peticion y respondernos una nueva cosa
    self.addEventListener('fetch', (e) =>{
        e.respondWith(
            caches.match(e.request).then((res) => {
                if(res){
                    return res;
                }
                return fetch(e.request);
            })
        );
    });
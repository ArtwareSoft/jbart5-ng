jb_component('http.get', {
    params: [
        { id: 'url', as: 'string' },
        { id: 'json', as: 'boolean' }
    ],
    impl: function (ctx, url, _json) {
        var json = _json || url.match(/json$/);
        return fetch(url)
            .then(function (r) {
            return json ? r.json() : r.text();
        })
            .catch(function (e) {
            return jb_logException(e);
        });
    }
});

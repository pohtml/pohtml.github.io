(function() {

    function decode(base64) {
        const text = atob(base64);
        const length = text.length;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = text.charCodeAt(i);
        }
        const decoder = new TextDecoder();
        // default is utf-8
        return decoder.decode(bytes);
    }

    function expiresIn(millis) {
        const expiration = new Date();
        expiration.setTime(expiration.getTime() + millis);
        return ";expires=" + expiration.toUTCString();
    }

    function selectCookie(name, cookies) {
        if (!cookies) {
            cookies = document.cookie
        }
        for (let cookie of cookies.split(/\s*;\s*/)) {
            let index = cookie.indexOf('=')
            let key = cookie.substring(0, index)
            if (key == name) {
                return cookie.substring(index + 1)
            }
        }
    }

    if (location.search) {
        window["softalks.com/state"] = parse(location.search.substring(1))
    } else {
        let model = selectCookie('json')
        if (model) {
            document.cookie = "json=" + expiresIn(-1) + ";path=/"
            if (!isNaN(model)) {
                let id = model
                model = sessionStorage.getItem(id)
                if (model) {
                    model = JSON.parse(model).data
                    sessionStorage.removeItem(id);
                }
            } else {
                model = JSON.parse(decode(model))
            }
            window["softalks.com/state"] = model
        }
    }

    function base() {
        let baseElements = document.getElementsByTagName("base")
        if (baseElements.length == 0) {
            return location.href
        } else {
            return document.getElementsByTagName("base")[0].href   
        }
    }

    if (window["softalks.com/state"]) {
        for (key of Object.keys(window["softalks.com/state"])) {
            window[key] = window["softalks.com/state"][key]
        }
    } else if (location.protocol == "file:" || location.href.startsWith(base())) {
        let fixture = localStorage.getItem(location.pathname)
        if (fixture) {
            eval(fixture)
        } else {
            fixture = prompt("Please enter an ECMAScript fixture with the dynamic contents of this static page");
            if (fixture) {
                alert("Warning: The provided fixture will be used for this URI until you remove it from the Local Storage (Application tab of your browser's devoloper tools)")
                eval(fixture)
                localStorage.setItem(location.pathname, fixture)
            } else {
                alert("Warning: You will work a dynamic page without its dynamic content")
            }
        }
    }

}
)()

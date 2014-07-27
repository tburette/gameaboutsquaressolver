var LIBCOLOR = function() {
    var e = function(c, a) {
            for (c += ""; c.length < a;) c = "0" + c;
            return c
        },
        f = function(c, a, d) {
            c = c.replace(/^\s*|\s*$/, "");
            c = c.replace(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i, "#$1$1$2$2$3$3");
            a = Math.round(256 * a) * (d ? -1 : 1);
            var b = c.match(/^rgba?\(\s*(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\s*,\s*(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\s*,\s*(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i),
                f = b && null != b[4] ? b[4] : null;
            c = b ? [b[1], b[2], b[3]] : c.replace(/^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
                function(a, b, c, d) {
                    return parseInt(b, 16) + "," + parseInt(c, 16) + "," + parseInt(d, 16)
                }).split(/,/);
            return b ? "rgb" + (null !== f ? "a" : "") + "(" + Math[d ? "max" : "min"](parseInt(c[0], 10) + a, d ? 0 : 255) + ", " + Math[d ? "max" : "min"](parseInt(c[1], 10) + a, d ? 0 : 255) + ", " + Math[d ? "max" : "min"](parseInt(c[2], 10) + a, d ? 0 : 255) + (null !== f ? ", " + f : "") + ")" : ["#", e(Math[d ? "max" : "min"](parseInt(c[0], 10) + a, d ? 0 : 255).toString(16), 2), e(Math[d ? "max" : "min"](parseInt(c[1], 10) + a, d ? 0 : 255).toString(16), 2), e(Math[d ? "max" : "min"](parseInt(c[2], 10) + a, d ? 0 : 255).toString(16),
                2)].join("")
        },
        k = function(c, a) {
            return f(c, a, !1)
        },
        g = function(c, a) {
            return f(c, a, !0)
        };
    g("rgba(80, 75, 52, .5)", .2);
    k("rgba(80, 75, 52, .5)", .2);
    return {
        lighterColor: k,
        darkerColor: g
    }
}();
! function(e, f) {
    var k = f.support.touch = !!("ontouchstart" in window || window.DocumentTouch && e instanceof DocumentTouch),
        g = "clientX clientY screenX screenY pageX pageY".split(" "),
        c = null,
        a = 0,
        d = 0,
        b = 0,
        h = !1,
        m = 0,
        p = function(a, b) {
            var c = b.originalEvent,
                d = f.Event(c),
                c = c.changedTouches ? c.changedTouches[0] : c;
            d.type = a;
            for (var e = 0, h = g.length; h > e; e++) d[g[e]] = c[g[e]];
            return d
        },
        n = {
            isEnabled: !1,
            isTracking: !1,
            enable: function() {
                return this.isEnabled ? this : (this.isEnabled = !0, f(e.body).on("touchstart._tap", this.onTouchStart).on("touchend._tap",
                    this.onTouchEnd).on("touchcancel._tap", this.onTouchCancel), this)
            },
            disable: function() {
                return this.isEnabled ? (this.isEnabled = !1, f(e.body).off("touchstart._tap", this.onTouchStart).off("touchend._tap", this.onTouchEnd).off("touchcancel._tap", this.onTouchCancel), this) : this
            },
            onTouchStart: function(e) {
                var g = e.originalEvent.touches;
                (b = g.length, n.isTracking) || (n.isTracking = !0, g = g[0], h = !1, m = Date.now(), c = f(e.target), a = g.pageX, d = g.pageY)
            },
            onTouchEnd: function(e) {
                var f = e.originalEvent,
                    g = e.changedTouches ? e.changedTouches[0] :
                    f.changedTouches[0],
                    f = Math.abs(g.pageX - a),
                    g = Math.abs(g.pageY - d),
                    f = Math.max(f, g);
                400 > Date.now() - m && 40 > f && !h && 1 === b && n.isTracking && c.trigger(p("tap", e));
                n.onTouchCancel(e)
            },
            onTouchCancel: function() {
                n.isTracking = !1;
                h = !0
            }
        };
    if (f.event.special.tap = {
        setup: function() {
            n.enable()
        }
    }, !k) {
        var q = [],
            l = function(a) {
                var b = a.originalEvent,
                    c;
                (c = a.isTrigger) || (c = 0 <= (Array.prototype.indexOf ? q.indexOf(b) : f.inArray(b, q)));
                c || (3 < q.length && q.splice(0, q.length - 3), q.push(b), b = p("tap", a), f(a.target).trigger(b))
            };
        f.event.special.tap = {
            setup: function() {
                f(this).on("click._tap", l)
            },
            teardown: function() {
                f(this).off("click._tap", l)
            }
        }
    }
}(document, jQuery);
(function(e) {
    try {
        document.createEvent("TouchEvent");
        return
    } catch (f) {}
    var k = {
            mousedown: "touchstart",
            mouseup: "touchend",
            mousemove: "touchmove"
        },
        g = function() {
            for (var c in k) document.body.addEventListener(c, function(a) {
                var c = k[a.type],
                    b = document.createEvent("MouseEvents");
                b.initMouseEvent(c, a.bubbles, a.cancelable, a.view, a.detail, a.screenX, a.screenY, a.clientX, a.clientY, a.ctrlKey, a.altKey, a.shiftKey, a.metaKey, a.button, a.relatedTarget);
                a.target.dispatchEvent(b);
                c = a.target["on" + k[a.type]];
                "function" === typeof c &&
                    c(a)
            }, !1)
        };
    "complete" === document.readyState || "loaded" === document.readyState ? g() : e.addEventListener("load", g, !1)
})(window);
window.Modernizr = function(e, f, k) {
    function g(a, b) {
        for (var c in a) {
            var d = a[c];
            if (!~("" + d).indexOf("-") && h[d] !== k) return "pfx" == b ? d : !0
        }
        return !1
    }

    function c(a, b, c) {
        var d = a.charAt(0).toUpperCase() + a.slice(1),
            e = (a + " " + p.join(d + " ") + d).split(" ");
        if ("string" === typeof b || "undefined" === typeof b) b = g(e, b);
        else a: {
            e = (a + " " + n.join(d + " ") + d).split(" "), a = e;
            for (var f in a)
                if (d = b[a[f]], d !== k) {
                    b = !1 === c ? a[f] : "function" === typeof d ? d.bind(c || b) : d;
                    break a
                }
            b = !1
        }
        return b
    }
    var a = {},
        d = f.documentElement,
        b = f.createElement("modernizr"),
        h = b.style,
        m = " -webkit- -moz- -o- -ms- ".split(" "),
        p = ["Webkit", "Moz", "O", "ms"],
        n = ["webkit", "moz", "o", "ms"],
        b = {},
        q = [],
        l = q.slice,
        v, r = function(a, b, c, e) {
            var g, h, m, p, k = f.createElement("div"),
                F = f.body,
                D = F || f.createElement("body");
            if (parseInt(c, 10))
                for (; c--;) m = f.createElement("div"), m.id = e ? e[c] : "modernizr" + (c + 1), k.appendChild(m);
            return g = ['&#173;<style id="smodernizr">', a, "</style>"].join(""), k.id = "modernizr", (F ? k : D).innerHTML += g, D.appendChild(k), F || (D.style.background = "", D.style.overflow = "hidden", p = d.style.overflow,
                d.style.overflow = "hidden", d.appendChild(D)), h = b(k, a), F ? k.parentNode.removeChild(k) : (D.parentNode.removeChild(D), d.style.overflow = p), !!h
        },
        u = {}.hasOwnProperty,
        w;
    "undefined" === typeof u || "undefined" === typeof u.call ? w = function(a, b) {
        return b in a && "undefined" === typeof a.constructor.prototype[b]
    } : w = function(a, b) {
        return u.call(a, b)
    };
    Function.prototype.bind || (Function.prototype.bind = function(a) {
        var b = this;
        if ("function" != typeof b) throw new TypeError;
        var c = l.call(arguments, 1),
            d = function() {
                if (this instanceof d) {
                    var e = function() {};
                    e.prototype = b.prototype;
                    var e = new e,
                        f = b.apply(e, c.concat(l.call(arguments)));
                    return Object(f) === f ? f : e
                }
                return b.apply(a, c.concat(l.call(arguments)))
            };
        return d
    });
    b.borderradius = function() {
        return c("borderRadius")
    };
    b.opacity = function() {
        var a = m.join("opacity:.55;") + "";
        h.cssText = a;
        return /^0.55$/.test(h.opacity)
    };
    b.fontface = function() {
        var a;
        return r('@font-face {font-family:"font";src:url("https://")}', function(b, c) {
            var d = f.getElementById("smodernizr"),
                d = (d = d.sheet || d.styleSheet) ?
                d.cssRules && d.cssRules[0] ? d.cssRules[0].cssText : d.cssText || "" : "";
            a = /src/i.test(d) && 0 === d.indexOf(c.split(" ")[0])
        }), a
    };
    b.generatedcontent = function() {
        var a;
        return r('#modernizr{font:0/0 a}#modernizr:after{content:":)";visibility:hidden;font:3px/1 a}', function(b) {
            a = 3 <= b.offsetHeight
        }), a
    };
    b.localstorage = function() {
        try {
            return localStorage.setItem("modernizr", "modernizr"), localStorage.removeItem("modernizr"), !0
        } catch (a) {
            return !1
        }
    };
    for (var B in b) w(b, B) && (v = B.toLowerCase(), a[v] = b[B](), q.push((a[v] ? "" : "no-") +
        v));
    a.addTest = function(b, c) {
        if ("object" == typeof b)
            for (var e in b) w(b, e) && a.addTest(e, b[e]);
        else {
            b = b.toLowerCase();
            if (a[b] !== k) return a;
            c = "function" == typeof c ? c() : c;
            d.className += " " + (c ? "" : "no-") + b;
            a[b] = c
        }
        return a
    };
    h.cssText = "";
    return b = null,
        function(a, b) {
            function c() {
                var a = t.elements;
                return "string" == typeof a ? a.split(" ") : a
            }

            function d(a) {
                var b = n[a[p]];
                return b || (b = {}, l++, a[p] = l, n[l] = b), b
            }

            function e(a, c, f) {
                c || (c = b);
                if (q) return c.createElement(a);
                f || (f = d(c));
                var h;
                return f.cache[a] ? h = f.cache[a].cloneNode() :
                    F.test(a) ? h = (f.cache[a] = f.createElem(a)).cloneNode() : h = f.createElem(a), !h.canHaveChildren || m.test(a) || h.tagUrn ? h : f.frag.appendChild(h)
            }

            function f(a, b) {
                b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag());
                a.createElement = function(c) {
                    return t.shivMethods ? e(c, a, b) : b.createElem(c)
                };
                a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + c().join().replace(/[\w\-]+/g, function(a) {
                    return b.createElem(a),
                        b.frag.createElement(a), 'c("' + a + '")'
                }) + ");return n}")(t, b.frag)
            }

            function g(a) {
                a || (a = b);
                var c = d(a);
                if (t.shivCSS && !k && !c.hasCSS) {
                    var e, h = a;
                    e = h.createElement("p");
                    h = h.getElementsByTagName("head")[0] || h.documentElement;
                    e = (e.innerHTML = "x<style>article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}</style>", h.insertBefore(e.lastChild, h.firstChild));
                    c.hasCSS = !!e
                }
                return q || f(a, c), a
            }
            var h = a.html5 || {},
                m = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
                F = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
                k, p = "_html5shiv",
                l = 0,
                n = {},
                q;
            (function() {
                try {
                    var a = b.createElement("a");
                    a.innerHTML = "<xyz></xyz>";
                    k = "hidden" in a;
                    var c;
                    if (!(c = 1 == a.childNodes.length)) {
                        b.createElement("a");
                        var d = b.createDocumentFragment();
                        c = "undefined" == typeof d.cloneNode || "undefined" == typeof d.createDocumentFragment || "undefined" == typeof d.createElement
                    }
                    q = c
                } catch (e) {
                    q = k = !0
                }
            })();
            var t = {
                elements: h.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
                version: "3.7.0",
                shivCSS: !1 !== h.shivCSS,
                supportsUnknownElements: q,
                shivMethods: !1 !== h.shivMethods,
                type: "default",
                shivDocument: g,
                createElement: e,
                createDocumentFragment: function(a, e) {
                    a || (a = b);
                    if (q) return a.createDocumentFragment();
                    e = e || d(a);
                    for (var f = e.frag.cloneNode(), h = 0, g = c(), m = g.length; h < m; h++) f.createElement(g[h]);
                    return f
                }
            };
            a.html5 = t;
            g(b)
        }(this, f), a._version = "2.8.2", a._prefixes = m, a._domPrefixes = n, a._cssomPrefixes = p, a.mq = function(a) {
            var b = e.matchMedia || e.msMatchMedia;
            if (b) return b(a) && b(a).matches ||
                !1;
            var c;
            return r("@media " + a + " { #modernizr { position: absolute; } }", function(a) {
                c = "absolute" == (e.getComputedStyle ? getComputedStyle(a, null) : a.currentStyle).position
            }), c
        }, a.testProp = function(a) {
            return g([a])
        }, a.testAllProps = c, a.testStyles = r, d.className = d.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (" js " + q.join(" ")), a
}(this, this.document);
(function(e, f, k) {
    function g(a) {
        return "[object Function]" == v.call(a)
    }

    function c(a) {
        return "string" == typeof a
    }

    function a() {}

    function d(a) {
        return !a || "loaded" == a || "complete" == a || "uninitialized" == a
    }

    function b() {
        var a = r.shift();
        u = 1;
        a ? a.t ? q(function() {
            ("c" == a.t ? C.injectCss : C.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
        }, 0) : (a(), b()) : u = 0
    }

    function h(a, c, e, h, g, m, k) {
        function p(e) {
            if (!n && d(x.readyState) && (K.r = n = 1, !u && b(), x.onload = x.onreadystatechange = null, e)) {
                "img" != a && q(function() {
                    J.removeChild(x)
                }, 50);
                for (var f in y[c]) y[c].hasOwnProperty(f) &&
                    y[c][f].onload()
            }
        }
        k = k || C.errorTimeout;
        var x = f.createElement(a),
            n = 0,
            A = 0,
            K = {
                t: e,
                s: c,
                e: g,
                a: m,
                x: k
            };
        1 === y[c] && (A = 1, y[c] = []);
        "object" == a ? x.data = c : (x.src = c, x.type = a);
        x.width = x.height = "0";
        x.onerror = x.onload = x.onreadystatechange = function() {
            p.call(this, A)
        };
        r.splice(h, 0, K);
        "img" != a && (A || 2 === y[c] ? (J.insertBefore(x, B ? null : l), q(p, k)) : y[c].push(x))
    }

    function m(a, d, e, f, g) {
        return u = 0, d = d || "j", c(a) ? h("c" == d ? Q : K, a, d, this.i++, e, f, g) : (r.splice(this.i++, 0, a), 1 == r.length && b()), this
    }

    function p() {
        var a = C;
        return a.loader = {
            load: m,
            i: 0
        }, a
    }
    var n = f.documentElement,
        q = e.setTimeout,
        l = f.getElementsByTagName("script")[0],
        v = {}.toString,
        r = [],
        u = 0,
        w = "MozAppearance" in n.style,
        B = w && !!f.createRange().compareNode,
        J = B ? n : l.parentNode,
        n = e.opera && "[object Opera]" == v.call(e.opera),
        n = !!f.attachEvent && !n,
        K = w ? "object" : n ? "script" : "img",
        Q = n ? "script" : K,
        R = Array.isArray || function(a) {
            return "[object Array]" == v.call(a)
        },
        N = [],
        y = {},
        T = {
            timeout: function(a, b) {
                return b.length && (a.timeout = b[0]), a
            }
        },
        S, C;
    C = function(b) {
        function d(a) {
            a = a.split("!");
            var b = N.length,
                c =
                a.pop(),
                e = a.length,
                c = {
                    url: c,
                    origUrl: c,
                    prefixes: a
                },
                f, h, g;
            for (h = 0; h < e; h++) g = a[h].split("="), (f = T[g.shift()]) && (c = f(c, g));
            for (h = 0; h < b; h++) c = N[h](c);
            return c
        }

        function e(a, b, c, f, h) {
            var m = d(a),
                l = m.autoCallback;
            m.url.split(".").pop().split("?").shift();
            m.bypass || (b && (b = g(b) ? b : b[a] || b[f] || b[a.split("/").pop().split("?")[0]]), m.instead ? m.instead(a, b, c, f, h) : (y[m.url] ? m.noexec = !0 : y[m.url] = 1, c.load(m.url, m.forceCSS || !m.forceJS && "css" == m.url.split(".").pop().split("?").shift() ? "c" : k, m.noexec, m.attrs, m.timeout), (g(b) || g(l)) && c.load(function() {
                p();
                b && b(m.origUrl, h, f);
                l && l(m.origUrl, h, f);
                y[m.url] = 2
            })))
        }

        function f(b, d) {
            function h(a, b) {
                if (a)
                    if (c(a)) b || (l = function() {
                        var a = [].slice.call(arguments);
                        p.apply(this, a);
                        n()
                    }), e(a, l, d, 0, m);
                    else {
                        if (Object(a) === a)
                            for (t in q = function() {
                                var b = 0,
                                    c;
                                for (c in a) a.hasOwnProperty(c) && b++;
                                return b
                            }(), a) a.hasOwnProperty(t) && (!b && !--q && (g(l) ? l = function() {
                                var a = [].slice.call(arguments);
                                p.apply(this, a);
                                n()
                            } : l[t] = function(a) {
                                return function() {
                                    var b = [].slice.call(arguments);
                                    a && a.apply(this,
                                        b);
                                    n()
                                }
                            }(p[t])), e(a[t], l, d, t, m))
                    } else !b && n()
            }
            var m = !!b.test,
                k = b.load || b.both,
                l = b.callback || a,
                p = l,
                n = b.complete || a,
                q, t;
            h(m ? b.yep : b.nope, !!k);
            k && h(k)
        }
        var h, m, l = this.yepnope.loader;
        if (c(b)) e(b, 0, l, 0);
        else if (R(b))
            for (h = 0; h < b.length; h++) m = b[h], c(m) ? e(m, 0, l, 0) : R(m) ? C(m) : Object(m) === m && f(m, l);
        else Object(b) === b && f(b, l)
    };
    C.addPrefix = function(a, b) {
        T[a] = b
    };
    C.addFilter = function(a) {
        N.push(a)
    };
    C.errorTimeout = 1E4;
    null == f.readyState && f.addEventListener && (f.readyState = "loading", f.addEventListener("DOMContentLoaded",
        S = function() {
            f.removeEventListener("DOMContentLoaded", S, 0);
            f.readyState = "complete"
        }, 0));
    e.yepnope = p();
    e.yepnope.executeStack = b;
    e.yepnope.injectJs = function(c, e, h, m, g, k) {
        var p = f.createElement("script"),
            n, r;
        m = m || C.errorTimeout;
        p.src = c;
        for (r in h) p.setAttribute(r, h[r]);
        e = k ? b : e || a;
        p.onreadystatechange = p.onload = function() {
            !n && d(p.readyState) && (n = 1, e(), p.onload = p.onreadystatechange = null)
        };
        q(function() {
            n || (n = 1, e(1))
        }, m);
        g ? p.onload() : l.parentNode.insertBefore(p, l)
    };
    e.yepnope.injectCss = function(c, d, e, h, m, g) {
        h =
            f.createElement("link");
        var k;
        d = g ? b : d || a;
        h.href = c;
        h.rel = "stylesheet";
        h.type = "text/css";
        for (k in e) h.setAttribute(k, e[k]);
        m || (l.parentNode.insertBefore(h, l), q(d, 0))
    }
})(this, document);
Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0))
};
(function() {
    "function" !== typeof Object.create && (Object.create = function(e) {
        function f() {}
        f.prototype = e;
        return new f
    })
})();
var GAMEABOUTSQUARES = GAMEABOUTSQUARES || {};
GAMEABOUTSQUARES.Conf = {
    movementTime: .3,
    colors: {
        0: "#c0392b",
        1: "#2980b9",
        2: "#2c3e50",
        3: "#e67e22",
        4: "#16a085",
        5: "#27ae60",
        6: "#9b59b6",
        7: "#7f8c8d",
        8: "#f1c40f",
        9: "#c24646",
        10: "#0b7140",
        11: "#555744",
        12: "#f19c2e",
        colorOfField: "#f0ead2",
        actionDefaultColor: "#5a5957",
        dimActionColor: "#F9F9F9",
        sharpActionColor: function(e) {
            return LIBCOLOR.darkerColor(e, .2)
        }
    },
    defaultMessage: '<span style="font-size: 300%" class="typcn typcn-arrow-right"></span>'
};
$.preloadImages = function() {
    for (var e = 0; e < arguments.length; e++) $("<img />").attr("src", arguments[e])
};
$(document).ready(function() {
    var e;
    e = Modernizr.mq("only all") && Modernizr.fontface && Modernizr.borderradius && Modernizr.opacity && Modernizr.localstorage ? !0 : !1;
    e ? GAMEABOUTSQUARES.State.init() : $("body").html($("#not-modern-enough-msg").show())
});
GAMEABOUTSQUARES.State = function(e) {
    var f = {},
        k, g, c, a;
    f.init = function() {
        k = e.Levels.levelFuncs;
        d();
        e.Interface.init();
        e.Interface.initLevels(k.length, a);
        a < k.length ? (h(a, !0), e.Interface.showGame()) : e.Interface.showLastLevelSelect()
    };
    var d = f.loadGame = function() {
            var b = Math.abs(parseInt(localStorage.getItem("beavers"))),
                d = parseInt(localStorage.getItem("badgers"));
            a = b ? b : 0;
            c = d ? d : 0
        },
        b = f.saveGame = function() {
            g === a && ($.ajax({
                    url: "/lvlcomplete",
                    data: {
                        lvlname: e.Levels.currentLvlName,
                        clicks: c,
                        v: "alpacas"
                    },
                    type: "POST"
                }),
                c = 0, localStorage.setItem("badgers", 0), a = g + 1, localStorage.setItem("beavers", a))
        };
    f.countClick = function() {
        g === a && (c++, localStorage.setItem("badgers", c))
    };
    var h = f.resetLvl = function(a) {
        if ("function" !== typeof k[a]) throw Error("cannot set level " + a + ": no lvlFunc");
        g = a;
        e.Model.resetLvl();
        e.Interface.resetLvl(a);
        e.Hooks.onLevelStart(function() {});
        k[a]();
        e.Interface.postLvlFuncInit()
    };
    f.playerResetLvl = function() {
        h(g);
        e.Interface.showGame()
    };
    f.switchLvl = function(a) {
        a === g ? e.Interface.resumeGame() : (h(a), e.Interface.showGame())
    };
    f.completeLvl = function() {
        e.Interface.completeLvl(g);
        b()
    };
    f.maySwitchTo = function(b) {
        return b <= a
    };
    return f
}(GAMEABOUTSQUARES);
GAMEABOUTSQUARES.Interface = function(e, f) {
    function k(a) {
        a || (s = {
            window: {
                height: x.height(),
                width: x.width()
            },
            controls: {
                offsetLeft: W.offset().left,
                offsetTop: W.offset().top
            },
            stage: {
                side: t.width(),
                maxHeight: t.css("maxHeight"),
                maxWidth: t.css("maxWidth")
            },
            backstage: {}
        });
        a = s;
        var b = G.height(),
            c = G.width(),
            d;
        d = A.is(":hidden") ? 0 : A.outerWidth(!0);
        a.wrap = {
            height: b,
            width: c,
            offsetLeft: d,
            offsetTop: G.offset().top
        }
    }

    function g() {
        var a;
        "block" === W.find("li").css("display") ? (D.hide(), V.show(), a = !0) : (D.show(), V.hide(), a = !1);
        k();
        a ? (a = Q ? s.window.width : s.controls.offsetLeft, G.height(s.window.height), G.width(a - s.wrap.offsetLeft)) : (a = Q ? s.window.height : s.controls.offsetTop, G.height(a), G.width(s.window.width));
        k(!0)
    }

    function c() {
        g();
        p();
        c = function() {}
    }

    function a() {
        n();
        (new TimelineLite).add(E.hideWrap.restart()).call(function() {
            z.not(H).addClass("invisible");
            H.show();
            m(M)
        }).append(E.showMessage.restart(), "-=0.1").delay(0).call(q)
    }

    function d() {
        (new TimelineLite).call(n).call(function() {
            m(M)
        }).add(E.showMessage.restart()).delay(0).call(q)
    }

    function b() {
        (new TimelineLite).call(function() {
            z.removeClass("invisible")
        }).add(E.hideMessage.restart()).call(function() {
            H.not(z).hide()
        }).append(E.showWrap.restart(), "-=0.15").call(e.Hooks.onLevelStart)
    }

    function h() {
        aa.toggleClass("invisible")
    }

    function m(a) {
        a.each(function() {
            var a = (s.wrap.height - $(this).height()) / 2.5;
            $(this).css("top", 0 < a ? a : 0)
        })
    }

    function p() {
        for (var a = Array.prototype.slice.call(arguments), b = $(".recenter"); a.length;) b = b.not(a.pop());
        m(b)
    }

    function n() {
        M.html(y.pop());
        if (1 <= y.length) M.off().on("tap",
            function() {
                d()
            });
        else if (B) M.off().on("tap", function() {
            da()
        });
        else M.off().on("tap", function() {
            b()
        })
    }

    function q() {
        y.length || B || e.State.resetLvl(S + 1)
    }
    var l = {},
        v, r, u, w, B = !1,
        J = 0,
        K = !1,
        Q = !1,
        R, N = !1,
        y = [],
        T, S, C, F, D, V, U, M, O, t, G, x, W, A, Z, aa, X, I, L, z, P, H, E, s;
    l.init = function() {
        C = $("#undo-btn");
        F = $("#reset-btn");
        D = $("#level-btn");
        V = $("#big-level-btn");
        U = $("#resume-btn");
        M = $("#message");
        O = $("#lvlselect");
        t = $(".stage");
        G = $("#wrap");
        x = $(window);
        L = $("#footer-wrapper");
        W = $("#controls");
        A = $("#social-vertical");
        Z = $("#about-btn");
        aa = $("#about-wrapper");
        X = $("#message-wrap");
        $("#about-wrapper > div");
        I = t.clone().hide().attr("id", "backstage").addClass("stage");
        G.append(I);
        E = {
            showWrap: TweenLite.fromTo(G, 1 * e.Conf.movementTime, {
                paused: !0,
                autoAlpha: 0
            }, {
                autoAlpha: 1
            }),
            showMessage: TweenLite.fromTo(X, .8 * e.Conf.movementTime, {
                rotation: "-90deg",
                transformOrigin: "top left"
            }, {
                paused: !0,
                rotation: "0deg_cw"
            }),
            hideMessage: TweenLite.to(X, .8 * e.Conf.movementTime, {
                paused: !0,
                rotation: "90deg_cw",
                transformOrigin: "top left"
            })
        };
        $(".en").hide();
        $(".ru").show();
        T = e.Levels.messagesEn;
        z = G.add(t).add(L).add("#controls").add(".main-btns").add(".secondary-controls").add(A);
        P = G.add(L).add("#controls").add(".secondary-controls").add(O).add(U.parent()).add(A);
        H = X.add(M).add(L).add("#controls").add(".secondary-controls").add(A);
        $(document).bind("mobileinit", function() {
            $.mobile.autoInitializePage = !1;
            $.mobile.defaultPageTransition = "none";
            $.mobile.touchOverflowEnabled = !1;
            $.mobile.defaultDialogTransition = "none";
            $.mobile.loadingMessage = ""
        });
        x.resize(function() {
            g();
            p();
            Y(!0)
        });
        $.preloadImages("elemis1.png", "elemis2.png", "elemis3.png", "elemis4.png");
        C.on("tap", e.Model.undoPlayerMove);
        F.on("tap", e.State.playerResetLvl);
        D.on("tap", ba);
        V.on("tap", ba);
        U.on("tap", ea);
        Z.on("tap", h).attr("disabled", !1);
        $("#close-about").on("tap", h).attr("disabled", !1)
    };
    var ea = l.resumeGame = function() {
        R || (e.State.resetLvl(S), showGame());
        P.not(z).hide();
        z.not(P).show();
        e.Hooks.onResume()
    };
    l.resetLvl = function(a) {
        w = r = u = v = 0;
        B = !1;
        S = a;
        y = [];
        R = !0;
        N = !1;
        fa(T[a]);
        O.find("button").removeClass("current-level").eq(a).addClass("current-level");
        $(".current-lvl-num").html(a);
        t.empty();
        ga();
        ha()
    };
    l.postLvlFuncInit = function() {
        z.not(H).addClass("invisible").show();
        H.show();
        c();
        Y(!0);
        $(".square").each(function() {
            this.addEventListener("touchstart", function(a) {
                e.Model.playerMove(a.currentTarget.gameObject);
                a.stopPropagation()
            }, !1)
        });
        E.recenterGame && E.recenterGame.kill();
        E.resizeGame && E.resizeGame.kill();
        E.hideWrap = TweenLite.to(".game-object", 1.325 * e.Conf.movementTime, {
            paused: !0,
            scale: 0,
            ease: "Back.easeIn"
        })
    };
    l.initLevels = function(a, b) {
        for (var c,
            d, f = 0; f < a; f++) c = f <= b, O.append(document.createElement("button")), d = O.find("button").eq(f).html(c ? f : ".").addClass("level-button").attr("disabled", c ? !1 : !0),
            function(a) {
                d.on("tap", function() {
                    e.State.maySwitchTo(a) && e.State.switchLvl(a)
                })
            }(f)
    };
    l.enableUndo = function() {
        C.attr("disabled", !1)
    };
    l.enableReset = function() {
        F.attr("disabled", !1)
    };
    var ga = l.disableReset = function() {
            F.attr("disabled", !0)
        },
        ha = l.disableUndo = function() {
            C.attr("disabled", !0)
        };
    l.completeLvl = function(b) {
        R = !1;
        O.find("button").eq(b).addClass("completed-level");
        O.find("button").eq(b + 1).html(b + 1).attr("disabled", !1);
        a()
    };
    var ba = l.showLevelSelect = function() {
            e.Hooks.onLvlSelect();
            U.parent().removeClass("invisible");
            z.not(P).hide();
            P.not(z).show()
        },
        da = l.showLastLevelSelect = function() {
            H.hide();
            z.hide();
            P.removeClass("invisible").show();
            U.parent().addClass("invisible");
            g();
            p()
        };
    l.showGame = function() {
        P.not(z).hide();
        H.not(z).hide();
        p();
        z.removeClass("invisible");
        e.Hooks.onLevelStart()
    };
    var Y = l.resizeGame = function(a) {
            function b() {
                var a = $(".layer:first").width(),
                    c = parseInt(a / 6, 10),
                    d = parseInt((a - 2 * c) / 2, 10) + "px",
                    a = parseInt((a - c) / 2, 10) + "px";
                $(".arrow").css("border-top-width", c + "px").css("border-bottom-width", c + "px").css("border-right-width", c + "px").css("margin-top", d).css("margin-left", a)
            }
            var c, d, f;
            c = u - w + 1;
            I.width(100 / (v - r + 1) + "%");
            I.height(100 / c + "%");
            c = I.height();
            d = I.width();
            c >= d ? (d === s.stage.side ? f = !0 : s.stage.side = d, I.height(d / s.wrap.height * 100 + "%"), d == parseInt(s.stage.maxWidth, 10) && I.width(d / s.wrap.width * 100 + "%")) : (c === s.stage.side ? f = !0 : s.stage.side = c, I.width(c /
                s.wrap.width * 100 + "%"), c == parseInt(s.stage.maxHeight, 10) && I.height(c / s.wrap.height * 100 + "%"));
            s.backstage.w = I[0].style.width;
            s.backstage.h = I[0].style.height;
            a || f ? (t.height(s.backstage.h), t.width(s.backstage.w), b()) : E.resizeGame = TweenLite.to(t, e.Conf.movementTime, {
                height: s.backstage.h || "0%",
                width: s.backstage.w || "0%",
                onUpdate: b
            });
            ia(a)
        },
        ia = l.recenterGame = function(a) {
            var b = parseFloat(s.backstage.w),
                c = parseFloat(s.backstage.h),
                d = (v - r + 1) * b,
                f = (u - w + 1) * c;
            a ? (t.css("left", (100 - d) / 2 - b * r + "%"), t.css("top", (100 -
                f) / 2 - c * w + "%")) : E.recenterGame = TweenLite.to(t, e.Conf.movementTime, {
                left: (100 - d) / 2 - b * r + "%",
                top: (100 - f) / 2 - c * w + "%"
            })
        };
    l.updateMinsAndMaxes = function(a) {
        var b = a.x,
            c = a.y,
            d = !1;
        "undefined" !== typeof b && b < r ? (r = b, d = !0) : "undefined" !== typeof b && b > v ? (v = b, d = !0) : "undefined" !== typeof c && c < w ? (w = c, d = !0) : "undefined" !== typeof c && c > u && (u = c, d = !0);
        a.canResize && d && Y()
    };
    l.preAnimationHook = function() {
        K || J++
    };
    l.postAnimationHook = function() {
        K || 0 !== --J || 0 !== e.Model.checkWinConditions() || (ja(), e.Model.reproduceCachedAction())
    };
    l.disableAnimationCount = function() {
        K = !0
    };
    l.enableAnimationCount = function() {
        K = !1;
        J = 0
    };
    l.addToStage = function(a) {
        t.append(a)
    };
    l.lock = function() {
        N = !0
    };
    var ja = l.unlock = function() {
        N = !1
    };
    l.isLocked = function() {
        return N
    };
    var fa = l.addMsg = function ca(a) {
        a instanceof Array ? a.forEach(function(a) {
            ca(a)
        }) : "string" === typeof a ? y.unshift(a) : y.unshift(e.Conf.defaultMessage)
    };
    l.lastOne = function() {
        B = !0
    };
    l.disableInterface = function() {
        Q = !0;
        H = H.not(A).not(L);
        z = z.not(A).not(L);
        A.add(L).hide();
        g()
    };
    l.enableInterface = function() {
        Q = !1;
        H = H.add(A).add(L);
        z = z.add(A).add(L);
        A.add(L).addClass("invisible").show();
        g();
        p(M)
    };
    return l
}(GAMEABOUTSQUARES, LIBCOLOR);
GAMEABOUTSQUARES.Model = function(e) {
    var f = {},
        k = 0,
        g = 0,
        c = [],
        a = [],
        d, b = [];
    f.resetLvl = function() {
        b.length = 0;
        a.length = 0;
        g = k = c.length = 0;
        d = null
    };
    f.takeHeart = function() {
        g += 1
    };
    f.releaseHeart = function() {
        g -= 1
    };
    var h = f.playerMove = function(a) {
        function f(a, b) {
            a.x() === w && a.y() === B && (k.unshift(a), delete v[b], J = !1)
        }
        if (e.Interface.isLocked()) d = a;
        else {
            e.Interface.lock();
            e.State.countClick();
            e.Interface.enableAnimationCount();
            e.Hooks.onFirstMove();
            var h = a.x(),
                g = a.y(),
                k = [a],
                v = [];
            a = a.action.deltas();
            var r = a[0],
                u = a[1];
            if (0 ===
                r && 0 === u) e.Interface.unlock();
            else {
                c.unshift([]);
                b.forEach(function(a) {
                    var b = a.x() - h,
                        c = a.y() - g;
                    b !== r && b / Math.abs(b) !== r || c !== u && c / Math.abs(c) !== u || v.push(a)
                });
                for (var w = h + r, B = g + u, J = !1; 0 < v.length && !J; w += r, B += u) J = !0, v.forEach(f);
                k.forEach(function(a) {
                    var b = a.x(),
                        d = a.y();
                    c[0].push([a, a.snapshot()]);
                    a.moveTo(b + r, d + u)
                });
                e.Interface.enableReset();
                e.Interface.enableUndo()
            }
        }
    };
    f.undoPlayerMove = function() {
        1 === c.length && (e.Interface.disableReset(), e.Interface.disableUndo());
        e.Interface.disableAnimationCount();
        c.shift().forEach(function(a) {
            a[0].restore(a[1])
        })
    };
    f.checkWinConditions = function() {
        return k === g ? (e.State.completeLvl(), 1) : 0
    };
    f.addSquare = function(a) {
        b.push(a)
    };
    f.addHeart = function() {
        k++
    };
    f.getTile = function(b, c) {
        return a[b] ? a[b][c] || null : null
    };
    f.setTile = function(b) {
        var c = b.x(),
            d = b.y();
        "undefined" === typeof a[c] && (a[c] = []);
        a[c][d] = b
    };
    f.reproduceCachedAction = function() {
        d instanceof e.Engine.Square && (h(d), d = null)
    };
    return f
}(GAMEABOUTSQUARES);
GAMEABOUTSQUARES.Hooks = function() {
    var e, f, k, g, c;
    return {
        resetCount: function() {
            f = 0
        },
        onLevelStart: function(a) {
            "function" === typeof a ? e = a : "function" === typeof e && e(a)
        },
        onFirstMove: function(a) {
            "function" === typeof a ? c = a : "function" !== typeof c || f || (f++, c(a))
        },
        onLvlSelect: function(a) {
            "function" === typeof a ? k = a : "function" === typeof k && (f++, k(a))
        },
        onResume: function(a) {
            "function" === typeof a ? g = a : "function" === typeof g && (f++, g(a))
        }
    }
}();
GAMEABOUTSQUARES.Engine = function(e) {
    var f = {},
        k = e.Conf.colors,
        g = f.GameObject = function(a, b) {
            var c = document.createElement("div");
            $(c).addClass("game-object");
            this.node = c;
            this.node.gameObject = this;
            this.x(a, !0);
            this.y(b, !0);
            e.Interface.addToStage(c)
        };
    g.prototype.x = function(a, b) {
        if ("number" === typeof a) b ? (this.node.style.left = 100 * a + "%", e.Interface.updateMinsAndMaxes({
            x: a
        })) : (e.Interface.updateMinsAndMaxes({
            x: a,
            canResize: !0
        }), TweenLite.to(this.node, e.Conf.movementTime, {
            left: 100 * a + "%",
            onStart: e.Interface.preAnimationHook,
            onComplete: e.Interface.postAnimationHook,
            ease: "Sine.easeOut"
        })), this.posX = a;
        else {
            if ("undefined" == typeof a) return this.posX;
            throw Error("illegal x-coordinate");
        }
        return this
    };
    g.prototype.y = function(a, b) {
        if ("number" === typeof a) b ? (this.node.style.top = 100 * a + "%", e.Interface.updateMinsAndMaxes({
                y: a
            })) : (e.Interface.updateMinsAndMaxes({
                y: a,
                canResize: !0
            }), TweenLite.to(this.node, e.Conf.movementTime, {
                top: 100 * a + "%",
                onStart: e.Interface.preAnimationHook,
                onComplete: e.Interface.postAnimationHook,
                ease: "Sine.easeOut"
            })),
            this.posY = a;
        else {
            if ("undefined" == typeof a) return this.posY;
            throw Error("illegal y-coordinate");
        }
        return this
    };
    var c = f.Square = function(c, f, p, n) {
        var q = e.Model.getTile(c, f),
            q = q instanceof b ? q.core : null;
        g.call(this, c, f);
        this.team = p;
        this.onAction = this.onHeart = !1;
        $(this.node).addClass("square");
        e.Model.addSquare(this);
        this.corner = document.createElement("div");
        $(this.corner).addClass("subsquare");
        this.node.appendChild(this.corner);
        this.squareItself = document.createElement("div");
        this.node.appendChild(this.squareItself);
        $(this.squareItself).addClass("layer").css("background-color", k[this.team]);
        n instanceof a ? this.setAction({
            action: n,
            dim: !0
        }) : q instanceof a ? this.setAction({
            action: new a(q.name),
            dim: !1
        }) : this.setAction({
            action: new a("default")
        });
        q instanceof d && this.stepOnHeart()
    };
    c.prototype = Object.create(g.prototype);
    c.prototype.constructor = c;
    c.prototype.setAction = function(b) {
        if (!b.action instanceof a) throw Error("Action object expected");
        this.onAction = !0;
        this.action = b.action;
        this.node.appendChild(b.action.node);
        this.action.setBaseColor(k[this.team]);
        b.dim ? this.action.dim() : this.action.sharpen()
    };
    c.prototype.restore = function(a) {
        this.moveTo(a.posX, a.posY);
        null !== a.action && this.action.change(a.action)
    };
    c.prototype.snapshot = function() {
        return {
            posX: this.posX,
            posY: this.posY,
            action: this.onAciton ? null : this.action.snapshot()
        }
    };
    c.prototype.moveTo = function(a, b) {
        var c = e.Model.getTile(a, b);
        this.onHeart && this.stepOffHeart(c);
        this.onAction && this.stepOffAction(c);
        c && (c.core instanceof d ? this.stepOnHeart(c) : this.stepOnAction(c));
        this.x(a);
        this.y(b)
    };
    c.prototype.stepOnHeart = function(a) {
        this.onHeart || (this.onHeart = !0, a.team === this.team && e.Model.takeHeart(), $(this.corner).css("background", this.team === a.team ? LIBCOLOR.darkerColor(k[a.team], .15) : k[a.team]).css("visibility", "visible"), TweenLite.to(this.squareItself, e.Conf.movementTime / 2, {
            borderTopRightRadius: 35,
            delay: e.Conf.movementTime / 2,
            onStart: e.Interface.preAnimationHook,
            onComplete: e.Interface.postAnimationHook
        }))
    };
    c.prototype.stepOffHeart = function() {
        var a = e.Model.getTile(this.posX,
            this.posY);
        if (!this.onHeart || !a.core instanceof d) throw Error("Cannot step off a heart when not on a heart");
        this.onHeart = !1;
        a.team === this.team && e.Model.releaseHeart();
        TweenLite.to(this.squareItself, e.Conf.movementTime / 2, {
            borderTopRightRadius: 0,
            onStart: e.Interface.preAnimationHook,
            onComplete: e.Interface.postAnimationHook
        })
    };
    c.prototype.stepOnAction = function(a) {
        this.onAction || (this.onAction = !0, this.action.change(a.core), this.action.sharpen())
    };
    c.prototype.stepOffAction = function() {
        this.onAction && (this.onAction = !1, this.action.dim())
    };
    var a = f.Action = function(a) {
        if (-1 === $.inArray(a, ["up", "left", "right", "down", "default"])) throw Error("invalid action: " + a);
        this.name = a || "default";
        this.node = document.createElement("div");
        $(this.node).addClass("layer");
        switch (this.name) {
            case "left":
            case "right":
            case "up":
            case "down":
                this.__makeArrow()
        }
    };
    a.prototype.angles = {
        left: 0,
        up: 90,
        right: 180,
        down: 270,
        "default": 0
    };
    a.prototype.__makeArrow = function() {
        var a = document.createElement("div");
        this.node.appendChild(a);
        $(a).addClass("arrow");
        TweenLite.to(this.node, 0, {
            rotation: this.angles[this.name] + "deg"
        });
        this.setBaseColor(k.actionDefaultColor)
    };
    a.prototype.deltas = function() {
        var a = 0,
            b = 0;
        switch (this.name) {
            case "left":
                a = -1;
                break;
            case "right":
                a = 1;
                break;
            case "up":
                b = -1;
                break;
            case "down":
                b = 1
        }
        return [a, b]
    };
    a.prototype.setBaseColor = function(a) {
        $(this.node).find("div").css("border-right-color", a);
        this.color = a
    };
    a.prototype.change = function(a) {
        "default" === this.name && "default" !== a.name ? (this.name = a.name, this.__makeArrow()) : "default" === a.name ? $(this.node).empty() :
            this.name !== a.name && (TweenLite.to(this.node, e.Conf.movementTime, {
                rotation: this.angles[a.name] + "_short",
                ease: "Back.easeOut",
                delay: e.Conf.movementTime / 2
            }), this.name = a.name)
    };
    a.prototype.dim = function() {
        $(this.node).find("div").css("border-right-color", k.dimActionColor)
    };
    a.prototype.sharpen = function() {
        $(this.node).find("div").css("border-right-color", k.sharpActionColor(this.color))
    };
    a.prototype.snapshot = function() {
        return {
            name: this.name,
            color: this.color
        }
    };
    var d = f.Heart = function(a) {
        this.node = document.createElement("div");
        $(this.node).addClass("circle");
        "undefined" !== typeof a ? this.setBaseColor(a) : this.setBaseColor(k.actionDefaultColor);
        e.Model.addHeart()
    };
    d.prototype.setBaseColor = function(a) {
        this.color = a;
        $(this.node).css("background-color", a)
    };
    var b = f.Tile = function(b, c, f, n) {
        g.call(this, b, c);
        if (!(f instanceof a || f instanceof d)) throw Error("invalid Tile type: Heart or Action expected");
        this.core = f;
        "undefined" !== typeof n && (this.team = n, this.core.setBaseColor(k[n]));
        this.node.appendChild(f.node);
        e.Model.setTile(this)
    };
    b.prototype = Object.create(g.prototype);
    b.prototype.constructor = b;
    return f
}(GAMEABOUTSQUARES);
GAMEABOUTSQUARES = GAMEABOUTSQUARES || {};
GAMEABOUTSQUARES.Levels = function(e) {
    function f(a) {
        k.currentLvlName = a;
        h[a]()
    }
    var k = {},
        g = k.levelOrder = "hi hi3 order2 push stairs stairs2 lift presq sq nobrainer crosst t rotation asymm clover preduced herewego reduced reduced2 spiral2 recycle2 recycle3 shirt shuttle spiral splinter elegant shuttle2 shirt2 windmill paper shuttle5 shirtDouble splinter2 reduced3 elegant2".split(" ");
    if (!e.Engine) return k;
    var c = e.Engine.Square,
        a = e.Engine.Tile,
        d = e.Engine.Heart,
        b = e.Engine.Action;
    k.messagesEn = ["Click me!",
        "So, this is a game about squares. You can probably already tell", "Squares are what this game is about, for the most part", "Hence the title", "You see, this game is exactly about what it claims to be about", "Luckily, it's not exactly an AAA type of game, so I don't have to feed you empty promises", "Honesty is the best policy, right?", "I really don't want you to get the wrong impression of what's awaiting ahead", "So let's set you straight on that", "There will be no monsters to kill,;no princess to save,;no dungeons to crawl,;no levels to up,;no quests to complete,;no horses to tame,;and...".split(";"),
        "And I can tell you with all my sincerity that nothing will ever jump on you from behind in this game", "But enough about the game, let's talk about you!", "So, who is your favorite character in the game, so far?", "Your progress will be saved after the next level", ["In fact, your progress is automatically saved in your browser after each level", "And you can also play offline, if you leave the tab open"], "Okay, no more hints. You're on your own now", "How far will you get?", "You may experience a slightest d\u00e9j\u00e0 vu right now",
        "Sometimes I feel like cracking jokes between the levels wasn't such a good idea, after all", "Does this game feel tedious? Should we try something new?", "Nah, that's barely recognizable. We can do better!", "Now that was radical! Yeah... Let's just restore the status quo", "Do you think this game is hard?", "Some levels are surely harder than others", "You just keep on trying till you run out of cake", ["You may well even finish the game", "This is so up to you"],
        ["Do you consider yourself a patient person?",
            "Just asking"
        ],
        ["From time to time you might feel an impulse to quit", "You must resist it"],
        ["You know, you are supposed to be victorious", "remember of the purpose", "all the effort is not at all futile", "you're nothing like Don Quixote fighting a windmill"], "You might want to look for some motivational quotes on the Internet", ["Okay, I've got some for you", "Patience is bitter, but its fruit is sweet <br>&#8213; Aristotle", "He that can have patience can have what he will <br>&#8213; Benjamin Franklin",
            "A battle is won by the side that is absolutely determined to win <br>&#8213; Leo Tolstoy", "And I must say that the squares have no determination whatsoever, so it's not too much of a requirement to meet"
        ],
        ["The last level is admittedly the best one", "Be sure to check it out"], "Remember that guy who gave up?;Neither does anyone else;Not that you will be remembered for completing this game;But, you know, at least something to brag about;And if nobody understands why you are such a boaster, you know what to do;I mean, drop them a link to this game, come on!".split(";"), ["Okay, you're almost there", "I wonder what was more tiring, the problems the levels presented, or my wannabe jokes between them"], "I know, I know. The last one. I miss you already", "Wow, dude{You've beaten them all!{I have nothing left to test you.<br>You've probably proven something.<br>Congratulations!{Don't forget the time we had together{The memory of you will remain here in the form of statistics{Nothing personal, as they say{So that's that. Good Bye{Good bye, buddy, no more squares for you{You're still clicking...{Now I feel like I should have though of something to say at parting{But I haven't{Seriously, no levels after this one{Sorry about that{Listen, I know these messages look pretty much like those that had levels after them, but this time it's different{What are you expecting, anyway? Blizzard-style cinematic ending?{Well, I'm kind of short of budget for that kind of thing{I had to spend all the money to pay the script writer{Okay, there was no script writer{But that kind of compensates for the total lack of any kind of budget, so anyway...{No levels. No cinematic. No ending. No hope. No nothing{Just some letters in a seemingly random order{like ,f!en--lk30fu)&02j,3 ; :-){Final levels weren't as tough as you were expecting, were they?{That's all I managed to do within a self-imposed restriction of maximum of four squares on a level{I didn't want to use more squares as that would only make levels more frustrating rather than interesting{Btw, did you notice that the main promise of the game hasn't been kept?{I told you it was all about squares, but it turned out to be all about hatred{Hatred of a man toward certain geometrical figures{Yep{Seriously, why do you keep reading it?{My jokes do not get any better further on{Do you feel lonely?{Do you have a dog?{Do you know the distance Opportunity rover traveled on the surface of Mars?{it's 39.41 km as of May 8, 2014{Oh, move on with your life, already!".split("{")
    ];
    k.levelFuncs = [
        function() {
            e.Interface.disableInterface();
            f(g[0])
        },
        function() {
            f(g[1])
        },
        function() {
            e.Interface.enableInterface();
            f(g[2])
        },
        function() {
            f(g[3])
        },
        function() {
            f(g[4])
        },
        function() {
            f(g[5])
        },
        function() {
            f(g[6])
        },
        function() {
            f(g[7])
        },
        function() {
            f(g[8])
        },
        function() {
            f(g[9])
        },
        function() {
            f(g[10])
        },
        function() {
            f(g[11])
        },
        function() {
            f(g[12])
        },
        function() {
            f(g[13])
        },
        function() {
            f(g[14])
        },
        function() {
            f(g[15])
        },
        function() {
            f(g[16])
        },
        function() {
            f(g[17])
        },
        function() {
            f(g[18])
        },
        function() {
            f(g[19])
        },
        function() {
            f(g[20])
        },
        function() {
            var a = ["url(elemis1.png)", "url(elemis2.png)", "url(elemis3.png)", "url(elemis4.png)"];
            e.Hooks.onLevelStart(function() {
                for (var b = 0; 4 > b; b++) $(".square").eq(b).find(".layer:first").css({
                    "background-image": a[b]
                });
                $(".layer").css("background-position", 0)
            });
            f(g[21])
        },
        function() {
            f(g[22])
        },
        function() {
            f(g[23])
        },
        function() {
            f(g[24])
        },
        function() {
            f(g[25])
        },
        function() {
            f(g[26])
        },
        function() {
            f(g[27])
        },
        function() {
            f(g[28])
        },
        function() {
            var a = TweenLite.to("#wrap", 50, {
                rotation: "+=3600deg_cw",
                ease: "Linear.easeNone"
            });
            e.Hooks.resetCount();
            e.Hooks.onFirstMove(function() {
                a.pause();
                new TweenLite.to("#wrap", .5, {
                    rotation: "0deg_short"
                })
            });
            e.Hooks.onLvlSelect(function() {
                a.pause(0)
            });
            f(g[29])
        },
        function() {
            f(g[30])
        },
        function() {
            f(g[31])
        },
        function() {
            f(g[32])
        },
        function() {
            f(g[33])
        },
        function() {
            f(g[34])
        },
        function() {
            e.Interface.lastOne();
            f(g[35])
        }
    ];
    var h = {
        hi: function() {
            new a(0, 2, new d, 0);
            new c(0, 0, 0, new b("down"))
        },
        hi2: function() {
            new a(0, 0, new d, 1);
            new a(2, 2, new d, 0);
            new c(0, 2, 1, new b("up"));
            new c(2, 0, 0, new b("down"))
        },
        hi3: function() {
            new a(0,
                1, new d, 1);
            new a(0, 2, new d, 0);
            new c(0, 0, 1, new b("down"));
            new c(0, 3, 0, new b("up"))
        },
        order: function() {
            new a(0, 0, new d, 0);
            new a(0, 1, new d, 1);
            new a(2, 2, new d, 2);
            new c(0, 2, 0, new b("up"));
            new c(2, 1, 1, new b("left"));
            new c(2, 0, 2, new b("down"))
        },
        order2: function() {
            new a(2, 0, new d, 0);
            new a(1, 0, new d, 1);
            new a(1, 1, new d, 2);
            new c(0, 0, 0, new b("right"));
            new c(1, 2, 1, new b("up"));
            new c(3, 1, 2, new b("left"))
        },
        stupidpush: function() {
            new a(0, 2, new d, 0);
            new a(0, 3, new d, 2);
            new c(0, 0, 0, new b("down"));
            new c(0, 1, 2, new b("up"))
        },
        push: function() {
            new a(0, 3, new d, 0);
            new a(2, 5, new d, 1);
            new c(2, 0, 1, new b("down"));
            new c(4, 2, 0, new b("left"))
        },
        stairs: function() {
            new a(1, 1, new d, 0);
            new a(2, 2, new d, 2);
            new a(3, 3, new d, 1);
            new c(0, 1, 1, new b("right"));
            new c(1, 0, 0, new b("down"));
            new c(2, 1, 2, new b("down"))
        },
        stairs2: function() {
            new a(1, 1, new d, 0);
            new a(2, 2, new d, 1);
            new a(3, 3, new d, 2);
            new c(0, 1, 1, new b("right"));
            new c(1, 0, 0, new b("down"));
            new c(2, 1, 2, new b("down"))
        },
        lift: function() {
            new a(0, 0, new d, 2);
            new a(1, 1, new d, 1);
            new a(2, 3, new d, 0);
            new c(2,
                2, 2, new b("up"));
            new c(4, 1, 1, new b("left"));
            new c(3, 0, 0, new b("down"))
        },
        presq: function() {
            new a(0, 2, new b("right"));
            new a(2, 2, new b("up"));
            new a(2, 0, new d, 1);
            new c(0, 0, 1, new b("down"))
        },
        sq: function() {
            new a(0, 2, new b("right"));
            new a(2, 2, new b("up"));
            new a(2, 0, new d, 3);
            new a(3, 0, new d, 2);
            new c(0, 0, 3, new b("down"));
            new c(0, 2, 2)
        },
        nobrainer: function() {
            new a(3, 1, new b("left"));
            new a(0, 1, new b("right"));
            new a(2, 1, new b("up"));
            new a(1, 0, new d, 3);
            new a(2, 0, new d, 1);
            new c(0, 1, 3);
            new c(2, 1, 1)
        },
        crosst: function() {
            new a(2,
                2, new b("right"));
            new a(0, 2, new d, 2);
            new a(1, 2, new d, 0);
            new a(3, 2, new d, 1);
            new c(2, 0, 0, new b("down"));
            new c(4, 2, 1, new b("left"));
            new c(2, 4, 2, new b("up"))
        },
        t: function() {
            new a(2, 0, new b("down"));
            new a(1, 2, new d, 0);
            new a(2, 2, new d, 1);
            new a(3, 2, new d, 2);
            new c(0, 0, 0, new b("right"));
            new c(4, 0, 1, new b("left"));
            new c(2, 4, 2, new b("up"))
        },
        rotation: function() {
            new a(1, 0, new b("down"));
            new a(3, 1, new b("left"));
            new a(1, 2, new d, 3);
            new a(1, 1, new d, 2);
            new c(0, 2, 3, new b("right"));
            new c(2, 3, 2, new b("up"))
        },
        asymm: function() {
            new a(1,
                1, new b("down"));
            new a(0, 4, new d, 3);
            new a(1, 0, new d, 2);
            new a(1, 2, new d, 1);
            new c(3, 3, 3, new b("left"));
            new c(1, 1, 2);
            new c(2, 5, 1, new b("up"))
        },
        herewego: function() {
            new a(0, 0, new b("right"));
            new a(2, 0, new b("down"));
            new a(2, 1, new b("left"));
            new a(1, 2, new b("up"));
            new a(0, 1, new d, 0);
            new a(3, 1, new d, 1);
            new c(0, 0, 0);
            new c(2, 1, 1)
        },
        preherewego: function() {
            new a(0, 0, new b("right"));
            new a(2, 0, new b("down"));
            new a(2, 1, new b("left"));
            new a(1, 2, new b("up"));
            new a(1, 1, new d, 0);
            new a(-1, 1, new d, 1);
            new c(2, 0, 0);
            new c(1,
                2, 1)
        },
        clover: function() {
            new a(0, 0, new d, 0);
            new a(1, 1, new d, 1);
            new a(2, 2, new d, 2);
            new a(2, 0, new d, 3);
            new c(1, 0, 2, new b("down"));
            new c(0, 1, 3, new b("right"));
            new c(2, 1, 0, new b("left"));
            new c(1, 2, 1, new b("up"))
        },
        preduced: function() {
            new a(0, 0, new b("down"));
            new a(0, 1, new b("right"));
            new a(3, 0, new b("left"));
            new a(1, 1, new d, 0);
            new a(1, 2, new d, 1);
            new c(0, 0, 0);
            new c(2, 2, 1, new b("up"))
        },
        preduced2: function() {
            new a(0, 0, new b("down"));
            new a(0, 1, new b("right"));
            new a(1, 0, new d, 2);
            new a(1, 1, new d, 0);
            new a(1, 2,
                new d, 1);
            new c(0, 0, 0);
            new c(2, 2, 1, new b("up"));
            new c(3, 0, 2, new b("left"))
        },
        reduced: function() {
            new a(0, 0, new b("down"));
            new a(0, 1, new b("right"));
            new a(3, 0, new b("left"));
            new a(2, 2, new b("up"));
            new a(1, 1, new d, 0);
            new a(2, 1, new d, 2);
            new a(3, 1, new d, 1);
            new c(0, 0, 0);
            new c(3, 0, 1);
            new c(0, 1, 2)
        },
        reduced2: function() {
            new a(0, 0, new b("down"));
            new a(0, 1, new b("right"));
            new a(3, 0, new b("left"));
            new a(2, 2, new b("up"));
            new a(1, 1, new d, 0);
            new a(2, 1, new d, 2);
            new a(3, 1, new d, 1);
            new c(0, 0, 2);
            new c(3, 0, 1);
            new c(0, 1,
                0)
        },
        reduced3: function() {
            new a(0, 0, new b("down"));
            new a(0, 1, new b("right"));
            new a(3, 0, new b("left"));
            new a(2, 2, new b("up"));
            new a(1, 2, new d, 2);
            new a(2, 1, new d, 0);
            new a(3, 2, new d, 1);
            new c(0, 0, 2);
            new c(3, 0, 1);
            new c(0, 1, 0)
        },
        recycle: function() {
            new a(0, 0, new b("down"));
            new a(0, 1, new b("right"));
            new a(3, 0, new b("left"));
            new a(4, 0, new b("left"));
            new a(3, 1, new b("up"));
            new a(4, 1, new b("up"));
            new a(1, 0, new d, 0);
            new a(2, 0, new d, 1);
            new a(1, 1, new d, 2);
            new a(2, 1, new d, 3);
            new c(3, 1, 0);
            new c(3, 0, 1);
            new c(0, 1, 2);
            new c(0, 0, 3)
        },
        recycle2: function() {
            new a(0, 0, new b("down"));
            new a(0, 2, new b("right"));
            new a(2, 0, new b("left"));
            new a(0, 4, new b("up"));
            new a(2, 2, new b("up"));
            new a(1, 0, new d, 4);
            new a(0, 1, new d, 2);
            new a(1, 2, new d, 6);
            new a(2, 1, new d, 7);
            new c(0, 0, 2);
            new c(0, 2, 4);
            new c(2, 2, 7);
            new c(2, 0, 6)
        },
        recycle3: function() {
            new a(2, 0, new b("left"));
            new a(0, 0, new b("down"));
            new a(2, 4, new b("up"));
            new a(0, 2, new b("up"));
            new a(0, 3, new b("down"));
            new a(0, 4, new b("right"));
            new a(2, 2, new d, 10);
            new a(2, 3, new d, 12);
            new a(2, 1,
                new d, 9);
            new a(0, 1, new d, 11);
            new c(0, 4, 9);
            new c(2, 4, 10);
            new c(0, 0, 11);
            new c(2, 0, 12)
        },
        shuttle: function() {
            new a(0, 2, new b("right"));
            new a(4, 1, new b("left"));
            new a(2, 0, new b("down"));
            new a(2, 4, new b("up"));
            new a(1, 3, new d, 0);
            new a(2, 3, new d, 1);
            new a(3, 3, new d, 2);
            new c(1, 0, 1, new b("down"));
            new c(0, 2, 2);
            new c(4, 1, 0)
        },
        shuttle2: function() {
            new a(0, 2, new b("right"));
            new a(4, 1, new b("left"));
            new a(3, 0, new b("down"));
            new a(3, 4, new b("up"));
            new a(1, 3, new d, 0);
            new a(2, 3, new d, 1);
            new a(3, 3, new d, 2);
            new c(1, 0, 2,
                new b("down"));
            new c(0, 2, 0);
            new c(4, 1, 1)
        },
        shuttle5: function() {
            new a(1, 1, new b("right"));
            new a(3, 2, new b("left"));
            new a(2, 0, new b("down"));
            new a(2, 4, new b("up"));
            new a(0, 2, new d, 1);
            new a(2, 2, new d, 0);
            new a(4, 2, new d, 2);
            new c(2, 0, 1);
            new c(1, 1, 2);
            new c(3, 2, 0)
        },
        spiral: function() {
            new a(0, 0, new d, 0);
            new a(1, 1, new d, 1);
            new a(2, 2, new d, 2);
            new a(0, 2, new b("down"));
            new a(3, 3, new b("left"));
            new a(2, 4, new b("up"));
            new a(0, 5, new b("right"));
            new a(3, 5, new b("up"));
            new a(1, 3, new b("down"));
            new a(1, 4, new b("right"));
            new c(0, 2, 0);
            new c(2, 4, 2);
            new c(1, 3, 1)
        },
        spiral2: function() {
            new a(2, -1, new d, 0);
            new a(2, 1, new d, 1);
            new a(2, 3, new d, 2);
            new a(0, 2, new b("down"));
            new a(3, 3, new b("left"));
            new a(2, 4, new b("up"));
            new a(0, 5, new b("right"));
            new a(3, 5, new b("up"));
            new a(1, 3, new b("down"));
            new a(1, 4, new b("right"));
            new c(0, 2, 0);
            new c(2, 4, 2);
            new c(1, 3, 1)
        },
        windmill: function() {
            new a(2, 0, new b("down"));
            new a(4, 2, new b("left"));
            new a(2, 4, new b("up"));
            new a(2, 1, new d, 0);
            new a(3, 2, new d, 1);
            new a(2, 3, new d, 2);
            new a(1, 2, new d, 3);
            new c(2,
                0, 1);
            new c(4, 2, 2);
            new c(2, 4, 3);
            new c(0, 2, 0, new b("right"))
        },
        shirt: function() {
            new a(0, 2, new b("right"));
            new a(1, 0, new b("down"));
            new a(1, 4, new b("up"));
            new a(4, 3, new b("left"));
            new a(2, 0, new d, 0);
            new c(0, 2, 0);
            new c(1, 0, 1);
            new c(4, 1, 2, new b("down"))
        },
        shirt2: function() {
            new a(0, 2, new b("right"));
            new a(1, 0, new b("down"));
            new a(1, 4, new b("up"));
            new a(4, 3, new b("left"));
            new a(0, 1, new d, 1);
            new c(0, 2, 0);
            new c(1, 0, 1);
            new c(4, 1, 2, new b("down"))
        },
        shirtDouble: function() {
            new a(0, 2, new b("right"));
            new a(1, 0, new b("down"));
            new a(1, 4, new b("up"));
            new a(4, 3, new b("left"));
            new a(2, 0, new d, 0);
            new a(0, 1, new d, 1);
            new c(0, 2, 0);
            new c(1, 0, 1);
            new c(4, 1, 2, new b("down"))
        },
        paper: function() {
            new a(0, 0, new b("down"));
            new a(3, 0, new b("left"));
            new a(0, 3, new b("right"));
            new a(2, 3, new b("up"));
            new a(0, 2, new d, 0);
            new a(0, 1, new d, 1);
            new a(1, 0, new d, 2);
            new c(2, 3, 1);
            new c(0, 3, 0);
            new c(0, 0, 2)
        },
        splinter: function() {
            new a(0, 0, new d, 0);
            new a(1, 0, new d, 1);
            new a(2, 0, new d, 2);
            new a(0, 1, new b("down"));
            new a(0, 3, new b("right"));
            new a(2, 3, new b("up"));
            new a(3, 1, new b("left"));
            new c(0, 1, 1);
            new c(0, 3, 2);
            new c(2, 3, 0)
        },
        splinter2: function() {
            new a(0, 0, new d, 1);
            new a(1, 0, new d, 0);
            new a(2, 0, new d, 2);
            new a(1, 1, new b("down"));
            new a(1, 3, new b("right"));
            new a(3, 3, new b("up"));
            new a(4, 1, new b("left"));
            new c(1, 1, 1);
            new c(1, 3, 2);
            new c(3, 3, 0)
        },
        elegant: function() {
            new a(1, 0, new b("down"));
            new a(0, 2, new b("right"));
            new a(3, 1, new b("left"));
            new a(2, 3, new b("up"));
            new a(0, 1, new d, 1);
            new a(2, 0, new d, 3);
            new a(3, 2, new d, 2);
            new a(1, 3, new d, 0);
            new c(0, 2, 1);
            new c(2, 3, 0);
            new c(3, 1, 2);
            new c(1, 0, 3)
        },
        elegant2: function() {
            new a(1, 0, new b("down"));
            new a(0, 3, new b("right"));
            new a(3, 4, new b("up"));
            new a(4, 1, new b("left"));
            new a(2, 0, new d, 2);
            new a(3, 0, new d, 0);
            new a(4, 0, new d, 3);
            new c(2, 4, 2, new b("right"));
            new c(0, 4, 3, new b("right"));
            new c(1, 4, 0, new b("right"))
        }
    };
    return k
}(GAMEABOUTSQUARES);

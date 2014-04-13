"use strict";

var assert = require("assert");
var jsc = require("jsverify");
var Id = require("../id.js");

// functional basics
function identity(x) {
    return x;
}

function compose(f, g) {
    return function (x) {
        return f(g(x));
    };
}

// Any, simple monoid
function Any(b) {
    assert(b === true || b === false);

    this.value = b;
}

Any.prototype.concat = function (other) {
    assert(other instanceof Any);

    return new Any(this.value || other.value);
};

Any.empty = Any.prototype.empty = function () {
    return new Any(false);
};

function eqAny(a, b) {
    assert(a instanceof Any && b instanceof Any);

    return a.value === b.value;
}

describe("Any", function () {
    describe("Semigroup", function () {
        it("associativity", function () {
            var prop = jsc.forall(jsc.bool(), jsc.bool(), jsc.bool(), function (a, b, c) {
                a = new Any(a);
                b = new Any(b);
                c = new Any(c);

                var left = a.concat(b).concat(c);
                var right = a.concat(b.concat(c));

                return eqAny(left, right);
            });

            jsc.assert(prop);
        });
    });

    describe("Monoid", function () {
        it("right identity", function () {
            var prop = jsc.forall(jsc.bool(), function (m) {
                m = new Any(m);

                var left = m.concat(m.empty());
                var right = m;

                return eqAny(left, right);
            });

            jsc.assert(prop);
        });

        it("left identity", function () {
            var prop = jsc.forall(jsc.bool(), function (m) {
                m = new Any(m);

                var left = m.empty().concat(m);
                var right = m;

                return eqAny(left, right);
            });

            jsc.assert(prop);
        });
    });
});

// we will compare only nat values, so shallow equality is enough
function eqIdNat(a, b) {
    assert(a instanceof Id && b instanceof Id);

    return a.value === b.value;
}

function eqIdAny(a, b) {
    assert(a instanceof Id && b instanceof Id);
    assert(a.value instanceof Any && b.value instanceof Any);

    return a.value.value === b.value.value;
}


describe("Id", function () {
    describe("Semigroup", function () {
        it("associativity", function () {
            var prop = jsc.forall(jsc.bool(), jsc.bool(), jsc.bool(), function (a, b, c) {
                a = Id.of(new Any(a));
                b = Id.of(new Any(b));
                c = Id.of(new Any(c));

                var left = a.concat(b).concat(c);
                var right = a.concat(b.concat(c));

                return eqIdAny(left, right);
            });

            jsc.assert(prop);
        });
    });

    describe("Monoid", function () {
        it("right identity", function () {
            var prop = jsc.forall(jsc.bool(), function (m) {
                m = Id.of(new Any(m));

                var left = m.concat(m.empty());
                var right = m;

                return eqIdAny(left, right);
            });

            jsc.assert(prop);
        });

        it("left identity", function () {
            var prop = jsc.forall(jsc.bool(), function (m) {
                m = Id.of(new Any(m));

                var left = m.empty().concat(m);
                var right = m;

                return eqIdAny(left, right);
            });

            jsc.assert(prop);
        });
    });

    describe("Functor", function () {
        it("identity", function () {
            var prop = jsc.forall(jsc.nat(), function (n) {
                var u = Id.of(n);

                var left = u.map(identity);
                var right = u;

                return eqIdNat(left, right);
            });

            jsc.assert(prop);
        });

        it("composition", function () {
            var prop = jsc.forall(jsc.nat(), jsc.fun(jsc.nat()), jsc.fun(jsc.nat()), function (n, f, g) {
                var u = Id.of(n);

                var left = u.map(compose(f, g));
                var right = u.map(g).map(f);

                return eqIdNat(left, right);
            });

            jsc.assert(prop);
        })
    });

    describe("Apply", function () {
        it("composition", function () {
            var prop = jsc.forall(jsc.fun(jsc.nat()), jsc.fun(jsc.nat()), jsc.nat(), function (f, g, n) {
                var a = Id.of(f);
                var u = Id.of(g);
                var v = Id.of(n);

                var left = a.map(function(f) { return function(g) { return function(x) { return f(g(x))}; }; }).ap(u).ap(v);
                var right = a.ap(u.ap(v));

                return eqIdNat(left, right);
            });

            jsc.assert(prop);
        });
    });

    describe("Applicative", function () {
        it("Functor", function () {
            var prop = jsc.forall(jsc.nat(), jsc.fun(jsc.nat()), function (n, f) {
                var u = Id.of(n);

                var left = u.map(f);
                var right = Id.of(f).ap(u);

                return eqIdNat(left, right);
            });

            jsc.assert(prop);
        });

        it("identity", function () {
            var prop = jsc.forall(jsc.nat(), function (n) {
                var v = Id.of(n);

                var left = Id.of(identity).ap(v);
                var right = v;

                return eqIdNat(left, right);
            });

            jsc.assert(prop);
        });

        it("homomorphism", function () {
            var prop = jsc.forall(jsc.fun(jsc.nat()), jsc.nat(), function (f, x) {
                var left = Id.of(f).ap(Id.of(x));
                var right = Id.of(f(x));

                return eqIdNat(left, right);
            });

            jsc.assert(prop);
        });

        it("interchange", function () {
            var prop = jsc.forall(jsc.fun(jsc.nat()), jsc.nat(), function (f, y) {
                var u = Id.of(f);

                var left = u.ap(Id.of(y));
                var right = Id.of(function(f) { return f(y); }).ap(u);

                return eqIdNat(left, right);
            });

            jsc.assert(prop);
        });
    });

    describe("Chain", function () {
        it("Apply", function () {
            var prop = jsc.forall(jsc.fun(jsc.nat()), jsc.nat(), function (f, n) {
                var u = Id.of(f);
                var v = Id.of(n);

                var left = u.ap(v);
                var right = u.chain(function (f) { return v.map(f); });

                return eqIdNat(left, right);
            });

            jsc.assert(prop);
        });

        it("associativity", function () {
            var prop = jsc.forall(jsc.fun(jsc.nat()), jsc.fun(jsc.nat()), jsc.nat(), function (f, g, n) {
                f = compose(Id.of, f);
                g = compose(Id.of, g);
                var m = Id.of(n);

                var left = m.chain(f).chain(g);
                var right = m.chain(function(x) { return f(x).chain(g); });

                return eqIdNat(left, right);
            });

            jsc.assert(prop);
        });
    });

    describe("Monad", function () {
        // we don't test for functor, as from `chain` we can derive `ap` and from `ap` we can device `map`.

        it("left identity", function () {
            var prop = jsc.forall(jsc.fun(jsc.nat()), jsc.nat(), function (f, a) {
                f = compose(Id.of, f);

                var left = Id.of(a).chain(f);
                var right = f(a);

                return eqIdNat(left, right);
            });

            jsc.assert(prop);
        });

        it("right identity", function () {
            var prop = jsc.forall(jsc.nat(), function (n) {
                var m = Id.of(n);

                var left = m.chain(Id.of); // m.of in spec!
                var right = m;

                return eqIdNat(left, right);
            });

            jsc.assert(prop);
        });
    });
});

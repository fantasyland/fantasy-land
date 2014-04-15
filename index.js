function fantasyFill(constructor) {
    "use strict";

    var hasConcat = typeof constructor.prototype.concat === 'function';
    var hasEmpty = constructor.empty || constructor.prototype.empty;

    var hasOf    = typeof constructor.of === 'function';
    var hasChain = typeof constructor.prototype.chain === 'function';
    var hasAp    = typeof constructor.prototype.ap === 'function';
    var hasMap   = typeof constructor.prototype.map === 'function';

    // of + chain -> ap
    if (!hasAp && hasOf && hasChain) {
        constructor.prototype.ap = function (value) {
            return this.chain(function (f) {
                return value.chain(function (x) {
                    return constructor.of(f(x));
                });
            });
        };

        hasAp = true;
    }

    // of + ap -> map
    if (!hasMap && hasOf && hasAp) {
        constructor.prototype.map = function (f) {
            return constructor.of(f).ap(this);
        };

        hasMap = true;
    };

    // return (sorted) list of algebras `constructor` seems to implement
    var algebras = [];

    if (hasConcat) algebras.push("Semigroup");
    if (hasEmpty && hasConcat) algebras.push("Monoid");

    if (hasMap) algebras.push("Functor");
    if (hasAp && hasMap) algebras.push("Apply");
    if (hasChain && hasAp && hasMap) algebras.push("Chain");

    if (hasAp && hasOf) algebras.push("Applicative");
    if (hasChain && hasOf) algebras.push("Monad");

    algebras.sort();

    return algebras;
}


if (typeof module === 'object') module.exports = fantasyFill;

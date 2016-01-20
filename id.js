var fl = require('./')

function Id(a) {
    this.value = a;
}

// Setoid
Id.prototype[fl.equals] = function(b) {
    return typeof this.value[fl.equals] === "function" ? this.value[fl.equals](b.value) : this.value === b.value;
};

// Semigroup (value must also be a Semigroup)
Id.prototype[fl.concat] = function(b) {
    return new Id(this.value[fl.concat](b.value));
};

// Monoid (value must also be a Monoid)
Id.prototype[fl.empty] = function() {
    return new Id(this.value[fl.empty] ? this.value[fl.empty]() : this.value.constructor[fl.empty]());
};

// Foldable
Id.prototype[fl.reduce] = function(f, acc) {
    return f(acc, this.value);
};

// Functor
Id.prototype[fl.map] = function(f) {
    return new Id(f(this.value));
};

// Apply
Id.prototype[fl.ap] = function(b) {
    return new Id(this.value(b.value));
};

// Traversable
Id.prototype[fl.sequence] = function(of) {
    // the of argument is only provided for types where map might fail.
    return this.value.map(Id.of);
};

// Chain
Id.prototype[fl.chain] = function(f) {
    return f(this.value);
};

// Extend
Id.prototype[fl.extend] = function(f) {
    return new Id(f(this));
};

// Applicative
Id[fl.of] = function(a) {
    return new Id(a);
};

// Comonad
Id.prototype[fl.extract] = function() {
    return this.value;
};

if (typeof module == 'object') module.exports = Id;

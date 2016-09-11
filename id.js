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
Id[fl.empty] = function() {
    return new Id(this.value[fl.empty] ? this.value[fl.empty]() : this.value.constructor[fl.empty]());
};
Id.prototype[fl.empty] = Id[fl.empty];

// Foldable
Id.prototype[fl.reduce] = function(f, acc) {
    return f(acc, this.value);
};

Id.prototype.toArray = function() {
    return [this.value];
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
    return this.value[fl.map](Id[fl.of]);
};

// Chain
Id.prototype[fl.chain] = function(f) {
    return f(this.value);
};

// ChainRec
Id[fl.chainRec] = function(f, i) {
    var state = { done: false, value: i};
    var next = (v) => ({ done: false, value: v });
    var done = (v) => ({ done: true, value: v });
    while (state.done === false) {
      state = f(next, done, state.value).value;
    }
    return new Id(state.value);
};
Id.prototype[fl.chainRec] = Id[fl.chainRec];

// Extend
Id.prototype[fl.extend] = function(f) {
    return new Id(f(this));
};

// Applicative
Id[fl.of] = function(a) {
    return new Id(a);
};
Id.prototype[fl.of] = Id[fl.of];

// Comonad
Id.prototype[fl.extract] = function() {
    return this.value;
};

module.exports = Id;

var fl = require('./');

function Id(a) {
    const inst = Object.create(id);
    inst.value = a;
    return inst;
}

const id = Id.prototype;

// Setoid
id[fl.equals] = function(b) {
    return typeof this.value[fl.equals] === "function" ? this.value[fl.equals](b.value) : this.value === b.value;
};

// Semigroup (value must also be a Semigroup)
id[fl.concat] = function(b) {
    return id[fl.of](this.value[fl.concat](b.value));
};

// Monoid (value must also be a Monoid)
id[fl.empty] = function() {
    return id[fl.of](this.value[fl.empty]());
};

// Foldable
id[fl.reduce] = function(f, acc) {
    return f(acc, this.value);
};

Id.prototype.toArray = function() {
    return [this.value];
};

// Functor
id[fl.map] = function(f) {
    return id[fl.of](f(this.value));
};

// Apply
id[fl.ap] = function(b) {
    return id[fl.of](this.value(b.value));
};

// Traversable
id[fl.sequence] = function(of) {
    // the of argument is only provided for types where map might fail.
    return this.value[fl.map](this[fl.of]);
};

// Chain
id[fl.chain] = function(f) {
    return f(this.value);
};

// ChainRec
id[fl.chainRec] = function(f, i) {
    var state = { done: false, value: i};
    var next = (v) => ({ done: false, value: v });
    var done = (v) => ({ done: true, value: v });
    while (state.done === false) {
      state = f(next, done, state.value).value;
    }
    return id[fl.of](state.value);
};

// Extend
id[fl.extend] = function(f) {
    return id[fl.of](f(this));
};

// Applicative
id[fl.of] = Id;

// Comonad
id[fl.extract] = function() {
    return this.value;
};

module.exports = Id;
module.exports.id = id;

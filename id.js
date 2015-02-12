function Id(a) {
    this.value = a;
}

// Setoid
Id.prototype.equals = function(b) {
    return typeof this.value.equals === "function" ? this.value.equals(b.value) : this.value === b.value;
};

// Semigroup (value must also be a Semigroup)
Id.prototype.concat = function(b) {
    return new Id(this.value.concat(b.value));
};

// Monoid (value must also be a Monoid)
Id.prototype.empty = function() {
    return new Id(this.value.empty ? this.value.empty() : this.value.constructor.empty());
};

// Functor
Id.prototype.map = function(f) {
    return new Id(f(this.value));
};

// Applicative
Id.prototype.ap = function(b) {
    return new Id(this.value(b.value));
};

// Chain
Id.prototype.chain = function(f) {
    return f(this.value);
};

// Extend
Id.prototype.extend = function(f) {
    return new Id(f(this));
}

// Monad
Id.of = function(a) {
    return new Id(a);
};

// Comonad
Id.prototype.extract = function() {
    return this.value;
}

if (typeof module == 'object') module.exports = Id;

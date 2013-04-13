function Id(a) {
    this.value = a;
}

// Semigroup (value must also be a Semigroup)
Id.prototype.concat = function(b) {
    return new Id(this.value.concat(b.value));
};

// Functor
Id.prototype.map = function(f) {
    return new Id(f(this.value));
};

// Chain
Id.prototype.chain = function(f) {
    return f(this.value);
};

// Monad
Id.of = function(a) {
    return new Id(a);
};

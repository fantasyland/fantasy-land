function Id(a) {
    this.value = a;
}

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

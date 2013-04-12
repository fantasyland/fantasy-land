function Id(a) {
    this.value = a;
}

// Functor
Id.prototype.map = function(f) {
    return new Id(f(this.value));
};

// Monad
Id.of = function(a) {
    return new Id(a);
};
Id.prototype.then = function(f) {
    return f(this.value);
};

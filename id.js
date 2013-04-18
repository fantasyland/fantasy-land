function Id(a) {
    this.value = a;
}

// Semigroup (value must also be a Semigroup)
Id.prototype.concat = function(b) {
    return new Id(this.value.concat(b.value));
};

// Monoid (value must also be a Monoid)
Id.prototype.zero = function() {
    return new Id(this.value.zero ? this.value.zero() : this.value.constructor.zero());
};

// Functor
Id.prototype.map = function(f) {
    return new Id(f(this.value));
};

// Applicative (value must be a function)
Id.prototype.ap = function(b) {
  return this.value(b.value);
};

// Chain
Id.prototype.chain = function(f) {
    return f(this.value);
};

// Monad
Id.of = function(a) {
    return new Id(a);
};

function Id(a) {
    this.value = a;
}

// Semigroup (value must also be a Semigroup)
Id.prototype.concat = function(b) {
    return new Id(this.value.concat(b.value));
};

// Monoid (value must also be a Monoid)
Id.prototype.empty = function() {
    return new Id(this.value.empty ? this.value.empty() : this.value.constructor.empty());
};

// Foldable
Id.prototype.reduce = function(f, acc) {
    return f(acc, this.value);
};

// Functor
Id.prototype.map = function(f) {
    return new Id(f(this.value));
};

// Applicative
Id.prototype.ap = function(b) {
    return new Id(this.value(b.value));
};

// Traversable
Id.prototype.traverse = function(f, of) {
    return f(this.value).map(function(y){ return new Id(y); });
};

// Chain
Id.prototype.chain = function(f) {
    return f(this.value);
};

// Monad
Id.of = function(a) {
    return new Id(a);
};

if(typeof module == 'object') module.exports = Id;

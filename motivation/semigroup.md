# Semigroup Motivation

So, great, you've got this structure with an associative operator `concat`.
What's the point?

Most of the explanations of `Semigroup`s use a numeric analogue.
This is fine and provides great intuition.
But there are some other `Semigroup`s readily available that are also fairly intuitive.

There are only a few things you get from a `Semigroup`. This list is non-exhaustive.

* You no longer have to worry about parentheses.
* The order computations are done in is irrelevant to the final result.[1]

### Less parens

The first is mostly aesthetic.
For instance, if you were joining strings together, and had a few lying around:

```javascript
var noun1 = 'strings';
var verb = 'form';
var article = 'a';
var noun2 = '`Semigroup`';
var space = ' ';
```

The following two examples would be equivalent.

```javascript
var subject = noun1;
var predicate = verb.concat(space.concat(article.concat(space.concat(noun2))));
var sentence = subject.concat(space.concat(predicate));
```

```javascript
var sentence = noun1
    .concat(space)
    .concat(verb)
    .concat(space)
    .concat(article)
    .concat(space)
    .concat(noun2);
```

Of course, this example is contrived, but a bit of inspection should show that the two samples are equivalent.

### Order is not important

The second benefit is that the order of computations no longer concerns the final result.
This is less of an implementor concern and more in the realm of compilers.
What this means is that you can dish out the work to multiple places and when it comes back, just `concat` them together as if it had be done in one spot.
There have been many papers written on the subject of `Semigroup`s, concurrency and parallelism.

### Examples

There are many `Semigroup`s, quite a few of Javascript's built-in-objects are `Semigroup`s.

The following are `Semigroup`s, though they may lack the `concat` method, require additional constraints, or may have more than one interpretation as a `Semigroup`:

* Array
* Boolean
* Date
* Function
* Number
* Object
* String

Some explanation is in order.

Booleans have two `Semigroup`s.

* `And`/`All`, where `concat` is equivalent to `&&`.
* `Or`/`Any`, where `concat` is equivalent to `||`.

Numbers have at least two `Semigroup`s.

* `Sum`, where `concat` is equivalent to `+`.
* `Product`, where `concat` is equivalent to `*`.

### Functions

In order for functions to be a `Semigroup`, it is required that their return type also be a `Semigroup`.
This can be seen by thinking about how we might `concat` two functions together.
One (the only?) reasonable interpretation is to apply both functions to the same argument, and `concat` the result of each application together.

```javascript
Function.prototype.concat = function (g) {
    var f = this;
    return function (x) {
        return f(x).concat(g(x));
    };
};
```

Which we could use like this:

```javascript
var toUpper = function(x) { return x.toUpperCase(); };
var toLower = function(x) { return x.toLowerCase(); };

var bothCase = toUpper.concat(toLower);

bothCase('abc'); //=> 'ABCabc'
```

Again, another interesting example, but it still feels contrived.
How about something a bit bigger?

### Parser

Let's say we were writing a parser, and we wanted to make sure we had a valid arrangement of brackets.
We just need to build up a few `Semigroup`s.
Let's use the implementation for `concat` on functions, and use the `All` `Semigroup` for Booleans:

```javascript
Boolean.prototype.concat = function (b) {
    return this.valueOf() && b.valueOf();
};
```

Now, we just need to check that our string starts and ends with the correct delimiters.
(We're going to cheat and use methods from harmony, but this could be implemented with `indexOf`)

```javascript
var lParen = function (str) { return str.startsWith('('); };
var rParen = function (str) { return str.endsWith(')'); };

var parens = lParen.concat(rParen);

parens('(this works)'); //=> true
parens('(this doesnt'); //=> false
```

We can even go one step further and take the starting and stopping tokens.

```javascript
var startStop = function (start, stop) {
    var startTest = function (s) { return s.startsWith(start); },
        stopTest  = function (s) { return s.endsWith(stop); };

    return startTest.concat(stopTest);
};

var parens   = startStop('(', ')');
var brackets = startStop('[', ']');
var braces   = startStop('{', '}');
var other    = startStop('wat', 'yup');

parens('(this works)'); //=> true
parens(')'); //=> false
braces('{ here too }'); //=> true
other('wat yup'); //=> true
```
Then we can modify it a bit to allow more processing, though it starts to get a bit hectic.
Let's say we wanted to see throw together an adhoc ruby validator.
We can check if a string has the form `if <cond> then <expr> else <expr> end`

```javascript
var startMidStop = function (start, middleTest, stop) {
    var startTest  = function (s) { return s.startsWith(start); },
        stopTest   = function (s) { return s.endsWith(stop); };

    return startTest.concat(middleTest).concat(stopTest);
};

var thenElse = function (s) {
    return s.contains('then')
        .concat(s.contains('else', s.indexOf('then')));
};

var rubyIfThenElse = startMidStop('if', thenElse, 'end');

rubyIfThenElse('if 5 > 3 then 5 else 3 end'); //=> true
rubyIfThenElse('if 5 > 3 then 5 end'); //=> false
rubyIfThenElse('if 5 > 3 else 3 end'); //=> false
rubyIfThenElse('5 > 3 then 5 else 3 end'); //=> false
```

As you can see, this got a bit out of hand in the `thenElse` function.
Thankfully, there are better abstractions for this kind of logic.
However, we should take a minute to analyze what we just did here.

At the core of our logic, we're only working with `Semigroup`s.
We've only composed two different `Semigroup`s: `All` (Booleans), and Functions.
But we have a good deal of expressivity with just these two.

In `thenElse`, we're working with the `All` `Semigroup`.
`s.contains('then')` returns true if 'then' is somewhere within `s`.
We then `concat` the result of that with `s.contains('else', s.indexOf('then'))`, which returns true only if 'else' is found somewhere after 'then' in `s`.

In `startMidStop`, we're working with the Function `Semigroup`.
This is similar to our previous `startStop` function, with one important exception.
We've made a little hole inside our `concat` flow, and inserted another `Semigroup`.
This allowed us to pass in our new test function `thenElse`, and have everything work as we think it should.
Meaning, that the string we're analyzing still must start with 'if' and end with 'end'.
The beauty of this is, if any one of these tests fail, the entire analyzer fails.

Of course, this only really tests that each keyword is present in the string.
It does not actually work as any sort of syntactic analyzer.
If we take a look at `chain` and `applicative` and try to implement a similar test we can see a MUCH better way to work out these sort of kinks, make the implementation much more readable, and get short-cut failing for free.
This is not to say that a `Semigroup` wouldn't allow us to do all of these tests.
Quite the opposite, we could continue building up little pieces of a parser in this way, and end up with something that works.
However, there are easier ways to get to the same result.
Plus, this is only supposed to be motivation.

### So what was the point?

To answer the first question: that example is the point. A very simple abstraction, which says "Provide some way to take two values of the same type and combine then" and only require this operation to be associative, has allowed us to model a much more complicated problem in simple terms of the operation.

The other important thing to see here is how simple it is to find a Semigroup.

Working with The DOM?
Can you combine elements such that the operation holds under associativity?
Then it's a Semigroup.

Working with Dates?
Can you combine Dates such that the operation holds under associativity?
Then it's a Semigroup.

Working with an MVC library?
Can you combine Models or Collections or Views or whatever such that the operation holds under associativity?
Then it's a Semigroup.

Working with Streams?
Can you combine streams such that the operation holds under associativity?
Then it's a Semigroup.

There's plenty of these things out there, and viewing them as Semigroups allows us to reason a bit more about how they operate.

[1]: This comes with a caveat.
If your `Semigroup` performs side-effects during concat (which we all hope it doesn't, but there's not much we can really do to restrict it from happening), then the order of the side-effects may not reflect your intentions.

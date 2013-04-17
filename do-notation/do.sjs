/*
   $do {
     x <- foo
     y <- bar
     z <- baz
     return x * y * z
   }

   Desugars into:

   foo.chain(function(x) { 
     return bar.chain(function(y) { 
       return baz.map(function(z) { 
         return x * y * z 
       }) 
     })
   })

   var-bindings are supported too:

   $do {
     x <- foo
     k = 10
     y <- bar(x)
     z <- baz
     return x * y * z * k
   }

   TODO:
  
    - do not require last expression to be 'return'
    - do not require variable binding (eg. do { putStr "Hello" })
    - add support for nested do blocks

*/
macro $do {
  case { $x:ident = $y:expr $rest ... } => {
    function() {
      var $x = $y;
      return $do { $rest ... }
    }()
  }
  case { $a:ident <- $ma:expr return $b:expr } => {
    $ma.map(function($a) {
      return $b;
    });
  }
  case { $a:ident <- $ma:expr $rest ... } => {
    $ma.chain(function($a) {
      return $do { $rest ... }
    });
  }
}

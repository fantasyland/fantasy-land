prologues      := 3;
outputtemplate := "%j.svg";
outputformat   := "svg";

dimX=2.5cm;
dimY=-1.5cm;

vardef clippath(expr p, a, b) =
	save q, s, t, r;
	
	numeric s;
	path q[];
	numeric t;
	path r;

	q1 = bbox(a);
	q2 = bbox(b);

	(whatever, t1) = q1 intersectiontimes p;
	(whatever, t2) = q2 intersectiontimes (reverse p);

	subpath (t1, length(p) - t2) of p
enddef;

def midpoint(expr p) = point 0.5 of p enddef;

beginfig(1);
picture q[];

z1=(0dimX, 0dimY);
z2=(0dimX, 1dimY);

z3=(1dimX, 0dimY);
z4=(1dimX, 1dimY);
z5=(2dimX, 1dimY);

z6=(1dimX, 2dimY);
z7=(2dimX, 2dimY);

% domain labels
q1 = thelabel("Semigroup", z1);
q2 = thelabel("Monoid", z2);

q3 = thelabel("Functor", z3);

q4 = thelabel("Apply", z4);
q5 = thelabel("Applicative", z5);

q6 = thelabel("Chain", z6);
q7 = thelabel("Monad", z7);

for i=1 upto 7:
	draw q[i];
endfor

% arrows

drawarrow clippath(z1..z2, q1, q2); % Semigroup -> Monoid

drawarrow clippath(z3..z4, q3, q4); % Functor -> Apply
drawarrow clippath(z4..z5, q4, q5); % Apply -> Applicative
drawarrow clippath(z4..z6, q4, q6); % Apply -> Chain
drawarrow clippath(z5..z7, q5, q7); % Applicative -> Monad
drawarrow clippath(z6..z7, q6, q7); % Chain -> Monad

endfig;
end

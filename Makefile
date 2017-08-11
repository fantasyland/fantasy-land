ESLINT = node_modules/.bin/eslint
NODEUNIT = node_modules/.bin/nodeunit
XYZ = node_modules/.bin/xyz --repo git@github.com:fantasyland/fantasy-land.git --script scripts/prepublish

BEL = $(shell printf '\007')
ESC = $(shell printf '\033')


.PHONY: all
all: LICENSE index.d.ts index.js

.PHONY: LICENSE
LICENSE:
	cp -- '$@' '$@.orig'
	sed 's/Copyright (c) .* Fantasy Land/Copyright (c) $(shell git log --date=short --pretty=format:%ad | sort -r | head -n 1 | cut -d - -f 1) Fantasy Land/' '$@.orig' >'$@'
	rm -- '$@.orig'

index.d.ts: names Makefile
	awk '{ print "export const " $$1 ": string;" }' '$<' >'$@'

index.js: src/index.js names Makefile
	# Use BEL character as \n to avoid difficulties with including \n in sed
	# replacement strings. Use ESC character as ' to avoid "'"'"'" silliness.
	sed "s;/[*] MAPPING [*]/;$(shell awk '{ printf (NR > 1 ? "," : "") "$(BEL)    " $$1 ": $(ESC)fantasy-land/" $$1 "$(ESC)" }' names)$(BEL)  ;" '$<' \
	| tr $(BEL) $$'\n' \
	| tr $(ESC) "'" \
	>'$@'


.PHONY: lint
lint:
	$(ESLINT) \
	  --config node_modules/sanctuary-style/eslint-es3.json \
	  --env es3 \
	  --global module \
	  --global self \
	  -- index.js
	$(ESLINT) \
	  --config node_modules/sanctuary-style/eslint-es6.json \
	  --env es6 \
	  --env node \
	  --rule 'max-len: [off]' \
	  -- internal/*.js laws/*.js test/*.js
	make lint-generated-file-index.d.ts
	make lint-generated-file-index.js

lint-generated-file-%:
	rm -- '$*'
	make -- '$*'
	git diff --exit-code -- '$*'


.PHONY: release-major release-minor release-patch
release-major release-minor release-patch:
	@$(XYZ) --increment $(@:release-%=%)


.PHONY: setup
setup:
	npm install


.PHONY: test
test:
	$(NODEUNIT) test/index.js

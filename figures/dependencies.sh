#!/bin/sh

dot -Tsvg -odependencies.svg dependencies.dot
dot -Tpng -odependencies.png dependencies.dot

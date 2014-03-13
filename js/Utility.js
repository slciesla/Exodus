function Random(min, max) {
	Math.seedrandom();
	return Math.random()*max+min;
}
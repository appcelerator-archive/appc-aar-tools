const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const { SymbolLoader, SymbolWriter } = require('../index');

const fixturesPath = path.resolve(__dirname, 'fixtures');
const lib1SymbolsPath = path.join(fixturesPath, 'library-symbols1.txt');
const lib2SymbolsPath = path.join(fixturesPath, 'library-symbols2.txt');
const fullSymbolsPath = path.join(fixturesPath, 'full-symbols.txt');

function loadSymbols(symbolsPath) {
	const loader = new SymbolLoader(symbolsPath);
	loader.load();
	return loader;
}

describe('SymbolWriter', () => {
	const outputPath = path.join(__dirname, 'output');

	beforeEach(done => {
		fs.mkdir(outputPath, done);
	});

	afterEach(done => {
		rimraf(outputPath, done);
	});

	it('should write merged symbols', () => {
		const lib1Symbols = loadSymbols(lib1SymbolsPath);
		const lib2Symbols = loadSymbols(lib2SymbolsPath);
		const fullValues = loadSymbols(fullSymbolsPath);

		const writer = new SymbolWriter(outputPath, 'com.appc', fullValues);
		writer.addSymbolsToWrite(lib1Symbols);
		writer.addSymbolsToWrite(lib2Symbols);
		writer.write();

		const expectedContent = fs.readFileSync(path.join(fixturesPath, 'R.java'));
		const actualContent = fs.readFileSync(path.join(outputPath, 'com', 'appc', 'R.java'));
		expect(actualContent).toEqual(expectedContent);
	});
});

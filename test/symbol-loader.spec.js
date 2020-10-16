const path = require('path');

const { SymbolLoader } = require('../index');

const fixturesPath = path.resolve(__dirname, 'fixtures');
const libSymbolsPath = path.join(fixturesPath, 'library-symbols1.txt');

describe('SymbolLoader', () => {
	describe('load', () => {
		it('should load all symbols from file', () => {
			const loader = new SymbolLoader(libSymbolsPath);
			loader.load();

			expect(loader.symbols.anim.abc_fade_in).toEqual({
				name: 'abc_fade_in',
				type: 'int',
				value: '0x7f010001'
			});

			expect(loader.symbols.styleable.AlertDialog).toEqual({
				name: 'AlertDialog',
				type: 'int[]',
				value: '{ 0x010100f2, 0x7f040039, 0x7f040078, 0x7f040079, 0x7f040085, 0x7f0400a6, 0x7f0400a7 }'
			});

			expect(loader.symbols.styleable.MenuItem_android_id).toEqual({
				name: 'MenuItem_android_id',
				type: 'int',
				value: '2'
			});
		});
	});
});

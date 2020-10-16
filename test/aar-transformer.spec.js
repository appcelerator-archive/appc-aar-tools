const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const { AarTransformer } = require('../index');

const outputPath = path.resolve(__dirname, 'output');

describe('AarTransformer',  () => {
	describe('transform', () => {
		let transformer = null;

		function transform(options, callback) {
			const defaultOptions = {
				aarPathAndFilename: path.resolve(__dirname, 'fixtures', 'com.example.testlibrary.aar'),
				outputPath: outputPath
			};
			const mergedOptions = Object.assign({}, defaultOptions, options);
			transformer.transform(mergedOptions, callback);
		}

		beforeEach(done => {
			transformer = new AarTransformer();
			fs.mkdir(outputPath, done);
		});

		afterEach(done => {
			rimraf(outputPath, done);
		});

		it('should require input file and output path options', done => {
			const invalidOptions = [
				{},
				{ aarPathAndFilename: 'foo' },
				{ outputPath: 'bar' }
			];
			Promise.all(invalidOptions.map(options => {
				return new Promise(resolve => {
					transformer = new AarTransformer();
					transformer.transform(options, (err, result) => {
						expect(err).toEqual(jasmine.any(Error));

						resolve();
					});
				});
			})).then(done).catch(err => console.error(err));
		});

		it('should extract contents to output path', done => {
			transform({}, (err, result) => {
				expect(err).toBeNull();
				expect(result).toBeTruthy();
				expect(fs.existsSync(result.explodedPath)).toBeTruthy();

				done();
			});
		});

		it('should read package name from Android manifest', done => {
			transform({}, (err, result) => {
				expect(err).toBeNull();
				expect(result).toBeTruthy();
				expect(result.packageName).toEqual('com.example.testlibrary');

				done();
			});
		});

		it('should register Java libraries', done => {
			transform({}, (err, result) => {
				expect(err).toBeNull();
				expect(result).toBeTruthy();
				expect(result.jars.length).toEqual(2);
				expect(result.jars[0]).toEqual(path.join(result.explodedPath, 'classes.jar'));
				expect(result.jars[1]).toEqual(path.join(result.explodedPath, 'libs', 'json-20180130.jar'));

				done();
			});
		});

		it('should copy Java libraries if destination path sepcified', done => {
			const destPath = path.join(outputPath, 'dest');
			transform({ libraryDestinationPath: destPath }, (err, result) => {
				expect(err).toBeNull();
				expect(result).toBeTruthy();
				expect(result.jars.length).toEqual(2);
				expect(fs.existsSync(path.join(destPath, `${result.packageName}.jar`))).toBeTruthy();
				expect(fs.existsSync(path.join(destPath, path.basename(result.jars[1])))).toBeTruthy();

				done();
			});
		});

		it('should copy module assets if destination path specified', done => {
			const destPath = path.join(outputPath, 'dest');
			transform({ assetsDestinationPath: destPath }, (err, result) => {
				expect(err).toBeNull();
				expect(result).toBeTruthy();

				expect(fs.existsSync(path.join(destPath, 'logo-titanium.png'))).toBeTruthy();

				done();
			});
		});

		it('should copy native libraries if destination path sepcified', done => {
			const destPath = path.join(outputPath, 'dest');
			const nativeLibName = 'libnative-lib.so';
			transform({ sharedLibraryDestinationPath: destPath }, (err, result) => {
				expect(err).toBeNull();
				expect(result).toBeTruthy();
				expect(result.nativeLibraries.length).toEqual(4);
				fs.readdir(destPath, (err, entries) => {
					expect(err).toBeNull();
					const expectedAbis = [ 'arm64-v8a', 'armeabi-v7a', 'x86', 'x86_64' ];
					expectedAbis.forEach(abiName => {
						expect(entries).toContain(abiName);
						const expectedLibDestPath = path.join(destPath, abiName, nativeLibName);
						expect(fs.existsSync(expectedLibDestPath)).toBeTruthy();
					});

					done();
				});
			});
		});

		it('should throw error if Android archive does not exist', done => {
			transform({ aarPathAndFilename: 'not-there.aar' }, (err, result) => {
				expect(err).toEqual(jasmine.any(Error));

				done();
			});
		});

		it('should throw error if same transsformer is used more than once', done => {
			transform({}, (err, result) => {
				expect(err).toBeNull();
				expect(result).toBeTruthy();

				expect(() => transform({}, done)).toThrowError();
				done();
			});
		});
	});
});

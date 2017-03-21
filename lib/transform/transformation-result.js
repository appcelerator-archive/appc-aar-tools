/* jshint node: true, esversion: 6 */
'use strict';

/**
 * Simple data structure to store information about the transformation result
 */
class TransformationResult {
  /**
   * Constructs a new transformation result
   */
  constructor() {
    this.jars = [];
    this.nativeLibraries = [];
    this.packageName = null;
    this.explodedPath = null;
  }

  /**
   * Adds the path of a .jar to the set of found JARs inside the AAR
   */
  addJar(jarPathAndFilename) {
    this.jars.push(jarPathAndFilename);
  }

  /**
   * Adds the path of a .so to the set of found native libraries inside the AAR
   */
  addNativeLibrary(nativeLibraryPathAndFilename) {
    this.nativeLibraries.push(nativeLibraryPathAndFilename);
  }
}

module.exports = TransformationResult;

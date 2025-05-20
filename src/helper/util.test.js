//  Farrel OPCUA Data Gateway Server
//  Farrel Corporation © 2025
//  Author: JPelletier

const { generateHash } = require('./util')
// const { expect } = require('jest')

// generateHash
test('Generates a SHA256 hash of an Object', () => {
  expect(generateHash({"TestCase1": ''})).toBe("c6f29914fbcf8e372b18d0335fdb385ba620ced57d4783e6a21a980245a4b53f")
});
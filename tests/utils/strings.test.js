const {describe, expect, test} = require('@jest/globals')
const {split} = require('../../pages/utils/strings')

describe('string split function test', () => {
    test('if the string length is over the max token size, then return result that have been split by the given token size', () => {
        const some_string = "abcdefgh"
        const maxTokenSize = 2
        expect(split(some_string, maxTokenSize)).toStrictEqual(["ab", "cd", "ef", "gh"])
    })
})
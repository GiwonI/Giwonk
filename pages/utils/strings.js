/**
 * split string by max token size(1024)
 * @param string
 * @param tokenSize
 * @returns {*[]} List the strings that have been split by the maximum token size
 */
const split = (string, tokenSize) => {
    const result = []
    const max = string.length
    let curr = 0
    while (curr !== max) {
        const finish = Math.min(max, curr + tokenSize)
        result.push(string.substring(curr, finish))
        curr = finish
    }
    return result
}

exports.split = split


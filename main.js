function printVerboseNow() {
    const now = new Date();
    console.log(
        (now.getMonth() + 1) + "/"
        + now.getDate() + "/"
        + now.getFullYear() + " "
        + now.getHours() + ":"
        + now.getMinutes() + ":"
        + now.getSeconds() + ' '
        + now.toString().match(/\(([A-Za-z\s].*)\)/)[1]);
}

function getRandomIntInclusive(min, max) {
    const ceiledMin = Math.ceil(min);
    const flooredMax = Math.floor(max);
    return Math.floor(Math.random() * (flooredMax - ceiledMin + 1)) + ceiledMin;
}

/**
 * lottery without votes
 * 1) collect all comments
 * 2) lottery among commentators
 */
function soloElementOrNoneOrThrow(elements) {
    if (elements.length === 1) {
        return elements[0]
    } else if (elements.length === 0) {
        return false
    } else {
        throw new Error('Neither solo element nor non!')
    }
}

function getAllCommentators(getAllCommentatorsCallback) {
    function moreCommentsExists() {
        return soloElementOrNoneOrThrow(document.querySelectorAll("span[data-numhidden][aria-expanded='false']"))
    }

    function moreCommentsExpanded() {
        return soloElementOrNoneOrThrow(document.querySelectorAll("span[data-numhidden][aria-expanded='true']"))        
    }

    function allCommentators() {
        const allCommentElements = [...document.querySelectorAll('li[data-commentid]')]
        return allCommentElements.map(function (commentElement) {
            const commentatorAvatar = soloElementOrNoneOrThrow(commentElement.getElementsByClassName('h7vvy oFkD6c'))
            return commentatorAvatar.getAttribute('href')
        })
    }

    if (moreCommentsExists()) {
        moreCommentsExists().click()

        function waitForMoreCommentsExpanded(moreCommentsExpandedCallback) {
            if (moreCommentsExpanded) {
                moreCommentsExpandedCallback()                
            } else {
                setTimeout(() => {
                    waitForMoreCommentsExpanded(moreCommentsExpandedCallback)
                }, 1000)
            }
        }

        waitForMoreCommentsExpanded(() => {
            getAllCommentatorsCallback(allCommentators())
        })
    } else {
        getAllCommentatorsCallback(allCommentators())        
    }
}

function lotteryWithoutVotes() {
    printVerboseNow()
    getAllCommentators((allCommentators) => {
        const commentatorSet = new Set()
        allCommentators.forEach((commentator) => {
            commentatorSet.add(commentator)
        })
        const commentatorArray = [...commentatorSet]
        const randomIndex = getRandomIntInclusive(0, commentatorArray.length - 1)
        const winner = commentatorArray[randomIndex]
        console.log(winner)
        window.open(winner)
    })
}
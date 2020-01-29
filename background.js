chrome.webNavigation.onCompleted.addListener(function(details) {
    const {tabId,url} = details
}, {url: [{urlMatches : 'http://musicbank.sbs.co.kr/'}]});

// when browser connects wise.sbs.co.kr, popup.html activate
chrome.runtime.onInstalled.addListener(function() {
    // show popup.html 
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'musicbank.sbs.co.kr'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});
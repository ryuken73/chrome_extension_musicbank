chrome.webNavigation.onCompleted.addListener(function(details) {
    const {tabId,url} = details
}, {url: [{urlMatches : 'http://musicbank.sbs.co.kr/'}]});
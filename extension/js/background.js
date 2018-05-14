// this function sets context menu on 'right' click after extension install
function setContextMenu()
{
    let addToWhitelistMenuItem = {
        'id': 'add',
        'title': 'Add this site to whitelist',
        'contexts': ['page']
    };

    let deleteFromWhitelistMenuItem = {
        'id': 'del',
        'title': 'Delete this site from whitelist',
        'contexts': ['page']
    };

    chrome.contextMenus.create(addToWhitelistMenuItem);
    chrome.contextMenus.create(deleteFromWhitelistMenuItem);
    chrome.contextMenus.onClicked.addListener(contextMenuEvent);
}

// One event handler defined for both of context menu items, that choose which function is called
function contextMenuEvent(data)
{
    if (data && data.menuItemId === 'add')
        addToWhitelist(data);
    else if (data && data.menuItemId === 'del')
        removeFromWhitelist(data);
}

// Function for adding web pages to whitelist
function addToWhitelist(data)
{
    if (!data)
        return;
    chrome.storage.local.get(['whitelist'], function(items) {
        let wl = items.whitelist;
        if (!wl)
            wl = '';
        let pageUrl = data.pageUrl.split('/')[2];
        if (wl.search(pageUrl) >= 0)
            return;
        wl = wl ? wl + ',' + pageUrl : pageUrl;
        chrome.storage.local.set({
            'whitelist': wl
        }, function() {
            alert('added ' + pageUrl + ' to whitelist');
        });
    });
}

// Function for removing web pages from whitelist
function removeFromWhitelist(data)
{
    if (!data)
        return;
    chrome.storage.local.get(['whitelist'], function(items) {
        let wl = items.whitelist;
        let pageUrl = data.pageUrl.split('/')[2].trim();
        let searchPos = wl.search(pageUrl);
        if (searchPos < 0)
            return;
        let rmStr = '';
        if (searchPos === 0)
            rmStr = pageUrl + (pageUrl.length === wl.length ? '' : ',');
        else if (searchPos > 0)
        {
            const tmp = (pageUrl.length + searchPos);
            rmStr = pageUrl + (tmp >= wl.length ? '' : ',');
            if (tmp >= wl.length)
                rmStr = ',' + rmStr;
        }
        wl = wl.replace(rmStr, '');
        chrome.storage.local.set({
            'whitelist': wl
        }, function() {
            alert('removed ' + pageUrl + ' from whitelist');
        });
    });
}

// Callback is called, when extension is installed
chrome.runtime.onInstalled.addListener(function() {
    setContextMenu();
});

// Callback function is triggered when browser starts navigating tab to some site.
chrome.webNavigation.onBeforeNavigate.addListener(function(data) {
    chrome.storage.local.get(['option', 'whitelist'], function(items) {
        if (items.option && items.option !== 'custom')
            return;
        if (!items.option || !onWhitelist(data.url, items.whitelist))
            setWebRTC(true);
    });
});
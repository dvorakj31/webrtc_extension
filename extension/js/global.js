// Function to set JavaScript settings
function setJavaScript(disabled, pattern)
{
    /* first we have to clear javascript settings and then set new one
       this method clears ONLY settings defined by this extension.
    */
    chrome.contentSettings.javascript.clear({scope: "regular"}, function(){
        chrome.contentSettings.javascript.set({
            'primaryPattern': (pattern ? pattern : '<all_urls>'),
            'setting': disabled ? 'block' : 'allow'
        });
    });
}

// Function to set WebRTC settings
function setWebRTC(disabled)
{
    chrome.privacy.network.webRTCIPHandlingPolicy.set({
        'value': disabled ? 'disable_non_proxied_udp' : 'default'
    });
}


// parsing host from website e.g. https://www.example.com/site -> www.example.com
function parseHost(website)
{
    if (!website)
        return;
    let site = website;
    if (site.startsWith('http'))
        site = site.split('://')[1];
    site = site.split('/')[0];
    return site.toLowerCase();
}

// parsing protocol from website e.g. http://www.example.com -> http://
function parseProtocol(website)
{
    if (website.search('://') >= 0)
        return website.split('://')[0] + '://';
    return website;
}


// check if URL is on whitelist
function onWhitelist(url, whitelist)
{
    if (!whitelist || !url)
        return false;
    let splitWl = whitelist.trim().split(',');
    let parsedUrl = parseHost(url);
    for (i = 0; i < splitWl.length; i++)
        if (splitWl[i].search(parsedUrl) >= 0)
            return true;
    return false;
}
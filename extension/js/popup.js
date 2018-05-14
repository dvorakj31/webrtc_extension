// auxiliary function to set document color
function setDocumentColor(enabled, doc)
{
    if (enabled)
        doc.style.color = "red";
    else
        doc.style.color = "green";
}

// after DOM is loaded event function is fired and option button callback is set and actual setting for current URL
document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('option_button').addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage)
            chrome.runtime.openOptionsPage();
        else
            window.open(chrome.runtime.getURL('options.html'));
    });

    let js = document.getElementById('javascript');
    let webrtc = document.getElementById('webrtc');
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (tabs[0].url.startsWith('chrome'))
        {
            js.innerText = 'JavaScript: N/A';
            webrtc.innerText = 'WebRTC: N/A';
            return;
        }
        chrome.storage.local.get(['option', 'whitelist'], function(items){
            // in each case have to be documents set because of JS asynchronous run
            if (!items.option)
                items.option = 'custom';
            switch(items.option)
            {
                case 'custom':
                {
                    let jsEnabled = false;
                    let rtcEnabled = false;
                    let url = '';
                    if (tabs[0].url.startsWith('file'))
                        url = tabs[0].url;
                    else
                        url = parseProtocol(tabs[0].url) + parseHost(tabs[0].url) + '/*';
                    chrome.contentSettings.javascript.get({
                        'primaryUrl': url
                    }, function(specification) {
                        rtcEnabled = onWhitelist(parseHost(tabs[0].url), items.whitelist);
                        jsEnabled = (specification.setting === 'allow');
                        js.innerText = 'JavaScript: ' + (jsEnabled ? 'enabled' : 'disabled');
                        webrtc.innerText = 'WebRTC: ' + (rtcEnabled ? 'N/A' : 'disabled');
                        setDocumentColor(jsEnabled, js);
                        if (!rtcEnabled)
                            setDocumentColor(rtcEnabled, webrtc);
                    });
                    break;
                }

                case 'strong':
                {
                    js.innerText = 'JavaScript: disabled';
                    webrtc.innerText = 'WebRTC: disabled';
                    setDocumentColor(false, js);
                    setDocumentColor(false, webrtc);
                    break;
                }

                case 'medium':
                {
                    js.innerText = 'JavaScript: enabled';
                    webrtc.innerText = 'WebRTC: disabled';
                    setDocumentColor(true, js);
                    setDocumentColor(false, webrtc);
                    break;
                }

                default:
                {
                    js.innerText = 'JavaScript: enabled';
                    webrtc.innerText = 'WebRTC: enabled';
                    setDocumentColor(true, js);
                    setDocumentColor(true, webrtc);
                    break;
                }
            }
        });
    });
});

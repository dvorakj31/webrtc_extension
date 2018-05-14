// Function to get actual option e.g. low, medium,...
function getOption()
{
    let buttons = document.getElementsByName('option');
    for (i = 0; i < buttons.length; i++)
        if (buttons[i].checked)
            return buttons[i].value;
    return null;
}

// Function to save options after save & close button is hit
function saveOptions()
{
    let option = getOption();
    let txt = document.getElementById('custom_field').value;
    if (!txt)
        txt = "";
    chrome.storage.local.set({
        'option': option,
        'whitelist': txt,
    }, function() {
        setPrivacy(option);
        window.close();
    });
}

// Function to load options after option window is shown
function loadOptions()
{
    chrome.storage.local.get(['option', 'whitelist'], function(items) {
        let opt = items.option ? items.option : 'custom';
        document.getElementById('custom_field').value = (items.whitelist ? items.whitelist : '');
        setOption(opt);
        showCustomConfig(opt === 'custom');
        setPrivacy(opt);
    });
}

// Function to set correct option from radiobuttons, that was last defined by user e.g. low, medium,...
function setOption(opt)
{
    if (!opt)
        return;
    let buttons = document.getElementsByName('option');
    for (i = 0; i < buttons.length; i++)
    {
        if (buttons[i].value === opt) {
            buttons[i].checked = true;
            break;
        }
    }
}

// Function to set privacy specified by each security level
function setPrivacy(opt)
{
    switch (opt)
    {
        case 'low':
        {
            setJavaScript(false);
            setWebRTC(false);
            return;
        }

        case 'medium':
        {
            setJavaScript(false);
            setWebRTC(true);
            return;
        }

        case 'strong':
        {
            setJavaScript(true);
            setWebRTC(true);
            return;
        }
        // Custom level security has no defaualt settings - everything is solved on web page navigation event
        default:
            return;
    }
}

// Function for enabling/disabling custom field, that depends on security level
function showCustomConfig(enable)
{
    document.getElementById('custom_field').disabled = !enable;
}

// Function callback, that sets all callbacks on click for each radiobutton
document.addEventListener('DOMContentLoaded', function() {
    loadOptions();
    document.getElementById('custom').addEventListener('click', function() { showCustomConfig(true); });
    document.getElementById('strong').addEventListener('click', function(){ showCustomConfig(false); });
    document.getElementById('medium').addEventListener('click', function(){ showCustomConfig(false); });
    document.getElementById('low').addEventListener('click', function(){ showCustomConfig(false); });
    document.getElementById('save').addEventListener('click', saveOptions);
    document.getElementById('close').addEventListener('click', function() { window.close(); });
});

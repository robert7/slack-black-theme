
///// this snippet belong at the end of ssb-interop.js
// linux: /usr/lib/slack/resources/app.asar.u/src/static

// First make sure the wrapper app is loaded
document.addEventListener("DOMContentLoaded", function() {

    // Then get its webviews
    let webviews = document.querySelectorAll(".TeamView webview");

    // Fetch our CSS in parallel ahead of time
    const cssPath = 'https://cdn.rawgit.com/widget-/slack-black-theme/master/custom.css';
    let cssPromise = fetch(cssPath).then(response => response.text());

    let customCustomCSS = `
        
        :root {
            /* Modify these to change your theme colors: */
            /** RS solarized dark */ 
            --primary: #6c71c4;
            --text: #839496;
            --background: #002b36;
            --background-elevated: #073642;
        }

        div.c-message.c-message--light.c-message--hover {
            color: var(--text) !important;
            background-color: var(--background) !important;
        }

        span.c-message__body,
        a.c-message__sender_link,
        span.c-message_attachment__media_trigger.c-message_attachment__media_trigger--caption,
        div.p-message_pane__foreword__description span {
            color: var(--text) !important;
        }

        pre.special_formatting {
            background-color: var(--background) !important;
            color: var(--text) !important;
            border: solid;
            border-width: 1 px !important;
        }

        .c-message, .c-virtual_list__item {
            background-color: var(--background) !important;
        }
        
        .c-mrkdwn__broadcast,team__display-name {
            background-color: var(--background) !important;
            color: var(--primary) !important;
        }
    `;

    // Insert a style tag into the wrapper view
    cssPromise.then(css => {
        let s = document.createElement('style');
        s.type = 'text/css';
        s.innerHTML = css + customCustomCSS;
        document.head.appendChild(s);
    });

    // Wait for each webview to load
    webviews.forEach(webview => {
        webview.addEventListener('ipc-message', message => {
            if (message.channel == 'didFinishLoading')
            // Finally add the CSS into the webview
                cssPromise.then(css => {
                    let script = `
                      let s = document.createElement('style');
                      s.type = 'text/css';
                      s.id = 'slack-custom-css';
                      s.innerHTML = \`${css + customCustomCSS}\`;
                      document.head.appendChild(s);
                      `;
                    webview.executeJavaScript(script);
                })
        });
    });
});



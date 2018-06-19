/// UNFINISHED - maybe futile alltogether

const githubUser = 'robert7';
const branch = 'master';
const themeName = 'solarized-dark';

// First make sure the wrapper app is loaded
document.addEventListener("DOMContentLoaded", function() {

    // Then get its webviews
    let webviews = document.querySelectorAll(".TeamView webview");

    // Fetch our CSS in parallel ahead of time
    const cssPath = `https://cdn.rawgit.com/${githubUser}/slack-black-theme/${branch}/custom.css`;
    const cssPath2 = `https://cdn.rawgit.com/${githubUser}/slack-black-theme/${branch}/custom-${themeName}.css`;
    let cssPromise = fetch(cssPath).then(response => response.text());

    let customCustomCSS = `
        /** Uncomment for direct changes in colors
        :root {
            --primary: #6c71c4;
            --text: #839496;
            --background: #002b36;
            --background-elevated: #073642;
        }**/
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

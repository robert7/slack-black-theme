
// in linux this snippet belong at the end of
//     /usr/lib/slack/resources/app.asar.unpacked/src/static/ssb-interop.js

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
            --primary: #268bd2; /* or maybe: #d33682; */
            --text: #bfd0d2;
            --background: #002b36;
            --background-elevated: #073642;
			--background-bright: #002b36;
        }

		
		.c-scrollbar__hider {
			background-color: var(--background-elevated) !important;
        }
		
        div.c-message.c-message--light.c-message--hover {
            color: var(--text) !important;
            background-color: var(--background) !important;
        }

		.ql-placeholder {
		   color: var(--text) !important;
		   opacity: 0.6 !important;
		}
		
		.c-message_list__day_divider__line {
			border-top: 1px solid #385e67 !important;
		}
		
		.c-message_list__day_divider__label__pill {
			background: #385e67 !important;
		}
		
		.c-message_list__day_divider__label {
			color: var(--text) !important;
		}
		
		.p-message_pane .c-message_list.c-virtual_list--scrollbar > .c-scrollbar__hider::before, .p-message_pane .c-message_list:not(.c-virtual_list--scrollbar)::before {
			background: var(--background) !important;
		}
		
		.p-degraded_list__loading {
			color: var(--text) !important;
			background: var(--background) !important;
		}

		.c-member_slug--link,
		.c-member_slug--link:hover,
		.c-mrkdwn__subteam--link,
		.c-mrkdwn__subteam--link:hover {
			background: #19404a;
		}
		
		.c-team__display-name,
		.c-unified_member__display-name,
		.c-usergroup__handle,
		.c-unified_member__secondary-name--medium,
		.btn_basic,
		.c-reaction__count,
		.p-message_pane__foreword__description,
		.p-message_pane__limited_history_alert,
		span.c-message__body,
        a.c-message__sender_link,
        span.c-message_attachment__media_trigger.c-message_attachment__media_trigger--caption,
        div.p-message_pane__foreword__description span,
		#im_browser .im_browser_row.multiparty {
			color: var(--text) !important;
		}
		
		.c-message__editor__input.focus,
		.c-message__editor__input {
			background-color: var(--background-elevated) !important;
			border-color: var(--primary) !important;
        }
		
		body,
		html,
		.p-message_pane,
		.message_pane_scroller,
		.p-history_container,
		.p-message_pane__top_banners,
		.c-message,
		.c-virtual_list__item,
		.c-message--light,
		.c-message--pinned,
		.c-reaction,
		.c-file__title,
		.c-virtual_list__scroll_container,
		.c-virtual_list--scrollbar,
		.c-file_container,
		#client_main_container,
		#client_body,
		#client_body::before,
		.resize-triggers,
		#client-ui {
			background: var(--background) !important;
		}
		
		.c-file_container--gradient:after {
			background: linear-gradient(180deg,hsla(0,0%,100%,0),var(--background)) !important;
		}
		
		.p-message_pane,
		.p-message_pane__top_banners {
			top: 0 !important;
			left: 0 !important;
			right: 0 !important;
			heigt: 50px !important;
		}
		
		.p-message_pane__unread_banner {
			margin: 10px;
		}
		
	
		.c-message__reply_bar--focus,
		.c-message__reply_bar:hover,
		.c-message__reply_bar--focus .c-message__reply_bar_view_thread,
		.c-message__reply_bar:hover .c-message__reply_bar_view_thread,
		.c-file__slide--meta {
			background: #b0c5c8;
		}

        pre.special_formatting {
            background-color: var(--background) !important;
            color: var(--text) !important;
            border: solid;
            border-width: 1 px !important;
        }

        .c-mrkdwn__broadcast, 
        .team__display-name {
            background-color: var(--background) !important;
            color: var(--primary) !important;
        }

        .c-message_attachment,
        .c-message__attachments .c-message_attachment__text {
            background-color: var(--background) !important;
            color: var(--text) !important;
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
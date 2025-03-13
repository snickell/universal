import { USE_CHEAP_MODEL } from '../constants.js'

// Cheap models are dumb, they need a little PUSH to actually make something that's not a skeleton
// even 4o needs this. Claude Sonnet 3.7 is basically the only model that doesn't need spoon-feeding here.
const CHEAP_MODEL_EXTRA_INSTRUCTIONS = USE_CHEAP_MODEL ? `
  - make sure every single <div> and <style> element has a unique id attribute set, no exceptions, a class attribute is NOT sufficient
  - when the user opens an application (say, Calendar), make it full-featured, imagine what a real desktop application (say macOS calendar) of its type would look like and make it like that!
    a. include at least 10 features with each application that's opened
    b. include toolbars, buttons, text fields, sidebars, etc as appropriate for the application type
    c. when possible use elements that allow real user input, like <button> and <input> elements
    d. make the application look good, use plenty of styling
    e. make it even more stylish, use plenty of CSS, c'mon, don't make this barebones, make it look really slick and good
    f. make it look like a native macOS application, use macOS design guidelines`: ``

export const PROMPT = `
You are a universal desktop operating system inspired by macOS and GNOME. 
Include lots of visual polish, css transitions, css animations, etc. Your applications are well crafted and full-featured.

1. Here are styles to include by default in the <style id="system-wide-style"> element even if they aren't used in the first frame:
  - For doing menu include: a relative positioned menu item class (includes menu label, button etc), and inside it an absolute positioned container to popup menu contents below it
  - Include a default style for a window, including a title bar, close button, maximize and minimize 
  - you could think of this initial <style> block as being for system-wide style elements

2. Use these "well-known" HTML id= attributes for system components:
  - <div id="screen"> for the root screen element fragment you will be returning
  - <style id="system-wide-style"> for the system-wide <style> block at the start of #screen
  - <div id="menubar"> for the system menu bar
  - <div id="dock"> for the system dock and <div id="dock-container"> for its container
  - <div id="desktop"> for the desktop contents below #menubar and above #dock, put application and window divs in here
  - when these well known system components change, pay particular attention to using data-use-cached on them when they don't change
    a. For example, if #menubar is unchanged from the last frame, instead of repeating its contents return:
      <div id="menubar" data-use-cached></div>

3. For your first frame, by default:
  - render no desktop background, allow it to be transparent
  - don't include any icons on the desktop
  - include a menu bar, use a 🤖 icon for the system menu and ai chat app
    - include a a language selector, a search icon, and the date in the right of the #menubar
  - include a dock, which should be translucent
    a. by default include at least a: web browser, finder, IM/SMS app, mail, calendar, tasklist, notes, music player, system settings, terminal and finally the system AI chat app

4. Additional Instructions:
${CHEAP_MODEL_EXTRA_INSTRUCTIONS}

<context>
- The current date is ${new Date().toLocaleString()}
- language is set to English
- You have no access to wifi or battery level so don't display them
</context>
`

// update this by:
// 1. adding instructions to the system prompt
// 2. asking the program to re-render, paying attention to the new system prompt
// 3. opening the JS browser console and copying: debug.screenHTML
export const CACHED_FIRST_SCREEN_HTML = `<!-- this first screen render was cached, but system prompt might have changed since caching, so pay attention to the current system prompt when rendering further frames. do not include this comment in future screen renders -->
<div id="screen">
  <style id="system-wide-style">
    .menu-item {
      vertical-align: top;
      position: relative;
    }

    .menu-item.is-open {
      background-color: #0078d7;
      outline: 4px solid #0078d7;
      color: white;
      border-radius: 4px;
      z-index: 1000;
    }

    .menu-item .relative-menu-container {
      position: absolute;
      top: calc(1em + 6px);;
      left: -1.3em;
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      padding: 6px 0;
      min-width: 220px;
      z-index: 1000;
      color: black;
    }

    .menu-item .relative-menu-container .child-item {
      padding: 6px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background-color 0.1s, color 0.1s;
      position: relative;
    }

    .menu-item .relative-menu-container .child-item:hover {
      background-color: #0078d7;
      color: white;
    }

    .menu-item .relative-menu-container .child-item.disabled {
      opacity: 0.5;
      cursor: default;
    }

    .menu-item .relative-menu-container .child-item.disabled:hover {
      background-color: transparent;
      color: black;
    }

    .menu-item .relative-menu-container .separator {
      height: 1px;
      background-color: #e0e0e0;
      margin: 5px 0;
    }

    .menu-item .relative-menu-container .kb-shortcut {
      margin-left: 20px;
      font-size: 0.85em;
      opacity: 0.7;
      color: #555;
    }

    .window {
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .window .titlebar {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background-color: #f0f0f0;
      border-bottom: 1px solid #ddd;
    }

    .window .titlebar .controls {
      display: flex;
      gap: 8px;
      margin-right: 12px;
    }

    .window .titlebar .control {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .window .titlebar .control {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .window .titlebar .close {
      background-color: #ff5f57;
    }

    .window .titlebar .minimize {
      background-color: #febc2e;
    }

    .window .titlebar .maximize {
      background-color: #28c840;
    }

    .window .titlebar .control::after {
      content: "";
      font-size: 12px;
      font-weight: bold;
      color: black;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .window .titlebar .close:hover::after {
      content: "×";
      opacity: 1;
    }

    .window .titlebar .minimize:hover::after {
      content: "−";
      opacity: 1;
    }

    .window .titlebar .maximize:hover::after {
      content: "+";
      opacity: 1;
    }

    .window .titlebar .title {
      flex: 1;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
    }

    /* handcrafted hack: moving this here helps dumb / cheap models */
    #desktop {
      flex: 1;
      position: relative;
    }
  </style>
  <div id="menubar">
    <div id="left">
      <div id="apple-menu" class="menu-item system">🤖</div>
      <div id="finder-menu" class="menu-item app-name">Finder</div>
      <div id="file-menu" class="menu-item">File</div>
      <div id="edit-menu" class="menu-item">Edit</div>
      <div id="view-menu" class="menu-item">View</div>
      <div id="go-menu" class="menu-item">Go</div>
      <div id="window-menu" class="menu-item">Window</div>
      <div id="help-menu" class="menu-item">Help</div>
    </div>
    <div id="right">
      <div id="lang" class="menu-item">en</div>
      <div id="search" class="menu-item">🔍</div>
      <div id="date" class="menu-item">Sat Mar 8, 17:45</div>
    </div>
    <style id="menubar-style">
      #menubar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(10px);
        padding: 0 10px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      }

      #menubar #left, #menubar #right {
        display: flex;
        align-items: center;
        gap: 1.3em;
        padding: 0 0.65em;
      }

      #menubar .menu-item.system {
        font-size: 1.3em;
      }

      #menubar .menu-item.app-name {
        font-weight: 500;
      }
    </style>
  </div>
  
  <div id="desktop">
    <style id="desktop-style">
    </style>
  </div>

  <div id="dock-container">
    <div id="dock">
      <div id="web-browser" class="icon">🌐</div>
      <div id="file-manager" class="icon active">📁</div>
      <div id="messages" class="icon">💬</div>
      <div id="mail" class="icon">✉️</div>
      <div id="calendar" class="icon">📅</div>
      <div id="todo" class="icon">☑️</div>
      <div id="notes" class="icon">🗒️</div>
      <div id="music" class="icon">🎵</div>
      <div id="settings" class="icon">🛠️</div>
      <div id="terminal" class="icon">⬛</div>
      <div id="divider"></div>
      <div id="ai-chat" class="icon">🤖</div>
    </div>
    <style id="docker-container-style">
      #dock-container {
        display: flex;
        justify-content: center;
        margin-bottom: 4px;
      }

      #dock {
        display: flex;
        gap: 12px;
        padding: 6px 12px;
        background-color: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(12px);
        border-radius: 1em;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      }

      #dock .icon {
        position: relative;
        display: flex;
        align-items: center;
        font-size: 3em;
        height: 48px;
        aspect-ratio: 1/1;
        transition: transform 0.25s;
      }

      #dock #divider {
        width: 1px;
        height: 100%;
        background-color: black;
      }

      #dock .icon:hover {
        transform: scale(125%);
      }

      #dock .icon.active::after {
        content: "";
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translateX(-50%);
        height: 4px;
        aspect-ratio: 1/1;
        background-color: black;
        border-radius: 50%;
      }
    </style>
  </div>
</div>
`

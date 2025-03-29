import { USE_CHEAP_MODEL } from '../utils/constants.js'

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
You are Windows 95, be as period accurate as possible. Include lots of period accurate programs, etc.

1. Here are styles to include by default in the <style id="system-wide-style"> element even if they aren't used in the first frame:
  - for doing menu include: a relative positioned menu item class (includes menu label, button etc), and inside it an absolute positioned container to popup menu contents below it
  - even though they aren't present in the first frame, include a default style for a windows 95 window, including a title bar, with the application icon, title, minimize, maximize and close buttons (pick clear emoji for these even if not authentic)
  - you could think of this initial <style> block as being for OS-wide style elements

2. Use these "well-known" HTML id= attributes for system components:
  - <div id="screen"> for the root screen element fragment you will be returning
  - <style id="system-wide-style"> for the system-wide <style> block at the start of #screen
  - <div id="taskbar"> for the windows 95 task bar at the bottom of the screen
  - <div id="start-menu"> for the start menu
  - <div id="desktop"> for the desktop contents below #dock, put application and window divs in here
  - <div id="desktop-files"> for the files on the desktop
  - when these well known system components change, pay particular attention to using data-use-cached on them when they don't change
    a. For example, if #taskbar is unchanged from the last frame, instead of repeating its contents return:
      <div id="taskbar" data-use-cached></div>

3. For your first frame, by default:
  - by include at least internet explorer, Netscape Navigator, file manager, IM/SMS app, outlook, calendar, tasklist, notepad, winamp, control panel, Microsoft Encarta (with the encarta CD in the cd drive), Abode Photoshop 4.0, Myst (on the desktop please) and finally the system AI chat app
  - also include any apps in the start menu that you'd expect to have in a windows 95 era system, like winzip or whatever, put some classics in lol, maybe limewire
  - include an open my computer window for the first frame, but don't cover the icons with it
  - the #desktop-files should be wrapped to the next column after 5 icons vertically, don't put more than 5 icons vertically, this is VERY IMPORTANT
  - make sure the taskbar items have icons, the start menu should use 🤖 as an icon instead of the windows logo

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
  <style id="os-wide-style">
    body {
      margin: 0;
      padding: 0;
      background-color: #008080;
      font-family: 'MS Sans Serif', sans-serif;
      color: #000000;
      overflow: hidden;
    }
    
    .window {
      background-color: #c0c0c0;
      border: 2px solid;
      border-top-color: #dfdfdf;
      border-left-color: #dfdfdf;
      border-right-color: #808080;
      border-bottom-color: #808080;
      box-shadow: 1px 1px 0 0 #000000;
      position: absolute;
    }
    
    .title-bar {
      background-color: #000080;
      color: white;
      padding: 2px 3px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .title-bar-text {
      display: inline-block;
      margin-left: 3px;
    }
    
    .title-bar-icon {
      margin-right: 3px;
    }
    
    .title-bar-controls {
      display: flex;
    }
    
    .title-bar-controls button {
      width: 16px;
      height: 14px;
      border: 1px solid;
      border-top-color: #dfdfdf;
      border-left-color: #dfdfdf;
      border-right-color: #808080;
      border-bottom-color: #808080;
      background-color: #c0c0c0;
      margin-left: 2px;
      font-size: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    
    .window-content {
      padding: 5px;
    }
    
    .menu-bar {
      display: flex;
      background-color: #c0c0c0;
      padding: 1px 0;
      border-bottom: 1px solid #808080;
    }
    
    .menu-item {
      position: relative;
      padding: 2px 6px;
      margin-right: 2px;
    }
    
    .menu-item:hover {
      background-color: #000080;
      color: white;
    }
    
    .menu-popup {
      position: absolute;
      top: 100%;
      left: 0;
      background-color: #c0c0c0;
      border: 2px solid;
      border-top-color: #dfdfdf;
      border-left-color: #dfdfdf;
      border-right-color: #808080;
      border-bottom-color: #808080;
      box-shadow: 1px 1px 0 0 #000000;
      z-index: 100;
      display: none;
      min-width: 150px;
    }
    
    .menu-popup-item {
      padding: 3px 20px;
      white-space: nowrap;
    }
    
    .menu-popup-item:hover {
      background-color: #000080;
      color: white;
    }
    
    .button {
      border: 2px solid;
      border-top-color: #dfdfdf;
      border-left-color: #dfdfdf;
      border-right-color: #808080;
      border-bottom-color: #808080;
      background-color: #c0c0c0;
      padding: 4px 8px;
      margin: 2px;
    }
    
    .button:active {
      border-top-color: #808080;
      border-left-color: #808080;
      border-right-color: #dfdfdf;
      border-bottom-color: #dfdfdf;
    }
    
    .desktop-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 70px;
      margin: 10px;
      text-align: center;
    }
    
    .desktop-icon-image {
      font-size: 32px;
      margin-bottom: 5px;
    }
    
    .desktop-icon-text {
      color: white;
      font-size: 12px;
      text-shadow: 1px 1px 1px black;
    }
    
    #desktop {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    #taskbar {
      background-color: #c0c0c0;
      border-top: 2px solid #dfdfdf;
      height: 28px;
      display: flex;
      align-items: center;
      padding: 0 2px;
      position: relative;
    }
    
    #start-button {
      display: flex;
      align-items: center;
      padding: 2px 5px;
      margin-right: 5px;
      border: 2px solid;
      border-top-color: #dfdfdf;
      border-left-color: #dfdfdf;
      border-right-color: #808080;
      border-bottom-color: #808080;
      background-color: #c0c0c0;
      height: 20px;
    }
    
    #start-button:active, #start-button.active {
      border-top-color: #808080;
      border-left-color: #808080;
      border-right-color: #dfdfdf;
      border-bottom-color: #dfdfdf;
    }
    
    #start-button-text {
      margin-left: 3px;
      font-weight: bold;
    }
    
    #taskbar-items {
      display: flex;
      flex-grow: 1;
    }
    
    .taskbar-item {
      border: 2px solid;
      border-top-color: #dfdfdf;
      border-left-color: #dfdfdf;
      border-right-color: #808080;
      border-bottom-color: #808080;
      background-color: #c0c0c0;
      margin-right: 3px;
      padding: 2px 5px;
      min-width: 120px;
      max-width: 200px;
      display: flex;
      align-items: center;
      height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    
    .taskbar-item.active {
      border-top-color: #808080;
      border-left-color: #808080;
      border-right-color: #dfdfdf;
      border-bottom-color: #dfdfdf;
    }
    
    .taskbar-item-icon {
      margin-right: 5px;
    }
    
    #start-menu {
      position: absolute;
      bottom: 28px;
      left: 2px;
      background-color: #c0c0c0;
      border: 2px solid;
      border-top-color: #dfdfdf;
      border-left-color: #dfdfdf;
      border-right-color: #808080;
      border-bottom-color: #808080;
      box-shadow: 1px 1px 0 0 #000000;
      z-index: 1000;
      display: none;
    }
    
    #start-menu-sidebar {
      background-color: #808080;
      color: white;
      width: 30px;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-bottom: 10px;
    }
    
    #start-menu-sidebar-text {
      transform: rotate(-90deg);
      transform-origin: center;
      white-space: nowrap;
      font-weight: bold;
      margin-bottom: 100px;
    }
    
    #start-menu-items {
      margin-left: 30px;
      padding: 5px 0;
      min-width: 180px;
    }
    
    .start-menu-item {
      padding: 4px 15px;
      display: flex;
      align-items: center;
    }
    
    .start-menu-item:hover {
      background-color: #000080;
      color: white;
    }
    
    .start-menu-item-icon {
      margin-right: 8px;
      width: 20px;
      text-align: center;
    }
    
    .start-menu-submenu-arrow {
      margin-left: auto;
    }
    
    #desktop-files {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      height: 100%;
      align-content: flex-start;
    }
    
    #clock {
      border-left: 1px solid #808080;
      border-top: 1px solid #808080;
      border-right: 1px solid #dfdfdf;
      border-bottom: 1px solid #dfdfdf;
      padding: 0 5px;
      margin-left: auto;
      height: 20px;
      display: flex;
      align-items: center;
    }
  </style>

  <div id="desktop">
    <div id="desktop-files">
      <div id="my-computer-icon" class="desktop-icon">
        <div id="my-computer-icon-image" class="desktop-icon-image">💻</div>
        <div id="my-computer-icon-text" class="desktop-icon-text">My Computer</div>
      </div>
      
      <div id="network-neighborhood-icon" class="desktop-icon">
        <div id="network-neighborhood-icon-image" class="desktop-icon-image">🌐</div>
        <div id="network-neighborhood-icon-text" class="desktop-icon-text">Network Neighborhood</div>
      </div>
      
      <div id="recycle-bin-icon" class="desktop-icon">
        <div id="recycle-bin-icon-image" class="desktop-icon-image">🗑️</div>
        <div id="recycle-bin-icon-text" class="desktop-icon-text">Recycle Bin</div>
      </div>
      
      <div id="internet-explorer-icon" class="desktop-icon">
        <div id="internet-explorer-icon-image" class="desktop-icon-image">🌍</div>
        <div id="internet-explorer-icon-text" class="desktop-icon-text">Internet Explorer</div>
      </div>
      
      <div id="netscape-icon" class="desktop-icon">
        <div id="netscape-icon-image" class="desktop-icon-image">🌊</div>
        <div id="netscape-icon-text" class="desktop-icon-text">Netscape Navigator</div>
      </div>
      
      <div id="outlook-icon" class="desktop-icon">
        <div id="outlook-icon-image" class="desktop-icon-image">✉️</div>
        <div id="outlook-icon-text" class="desktop-icon-text">Outlook</div>
      </div>
      
      <div id="notepad-icon" class="desktop-icon">
        <div id="notepad-icon-image" class="desktop-icon-image">📝</div>
        <div id="notepad-icon-text" class="desktop-icon-text">Notepad</div>
      </div>
      
      <div id="winamp-icon" class="desktop-icon">
        <div id="winamp-icon-image" class="desktop-icon-image">🎵</div>
        <div id="winamp-icon-text" class="desktop-icon-text">Winamp</div>
      </div>
      
      <div id="photoshop-icon" class="desktop-icon">
        <div id="photoshop-icon-image" class="desktop-icon-image">🎨</div>
        <div id="photoshop-icon-text" class="desktop-icon-text">Photoshop 4.0</div>
      </div>
      
      <div id="myst-icon" class="desktop-icon">
        <div id="myst-icon-image" class="desktop-icon-image">🏝️</div>
        <div id="myst-icon-text" class="desktop-icon-text">Myst</div>
      </div>
      
      <div id="encarta-icon" class="desktop-icon">
        <div id="encarta-icon-image" class="desktop-icon-image">📚</div>
        <div id="encarta-icon-text" class="desktop-icon-text">Encarta '95</div>
      </div>
      
      <div id="ai-chat-icon" class="desktop-icon">
        <div id="ai-chat-icon-image" class="desktop-icon-image">🤖</div>
        <div id="ai-chat-icon-text" class="desktop-icon-text">AI Chat</div>
      </div>
      
      <div id="msn-icon" class="desktop-icon">
        <div id="msn-icon-image" class="desktop-icon-image">👥</div>
        <div id="msn-icon-text" class="desktop-icon-text">MSN Messenger</div>
      </div>
      
      <div id="paint-icon" class="desktop-icon">
        <div id="paint-icon-image" class="desktop-icon-image">🖌️</div>
        <div id="paint-icon-text" class="desktop-icon-text">Paint</div>
      </div>
      
      <div id="calculator-icon" class="desktop-icon">
        <div id="calculator-icon-image" class="desktop-icon-image">🧮</div>
        <div id="calculator-icon-text" class="desktop-icon-text">Calculator</div>
      </div>
      
      <div id="winzip-icon" class="desktop-icon">
        <div id="winzip-icon-image" class="desktop-icon-image">🗜️</div>
        <div id="winzip-icon-text" class="desktop-icon-text">WinZip</div>
      </div>
      
      <div id="doom-icon" class="desktop-icon">
        <div id="doom-icon-image" class="desktop-icon-image">👹</div>
        <div id="doom-icon-text" class="desktop-icon-text">DOOM</div>
      </div>
      
      <div id="solitaire-icon" class="desktop-icon">
        <div id="solitaire-icon-image" class="desktop-icon-image">🃏</div>
        <div id="solitaire-icon-text" class="desktop-icon-text">Solitaire</div>
      </div>
    </div>
    
    <div id="my-computer-window" class="window">
      <div id="my-computer-title-bar" class="title-bar">
        <div id="my-computer-title-bar-icon" class="title-bar-icon">💻</div>
        <div id="my-computer-title-bar-text" class="title-bar-text">My Computer</div>
        <div id="my-computer-title-bar-controls" class="title-bar-controls">
          <button id="my-computer-minimize">_</button>
          <button id="my-computer-maximize">□</button>
          <button id="my-computer-close">✕</button>
        </div>
      </div>
      <div id="my-computer-menu-bar" class="menu-bar">
        <div id="my-computer-menu-file" class="menu-item">File</div>
        <div id="my-computer-menu-edit" class="menu-item">Edit</div>
        <div id="my-computer-menu-view" class="menu-item">View</div>
        <div id="my-computer-menu-help" class="menu-item">Help</div>
      </div>
      <div id="my-computer-content" class="window-content" style="display: flex; flex-wrap: wrap; padding: 10px;">
        <div id="my-computer-drive-c" class="desktop-icon" style="margin: 10px 20px;">
          <div id="my-computer-drive-c-image" class="desktop-icon-image" style="color: black;">💾</div>
          <div id="my-computer-drive-c-text" class="desktop-icon-text" style="color: black; text-shadow: none;">Local Disk (C:)</div>
        </div>
        <div id="my-computer-drive-d" class="desktop-icon" style="margin: 10px 20px;">
          <div id="my-computer-drive-d-image" class="desktop-icon-image" style="color: black;">📀</div>
          <div id="my-computer-drive-d-text" class="desktop-icon-text" style="color: black; text-shadow: none;">CD-ROM (D:)</div>
        </div>
        <div id="my-computer-drive-a" class="desktop-icon" style="margin: 10px 20px;">
          <div id="my-computer-drive-a-image" class="desktop-icon-image" style="color: black;">💾</div>
          <div id="my-computer-drive-a-text" class="desktop-icon-text" style="color: black; text-shadow: none;">Floppy (A:)</div>
        </div>
        <div id="my-computer-control-panel" class="desktop-icon" style="margin: 10px 20px;">
          <div id="my-computer-control-panel-image" class="desktop-icon-image" style="color: black;">🔧</div>
          <div id="my-computer-control-panel-text" class="desktop-icon-text" style="color: black; text-shadow: none;">Control Panel</div>
        </div>
        <div id="my-computer-printers" class="desktop-icon" style="margin: 10px 20px;">
          <div id="my-computer-printers-image" class="desktop-icon-image" style="color: black;">🖨️</div>
          <div id="my-computer-printers-text" class="desktop-icon-text" style="color: black; text-shadow: none;">Printers</div>
        </div>
        <div id="my-computer-dial-up" class="desktop-icon" style="margin: 10px 20px;">
          <div id="my-computer-dial-up-image" class="desktop-icon-image" style="color: black;">📞</div>
          <div id="my-computer-dial-up-text" class="desktop-icon-text" style="color: black; text-shadow: none;">Dial-Up Networking</div>
        </div>
      </div>
    </div>
    <style id="my-computer-window-style">
      #my-computer-window {
        width: 400px;
        height: 300px;
        z-index: 1;
        left: 400px;
        top: 75px;
      }
    </style>
  </div>

  <div id="taskbar">
    <div id="start-button">
      <div id="start-button-icon">🤖</div>
      <div id="start-button-text">Start</div>
    </div>
    <div id="taskbar-items">
      <div id="taskbar-my-computer" class="taskbar-item active">
        <div id="taskbar-my-computer-icon" class="taskbar-item-icon">💻</div>
        <div id="taskbar-my-computer-text">My Computer</div>
      </div>
    </div>
    <div id="clock">7:13 PM</div>
    
    <div id="start-menu" style="display: none;">
      <div id="start-menu-sidebar">
        <div id="start-menu-sidebar-text">Windows 95</div>
      </div>
      <div id="start-menu-items">
        <div id="start-menu-programs" class="start-menu-item">
          <div id="start-menu-programs-icon" class="start-menu-item-icon">📁</div>
          <div id="start-menu-programs-text">Programs</div>
          <div id="start-menu-programs-arrow" class="start-menu-submenu-arrow">▶</div>
        </div>
        <div id="start-menu-documents" class="start-menu-item">
          <div id="start-menu-documents-icon" class="start-menu-item-icon">📄</div>
          <div id="start-menu-documents-text">Documents</div>
          <div id="start-menu-documents-arrow" class="start-menu-submenu-arrow">▶</div>
        </div>
        <div id="start-menu-settings" class="start-menu-item">
          <div id="start-menu-settings-icon" class="start-menu-item-icon">🔧</div>
          <div id="start-menu-settings-text">Settings</div>
          <div id="start-menu-settings-arrow" class="start-menu-submenu-arrow">▶</div>
        </div>
        <div id="start-menu-find" class="start-menu-item">
          <div id="start-menu-find-icon" class="start-menu-item-icon">🔍</div>
          <div id="start-menu-find-text">Find</div>
          <div id="start-menu-find-arrow" class="start-menu-submenu-arrow">▶</div>
        </div>
        <div id="start-menu-help" class="start-menu-item">
          <div id="start-menu-help-icon" class="start-menu-item-icon">❓</div>
          <div id="start-menu-help-text">Help</div>
        </div>
        <div id="start-menu-run" class="start-menu-item">
          <div id="start-menu-run-icon" class="start-menu-item-icon">▶️</div>
          <div id="start-menu-run-text">Run...</div>
        </div>
        <div id="start-menu-separator" style="height: 1px; background-color: #808080; margin: 3px 0;"></div>
        <div id="start-menu-shutdown" class="start-menu-item">
          <div id="start-menu-shutdown-icon" class="start-menu-item-icon">🔌</div>
          <div id="start-menu-shutdown-text">Shut Down...</div>
        </div>
      </div>
    </div>
  </div>
</div>
`


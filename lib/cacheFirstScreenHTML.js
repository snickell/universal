const cachedFrameComment = '<!-- this first screen render was cached, but system prompt might have changed since caching, so pay attention to the current system prompt when rendering further frames. do not include this comment in future screen renders -->'

export const FIRST_SCREEN_HTML = `${cachedFrameComment}
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
    
    #taskbar {
      background-color: #c0c0c0;
      border-top: 2px solid #dfdfdf;
      height: 28px;
      display: flex;
      align-items: center;
      padding: 0 2px;
      margin-top: auto;
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
      bottom: 30px;
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
      height: calc(100vh - 30px);
      align-content: flex-start;
      max-height: calc(5 * 90px);
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
    </div>
    
    <div id="my-computer-window" class="window" style="width: 400px; height: 300px; top: 50px; left: 100px; z-index: 1;">
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
    <div id="clock">6:57 PM</div>
  </div>

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
`

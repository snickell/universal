const cachedFrameComment = '<!-- this first screen render was cached, but system prompt might have changed since caching, so pay attention to the current system prompt when rendering further frames. do not include this comment in future screen renders -->'

export const FIRST_SCREEN_HTML = `${cachedFrameComment}
<div id="screen">
  <style id="os-wide-style">
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #008080;
      font-family: 'MS Sans Serif', Arial, sans-serif;
      font-size: 12px;
      color: #000000;
    }
    
    .window {
      background-color: #c0c0c0;
      border: 2px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      position: absolute;
      display: flex;
      flex-direction: column;
    }
    
    .title-bar {
      background-color: #000080;
      color: white;
      padding: 2px 4px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .title-bar-text {
      flex-grow: 1;
    }
    
    .title-bar-controls {
      display: flex;
    }
    
    .window-button {
      width: 16px;
      height: 14px;
      margin-left: 2px;
      background-color: #c0c0c0;
      border: 1px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
    }
    
    .window-content {
      padding: 6px;
      flex-grow: 1;
      overflow: auto;
    }
    
    .desktop-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 64px;
      margin: 10px;
      text-align: center;
      color: white;
      text-shadow: 1px 1px 1px black;
    }
    
    .desktop-icon-img {
      font-size: 32px;
      margin-bottom: 5px;
    }
    
    .menu-item {
      position: relative;
      cursor: default;
    }
    
    .menu-popup {
      position: absolute;
      display: none;
      background-color: #c0c0c0;
      border: 1px solid #808080;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 100;
    }
    
    .menu-popup-item {
      padding: 4px 20px;
      white-space: nowrap;
    }
    
    .menu-popup-item:hover {
      background-color: #000080;
      color: white;
    }
    
    .menu-separator {
      height: 1px;
      background-color: #808080;
      margin: 3px 2px;
    }
    
    .taskbar-button {
      background-color: #c0c0c0;
      border: 1px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      padding: 2px 8px;
      margin-right: 2px;
      min-width: 100px;
      text-align: left;
      display: flex;
      align-items: center;
    }
    
    .taskbar-button-icon {
      margin-right: 4px;
    }
  </style>

  <div id="desktop">
    <div id="desktop-files">
      <div id="my-computer-icon" class="desktop-icon">
        <div id="my-computer-img" class="desktop-icon-img">💻</div>
        <div id="my-computer-text">My Computer</div>
      </div>
      
      <div id="network-neighborhood-icon" class="desktop-icon">
        <div id="network-neighborhood-img" class="desktop-icon-img">🌐</div>
        <div id="network-neighborhood-text">Network Neighborhood</div>
      </div>
      
      <div id="recycle-bin-icon" class="desktop-icon">
        <div id="recycle-bin-img" class="desktop-icon-img">🗑️</div>
        <div id="recycle-bin-text">Recycle Bin</div>
      </div>
      
      <div id="internet-explorer-icon" class="desktop-icon">
        <div id="internet-explorer-img" class="desktop-icon-img">🌍</div>
        <div id="internet-explorer-text">Internet Explorer</div>
      </div>
      
      <div id="outlook-icon" class="desktop-icon">
        <div id="outlook-img" class="desktop-icon-img">✉️</div>
        <div id="outlook-text">Outlook</div>
      </div>
      
      <div id="notepad-icon" class="desktop-icon">
        <div id="notepad-img" class="desktop-icon-img">📝</div>
        <div id="notepad-text">Notepad</div>
      </div>
      
      <div id="winamp-icon" class="desktop-icon">
        <div id="winamp-img" class="desktop-icon-img">🎵</div>
        <div id="winamp-text">Winamp</div>
      </div>
    </div>
  </div>

  <div id="taskbar">
    <style id="taskbar-style">
      #taskbar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 28px;
        background-color: #c0c0c0;
        border-top: 2px solid #ffffff;
        display: flex;
        padding: 2px;
        z-index: 1000;
      }
      
      #start-button {
        display: flex;
        align-items: center;
        background-color: #c0c0c0;
        border: 2px solid;
        border-color: #ffffff #808080 #808080 #ffffff;
        padding: 2px 6px;
        margin-right: 6px;
        font-weight: bold;
      }
      
      #start-logo {
        margin-right: 4px;
      }
      
      #taskbar-buttons {
        display: flex;
        flex-grow: 1;
      }
      
      #taskbar-tray {
        display: flex;
        align-items: center;
        border-left: 1px solid #808080;
        padding-left: 4px;
      }
      
      #clock {
        background-color: #c0c0c0;
        border: 1px solid;
        border-color: #808080 #ffffff #ffffff #808080;
        padding: 2px 6px;
      }
    </style>
    
    <div id="start-button">
      <div id="start-logo">🪟</div>
      <div id="start-text">Start</div>
    </div>
    
    <div id="taskbar-buttons"></div>
    
    <div id="taskbar-tray">
      <div id="clock">5:55 PM</div>
    </div>
  </div>

  <div id="start-menu" style="display: none;">
    <style id="start-menu-style">
      #start-menu {
        position: fixed;
        bottom: 30px;
        left: 2px;
        width: 200px;
        background-color: #c0c0c0;
        border: 2px solid;
        border-color: #ffffff #808080 #808080 #ffffff;
        z-index: 1001;
      }
      
      #start-menu-sidebar {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 25px;
        background-color: #808080;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding-bottom: 10px;
      }
      
      #start-menu-sidebar-text {
        color: white;
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        text-align: center;
        font-weight: bold;
        font-size: 14px;
      }
      
      #start-menu-items {
        margin-left: 25px;
        padding: 2px 0;
      }
      
      .start-menu-item {
        padding: 4px 8px;
        display: flex;
        align-items: center;
      }
      
      .start-menu-item:hover {
        background-color: #000080;
        color: white;
      }
      
      .start-menu-icon {
        width: 20px;
        margin-right: 8px;
        text-align: center;
      }
      
      .start-menu-arrow {
        margin-left: auto;
      }
      
      .start-menu-separator {
        height: 1px;
        background-color: #808080;
        margin: 3px 0;
      }
    </style>
    
    <div id="start-menu-sidebar">
      <div id="start-menu-sidebar-text">Windows 95</div>
    </div>
    
    <div id="start-menu-items">
      <div id="programs-menu-item" class="start-menu-item">
        <div id="programs-menu-icon" class="start-menu-icon">📁</div>
        <div id="programs-menu-text">Programs</div>
        <div id="programs-menu-arrow" class="start-menu-arrow">▶</div>
      </div>
      
      <div id="documents-menu-item" class="start-menu-item">
        <div id="documents-menu-icon" class="start-menu-icon">📄</div>
        <div id="documents-menu-text">Documents</div>
        <div id="documents-menu-arrow" class="start-menu-arrow">▶</div>
      </div>
      
      <div id="settings-menu-item" class="start-menu-item">
        <div id="settings-menu-icon" class="start-menu-icon">⚙️</div>
        <div id="settings-menu-text">Settings</div>
        <div id="settings-menu-arrow" class="start-menu-arrow">▶</div>
      </div>
      
      <div id="find-menu-item" class="start-menu-item">
        <div id="find-menu-icon" class="start-menu-icon">🔍</div>
        <div id="find-menu-text">Find</div>
        <div id="find-menu-arrow" class="start-menu-arrow">▶</div>
      </div>
      
      <div id="help-menu-item" class="start-menu-item">
        <div id="help-menu-icon" class="start-menu-icon">❓</div>
        <div id="help-menu-text">Help</div>
      </div>
      
      <div id="run-menu-item" class="start-menu-item">
        <div id="run-menu-icon" class="start-menu-icon">▶️</div>
        <div id="run-menu-text">Run...</div>
      </div>
      
      <div id="start-menu-separator" class="start-menu-separator"></div>
      
      <div id="shutdown-menu-item" class="start-menu-item">
        <div id="shutdown-menu-icon" class="start-menu-icon">🔌</div>
        <div id="shutdown-menu-text">Shut Down...</div>
      </div>
    </div>
  </div>
</div>
`
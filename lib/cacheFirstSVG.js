const cachedFrameComment = '<!-- this first screen render was cached, but system prompt might have changed since caching, so pay attention to the current system prompt when rendering further frames. do not include this comment in future screen renders -->'

export const FIRST_SVG = `${cachedFrameComment}
<div id="screen">
  <style id="os-wide-style">
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
  </style>
  <div id="menubar">
    <div id="left">
      <div id="apple-menu" class="menu-item system">🤖</div>
      <div id="finder-menu" class="menu-item app-name">Files</div>
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
      #desktop {
        flex: 1;
        position: relative;
      }
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
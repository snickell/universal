const cachedFrameComment = '<!-- this first screen render was cached, but system prompt might have changed since caching, so pay attention to the current system prompt when rendering further frames. do not include this comment in future screen renders -->'

export const FIRST_SVG = `${cachedFrameComment}
<div id="screen">
  <div id="menu-bar">
    <div id="left-menu">
      <div id="apple-menu" class="menu-item">🦄</div>
      <div id="finder-menu" class="menu-item">Finder</div>
      <div id="file-menu" class="menu-item">File</div>
      <div id="edit-menu" class="menu-item">Edit</div>
      <div id="view-menu" class="menu-item">View</div>
      <div id="go-menu" class="menu-item">Go</div>
      <div id="window-menu" class="menu-item">Window</div>
      <div id="help-menu" class="menu-item">Help</div>
    </div>
    <div id="right-menu">
      <div id="wifi-icon">📶</div>
      <div id="battery-icon">🔋</div>
      <div id="time">10:30 AM</div>
    </div>
    <style>
      #menu-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 24px;
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        padding: 0 10px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      #left-menu {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      
      #right-menu {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 12px;
      }
      
      .menu-item {
        font-size: 13px;
        cursor: pointer;
      }
    </style>
  </div>
  
  <div id="desktop">
    <style>
      #desktop {
        flex: 1;
        position: relative;
      }
    </style>
  </div>
  
  <div id="dock-container">
    <div id="dock">
      <div id="file-manager-icon" class="dock-icon">📁</div>
      <div id="browser-icon" class="dock-icon">🌐</div>
      <div id="ai-chat-icon" class="dock-icon">🤖</div>
      <div id="messages-icon" class="dock-icon">💬</div>
      <div id="calendar-icon" class="dock-icon">📅</div>
      <div id="music-icon" class="dock-icon">🎵</div>
      <div id="mail-icon" class="dock-icon">✉️</div>
      <div id="todo-icon" class="dock-icon">✓</div>
      <div id="notes-icon" class="dock-icon">📝</div>
      <div id="terminal-icon" class="dock-icon">💻</div>
    </div>
    <style>
      #dock-container {
        margin-top: auto;
        display: flex;
        justify-content: center;
        padding: 10px 0;
      }
      
      #dock {
        display: flex;
        background-color: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 5px 10px;
        gap: 15px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      }
      
      .dock-icon {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .dock-icon:hover {
        transform: scale(1.2);
      }
    </style>
  </div>
</div>
`
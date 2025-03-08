export const FIRST_SVG = `
<div id="screen">
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
    
    #dock-container {
      margin-top: auto;
      display: flex;
      justify-content: center;
      padding: 0;
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
    
    #desktop {
      flex: 1;
      position: relative;
    }
  </style>
  
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
  </div>
  
  <div id="desktop"></div>
  
  <div id="dock-container">
    <div id="dock">
      <div id="finder-icon" class="dock-icon">🔍</div>
      <div id="safari-icon" class="dock-icon">🧭</div>
      <div id="mail-icon" class="dock-icon">✉️</div>
      <div id="photos-icon" class="dock-icon">🖼️</div>
      <div id="messages-icon" class="dock-icon">💬</div>
      <div id="music-icon" class="dock-icon">🎵</div>
      <div id="settings-icon" class="dock-icon">⚙️</div>
      <div id="trash-icon" class="dock-icon">🗑️</div>
    </div>
  </div>
</div>
`
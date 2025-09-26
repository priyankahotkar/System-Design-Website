export const icons = {
    api: '/icons/API.svg',
    arrowSelector: '/icons/ArrowSelector.svg',
    arrowForward: '/icons/Arrow_Forward.svg',
    arrowAndEdge: '/icons/Arrow_and_edge.svg',
    circle: '/icons/Circle.svg',
    cloud: '/icons/Cloud.svg',
    cloudCircle: '/icons/Cloud_Circle.svg',
    copy: '/icons/Copy.svg',
    dns: '/icons/DNS.svg',
    dashboard: '/icons/Dashboard.svg',
    database: '/icons/Database.svg',
    databaseSearch: '/icons/Database_search.svg',
    databaseUpload: '/icons/Database_upload.svg',
    files: '/icons/Files.svg',
    notification: '/icons/Notification.svg',
    router: '/icons/Router.svg',
    security: '/icons/Security.svg',
    square: '/icons/Square.svg',
    terminal: '/icons/Terminal.svg',
    user: '/icons/User_Account.svg',
    userAccount: '/icons/User_account.svg',
    wifi: '/icons/Wifi.svg'
  };
  
export const getIconEntries = () => Object.entries(icons).map(([key, src]) => ({ key, src }));

export default icons;
  
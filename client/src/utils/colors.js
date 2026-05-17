export const getWorkspaceGlazeStyle = (workspaceId) => {
  if (!workspaceId) return {};
  
  let hash = 0;
  for (let i = 0; i < workspaceId.length; i++) {
    hash = workspaceId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash) % 360;
  
  return {
    background: `linear-gradient(135deg, hsla(${hue}, 80%, 75%, 0.6) 0%, hsla(${hue}, 80%, 85%, 0.9) 100%)`,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)'
  };
};

export const getWorkspacePageGlazeStyle = (workspaceId) => {
  if (!workspaceId) return {};
  
  let hash = 0;
  for (let i = 0; i < workspaceId.length; i++) {
    hash = workspaceId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash) % 360;
  
  return {
    background: `linear-gradient(135deg, hsla(${hue}, 65%, 80%, 0.7) 0%, hsla(${hue}, 65%, 90%, 1) 100%)`
  };
};

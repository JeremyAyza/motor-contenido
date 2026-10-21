/**
 * Instagram web UI texts and selectors. This is the only place they live:
 * when Instagram changes its UI, fix them here and confirm with --dry-run.
 * Texts cover the Spanish and English UIs because they follow the account's language.
 */
export const IG = {
  home: "https://www.instagram.com/",
  profile: (handle: string) => `https://www.instagram.com/${handle}/`,
  post: (code: string) => `https://www.instagram.com/p/${code}/`,
  reel: (code: string) => `https://www.instagram.com/reel/${code}/`,

  /** The login form's field names change (username, email); the password field stays. */
  loginInput: 'input[type="password"]',
  homeIcon: 'svg[aria-label="Inicio"], svg[aria-label="Home"]',
  /** Sidebar link whose href is /<handle>/; its accessible name contains Perfil or Profile. */
  profileLink: /(Perfil|Profile)/i,
  notNow: /^(Ahora no|Not now)$/i,

  createLink: /(^|\s)(Crear|Create)$/,
  newPostIcon: 'svg[aria-label="Nueva publicación"], svg[aria-label="New post"]',
  postMenuItem: /^(Publicación|Post)$/,
  reelMenuItem: /^(Reel|Reels)$/i,
  fileInput: 'input[type="file"]',
  cropIcon: 'svg[aria-label="Seleccionar recorte"], svg[aria-label="Select crop"]',
  originalRatio: /^Original$/,
  nineSixteenRatio: /^9:16$/,
  videoDismissOk: /^(Aceptar|OK|Entendido|Got it)$/i,
  next: /^(Siguiente|Next)$/,
  uploadCoverBtn: /(Subir de la computadora|Select from computer|Elegir de la computadora|Add from computer)/i,
  captionBox: 'div[aria-label^="Escribe un pie de foto"], div[aria-label^="Write a caption"], div[role="textbox"][contenteditable="true"]',
  advancedSettings: /(Configuración avanzada|Advanced settings)/i,
  aiLabelHeading: /(Agregar etiqueta de IA|Etiqueta de contenido de IA|Contenido de IA|AI label|Add AI label|Label as AI-generated)/i,
  aiLabelConfirm: /^(Activar|Turn on|Guardar|Save)$/i,
  share: /^(Compartir|Share)$/,
  shared: /(se ha compartido|se compartió) tu (publicación|reel)|your (post|reel) has been shared/i,
  sharedIcon: 'img[alt="Marca de verificación animada"], img[alt="Animated checkmark"]',
  closeIcon: 'svg[aria-label="Cerrar"], svg[aria-label="Close"]',

  postLink: 'a[href*="/p/"], a[href*="/reel/"]',
  postCode: /\/(?:p|reel)\/([\w-]+)/,
} as const;

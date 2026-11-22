export function isMobile(window: Window): boolean {
    return window.innerWidth <= 768 || window.innerHeight <= 768;
}
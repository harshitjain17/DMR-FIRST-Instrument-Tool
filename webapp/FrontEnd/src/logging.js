import log from "loglevel";

/**
 * Toggle logging on Ctrl-F12
 */
export default function initLogging() {
  log.setDefaultLevel("error");
  const levels = ['trace', 'debug', 'info', 'warn', 'error', 'silent'];

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.code === 'F12') {
      const loglevel = log.getLevel() === 0 ? 5 : log.getLevel() - 1;;
      log.setLevel(log.levels.INFO);
      log.info(`Logging turned to ${levels[loglevel]}`);
      log.setLevel(loglevel);
    }
  });
}

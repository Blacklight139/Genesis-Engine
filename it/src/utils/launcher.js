import { Launch } from 'minecraft-java-core'

export const getOverrides = () => {
  const source = localStorage.getItem('downloadSource') || 'official'
  if (source === 'bmclapi') {
    return {
      meta: 'https://bmclapi2.bangbang93.com',
      resource: 'https://bmclapi2.bangbang93.com/assets',
      library: 'https://bmclapi2.bangbang93.com/maven'
    }
  } else if (source === 'fastmirror') {
    return {
      meta: 'https://launchermeta.fastmcmirror.org',
      resource: 'https://resources.fastmcmirror.org',
      library: 'https://libraries.fastmcmirror.org'
    }
  }
  return null
}

export const launchClient = async (options = {}, onLog) => {
  const launcher = new Launch()
  const javaPath = localStorage.getItem('javaPath') || null

  const launchOptions = {
    path: './.minecraft',
    version: options.version || '1.21.3',
    loader: options.loader || null,
    overrides: getOverrides(),
    java: javaPath ? { path: javaPath } : undefined,
    memory: options.memory || { max: '4G', min: '1G' }
  }

  onLog?.('[Launcher] 正在启动...')

  const proc = await launcher.Launch(launchOptions)

  proc.stdout.on('data', data => onLog?.(data.toString().trim()))
  proc.stderr.on('data', data => onLog?.(`[ERROR] ${data.toString().trim()}`))
  proc.on('close', code => onLog?.(`进程退出，代码: ${code}`))

  return proc
}
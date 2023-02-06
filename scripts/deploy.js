// @ts-check
import { execa } from 'execa'
import { distDir, rootDir } from './paths.js'

const main = async () => {
    await execa('npm', [
        'run',
        'build',
    ], {
        cwd: rootDir,
        stdio: 'inherit',
    })

    await execa('npm', [
        'publish',
        '--userconfig',
        '~/.npmrc_personal'
    ], {
        cwd: distDir,
        stdio: 'inherit',
    })
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

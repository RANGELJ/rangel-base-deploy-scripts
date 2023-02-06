// @ts-check
import { execa } from 'execa'
import fs from 'fs-extra'
import path from 'path'
import { rootDir, distDir } from './paths.js'

const main = async () => {
    console.log('Compiling typescript files...', rootDir)

    await fs.remove(distDir)

    await fs.copy(path.resolve(rootDir, 'package.json'), path.resolve(distDir, 'package.json'))
    await fs.copy(path.resolve(rootDir, 'package-lock.json'), path.resolve(distDir, 'package-lock.json'))

    const commonjsDir = path.resolve(distDir, 'commonjs')

    await execa('npx', [
        'tsc',
        '--outDir',
        commonjsDir,
        '--module',
        'commonjs',
    ], {
        cwd: rootDir,
        stdio: 'inherit',
    })

    const es6Dir = path.resolve(distDir, 'es6')

    await execa('npx', [
        'tsc',
        '--outDir',
        es6Dir,
        '--module',
        'ES6',
    ], {
        cwd: rootDir,
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

// @ts-check
import fs from 'fs-extra'
import path from 'path'
import { execa } from 'execa'
import { distDir, rootDir } from './paths.mjs'

const main = async () => {
    const targetDir = distDir
    const sourceDir = rootDir

    await fs.remove(targetDir)

    const packageDir = path.resolve(sourceDir, 'package.json')
    const packageData = await fs.readJSON(packageDir)

    const packageName = packageData.name

    packageData.name = `${packageName}-cjs`
    packageData.type = 'commonjs'

    const libPackagePath = path.resolve(targetDir, 'package.json')

    await fs.ensureFile(libPackagePath)
    await fs.writeJSON(libPackagePath, packageData, { spaces: 4 })
    await fs.copy(path.resolve(sourceDir, 'package-lock.json'), path.resolve(targetDir, 'package-lock.json'))

    await execa('npx', [
        'tsc',
        '--outDir',
        targetDir,
        '--module',
        'commonjs',
    ], {
        cwd: sourceDir,
        stdio: 'inherit',
    })

    await execa('npm', [
        'publish',
        '--userconfig',
        '~/.npmrc_personal'
    ], {
        cwd: targetDir,
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

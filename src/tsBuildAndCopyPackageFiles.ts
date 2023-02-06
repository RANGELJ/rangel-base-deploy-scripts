import fs from 'fs-extra'
import path from 'path'
import { execa } from 'execa'

type Args = {
    targetDir: string;
    sourceDir: string;
}

const tsBuildAndCopyPackageFiles = async ({
    targetDir,
    sourceDir,
}: Args) => {
    await fs.remove(targetDir)

    await fs.copy(path.resolve(sourceDir, 'package.json'), path.resolve(targetDir, 'package.json'))
    await fs.copy(path.resolve(sourceDir, 'package-lock.json'), path.resolve(targetDir, 'package-lock.json'))

    const commonjsDir = path.resolve(targetDir, 'commonjs')

    await execa('npx', [
        'tsc',
        '--outDir',
        commonjsDir,
        '--module',
        'commonjs',
    ], {
        cwd: sourceDir,
        stdio: 'inherit',
    })

    const es6Dir = path.resolve(targetDir, 'es6')

    await execa('npx', [
        'tsc',
        '--outDir',
        es6Dir,
        '--module',
        'ES6',
    ], {
        cwd: sourceDir,
        stdio: 'inherit',
    })
}

export default tsBuildAndCopyPackageFiles

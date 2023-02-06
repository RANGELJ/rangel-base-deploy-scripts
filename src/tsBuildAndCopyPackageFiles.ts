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
}

export default tsBuildAndCopyPackageFiles

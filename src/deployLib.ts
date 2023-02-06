import { execa } from 'execa'
import tsBuildAndCopyPackageFiles from './tsBuildAndCopyPackageFiles'

type Args = {
    sourceDir: string;
    targetDir: string;
}

const deployLib = async ({
    sourceDir,
    targetDir,
}: Args) => {
    await tsBuildAndCopyPackageFiles({
        sourceDir,
        targetDir,
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

export default deployLib

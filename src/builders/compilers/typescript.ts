import { TypescriptBundler } from '@puresamari/ts-bundler';
import path from 'path';

import { IBuilderContext } from '../../utils';
import { ExportType } from '../utils';
import { Compiler } from './compiler';

export default class TypescriptCompiler extends Compiler {

  private readonly bundler: TypescriptBundler;

  constructor(public readonly file: string, public readonly context: IBuilderContext) {
    super(file, context);
    this.bundler = new TypescriptBundler(this.file, this.context.basePath);
  }

  public async compile(
    exportPath: string,
    context: IBuilderContext
  ) {
    const exportedPath = exportPath;
    const result = await this.bundler.bundle();

    return this.postCompile({
      output: result.output,
      file: this.file,
      path: exportedPath,
      type: 'js' as ExportType,
      affectedFiles: []
    }, [
      ...(Object.values(result.map)).filter((v: any) => !v.node_module).map((v) => v.file as { file: string, nodeModule: boolean })
    ].filter(v => !!v && !v.nodeModule).map(v => v.file));
  }
}
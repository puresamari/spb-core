import fs from 'fs';
import { glob } from 'glob';
import path from 'path';

import { IBuilderOptions } from '../definitions';

export const basePath = process.cwd();

export function resolveFilePathOnBase(file: string) {
  return path.resolve(basePath, file);
}

export function resolveFilePath(file: string) {
  return path.resolve(basePath, file);
}

export function getConfigFromFile(configPath: string): IBuilderOptions {
  const dir = path.dirname(configPath);
  try {
    const configs = JSON.parse(
      fs.readFileSync(resolveFilePathOnBase(configPath), "utf-8")
    ) as IBuilderOptions;
    // const configs = require(resolveFilePath(configPath)) as IBuilderOptions;
    return {
      ...configs,
      output: path.resolve(dir, configs.output),
      files: collectFiles(
        configs.files.map((v) => path.join(dir, configs.root || "", v)),
        configs
      ),
    };
  } catch (e) {
    console.error("Error while getting config", configPath);
    console.error(e);
    process.exit(100);
  }
}

export function collectFiles(files: string[], config: IBuilderOptions) {
  let retFiles: string[] = [];
  files.forEach((pattern) => {
    retFiles = [...retFiles, ...glob.sync(pattern)];
  });
  return retFiles.map((v) => resolveFilePath(v));
}

export interface IMainProcessOptions {
  out?: string;
  files?: string | string[];
  config: string;
}

export function generateConfig(
  options: IMainProcessOptions
): IBuilderOptions {
  const config: IBuilderOptions = options.config
    ? getConfigFromFile(options.config) || { output: "", files: [] }
    : { output: "", files: [] };
  if (options.out) {
    config.output = resolveFilePath(options.out);
  }
  if (options.files) {
    if (typeof options.files === "string") {
      config.files = collectFiles([options.files], config);
    } else if (options.files.length > 0) {
      config.files = collectFiles(options.files, config);
    }
  }
  return config;
}
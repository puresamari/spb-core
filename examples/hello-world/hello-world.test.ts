import path from 'path';
import fs from 'fs';
import { getConfigFromFile } from '../../src/utils';
import { Builder } from '../../src';

const configPath = path.resolve(__dirname, './hello-world.config.spb.json');
const config = getConfigFromFile(path.resolve(__dirname, './hello-world.config.spb.json'));

const builder = new Builder(config, path.dirname(configPath));

builder.build().then(() => console.log('built!!'));
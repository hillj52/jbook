import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (input: string) => ({
  name: 'fetch-plugin',
  setup(build: esbuild.PluginBuild) {
    build.onLoad({ filter: /(^index\.js$)/ }, () => ({
      loader: 'jsx',
      contents: input,
    }));

    build.onLoad({ filter: /.*/ }, async (args: any) => {
      const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
        args.path
      );
      if (cachedResult) {
        return cachedResult;
      }
      return null;
    });

    build.onLoad({ filter: /.css$/ }, async (args: any) => {
      const { data, request } = await axios.get(args.path);
      const resolveDir = new URL('./', request.responseURL).pathname;
      const contents = `
          const style = document.createElement('style');
          style.innerText = '${data
            .replace(/\n/g, '')
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")};'
          document.head.appendChild(style);
        `;
      const result: esbuild.OnLoadResult = {
        loader: 'jsx',
        contents,
        resolveDir,
      };
      await fileCache.setItem(args.path, result);
      return result;
    });

    build.onLoad({ filter: /.*/ }, async (args: any) => {
      const { data, request } = await axios.get(args.path);
      const resolveDir = new URL('./', request.responseURL).pathname;
      const contents = data;
      const result: esbuild.OnLoadResult = {
        loader: 'jsx',
        contents,
        resolveDir,
      };
      await fileCache.setItem(args.path, result);
      return result;
    });
  },
});

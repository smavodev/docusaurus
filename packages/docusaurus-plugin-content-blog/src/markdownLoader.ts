/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-nocheck

import {truncate, linkify} from './blogUtils';
import {parseQuery} from 'loader-utils';
import {BlogMarkdownLoaderOptions} from './types';

const markdownLoader = function (source) {
  const filePath = this.resourcePath;
  const fileString = source as string;
  const callback = this.async();
  const markdownLoaderOptions = this.getOptions() as BlogMarkdownLoaderOptions;

  // Linkify blog posts
  let finalContent = linkify({
    fileString,
    filePath,
    ...markdownLoaderOptions,
  });

  // Truncate content if requested (e.g: file.md?truncated=true).
  const truncated: string | undefined = this.resourceQuery
    ? parseQuery(this.resourceQuery).truncated
    : undefined;

  if (truncated) {
    finalContent = truncate(finalContent, markdownLoaderOptions.truncateMarker);
  }

  return callback && callback(null, finalContent);
};

export default markdownLoader;

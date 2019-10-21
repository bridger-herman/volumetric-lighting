/* resource.js
 *
 * Copyright (c) 2019, University of Minnesota
 *
 * Author: Bridger Herman
 *
 * Load a resource from disk, asynchronously
 */

export async function loadResource(path) {
    console.debug(`Loading resource ${path}`);
    let response = await fetch(path);
    let text = await response.text();
    return text;
}

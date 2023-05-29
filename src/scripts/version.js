import {pushNotification} from "./notifications.js";

/**
 * @typedef {{hash: string, timestamp: number, uncommitted_changes: boolean?}} Commit
 * @returns {{current: Commit, latest: Commit}}
 */
export async function fetchVersion() {
    /** @type {Commit} **/
    let thisVersion = await fetch("revision.json", {cache: "reload"}).then(r => r.json());
    /** @type {Commit} **/
    let latestVersion = await fetch("https://theo543.github.io/Matrix-Math/revision.json", {cache: "reload"}).then(r => r.json());
    return {current: thisVersion, latest: latestVersion};
}
export function notifyVersion(thisVersion, latestVersion) {
    let $version = document.createElement("span");
    let gh_link = `<a href="https://theo543.github.io/Matrix-Math/">GitHub Pages</a>`;
    let color = 'lightgray';
    let timeout = 1000;
    if (thisVersion.timestamp < latestVersion.timestamp) {
        $version.innerHTML = `Check out the newest version at ${gh_link}!`;
        timeout = 5000;
    } else if (thisVersion.timestamp > latestVersion.timestamp) {
        $version.innerHTML = `Running development version (newer than ${gh_link})!`;
        timeout = 2000;
    } else {
        $version.innerHTML = `Welcome to Matrix Math! Viewing the latest version.`;
    }
    if(thisVersion.uncommitted_changes !== undefined && thisVersion.uncommitted_changes === true) {
        $version.innerHTML += " Warning: Uncommitted changes present!";
        timeout += 1000;
    }
    $version.style.backgroundColor = color;
    pushNotification($version, timeout);
}

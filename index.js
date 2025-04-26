// Imports
import {fetchGitHubData} from 'portfolio/global.js';

// Retreive GitHub data
const githubData = await fetchGitHubData('SC450');
const profileStats = document.querySelector('#profile-stats');

// Populate the profile stats section
if (profileStats) {
    profileStats.innerHTML = `
        <dl>
            <dt>Public Repos</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers</dt><dd>${githubData.followers}</dd>
            <dt>Following</dt><dd>${githubData.following}</dd>
        </dl>
    `;
}

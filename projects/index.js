// Imports
import {fetchJSON, renderProjects, fetchGitHubData} from '../global.js';

// Fetch and filter projects
const projects = await fetchJSON('../lib/projects.json');
const latestProjects = projects.slice(0, 3);

// Select the projects containers
const allProjectsContainer = document.querySelector('.projects');
const latestProjectsContainer = document.querySelector('.projects-latest');

// Render the latest projects
renderProjects(latestProjects, latestProjectsContainer, 'h2');

// Render all projects
renderProjects(projects, allProjectsContainer, 'h2');

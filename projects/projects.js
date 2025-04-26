// Imports
import { fetchJSON, renderProjects } from '../global.js';

// Load projects data
const projects = await fetchJSON('../lib/projects.json');

// Select the projects container
const projectsContainer = document.querySelector('.projects');

// Update projects count
const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
    const projectsCount = projects.length;
    const projectWord = projectsCount === 1 ? 'Project' : 'Projects';
    projectsTitle.textContent = `${projectsCount} ${projectWord}`;
}

// Render the projects
renderProjects(projects, projectsContainer, 'h2');

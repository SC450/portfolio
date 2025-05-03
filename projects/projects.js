// Imports
import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

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

// Define function to create a pie chart
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

// Set up pie chart data
let rolledData = d3.rollups(
    projects,
    (v) => v.length,
    (d) => d.year,
);
let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
});

// // Set up the pie chart
// let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data);
// let arcs = arcData.map((d) => arcGenerator(d));
// let angle = 0;
// let colors = d3.scaleOrdinal(d3.schemeTableau10);

// // Calculate the angles for the pie chart
// let total = 0;

// for (let d of data) {
//   total += d;
// }

// for (let d of data) {
//   let endAngle = angle + (d / total) * 2 * Math.PI;
//   arcData.push({ startAngle: angle, endAngle });
//   angle = endAngle;
// }

// // Fill in colors for the pie chart
// arcs.forEach((arc, idx) => {
//     d3.select('svg')
//         .append('path')
//         .attr('d', arc)
//         // Fill in the attribute for fill color via indexing the colors variable
//         .attr('fill', colors(idx))
// })

// // Create the projects legend
// // how you add class name as attributes using D3
// let legend = d3.select('.legend');
// data.forEach((d, idx) => {
//     legend
//         .append('li')
//         .attr('style', `--color:${colors(idx)}`)
//         .attr('class', 'legend-item') // add class name
//         .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
// })

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
    // re-calculate rolled data
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    // re-calculate slice generator, arc data, arc, etc.
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    
    // Clear existing paths and legends
    d3.select('svg').selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();
    
    // Update paths with new data
    newArcs.forEach((arc, idx) => {
        d3.select('svg')
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(idx));
    });
    
    // Update legend with new data
    let legend = d3.select('.legend');
    newData.forEach((d, idx) => {
        legend
            .append('li')
            .attr('style', `--color:${colors(idx)}`)
            .attr('class', 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });

    // Create selectable wedges
    let selectedIndex = -1;
    let svg = d3.select('svg');
    svg.selectAll('path').remove();
    newArcs.forEach((arc, i) => {
        svg
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(i))
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;

                svg
                .selectAll('path')
                .attr('class', (_, idx) => (
                    // TODO: filter idx to find correct pie slice and apply CSS from above
                    idx === selectedIndex ? 'selected' : ''
                ));

                legend
                .selectAll('li')
                .classed('selected', (_, idx) => idx === selectedIndex);

                if (selectedIndex === -1) {
                    // When no slice is selected, only filter by search query
                    let filteredBySearch = projects.filter((project) => {
                        let values = Object.values(project).join('\n').toLowerCase();
                        return values.includes(query.toLowerCase());
                    });
                    renderProjects(filteredBySearch, projectsContainer, 'h2');
                } else {
                    // Filter by both year and search query
                    let selectedLabel = newData[selectedIndex].label;
                    let filteredProjects = projects.filter((project) => {
                        let matchesYear = project.year === selectedLabel;
                        let values = Object.values(project).join('\n').toLowerCase();
                        let matchesSearch = values.includes(query.toLowerCase());
                        return matchesYear && matchesSearch;
                    });
                    renderProjects(filteredProjects, projectsContainer, 'h2');
                }
            });
    });
}

// Call this function on page load
renderPieChart(projects);

// Adding a search query to the projects page
let query = '';

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
    // update query value
    query = event.target.value;

    // TODO: filter the projects
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    // TODO: render updated projects!
    renderProjects(filteredProjects, projectsContainer, 'h2');

    // Render pie cart with filtered data
    renderPieChart(filteredProjects);
});

// Bug explanation: Searching in bar and then clicking on a pie slice only filters the
// projects by year because the search query is not being passed to the renderPieChart function
// (i.e., search query is not being updated after clicking on a pie slice).
// Solution: Check if there are both a selected pie slice and a search query.
// If so, filter the projects by both year and search query.
// If only a search query is present, filter the projects by the search query.

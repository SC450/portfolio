console.log('IT’S ALIVE!');

// // Function to get a selector from HTML file
// function $$(selector, context = document) {
//     return Array.from(context.querySelectorAll(selector));
// }

// // Get navigation links
// let navLinks = $$("nav a");
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
// );

// // Add "current" class to each separate page
// currentLink?.classList.add('current');

document.addEventListener('DOMContentLoaded', () => {
    // let pages = [
    //     {url: "../", title: "Home"},
    //     {url: "../projects/", title: "Projects"},
    //     {url: "../contact/", title: "Contact"},
    //     {url: "../resume/", title: "Resume"},
    //     {url: "https://github.com/SC450", title: "GitHub"}
    // ];

    // function normalizePath(path) {
    //     return path.replace(/\/+$/, '').toLowerCase();
    // }

    // let currentPath = normalizePath(location.pathname);

    // let nav = document.createElement('nav');
    // document.body.prepend(nav);

    // for (let p of pages) {
    //     let a = document.createElement('a');
    //     a.href = p.url;
    //     a.textContent = p.title;
    //     a.classList.add('tab');

    //     // External link? Open in a new tab
    //     if (!p.url.startsWith("..") && !p.url.startsWith("/")) {
    //         a.target = "_blank";
    //         a.rel = "noopener noreferrer"; // Good security practice
    //     }

    //     // Match current page for local links
    //     if (a.host === location.host) {
    //         let linkPath = normalizePath(a.pathname);
    //         if (linkPath === currentPath) {
    //             a.classList.add('current');
    //         }
    //     }

    //     nav.appendChild(a);
    // }

    // Add theme selector
    document.body.insertAdjacentHTML(
        'afterbegin',
        `
          <label class="color-scheme">
              Theme:
              <select>
                  <option>Automatic</option>
                  <option>Light</option>
                  <option>Dark</option>
              </select>
          </label>`,
      );

    // Get the theme selector
    let select = document.querySelector("select");

    // Change color theme based on user's choice
    select.addEventListener('input', function (event) {
        console.log('color scheme changed to', event.target.value);
        document.documentElement.style.setProperty('color-scheme', event.target.value);
        localStorage.setItem("color-scheme", event.target.value);
    });

    // Save and load the user's preferred theme preference
    if (localStorage.getItem("color-scheme")) {
        document.documentElement.style.setProperty('color-scheme', localStorage.getItem("color-scheme"));
        select.value = localStorage.getItem("color-scheme");
    }
});

// Get content from Projects page
export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        console.log(response);

        // Parse the response
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

// Render projects on the page
export function renderProjects(projects, containerElement, headingLevel = "h2") {
    // Clear the container
    containerElement.innerHTML = '';

    // Create a fragment to hold the project elements
    const fragment = document.createDocumentFragment();

    // Loop through each project and create an element for it
    for (const project of projects) {
        const projectElement = document.createElement('article');

        projectElement.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
        `;

        // Append to fragment (not containerElement directly)
        fragment.appendChild(projectElement);
    }

    // Append the fragment to the container
    containerElement.appendChild(fragment);
}

// Fetch GitHub user data
export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}

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
    let pages = [
        {url: "../", title: "Home"},
        {url: "../portfolio/projects/", title: "Projects"},
        {url: "../portfolio/contact/", title: "Contact"},
        {url: "../portfolio/resume/", title: "Resume"},
        {url: "https://github.com/SC450", title: "GitHub"}
    ];

    function normalizePath(path) {
        return path.replace(/\/+$/, '').toLowerCase();
    }

    let currentPath = normalizePath(location.pathname);

    let nav = document.createElement('nav');
    document.body.prepend(nav);

    for (let p of pages) {
        let a = document.createElement('a');
        a.href = p.url;
        a.textContent = p.title;
        a.classList.add('tab');

        // External link? Open in a new tab
        if (!p.url.startsWith("..") && !p.url.startsWith("/")) {
            a.target = "_blank";
            a.rel = "noopener noreferrer"; // Good security practice
        }

        // Match current page for local links
        if (a.host === location.host) {
            let linkPath = normalizePath(a.pathname);
            if (linkPath === currentPath) {
                a.classList.add('current');
            }
        }

        nav.appendChild(a);
    }

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


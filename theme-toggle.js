const bgVariations = {
    darkTheme: {
        mobile: "/images/bg-mobile-dark.jpg",
        desktop: "/images/bg-desktop-dark.jpg"
    }, 

    lightTheme: {
        mobile: "/images/bg-mobile-light.jpg",
        desktop: "/images/bg-desktop-light.jpg"
    }
}

const toggleIcons = {
    darkTheme: "./images/icon-moon.svg",
    lightTheme: "./images/icon-sun.svg"
}

const documentStyles = getComputedStyle(document.documentElement);

const darkThemeColors = {
    body: documentStyles.getPropertyValue("--da-clr-neutral-900"),
    taskBg: documentStyles.getPropertyValue("--da-clr-neutral-890"),
    taskPrimary: documentStyles.getPropertyValue("--da-clr-neutral-100"),
    taskSecondary: documentStyles.getPropertyValue("--da-clr-neutral-700"),
    checkboxBorder: documentStyles.getPropertyValue("--da-clr-neutral-800"),
    placeholder: documentStyles.getPropertyValue("--da-clr-neutral-500")
}

const lightThemeColors = {
    body: documentStyles.getPropertyValue("--clr-neutral-100"),
    taskBg: documentStyles.getPropertyValue("--clr-neutral-50"),
    taskPrimary: documentStyles.getPropertyValue("--clr-neutral-700"),
    taskSecondary: documentStyles.getPropertyValue("--clr-neutral-600"),
    checkboxBorder: documentStyles.getPropertyValue("--clr-neutral-200"),
    placeholder: documentStyles.getPropertyValue("--_task-secondary-clr")
}

let currentTheme = JSON.parse(localStorage.getItem("theme")) || "lightTheme"

const toggleThemeBtn = document.getElementById("toggle-theme-btn");
const toggleThemeIcon = toggleThemeBtn.querySelector("img");

const bgImage = document.getElementById("background-image");
const bgDesktop = bgImage.querySelector("source");
const bgMobile = bgImage.querySelector("img");

const todoContainer = document.querySelector(".to-do-container");


function setTheme(themeColors, themeKey) {
    document.querySelector("body").style.setProperty("--_bg-color", `${themeColors["body"]}`);
    todoContainer.style.setProperty("--_task-primary-clr", `${themeColors["taskPrimary"]}`);
    todoContainer.style.setProperty("--_task-secondary-clr", `${themeColors["taskSecondary"]}`);
    todoContainer.style.setProperty("--_task-bg-clr", `${themeColors["taskBg"]}`);
    todoContainer.style.setProperty("--_checkbox-border-clr", `${themeColors["checkboxBorder"]}`);
    todoContainer.style.setProperty("--_task-placeholder-clr", `${themeColors["placeholder"]}`);

    toggleThemeIcon.src = toggleIcons[themeKey];
    bgDesktop.srcset = bgVariations[themeKey]["desktop"];
    bgMobile.src = bgVariations[themeKey]["mobile"];
}


toggleThemeBtn.addEventListener("click", () => {
    
    // Theme the button is set to toggle (dark mode by default)
    let toggleTheme = toggleThemeBtn.dataset.toggleTheme;
    let themeKey;

    if (toggleTheme === "dark theme") {
        toggleThemeBtn.dataset.toggleTheme = "light theme";
        themeKey = "darkTheme";

        setTheme(darkThemeColors, themeKey)
        localStorage.setItem("theme", JSON.stringify(themeKey))

    } else if (toggleTheme === "light theme") {
        toggleThemeBtn.dataset.toggleTheme = "dark theme";
        themeKey = "lightTheme";

        setTheme(lightThemeColors, themeKey)
        localStorage.setItem("theme", JSON.stringify(themeKey))
    }
})


setTheme((currentTheme === "lightTheme") ? lightThemeColors : darkThemeColors, currentTheme)

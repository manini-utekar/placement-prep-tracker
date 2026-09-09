document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // REGISTER
  // =========================================

  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("register-name").value.trim();

      const email = document.getElementById("register-email").value.trim();

      const password = document.getElementById("register-password").value;

      const confirmPassword = document.getElementById("confirm-password").value;

      const nameMessage = document.getElementById("name-message");

      const emailMessage = document.getElementById("email-message");

      const passwordMessage = document.getElementById("password-message");

      if (nameMessage) nameMessage.innerText = "";
      if (emailMessage) emailMessage.innerText = "";
      if (passwordMessage) passwordMessage.innerText = "";

      // Name validation
      const namePattern = /^[A-Za-z ]{2,}$/;

      if (!namePattern.test(name)) {
        if (nameMessage) {
          nameMessage.innerText =
            "Name should contain only letters and spaces.";
        }

        return;
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        if (emailMessage) {
          emailMessage.innerText = "Please enter a valid email address.";
        }

        return;
      }

      // Password validation
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!passwordPattern.test(password)) {
        if (passwordMessage) {
          passwordMessage.innerText =
            "Password must have at least 8 characters, one uppercase letter, one lowercase letter and one number.";
        }

        return;
      }

      // Confirm password
      if (password !== confirmPassword) {
        if (passwordMessage) {
          passwordMessage.innerText = "Passwords do not match.";
        }

        return;
      }

      const user = {
        name: name,
        email: email,
        password: password,
      };

      localStorage.setItem("placementUser", JSON.stringify(user));

      alert("Account created successfully!");

      window.location.href = "login.html";
    });
  }

  // =========================================
  // LOGIN
  // =========================================

  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("login-email").value.trim();

      const password = document.getElementById("login-password").value;

      const savedUser = JSON.parse(localStorage.getItem("placementUser"));

      if (!savedUser) {
        alert("No account found. Please register first.");

        return;
      }

      if (email === savedUser.email && password === savedUser.password) {
        localStorage.setItem("loggedIn", "true");

        window.location.href = "dashboard.html";
      } else {
        alert("Incorrect email or password.");
      }
    });
  }

  // =========================================
  // PROTECTED PAGES
  // =========================================

  const loggedIn = localStorage.getItem("loggedIn");

  const currentPage = window.location.pathname;

  const protectedPages = [
    "dashboard.html",
    "dsa.html",
    "development.html",
    "subjects.html",
    "aptitude.html",
    "projects.html",
    "daily-goals.html",
  ];

  const isProtectedPage = protectedPages.some((page) =>
    currentPage.includes(page),
  );

  if (isProtectedPage && loggedIn !== "true") {
    window.location.href = "login.html";

    return;
  }

  // =========================================
  // SHOW USER NAME
  // =========================================

  const savedUser = JSON.parse(localStorage.getItem("placementUser"));

  const userName = document.getElementById("user-name");

  if (savedUser && userName) {
    userName.textContent = savedUser.name;
  }

  // =========================================
  // LOGOUT
  // =========================================

  const logoutButton = document.getElementById("logout-btn");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");

      window.location.href = "login.html";
    });
  }

  // =========================================
  // DSA TRACKER
  // =========================================

  const solveButtons = document.querySelectorAll(".solve-btn");

  let solvedProblems = JSON.parse(localStorage.getItem("solvedProblems")) || [];

  solveButtons.forEach((button) => {
    const problemId = button.dataset.problem;

    if (solvedProblems.includes(problemId)) {
      button.textContent = "✓ Solved";

      button.classList.add("solved");
    }

    button.addEventListener("click", () => {
      if (solvedProblems.includes(problemId)) {
        return;
      }

      solvedProblems.push(problemId);

      localStorage.setItem("solvedProblems", JSON.stringify(solvedProblems));

      button.textContent = "✓ Solved";

      button.classList.add("solved");

      updateDSAProgress();
    });
  });

  function updateDSAProgress() {
    const total = solveButtons.length;

    const solved = solvedProblems.length;

    if (total === 0) {
      return;
    }

    const remaining = total - solved;

    const progress = Math.round((solved / total) * 100);

    const totalElement = document.getElementById("total-problems");

    const solvedElement = document.getElementById("solved-problems");

    const remainingElement = document.getElementById("remaining-problems");

    const progressElement = document.getElementById("dsa-progress");

    const percentageElement = document.getElementById("progress-percentage");

    const progressFill = document.getElementById("dsa-progress-fill");

    if (totalElement) totalElement.textContent = total;

    if (solvedElement) solvedElement.textContent = solved;

    if (remainingElement) remainingElement.textContent = remaining;

    if (progressElement) progressElement.textContent = progress + "%";

    if (percentageElement) percentageElement.textContent = progress + "%";

    if (progressFill) progressFill.style.width = progress + "%";

    // SAVE PROGRESS FOR DASHBOARD
    localStorage.setItem("dsaProgress", progress);
  }

  updateDSAProgress();

  // =========================================
  // DEVELOPMENT TRACKER
  // =========================================

  const skillButtons = document.querySelectorAll(".skill-btn");

  let completedSkills =
    JSON.parse(localStorage.getItem("completedSkills")) || [];

  skillButtons.forEach((button) => {
    const skillId = button.dataset.skill;

    if (completedSkills.includes(skillId)) {
      button.textContent = "✓ Completed";

      button.classList.add("completed");
    }

    button.addEventListener("click", () => {
      if (completedSkills.includes(skillId)) {
        return;
      }

      completedSkills.push(skillId);

      localStorage.setItem("completedSkills", JSON.stringify(completedSkills));

      button.textContent = "✓ Completed";

      button.classList.add("completed");

      updateDevelopmentProgress();
    });
  });

  function updateDevelopmentProgress() {
    const total = skillButtons.length;

    const completed = completedSkills.length;

    if (total === 0) {
      return;
    }

    const progress = Math.round((completed / total) * 100);

    const progressElement = document.getElementById("development-progress");

    const countElement = document.getElementById("development-count");

    const progressFill = document.getElementById("development-progress-fill");

    if (progressElement) progressElement.textContent = progress + "%";

    if (countElement)
      countElement.textContent = completed + " / " + total + " skills";

    if (progressFill) progressFill.style.width = progress + "%";

    // SAVE PROGRESS FOR DASHBOARD
    localStorage.setItem("developmentProgress", progress);
  }

  updateDevelopmentProgress();

  // =========================================
  // CORE SUBJECTS TRACKER
  // =========================================

  const subjectButtons = document.querySelectorAll(".subject-btn");

  let completedSubjects =
    JSON.parse(localStorage.getItem("completedSubjects")) || [];

  subjectButtons.forEach((button) => {
    const subjectId = button.dataset.subject;

    if (completedSubjects.includes(subjectId)) {
      button.textContent = "✓ Completed";

      button.classList.add("completed");
    }

    button.addEventListener("click", () => {
      if (completedSubjects.includes(subjectId)) {
        return;
      }

      completedSubjects.push(subjectId);

      localStorage.setItem(
        "completedSubjects",
        JSON.stringify(completedSubjects),
      );

      button.textContent = "✓ Completed";

      button.classList.add("completed");

      updateSubjectsProgress();
    });
  });

  function updateSubjectsProgress() {
    const total = subjectButtons.length;

    const completed = completedSubjects.length;

    if (total === 0) {
      return;
    }

    const progress = Math.round((completed / total) * 100);

    const progressElement = document.getElementById("subjects-progress");

    const countElement = document.getElementById("subjects-count");

    const progressFill = document.getElementById("subjects-progress-fill");

    if (progressElement) progressElement.textContent = progress + "%";

    if (countElement)
      countElement.textContent = completed + " / " + total + " topics";

    if (progressFill) progressFill.style.width = progress + "%";

    // SAVE PROGRESS FOR DASHBOARD
    localStorage.setItem("subjectsProgress", progress);
  }

  updateSubjectsProgress();

  // =========================================
  // APTITUDE TRACKER
  // =========================================

  const aptitudeButtons = document.querySelectorAll(".aptitude-btn");

  let aptitudeData = JSON.parse(localStorage.getItem("aptitudeData")) || {};

  aptitudeButtons.forEach((button) => {
    const topic = button.dataset.topic;

    // Restore saved values
    const savedData = aptitudeData[topic];

    if (savedData) {
      const correctInput = document.querySelector(
        `.correct-input[data-topic="${topic}"]`,
      );

      const totalInput = document.querySelector(
        `.total-input[data-topic="${topic}"]`,
      );

      if (correctInput) correctInput.value = savedData.correct;

      if (totalInput) totalInput.value = savedData.total;

      button.textContent = "✓ Saved";
    }

    button.addEventListener("click", () => {
      const correctInput = document.querySelector(
        `.correct-input[data-topic="${topic}"]`,
      );

      const totalInput = document.querySelector(
        `.total-input[data-topic="${topic}"]`,
      );

      const correct = Number(correctInput.value);

      const total = Number(totalInput.value);

      if (total <= 0 || correct < 0 || correct > total) {
        alert("Please enter a valid score.");

        return;
      }

      aptitudeData[topic] = {
        correct: correct,

        total: total,
      };

      localStorage.setItem("aptitudeData", JSON.stringify(aptitudeData));

      button.textContent = "✓ Saved";

      updateAptitudeProgress();
    });
  });

  function updateAptitudeProgress() {
    let totalQuestions = 0;

    let correctQuestions = 0;

    Object.values(aptitudeData).forEach((data) => {
      totalQuestions += data.total;

      correctQuestions += data.correct;
    });

    const completedTopics = Object.keys(aptitudeData).length;

    const totalTopics = aptitudeButtons.length;

    if (totalTopics === 0) {
      return;
    }

    const progress = Math.round((completedTopics / totalTopics) * 100);

    let accuracy = 0;

    if (totalQuestions > 0) {
      accuracy = Math.round((correctQuestions / totalQuestions) * 100);
    }

    const totalElement = document.getElementById("aptitude-total");

    const solvedElement = document.getElementById("aptitude-solved");

    const accuracyElement = document.getElementById("aptitude-accuracy");

    const progressElement = document.getElementById("aptitude-progress");

    const countElement = document.getElementById("aptitude-count");

    const percentageElement = document.getElementById("aptitude-percentage");

    const progressFill = document.getElementById("aptitude-progress-fill");

    if (totalElement) totalElement.textContent = totalQuestions;

    if (solvedElement) solvedElement.textContent = correctQuestions;

    if (accuracyElement) accuracyElement.textContent = accuracy + "%";

    if (progressElement) progressElement.textContent = progress + "%";

    if (countElement)
      countElement.textContent =
        completedTopics + " / " + totalTopics + " topics";

    if (percentageElement) percentageElement.textContent = progress + "%";

    if (progressFill) progressFill.style.width = progress + "%";

    // SAVE PROGRESS FOR DASHBOARD
    localStorage.setItem("aptitudeProgress", progress);
  }

  updateAptitudeProgress();

  // =========================================
  // PROJECT TRACKER
  // =========================================

  const projectButtons = document.querySelectorAll(".project-btn");

  let completedProjects =
    JSON.parse(localStorage.getItem("completedProjects")) || [];

  projectButtons.forEach((button) => {
    const projectId = button.dataset.project;

    if (completedProjects.includes(projectId)) {
      button.textContent = "✓ Completed";

      button.classList.add("completed");
    }

    button.addEventListener("click", () => {
      if (completedProjects.includes(projectId)) {
        return;
      }

      completedProjects.push(projectId);

      localStorage.setItem(
        "completedProjects",
        JSON.stringify(completedProjects),
      );

      button.textContent = "✓ Completed";

      button.classList.add("completed");

      updateProjectProgress();
    });
  });

  function updateProjectProgress() {
    const total = projectButtons.length;

    const completed = completedProjects.length;

    if (total === 0) {
      return;
    }

    const progress = Math.round((completed / total) * 100);

    const countElement = document.getElementById("projects-count");

    const progressElement = document.getElementById("projects-progress");

    const progressFill = document.getElementById("projects-progress-fill");

    if (countElement)
      countElement.textContent =
        completed + " / " + total + " projects completed";

    if (progressElement) progressElement.textContent = progress + "%";

    if (progressFill) progressFill.style.width = progress + "%";

    // SAVE PROGRESS FOR DASHBOARD
    localStorage.setItem("projectsProgress", progress);
  }

  updateProjectProgress();

  // =========================================
  // DAILY GOALS
  // =========================================

  const goalButtons = document.querySelectorAll(".goal-btn");

  let completedGoals = JSON.parse(localStorage.getItem("completedGoals")) || [];

  goalButtons.forEach((button) => {
    const goalId = button.dataset.goal;

    if (completedGoals.includes(goalId)) {
      button.textContent = "✓ Completed";

      button.classList.add("completed");
    }

    button.addEventListener("click", () => {
      if (completedGoals.includes(goalId)) {
        return;
      }

      completedGoals.push(goalId);

      localStorage.setItem("completedGoals", JSON.stringify(completedGoals));

      button.textContent = "✓ Completed";

      button.classList.add("completed");

      updateGoalsProgress();
    });
  });

  function updateGoalsProgress() {
    const total = goalButtons.length;

    const completed = completedGoals.length;

    if (total === 0) {
      return;
    }

    const progress = Math.round((completed / total) * 100);

    const completedElement = document.getElementById("goals-completed");

    const totalElement = document.getElementById("goals-total");

    const progressElement = document.getElementById("goals-progress");

    const percentageElement = document.getElementById("goals-percentage");

    const progressFill = document.getElementById("goals-progress-fill");

    if (completedElement) completedElement.textContent = completed;

    if (totalElement) totalElement.textContent = total;

    if (progressElement) progressElement.textContent = progress + "%";

    if (percentageElement) percentageElement.textContent = progress + "%";

    if (progressFill) progressFill.style.width = progress + "%";

    // SAVE PROGRESS FOR DASHBOARD
    localStorage.setItem("goalsProgress", progress);
  }

  updateGoalsProgress();

  // =========================================
  // DASHBOARD
  // =========================================
  // =========================================
  // DASHBOARD
  // =========================================

  function getProgress(key) {
    const value = localStorage.getItem(key);

    if (value === null) {
      return 0;
    }

    return Number(value);
  }

  function updateDashboardProgress() {
    // Get progress saved by each tracker

    const dsa = getProgress("dsaProgress");

    const development = getProgress("developmentProgress");

    const subjects = getProgress("subjectsProgress");

    const aptitude = getProgress("aptitudeProgress");

    const projects = getProgress("projectsProgress");

    const goals = getProgress("goalsProgress");

    // =========================================
    // DISPLAY INDIVIDUAL PROGRESS
    // =========================================

    const dsaElement = document.getElementById("dashboard-dsa");

    const developmentElement = document.getElementById("dashboard-development");

    const subjectsElement = document.getElementById("dashboard-subjects");

    const aptitudeElement = document.getElementById("dashboard-aptitude");

    const projectsElement = document.getElementById("dashboard-projects");

    const goalsElement = document.getElementById("dashboard-goals");

    if (dsaElement) {
      dsaElement.textContent = dsa + "%";
    }

    if (developmentElement) {
      developmentElement.textContent = development + "%";
    }

    if (subjectsElement) {
      subjectsElement.textContent = subjects + "%";
    }

    if (aptitudeElement) {
      aptitudeElement.textContent = aptitude + "%";
    }

    if (projectsElement) {
      projectsElement.textContent = projects + "%";
    }

    if (goalsElement) {
      goalsElement.textContent = goals + "%";
    }

    // =========================================
    // CALCULATE OVERALL PROGRESS
    // =========================================

    const overall = Math.round(
      (dsa + development + subjects + aptitude + projects + goals) / 6,
    );

    const overallElement = document.getElementById("overall-progress");

    const overallFill = document.getElementById("overall-progress-fill");

    if (overallElement) {
      overallElement.textContent = overall + "%";
    }

    if (overallFill) {
      overallFill.style.width = overall + "%";
    }
  }

  // Run only on dashboard
  if (document.getElementById("overall-progress")) {
    updateDashboardProgress();
  }
});

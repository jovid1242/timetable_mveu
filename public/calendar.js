function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function setQueryParam(key, value) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(key, value);
  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}?${urlParams}`
  );
}

function setQueryParamByRussianDay(day) {
  const dayMapping = {
    Пн: "понедельник",
    Вт: "вторник",
    Ср: "среда",
    Чт: "четверг",
    Пт: "пятница",
    Сб: "суббота",
  };

  const englishDay = dayMapping[day];
  if (englishDay) {
    setQueryParam("day", englishDay);
  }
}

function loadSchedule() {
  var urlParams = new URLSearchParams(window.location.search);
  var range = urlParams.get("range");
  var spreadsheetId = urlParams.get("spreadsheetId");
  var day = urlParams.get("day") || "all";

  fetch(
    `https://classschedule.okchina.co/group?range=${range}&spreadsheetId=${spreadsheetId}&day=${day}`
  )
    .then((response) => response.json())
    .then((data) => {
      const schedule = document.querySelector(".schedule");
      schedule.innerHTML = "";

      for (const day in data) {
        if (data.hasOwnProperty(day)) {
          const lessons = data[day];

          const header = document.createElement("div");
          header.classList.add("header");
          header.textContent = day.charAt(0).toUpperCase() + day.slice(1);
          schedule.appendChild(header);

          lessons.forEach((lesson) => {
            const lessonDiv = document.createElement("div");
            lessonDiv.classList.add("lesson");

            const timeAndSubjectDiv = document.createElement("div");
            timeAndSubjectDiv.innerHTML = `
              <p class="lesson-time">${lesson[3]}</p>
              <p class="lesson-title">${lesson[4]}</p>
            `;

            if (lesson.length > 5 && lesson[5]) {
              timeAndSubjectDiv.innerHTML += `<p class="homework">${lesson[5]}</p>`;
            }

            lessonDiv.appendChild(timeAndSubjectDiv);
            if (lesson.length > 6 && lesson[6]) {
              const roomDiv = document.createElement("div");
              roomDiv.classList.add("lesson-room");

              if (!isNaN(lesson[6])) {
                roomDiv.textContent = `Кабинет: ${lesson[6]}`;
              } else {
                roomDiv.textContent = lesson[6];
              }

              lessonDiv.appendChild(roomDiv);
            }

            if (lesson.length > 7 && lesson[7]) {
              const gradeDiv = document.createElement("div");
              gradeDiv.classList.add("lesson-grade");
              gradeDiv.textContent = lesson[7];
              lessonDiv.appendChild(gradeDiv);
            }

            schedule.appendChild(lessonDiv);
          });
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching schedule:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const calendar = document.getElementById("calendar");
  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  for (let i = 0; i < 6; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dayNumber = date.getDate();
    const dayOfWeek = daysOfWeek[i];

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.setAttribute("data-day", dayOfWeek);

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("date");
    dateDiv.textContent = dayNumber;

    const weekdayDiv = document.createElement("div");
    weekdayDiv.classList.add("weekday");
    weekdayDiv.textContent = dayOfWeek;

    dayDiv.appendChild(dateDiv);
    dayDiv.appendChild(weekdayDiv);
    calendar.appendChild(dayDiv);

    dayDiv.addEventListener("click", function () {
      const selectedDay = this.getAttribute("data-day");

      setQueryParamByRussianDay(selectedDay);

      document
        .querySelectorAll(".day")
        .forEach((day) => day.classList.remove("active"));

      this.classList.add("active");

      loadSchedule();
    });

    if (dayOfWeek === i) {
      dayDiv.classList.add("active");
    }
  }

  const allButton = document.createElement("button");
  allButton.textContent = "Все";
  allButton.classList.add("day", "active");
  allButton.setAttribute("data-day", "Все");
  calendar.appendChild(allButton);

  allButton.addEventListener("click", function () {
    document
      .querySelectorAll(".day")
      .forEach((day) => day.classList.remove("active"));

    this.classList.add("active");

    setQueryParam("day", "all");

    loadSchedule();
  });

  loadSchedule();
});

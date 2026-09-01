function DegreeProgress({ program, courses, courseStatuses }) {
  function isCourseCompleted(courseCode) {
    return courseStatuses[courseCode] === "Completed";
  }

  function getCourseCredits(courseCode) {
    const course = courses.find(
      (course) => course.code === courseCode
    );

    if (!course) {
      return 0;
    }

    return typeof course.credits === "number"
      ? course.credits
      : course.credits.min;
  }

  function courseMatchesFilter(course, filter) {
    if (
      filter.department &&
      course.department !== filter.department
    ) {
      return false;
    }

    const courseNumber = parseInt(
      course.code.split("-")[1],
      10
    );

    if (
      filter.minLevel &&
      courseNumber < filter.minLevel
    ) {
      return false;
    }

    if (
      filter.minCredits &&
      getCourseCredits(course.code) < filter.minCredits
    ) {
      return false;
    }

    if (
      filter.maxCredits &&
      getCourseCredits(course.code) > filter.maxCredits
    ) {
      return false;
    }

    return true;
  }

  function calculateRequirement(requirement, usedCourses) {
    // Required courses
    if (requirement.type === "required") {
      let credits = 0;

      requirement.courses.forEach((courseCode) => {
        if (
          isCourseCompleted(courseCode) &&
          !usedCourses.has(courseCode)
        ) {
          usedCourses.add(courseCode);
          credits += getCourseCredits(courseCode);
        }
      });

      return credits;
    }

    // Choose one path or option
    if (
      requirement.type === "choose-one" ||
      requirement.type === "choose-one-path"
    ) {
      for (const option of requirement.options) {
        if (option.courses) {
          const allCompleted = option.courses.every(
            (courseCode) =>
              isCourseCompleted(courseCode) &&
              !usedCourses.has(courseCode)
          );

          if (allCompleted) {
            option.courses.forEach((courseCode) => {
              usedCourses.add(courseCode);
            });

            return option.courses.reduce(
              (total, courseCode) =>
                total + getCourseCredits(courseCode),
              0
            );
          }
        }

        if (option.courseFilter) {
          const matchingCourse = courses.find(
            (course) =>
              isCourseCompleted(course.code) &&
              !usedCourses.has(course.code) &&
              courseMatchesFilter(
                course,
                option.courseFilter
              )
          );

          if (matchingCourse) {
            usedCourses.add(matchingCourse.code);

            return getCourseCredits(
              matchingCourse.code
            );
          }
        }
      }

      return 0;
    }

    // Minimum number of credits from matching courses
    if (requirement.type === "credit-minimum") {
      let credits = 0;

      const matchingCourses = courses.filter(
        (course) =>
          isCourseCompleted(course.code) &&
          !usedCourses.has(course.code) &&
          courseMatchesFilter(
            course,
            requirement.courseFilter
          )
      );

      for (const course of matchingCourses) {
        if (credits >= requirement.creditsRequired) {
          break;
        }

        usedCourses.add(course.code);
        credits += getCourseCredits(course.code);
      }

      return Math.min(
        credits,
        requirement.creditsRequired
      );
    }

    return 0;
  }

  return (
    <div className="degree-progress">
      <h2>{program.name}</h2>

      {program.requirements.map((section) => {
        // Each section gets its own used-course list.
        // This prevents a course from satisfying
        // multiple requirements within that section.
        const usedCourses = new Set();

        let completedCredits = 0;

        section.requirements.forEach((requirement) => {
          completedCredits += calculateRequirement(
            requirement,
            usedCourses
          );
        });

        const requiredCredits =
          typeof section.creditsRequired === "number"
            ? section.creditsRequired
            : section.creditsRequired.min;

        const percentage = Math.min(
          (completedCredits / requiredCredits) * 100,
          100
        );

        return (
          <div
            className="progress-section"
            key={section.id}
          >
            <h3>{section.name}</h3>

            <p>
              {completedCredits} / {requiredCredits}{" "}
              credits completed
            </p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${percentage}%`,
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DegreeProgress;